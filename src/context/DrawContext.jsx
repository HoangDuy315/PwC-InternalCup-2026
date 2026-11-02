import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from "react";
import { onValue, ref, set } from "firebase/database";
import { db } from "../firebase.js";
import { TEAMS, TEAMS_SIGNATURE, TEAM_BY_ID } from "../data/teams.js";

const DB_PATH = "draw";
export const TEAMS_PER_GROUP = 3;

// Thứ tự chia bảng: lượt lẻ → A, lượt chẵn → B
export const getGroupForTurn = (turnIndex) => (turnIndex % 2 === 0 ? "A" : "B");

const createInitialState = (mode = "random") => ({
  signature: TEAMS_SIGNATURE,
  results: [],
  pendingTeamId: null,
  mode,
});

// Chốt đội đang pending vào bảng tiếp theo
function commitPending(state) {
  const { pendingTeamId, results } = state;
  if (!pendingTeamId) return state;
  const alreadyDrawn = results.some((r) => r.teamId === pendingTeamId);
  if (alreadyDrawn || results.length >= TEAMS.length || !TEAM_BY_ID[pendingTeamId]) {
    return { ...state, pendingTeamId: null };
  }
  const turnIndex = results.length;
  return {
    ...state,
    pendingTeamId: null,
    results: [
      ...results,
      {
        teamId: pendingTeamId,
        group: getGroupForTurn(turnIndex),
        turn: turnIndex + 1,
        drawnAt: new Date().toISOString(),
      },
    ],
  };
}

// Kiểm tra dữ liệu từ server (Firebase bỏ mảng rỗng nên results có thể không tồn tại)
function initState(stored) {
  const mode = stored?.mode === "preset" ? "preset" : "random";
  if (!stored || stored.signature !== TEAMS_SIGNATURE) return createInitialState(mode);

  const rawResults = Array.isArray(stored.results)
    ? stored.results
    : Object.values(stored.results || {});
  const seen = new Set();
  const results = [];
  rawResults.forEach((r) => {
    if (r && TEAM_BY_ID[r.teamId] && !seen.has(r.teamId) && results.length < TEAMS.length) {
      seen.add(r.teamId);
      const turnIndex = results.length;
      results.push({
        teamId: r.teamId,
        group: getGroupForTurn(turnIndex),
        turn: turnIndex + 1,
        drawnAt: r.drawnAt || new Date().toISOString(),
      });
    }
  });
  const pendingTeamId =
    stored.pendingTeamId && TEAM_BY_ID[stored.pendingTeamId] ? stored.pendingTeamId : null;
  return { signature: TEAMS_SIGNATURE, results, pendingTeamId, mode };
}

function drawReducer(state, action) {
  switch (action.type) {
    case "START_SPIN": {
      if (state.pendingTeamId || state.results.length >= TEAMS.length) return state;
      const isRemaining =
        TEAM_BY_ID[action.teamId] && !state.results.some((r) => r.teamId === action.teamId);
      if (!isRemaining) return state;
      return { ...state, pendingTeamId: action.teamId };
    }
    case "COMMIT":
      return commitPending(state);
    case "RESET":
      return createInitialState(action.mode === "preset" ? "preset" : "random");
    case "HYDRATE":
      return action.state;
    default:
      return state;
  }
}

const DrawContext = createContext(null);

export function DrawProvider({ children }) {
  const [state, dispatch] = useReducer(drawReducer, undefined, () => createInitialState());
  const loadedRef = useRef(false); // đã nhận dữ liệu từ server lần đầu chưa
  const fromRemoteRef = useRef(false); // thay đổi đến từ server → không ghi ngược lại

  // Nhận kết quả bốc thăm từ server (realtime)
  useEffect(
    () =>
      onValue(ref(db, DB_PATH), (snap) => {
        fromRemoteRef.current = true;
        loadedRef.current = true;
        dispatch({ type: "HYDRATE", state: initState(snap.val()) });
      }),
    [],
  );

  // Ghi lên server khi state đổi tại máy này
  useEffect(() => {
    if (!loadedRef.current) return;
    if (fromRemoteRef.current) {
      fromRemoteRef.current = false;
      return;
    }
    set(ref(db, DB_PATH), state);
  }, [state]);

  const startSpin = useCallback((teamId) => dispatch({ type: "START_SPIN", teamId }), []);
  const commit = useCallback(() => dispatch({ type: "COMMIT" }), []);
  const reset = useCallback((mode = "random") => dispatch({ type: "RESET", mode }), []);

  const value = useMemo(() => {
    const drawnIds = new Set(state.results.map((r) => r.teamId));
    const remainingTeams = TEAMS.filter((t) => !drawnIds.has(t.id));
    const history = state.results.map((r) => ({ ...r, team: TEAM_BY_ID[r.teamId] }));
    const groupA = history.filter((r) => r.group === "A");
    const groupB = history.filter((r) => r.group === "B");
    const resultByTeamId = Object.fromEntries(state.results.map((r) => [r.teamId, r]));
    const isComplete = state.results.length >= TEAMS.length;

    return {
      teams: TEAMS,
      results: state.results,
      history,
      groupA,
      groupB,
      remainingTeams,
      resultByTeamId,
      mode: state.mode,
      pendingTeam: state.pendingTeamId ? TEAM_BY_ID[state.pendingTeamId] : null,
      nextGroup: isComplete ? null : getGroupForTurn(state.results.length),
      nextTurn: isComplete ? null : state.results.length + 1,
      hasStarted: state.results.length > 0,
      isComplete,
      startSpin,
      commitPending: commit,
      reset,
    };
  }, [state, startSpin, commit, reset]);

  return <DrawContext.Provider value={value}>{children}</DrawContext.Provider>;
}

export function useDraw() {
  const ctx = useContext(DrawContext);
  if (!ctx) throw new Error("useDraw phải được dùng bên trong <DrawProvider>");
  return ctx;
}