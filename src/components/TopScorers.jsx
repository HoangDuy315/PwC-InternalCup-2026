import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TEAMS, TEAM_BY_ID, getJerseyNumber } from "../data/teams.js";
import { useSharedState } from "../hooks/useSharedState.js";
import { useAuth } from "../context/AuthContext.jsx";
import TeamAvatar from "./TeamAvatar.jsx";
import { ResetIcon, TrophyIcon } from "./Icons.jsx";

const MANUAL = "_manual_"; // giá trị đặc biệt: nhập tên tay

// Khóa lưu = id đội + tên cầu thủ (tránh trùng tên giữa 2 đội)
const makeKey = (teamId, player) => teamId + "::" + player;

// Làm sạch tên nhập tay: bỏ ký tự Firebase không cho phép trong key (. # $ / [ ])
const cleanName = (s) =>
  String(s || "")
    .replace(/[.#$/[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export default function TopScorers() {
  const { isAuthed } = useAuth(); // chỉ admin mới được sửa
  const [goals, setGoals] = useSharedState("goals", {});
  const [teamId, setTeamId] = useState(TEAMS[0]?.id || "");
  const [player, setPlayer] = useState(""); // tên cầu thủ chọn từ list, hoặc MANUAL
  const [manualName, setManualName] = useState(""); // tên nhập tay

  // Danh sách cầu thủ có bàn, sắp xếp giảm dần
  const rows = useMemo(
    () =>
      Object.entries(goals || {})
        .map(([key, count]) => {
          const [tId, name] = key.split("::");
          return { key, team: TEAM_BY_ID[tId], name, count };
        })
        .filter((r) => r.team && r.count > 0)
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "vi")),
    [goals]
  );
  const topCount = rows[0]?.count || 0;

  // Cầu thủ trong list của đội + cầu thủ nhập tay đã từng ghi bàn cho đội đó
  const roster = TEAM_BY_ID[teamId]?.players || [];
  const rosterNames = new Set(roster.map((p) => p.name));
  const extraPlayers = rows
    .filter((r) => r.team.id === teamId && !rosterNames.has(r.name))
    .map((r) => r.name);

  const isManual = player === MANUAL;
  const finalName = isManual ? cleanName(manualName) : player;

  // Cộng/trừ bàn thắng
  const change = (key, delta) =>
    setGoals((prev) => {
      const base = prev || {};
      const next = Math.max(0, (base[key] || 0) + delta);
      const copy = { ...base };
      if (next === 0) delete copy[key];
      else copy[key] = next;
      return copy;
    });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!teamId || !finalName) return;
    change(makeKey(teamId, finalName), 1);
    // Nhập tay xong: chuyển dropdown về đúng tên vừa thêm để bấm tiếp cho nhanh
    if (isManual) {
      setPlayer(finalName);
      setManualName("");
    }
  };

  return (
    <section aria-labelledby="scorers-title">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Cá nhân</p>
          <h2 id="scorers-title" className="section-title">Vua phá lưới</h2>
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
                setManualName("");
              }}
              className="mt-1 w-full rounded-md border border-black/15 bg-white px-3 py-2.5"
            >
              {TEAMS.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </label>

          <label className="flex-1 text-sm font-semibold text-pwc-dark">
            Cầu thủ
            <select
              value={player}
              onChange={(e) => {
                setPlayer(e.target.value);
                setManualName("");
              }}
              className="mt-1 w-full rounded-md border border-black/15 bg-white px-3 py-2.5"
            >
              <option value="">-- Chọn cầu thủ --</option>
              {roster.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.number != null ? "#" + p.number + " – " : ""}
                  {p.name}
                </option>
              ))}
              {extraPlayers.map((name) => (
                <option key={"extra-" + name} value={name}>
                  {name} (ngoài danh sách)
                </option>
              ))}
              <option value={MANUAL}>+ Nhập tên khác…</option>
            </select>
          </label>

          {/* Ô nhập tên tay – chỉ hiện khi chọn "Nhập tên khác" */}
          {isManual && (
            <label className="flex-1 text-sm font-semibold text-pwc-dark">
              Tên cầu thủ
              <input
                type="text"
                autoFocus
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder="VD: Nguyễn Văn A"
                maxLength={60}
                className="mt-1 w-full rounded-md border border-black/15 bg-white px-3 py-2.5"
              />
            </label>
          )}

          <button type="submit" disabled={!finalName} className="btn-primary">
            + 1 bàn
          </button>
        </form>
      )}

      {/* Bảng xếp hạng */}
      <div className="mt-6 overflow-hidden rounded-xl border border-black/5 bg-white shadow-card">
        {rows.length === 0 ? (
          <p className="p-6 text-center text-pwc-dark/70">Chưa có bàn thắng nào được ghi nhận.</p>
        ) : (
          <ol>
            <AnimatePresence initial={false}>
              {rows.map((r, i) => {
                const isTop = r.count === topCount;
                const jersey = getJerseyNumber(r.team.id, r.name);
                return (
                  <motion.li
                    key={r.key}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={
                      "flex items-center gap-3 border-t border-black/5 px-4 py-3 first:border-t-0 " +
                      (isTop ? "bg-pwc-amber/10" : "")
                    }
                  >
                    <span className="w-6 text-center font-black text-pwc-dark/50">{i + 1}</span>
                    <TeamAvatar team={r.team} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2 truncate font-bold text-pwc-black">
                        {r.name}
                        {isTop && <TrophyIcon className="h-4 w-4 shrink-0 text-pwc-orange" />}
                      </p>
                      <p className="text-xs text-pwc-dark/60">
                        {jersey != null ? "#" + jersey + " · " : ""}
                        {r.team.name}
                      </p>
                    </div>

                    {isAuthed && (
                      <button
                        type="button"
                        onClick={() => change(r.key, -1)}
                        aria-label={"Bớt 1 bàn của " + r.name}
                        className="h-8 w-8 rounded-md text-lg font-bold text-pwc-dark ring-1 ring-black/15 hover:bg-pwc-light"
                      >
                        −
                      </button>
                    )}
                    <span className="w-10 text-center text-xl font-black text-pwc-orangeDark">{r.count}</span>
                    {isAuthed && (
                      <button
                        type="button"
                        onClick={() => change(r.key, 1)}
                        aria-label={"Thêm 1 bàn cho " + r.name}
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
        Dòng tô vàng có biểu tượng cúp: đang dẫn đầu (bằng bàn thì cùng dẫn đầu).
      </p>
    </section>
  );
}