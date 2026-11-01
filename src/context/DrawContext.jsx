import { createContext, useCallback, useContext, useMemo } from "react";
import { TEAMS, TEAMS_SIGNATURE, TEAM_BY_ID } from "../data/teams.js";
import { usePersistentReducer } from "../hooks/useLocalStorage.js";

const STORAGE_KEY = "pwc-internal-cup:draw:v1";
export const TEAMS_PER_GROUP = 3;

// Thứ tự chia bảng: lượt lẻ → A, lượt chẵn → B (turnIndex bắt đầu từ 0)
export const getGroupForTurn = (turnIndex) => (turnIndex % 2 === 0 ? "A" : "B");

/*
  Cấu trúc state:
  - results: [{ teamId, group, turn, drawnAt }] – kết quả đã chốt
  - pendingTeamId: đội vừa được chọn nhưng chưa chốt (đang quay / đang hiện popup)
  - mode: 'random' (ngẫu nhiên hoàn toàn) | 'preset' (theo tổ hợp xếp sẵn)
*/
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
  if (
    alreadyDrawn ||
    results.length >= TEAMS.length ||
    !TEAM_BY_ID[pendingTeamId]
  ) {
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

// Kiểm tra dữ liệu localStorage; nếu không hợp lệ thì khởi tạo lại
function initState(stored) {
  if (
    !stored ||
    stored.signature !== TEAMS_SIGNATURE ||
    !Array.isArray(stored.results)
  ) {
    return createInitialState();
  }
  const seen = new Set();
  const results = [];
  stored.results.forEach((r) => {
    if (
      r &&
      TEAM_BY_ID[r.teamId] &&
      !seen.has(r.teamId) &&
      results.length < TEAMS.length
    ) {
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
    stored.pendingTeamId && TEAM_BY_ID[stored.pendingTeamId]
      ? stored.pendingTeamId
      : null;
  const mode = stored.mode === "preset" ? "preset" : "random";
  // F5 khi đang quay: tự chốt đội đã được chọn trước đó
  return commitPending({
    signature: TEAMS_SIGNATURE,
    results,
    pendingTeamId,
    mode,
  });
}

function drawReducer(state, action) {
  switch (action.type) {
    case "START_SPIN": {
      // Chặn quay 2 lần đồng thời hoặc khi đã hết đội
      if (state.pendingTeamId || state.results.length >= TEAMS.length)
        return state;
      const isRemaining =
        TEAM_BY_ID[action.teamId] &&
        !state.results.some((r) => r.teamId === action.teamId);
      if (!isRemaining) return state;
      return { ...state, pendingTeamId: action.teamId };
    }
    case "COMMIT":
      return commitPending(state);
    case "RESET":
      return createInitialState(action.mode === "preset" ? "preset" : "random");
    default:
      return state;
  }
}

const DrawContext = createContext(null);

export function DrawProvider({ children }) {
  const [state, dispatch] = usePersistentReducer(
    drawReducer,
    STORAGE_KEY,
    initState,
  );

  const startSpin = useCallback(
    (teamId) => dispatch({ type: "START_SPIN", teamId }),
    [dispatch],
  );
  const commit = useCallback(() => dispatch({ type: "COMMIT" }), [dispatch]);
  // reset('random') = reset lớn, reset('preset') = reset nhỏ
  const reset = useCallback(
    (mode = "random") => dispatch({ type: "RESET", mode }),
    [dispatch],
  );

  const value = useMemo(() => {
    const drawnIds = new Set(state.results.map((r) => r.teamId));
    const remainingTeams = TEAMS.filter((t) => !drawnIds.has(t.id));
    const history = state.results.map((r) => ({
      ...r,
      team: TEAM_BY_ID[r.teamId],
    }));
    const groupA = history.filter((r) => r.group === "A");
    const groupB = history.filter((r) => r.group === "B");
    const resultByTeamId = Object.fromEntries(
      state.results.map((r) => [r.teamId, r]),
    );
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

// Hook tiện ích để dùng context
export function useDraw() {
  const ctx = useContext(DrawContext);
  if (!ctx) throw new Error("useDraw phải được dùng bên trong <DrawProvider>");
  return ctx;
}