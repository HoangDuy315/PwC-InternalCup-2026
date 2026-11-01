import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TeamAvatar from "./TeamAvatar.jsx";
import { UsersIcon } from "./Icons.jsx";

// Hiệu ứng xuất hiện cho từng card (dùng với stagger ở trang Teams)
export const teamCardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

// Icon mũi tên xuống
function ChevronDownIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

// Badge trạng thái bảng
function GroupBadge({ result }) {
  if (!result) {
    return (
      <span className="whitespace-nowrap rounded-full bg-pwc-light px-3 py-1 text-xs font-bold text-pwc-dark ring-1 ring-black/10">
        Chưa xếp bảng
      </span>
    );
  }
  return (
    <span
      className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold text-white ${
        result.group === "A" ? "bg-pwc-orange" : "bg-pwc-dark"
      }`}
    >
      Bảng {result.group}
    </span>
  );
}

// So sánh tên không phân biệt hoa thường / khoảng trắng thừa
const normalize = (s = "") => s.trim().replace(/\s+/g, " ").toLowerCase();

export default function TeamCard({ team, index, result }) {
  const [open, setOpen] = useState(false); // trạng thái mở/ẩn danh sách cầu thủ
  const panelId = useId();
  const players = team.players || [];
  const captainKey = normalize(team.captain);

  return (
    <motion.li
      variants={teamCardVariants}
      className="relative flex flex-col self-start overflow-hidden rounded-xl border border-black/5 bg-white shadow-card transition-shadow hover:shadow-lg"
    >
      {/* Vạch màu đội bên trái */}
      <span
        className="absolute inset-y-0 left-0 w-1.5"
        style={{ backgroundColor: team.color }}
        aria-hidden="true"
      />

      {/* ===== Header: STT, avatar, tên đội, đội trưởng, badge ===== */}
      <div className="flex items-center gap-4 p-5 pb-4">
        <span
          className="hidden w-8 shrink-0 text-center text-2xl font-black text-pwc-dark/25 sm:block"
          aria-label={`Số thứ tự ${index}`}
        >
          {String(index).padStart(2, "0")}
        </span>
        <TeamAvatar team={team} size="md" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-extrabold text-pwc-black">
            {team.name}
          </h3>
          {team.department && (
            <p className="text-sm text-pwc-dark/80">{team.department}</p>
          )}
          {/* Đội trưởng và số thành viên luôn nằm 2 dòng riêng để các card đồng đều */}
          <div className="mt-1 flex flex-col gap-1 text-sm text-pwc-dark/70">
            {team.captain && (
              <span className="truncate">
                Đội trưởng:{" "}
                <strong className="text-pwc-dark">{team.captain}</strong>
              </span>
            )}
            {team.members ? (
              <span className="inline-flex items-center gap-1.5">
                <UsersIcon className="h-4 w-4 shrink-0" /> {team.members} thành
                viên
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <GroupBadge result={result} />
          {result && (
            <span className="text-[11px] text-pwc-dark/60">
              Lượt #{result.turn}
            </span>
          )}
        </div>
      </div>

      {/* ===== Nút mở/ẩn + danh sách cầu thủ ===== */}
      {players.length > 0 && (
        <div className="border-t border-black/5">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={`${open ? "Ẩn" : "Xem"} danh sách cầu thủ ${team.name}`}
            className="flex w-full items-center justify-between px-5 py-3 text-sm font-bold text-pwc-orangeDark transition-colors hover:bg-pwc-light"
          >
            <span>
              {open ? "Ẩn danh sách cầu thủ" : "Xem danh sách cầu thủ"}{" "}
              <span className="font-semibold text-pwc-dark/60">
                ({players.length})
              </span>
            </span>
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-pwc-orange/10"
            >
              <ChevronDownIcon />
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id={panelId}
                key="players"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <ol
                  className="grid grid-cols-1 gap-x-4 gap-y-1 bg-pwc-light/60 px-5 pb-4 pt-3 sm:grid-cols-2"
                  aria-label={`Danh sách cầu thủ ${team.name}`}
                >
                  {players.map((player, i) => {
                    const isCaptain = normalize(player) === captainKey;
                    return (
                      <li
                        key={`${player}-${i}`}
                        className="flex min-w-0 items-center gap-2 text-sm"
                      >
                        <span className="w-5 shrink-0 text-right text-xs font-semibold tabular-nums text-pwc-dark/50">
                          {i + 1}.
                        </span>
                        <span
                          className={`truncate ${isCaptain ? "font-bold text-pwc-orangeDark" : "text-pwc-dark"}`}
                          title={player}
                        >
                          {player}
                        </span>
                        {isCaptain && (
                          <span
                            className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-pwc-orange text-[10px] font-black text-white"
                            aria-label="Đội trưởng"
                            title="Đội trưởng"
                          >
                            C
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.li>
  );
}