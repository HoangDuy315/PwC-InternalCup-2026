import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const OG = "_og_"; // bàn phản lưới (đội được hưởng)

// Bỏ ký tự Firebase không cho phép trong key
const cleanName = (s) =>
  String(s || "")
    .replace(/[.#$/[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// Chấp nhận cầu thủ dạng "Tên" hoặc { name, number }
const toPlayer = (p) =>
  typeof p === "string"
    ? { name: p, number: null }
    : { name: p?.name ?? "", number: p?.number ?? null };

function TeamColumn({ team, goals, canEdit, onChange }) {
  const [manual, setManual] = useState("");
  const prefix = team.id + "::";
  const countOf = (name) => Number(goals[prefix + name]) || 0;

  const roster = (team.players || []).map(toPlayer);
  const rosterNames = new Set(roster.map((p) => p.name));

  // Cầu thủ nhập tay đã ghi bàn trong trận này
  const extras = Object.keys(goals)
    .filter((k) => k.indexOf(prefix) === 0)
    .map((k) => k.slice(prefix.length))
    .filter((n) => n !== OG && !rosterNames.has(n))
    .map((n) => ({ name: n, number: null }));

  const all = roster.concat(extras);
  const scorers = all.filter((p) => countOf(p.name) > 0);
  const og = countOf(OG);

  const addManual = (e) => {
    e.preventDefault();
    const n = cleanName(manual);
    if (!n) return;
    onChange(team.id, n, 1);
    setManual("");
  };

  return (
    <div className="min-w-0">
      <p className="mb-2 text-sm font-extrabold text-pwc-black">{team.name}</p>

      {/* Người xem: chỉ hiện người ghi bàn */}
      {!canEdit && (
        <ul className="space-y-1 text-sm">
          {scorers.length === 0 && og === 0 && (
            <li className="text-pwc-dark/50">Chưa có bàn thắng</li>
          )}
          {scorers.map((p) => (
            <li key={p.name} className="flex justify-between gap-2">
              <span className="truncate">
                {(p.number != null ? "#" + p.number + " " : "") + p.name}
              </span>
              <span className="shrink-0 font-bold text-pwc-orangeDark">
                {"⚽ ×" + countOf(p.name)}
              </span>
            </li>
          ))}
          {og > 0 && (
            <li className="flex justify-between gap-2 text-pwc-dark/70">
              <span>Phản lưới nhà</span>
              <span className="font-bold">{"×" + og}</span>
            </li>
          )}
        </ul>
      )}

      {/* Admin: toàn bộ danh sách + nút +/− */}
      {canEdit && (
        <>
          <ul className="space-y-1 text-sm">
            {all.concat([{ name: OG, number: null }]).map((p) => {
              const c = countOf(p.name);
              const isOg = p.name === OG;
              const label = isOg ? "Bàn phản lưới (được hưởng)" : p.name;
              return (
                <li
                  key={p.name}
                  className={
                    "flex items-center gap-2 rounded px-1 py-0.5 " +
                    (c > 0 ? "bg-pwc-amber/15" : "")
                  }
                >
                  <span className="w-7 shrink-0 text-xs font-black text-pwc-dark/60">
                    {p.number != null ? "#" + p.number : ""}
                  </span>
                  <span
                    className={
                      "min-w-0 flex-1 truncate " +
                      (isOg ? "italic text-pwc-dark/70" : "")
                    }
                  >
                    {label}
                  </span>
                  <button
                    type="button"
                    onClick={() => onChange(team.id, p.name, -1)}
                    disabled={c === 0}
                    aria-label={"Bớt 1 bàn: " + label}
                    className="h-7 w-7 shrink-0 rounded font-bold ring-1 ring-black/15 hover:bg-pwc-light disabled:opacity-30"
                  >
                    −
                  </button>
                  <span className="w-5 shrink-0 text-center font-black text-pwc-orangeDark">
                    {c}
                  </span>
                  <button
                    type="button"
                    onClick={() => onChange(team.id, p.name, 1)}
                    aria-label={"Thêm 1 bàn: " + label}
                    className="h-7 w-7 shrink-0 rounded bg-pwc-orange font-bold text-white hover:bg-pwc-orangeDark"
                  >
                    +
                  </button>
                </li>
              );
            })}
          </ul>

          <form onSubmit={addManual} className="mt-2 flex gap-2">
            <input
              type="text"
              value={manual}
              onChange={(e) => setManual(e.target.value)}
              placeholder="Cầu thủ ngoài danh sách"
              maxLength={60}
              className="min-w-0 flex-1 rounded-md border border-black/15 px-2 py-1.5 text-sm"
            />
            <button
              type="submit"
              disabled={!manual.trim()}
              className="btn-outline px-3 py-1.5 text-sm"
            >
              + 1
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default function MatchScorers({
  match,
  goals,
  canEdit,
  onChange,
  score,
  onZero,
}) {
  const [open, setOpen] = useState(false);
  if (!match.homeTeam || !match.awayTeam) return null;

  const g = goals || {};
  const total = Object.keys(g).reduce((s, k) => s + (Number(g[k]) || 0), 0);
  const hasGoals = Object.keys(g).length > 0;
  const isZero = score.home === "0" && score.away === "0";
  const isEmpty = score.home === "" && score.away === "";

  return (
    <div className="mt-2 overflow-hidden rounded-xl bg-white shadow-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-2.5 text-sm font-bold text-pwc-orangeDark hover:bg-pwc-light"
      >
        <span>{"Cầu thủ ghi bàn" + (total > 0 ? " (" + total + ")" : "")}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} aria-hidden="true">
          ▾
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid gap-4 border-t border-black/5 p-4 sm:grid-cols-2">
              <TeamColumn
                team={match.homeTeam}
                goals={g}
                canEdit={canEdit}
                onChange={onChange}
              />
              <TeamColumn
                team={match.awayTeam}
                goals={g}
                canEdit={canEdit}
                onChange={onChange}
              />
            </div>

            {canEdit && !hasGoals && (isEmpty || isZero) && (
              <div className="border-t border-black/5 px-4 py-3">
                <button
                  type="button"
                  onClick={onZero}
                  className="btn-outline py-1.5 text-sm"
                >
                  {isZero ? "Hủy 0–0" : "Xác nhận 0–0"}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}