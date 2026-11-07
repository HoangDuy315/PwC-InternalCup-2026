import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TEAM_BY_ID, getJerseyNumber } from "../data/teams.js";
import { useSharedState } from "../hooks/useSharedState.js";
import TeamAvatar from "./TeamAvatar.jsx";
import { TrophyIcon } from "./Icons.jsx";

export default function TopScorers() {
  const [matchGoals] = useSharedState("matchGoals", {});

  // Cộng bàn của từng cầu thủ qua tất cả các trận (không tính phản lưới)
  const rows = useMemo(() => {
    const total = {};
    Object.values(matchGoals || {}).forEach((m) => {
      Object.keys(m || {}).forEach((key) => {
        if (key.indexOf("::__og__") !== -1) return;
        total[key] = (total[key] || 0) + (Number(m[key]) || 0);
      });
    });
    return Object.keys(total)
      .map((key) => {
        const parts = key.split("::");
        return {
          key: key,
          team: TEAM_BY_ID[parts[0]],
          name: parts[1],
          count: total[key],
        };
      })
      .filter((r) => r.team && r.count > 0)
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "vi"));
  }, [matchGoals]);
  const topCount = rows[0]?.count || 0;

  return (
    <section aria-labelledby="scorers-title">
      <p className="eyebrow">Cá nhân</p>
      <h2 id="scorers-title" className="section-title">
        Vua phá lưới
      </h2>
      <p className="mt-2 text-sm text-pwc-dark/70">
        Tự cập nhật từ danh sách ghi bàn của từng trận.
      </p>

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
                const jersey = getJerseyNumber(r.team.id, r.name);
                return (
                  <motion.li
                    key={r.key}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={
                      "flex items-center gap-3 border-t border-black/5 px-4 py-3 first:border-t-0 " +
                      (isTop ? "bg-pwc-amber/10" : "")
                    }
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
                      <p className="text-xs text-pwc-dark/60">
                        {(jersey != null ? "#" + jersey + " · " : "") +
                          r.team.name}
                      </p>
                    </div>
                    <span className="w-10 text-center text-xl font-black text-pwc-orangeDark">
                      {r.count}
                    </span>
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