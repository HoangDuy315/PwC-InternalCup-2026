import { AnimatePresence, motion } from 'framer-motion';
import { TEAMS_PER_GROUP } from '../context/DrawContext.jsx';
import TeamAvatar from './TeamAvatar.jsx';

/**
 * Bảng đấu với 3 slot.
 * - entries: [{ team, turn }] các đội đã vào bảng
 * - isNext: bảng sẽ nhận đội ở lượt kế tiếp (để highlight)
 * - lastAddedId: đội vừa được thêm → hiệu ứng nổi bật
 */
export default function GroupBoard({ group, entries, isNext, lastAddedId }) {
  const slots = Array.from({ length: TEAMS_PER_GROUP }, (_, i) => entries[i] || null);
  const isA = group === 'A';

  return (
    <section
      aria-labelledby={`group-${group}-title`}
      className={[
        'overflow-hidden rounded-xl border bg-white shadow-card transition-shadow',
        isNext ? 'border-pwc-amber ring-2 ring-pwc-amber/50' : 'border-black/5',
      ].join(' ')}
    >
      <header
        className={`flex items-center justify-between px-5 py-3 ${isA ? 'bg-pwc-orange' : 'bg-pwc-dark'} text-white`}
      >
        <h2 id={`group-${group}-title`} className="text-lg font-extrabold tracking-tight">
          Bảng {group}
        </h2>
        <span className="rounded-full bg-black/25 px-3 py-1 text-xs font-bold">
          {entries.length}/{TEAMS_PER_GROUP}
        </span>
      </header>

      <ol className="space-y-2 p-3">
        {slots.map((entry, i) => (
          <li key={i} className="min-h-[60px]">
            <AnimatePresence mode="wait" initial={false}>
              {entry ? (
                <motion.div
                  key={entry.team.id}
                  initial={{ opacity: 0, x: -60, scale: 0.7 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  className={[
                    'flex items-center gap-3 rounded-lg border p-2.5',
                    lastAddedId === entry.team.id
                      ? 'border-pwc-amber bg-pwc-amber/10'
                      : 'border-black/5 bg-pwc-light',
                  ].join(' ')}
                >
                  <TeamAvatar team={entry.team} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-pwc-black">{entry.team.name}</p>
                    <p className="text-xs text-pwc-dark/70">Lượt bốc thăm #{entry.turn}</p>
                  </div>
                  <span className="text-sm font-black text-pwc-dark/40" aria-hidden="true">
                    {group}
                    {i + 1}
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-[60px] items-center gap-3 rounded-lg border-2 border-dashed border-black/10 px-3 text-sm text-pwc-dark/60"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-pwc-light font-bold">
                    {i + 1}
                  </span>
                  Đang chờ bốc thăm…
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        ))}
      </ol>
    </section>
  );
}