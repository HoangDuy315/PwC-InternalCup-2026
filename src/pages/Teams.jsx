import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useDraw } from "../context/DrawContext.jsx";
import TeamCard from "../components/TeamCard.jsx";
import { ArrowRightIcon } from "../components/Icons.jsx";

const FILTERS = [
  { key: "all", label: "Tất cả" },
  { key: "A", label: "Bảng A" },
  { key: "B", label: "Bảng B" },
];

// Container điều khiển hiệu ứng xuất hiện lần lượt (stagger)
const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export default function Teams() {
  const { teams, resultByTeamId, hasStarted, isComplete, history } = useDraw();
  const [filter, setFilter] = useState("all");

  // Lọc danh sách theo tab; trong tab bảng thì sắp theo thứ tự bốc thăm
  const visibleTeams = useMemo(() => {
    if (filter === "all") return teams;
    return teams
      .filter((t) => resultByTeamId[t.id]?.group === filter)
      .sort((a, b) => resultByTeamId[a.id].turn - resultByTeamId[b.id].turn);
  }, [filter, teams, resultByTeamId]);

  const countOf = (key) =>
    key === "all"
      ? teams.length
      : teams.filter((t) => resultByTeamId[t.id]?.group === key).length;

  return (
    <div className="bg-pwc-light">
      {/* Tiêu đề trang */}
      <section className="bg-pwc-black text-white">
        <div className="container-page py-10 sm:py-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-pwc-amber">
            Đội tham dự
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Danh sách 6 đội
          </h1>
          <p className="mt-3 max-w-2xl text-white/75">
            {isComplete
              ? "Bốc thăm đã hoàn tất. Lọc theo bảng để xem đội hình từng bảng."
              : hasStarted
                ? `Đang bốc thăm: ${history.length}/${teams.length} đội đã được xếp bảng.`
                : "Các đội chưa được xếp bảng. Hãy tiến hành bốc thăm để chia 2 bảng A và B."}
          </p>
        </div>
      </section>

      <div className="container-page py-10">
        {/* Thanh công cụ: tab lọc (khi đã bốc thăm) hoặc nút tới trang bốc thăm */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {hasStarted ? (
            <div
              role="tablist"
              aria-label="Lọc theo bảng"
              className="inline-flex w-fit rounded-lg bg-white p-1 shadow-card"
            >
              {FILTERS.map((f) => {
                const active = filter === f.key;
                return (
                  <button
                    key={f.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-controls="team-list"
                    onClick={() => setFilter(f.key)}
                    className={[
                      "relative rounded-md px-4 py-2 text-sm font-bold transition-colors",
                      active
                        ? "text-white"
                        : "text-pwc-dark hover:bg-pwc-light",
                    ].join(" ")}
                  >
                    {active && (
                      <motion.span
                        layoutId="team-filter-pill"
                        className="absolute inset-0 rounded-md bg-pwc-black"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 32,
                        }}
                        aria-hidden="true"
                      />
                    )}
                    <span className="relative">
                      {f.label}{" "}
                      <span className="opacity-70">({countOf(f.key)})</span>
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-pwc-dark">Chưa có kết quả bốc thăm.</p>
          )}

          {!isComplete && (
            <Link to="/draw" className="btn-primary w-fit">
              {hasStarted ? "Tiếp tục bốc thăm" : "Đến trang bốc thăm"}{" "}
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          )}
        </div>

        {/* Danh sách đội; key theo filter để chạy lại stagger khi đổi tab */}
        <motion.ul
          id="team-list"
          key={filter}
          variants={listVariants}
          initial="hidden"
          animate="show"
          className="grid items-start gap-4 md:grid-cols-2"
        >
          {visibleTeams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              index={teams.indexOf(team) + 1}
              result={resultByTeamId[team.id]}
            />
          ))}
        </motion.ul>

        {visibleTeams.length === 0 && (
          <p className="mt-6 rounded-xl bg-white p-6 text-center text-pwc-dark shadow-card">
            Chưa có đội nào trong Bảng {filter}.
          </p>
        )}
      </div>
    </div>
  );
}