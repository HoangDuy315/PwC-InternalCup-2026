import { AnimatePresence, motion } from 'framer-motion';

// Lịch sử các lượt bốc thăm theo thứ tự
export default function DrawHistory({ history }) {
  return (
    <section aria-labelledby="history-title" className="rounded-xl border border-black/5 bg-white p-5 shadow-card">
      <h2 id="history-title" className="text-base font-extrabold text-pwc-black">
        Lịch sử bốc thăm
      </h2>
      {history.length === 0 ? (
        <p className="mt-3 text-sm text-pwc-dark/70">Chưa có lượt quay nào. Bấm “QUAY” để bắt đầu!</p>
      ) : (
        <ol className="mt-3 space-y-1.5">
          <AnimatePresence initial={false}>
            {history.map((h) => (
              <motion.li
                key={h.teamId}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center justify-between gap-3 overflow-hidden text-sm"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pwc-black text-xs font-bold text-white">
                    {h.turn}
                  </span>
                  <span className="truncate font-semibold text-pwc-black">{h.team.name}</span>
                </span>
                <span
                  className={`shrink-0 rounded px-2 py-0.5 text-xs font-bold text-white ${
                    h.group === 'A' ? 'bg-pwc-orange' : 'bg-pwc-dark'
                  }`}
                >
                  Bảng {h.group}
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
      )}
    </section>
  );
}