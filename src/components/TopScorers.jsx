import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TEAMS, TEAM_BY_ID } from "../data/teams.js";
// import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { useSharedState } from "../hooks/useSharedState.js";
import { useAuth } from "../context/AuthContext.jsx";
import TeamAvatar from "./TeamAvatar.jsx";
import {ResetIcon, TrophyIcon } from "./Icons.jsx";

const GOALS_KEY = "pwc-internal-cup:goals:v1";
// Khóa lưu = id đội + tên cầu thủ (tránh trùng tên giữa 2 đội)
const makeKey = (teamId, player) => `${teamId}::${player}`;

export default function TopScorers() {
  const { isAuthed } = useAuth(); // chỉ admin mới được sửa
  const [goals, setGoals] = useSharedState("goals", {});
  const [teamId, setTeamId] = useState(TEAMS[0]?.id || "");
  const [player, setPlayer] = useState("");

  const players = TEAM_BY_ID[teamId]?.players || [];

  // Danh sách cầu thủ có bàn, sắp xếp giảm dần
  const rows = useMemo(
    () =>
      Object.entries(goals)
        .map(([key, count]) => {
          const [tId, name] = key.split("::");
          return { key, team: TEAM_BY_ID[tId], name, count };
        })
        .filter((r) => r.team && r.count > 0)
        .sort(
          (a, b) => b.count - a.count || a.name.localeCompare(b.name, "vi"),
        ),
    [goals],
  );
  const topCount = rows[0]?.count || 0;

  // Cộng/trừ bàn thắng
  const change = (key, delta) =>
    setGoals((prev) => {
      const next = Math.max(0, (prev[key] || 0) + delta);
      const copy = { ...prev };
      if (next === 0) delete copy[key];
      else copy[key] = next;
      return copy;
    });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!teamId || !player) return;
    change(makeKey(teamId, player), 1);
  };

  return (
    <section aria-labelledby="scorers-title">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Cá nhân</p>
          <h2 id="scorers-title" className="section-title">
            Vua phá lưới
          </h2>
        </div>
        {isAuthed && rows.length > 0 && (
          <button
            type="button"
            onClick={() => setGoals({})}
            className="btn-outline py-2"
            aria-label="Xóa toàn bộ bàn thắng của vua phá lưới"
          >
            <ResetIcon className="h-4 w-4" /> Reset vua phá lưới
          </button>
        )}
      </div>

      {/* Form ghi bàn – chỉ hiện khi đã đăng nhập admin */}
      {isAuthed && (
        <form
          onSubmit={handleAdd}
          className="mt-6 flex flex-col gap-3 rounded-xl bg-white p-4 shadow-card sm:flex-row sm:items-end"
        >
          <label className="flex-1 text-sm font-semibold text-pwc-dark">
            Đội
            <select
              value={teamId}
              onChange={(e) => {
                setTeamId(e.target.value);
                setPlayer("");
              }}
              className="mt-1 w-full rounded-md border border-black/15 bg-white px-3 py-2.5"
            >
              {TEAMS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex-1 text-sm font-semibold text-pwc-dark">
            Cầu thủ
            <select
              value={player}
              onChange={(e) => setPlayer(e.target.value)}
              className="mt-1 w-full rounded-md border border-black/15 bg-white px-3 py-2.5"
            >
              <option value="">-- Chọn cầu thủ --</option>
              {players.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" disabled={!player} className="btn-primary">
            + 1 bàn
          </button>
        </form>
      )}

      {/* Bảng xếp hạng */}
      <div className="mt-6 overflow-hidden rounded-xl border border-black/5 bg-white shadow-card">
        {rows.length === 0 ? (
          <p className="p-6 text-center text-pwc-dark/70">
            Chưa có bàn thắng nào được ghi nhận.
          </p>
        ) : (
          <ol>
            <AnimatePresence initial={false}>
              {rows.map((r, i) => {
                const isTop = r.count === topCount;
                return (
                  <motion.li
                    key={r.key}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex items-center gap-3 border-t border-black/5 px-4 py-3 first:border-t-0 ${
                      isTop ? "bg-pwc-amber/10" : ""
                    }`}
                  >
                    <span className="w-6 text-center font-black text-pwc-dark/50">
                      {i + 1}
                    </span>
                    <TeamAvatar team={r.team} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2 truncate font-bold text-pwc-black">
                        {r.name}
                        {isTop && (
                          <TrophyIcon className="h-4 w-4 shrink-0 text-pwc-orange" />
                        )}
                      </p>
                      <p className="text-xs text-pwc-dark/60">{r.team.name}</p>
                    </div>

                    {isAuthed && (
                      <button
                        type="button"
                        onClick={() => change(r.key, -1)}
                        aria-label={`Bớt 1 bàn của ${r.name}`}
                        className="h-8 w-8 rounded-md text-lg font-bold text-pwc-dark ring-1 ring-black/15 hover:bg-pwc-light"
                      >
                        −
                      </button>
                    )}
                    <span className="w-10 text-center text-xl font-black text-pwc-orangeDark">
                      {r.count}
                    </span>
                    {isAuthed && (
                      <button
                        type="button"
                        onClick={() => change(r.key, 1)}
                        aria-label={`Thêm 1 bàn cho ${r.name}`}
                        className="h-8 w-8 rounded-md bg-pwc-orange text-lg font-bold text-white hover:bg-pwc-orangeDark"
                      >
                        +
                      </button>
                    )}
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ol>
        )}
      </div>
      <p className="mt-2 text-xs text-pwc-dark/60">
        Dòng tô vàng có biểu tượng cúp: đang dẫn đầu (bằng bàn thì cùng dẫn
        đầu).
      </p>
    </section>
  );
}