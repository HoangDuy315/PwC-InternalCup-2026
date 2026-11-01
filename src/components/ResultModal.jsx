import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import TeamAvatar from './TeamAvatar.jsx';
import { TrophyIcon } from './Icons.jsx';

const PWC_COLORS = ['#D04A02', '#EB8C00', '#FFB600', '#2D2D2D', '#FFFFFF'];

// Bắn pháo giấy 3 hướng
function fireConfetti() {
  const base = { colors: PWC_COLORS, zIndex: 9999, disableForReducedMotion: true };
  confetti({ ...base, particleCount: 140, spread: 90, startVelocity: 45, origin: { y: 0.55 } });
  confetti({ ...base, particleCount: 60, angle: 60, spread: 60, origin: { x: 0, y: 0.7 } });
  confetti({ ...base, particleCount: 60, angle: 120, spread: 60, origin: { x: 1, y: 0.7 } });
}

/**
 * Popup chúc mừng đội trúng.
 * - team: đội trúng (null = đóng)
 * - group, turn, total: thông tin hiển thị
 * - onClose: đóng popup và chốt đội vào bảng
 */
export default function ResultModal({ team, group, turn, total, onClose, reducedMotion }) {
  const buttonRef = useRef(null);

  // Khi mở: bắn confetti, focus nút, khóa cuộn trang, lắng nghe phím Esc
  useEffect(() => {
    if (!team) return undefined;
    if (!reducedMotion) fireConfetti();
    const focusTimer = window.setTimeout(() => buttonRef.current?.focus(), 50);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      // Giữ focus trong modal (chỉ có 1 nút)
      if (e.key === 'Tab') {
        e.preventDefault();
        buttonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [team, onClose, reducedMotion]);

  return (
    <AnimatePresence>
      {team && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="result-title"
            aria-describedby="result-desc"
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-br from-pwc-black via-pwc-dark to-pwc-black px-6 pb-12 pt-8 text-white">
              <TrophyIcon className="mx-auto h-10 w-10 text-pwc-amber" />
              <p className="mt-2 text-sm font-bold uppercase tracking-[0.25em] text-pwc-amber">
                Lượt {turn}/{total}
              </p>
              <h2 id="result-title" className="mt-1 text-2xl font-extrabold sm:text-3xl">
                Chúc mừng!
              </h2>
            </div>
            <div className="-mt-8 flex justify-center">
              <TeamAvatar team={team} size="lg" />
            </div>
            <div className="px-6 pb-7 pt-3">
              <p className="text-2xl font-black text-pwc-black sm:text-3xl">{team.name}</p>
              <p id="result-desc" className="mt-2 text-pwc-dark">
                được xếp vào{' '}
                <span
                  className={`rounded-md px-2 py-0.5 font-extrabold text-white ${
                    group === 'A' ? 'bg-pwc-orange' : 'bg-pwc-dark'
                  }`}
                >
                  Bảng {group}
                </span>
              </p>
              <button
                ref={buttonRef}
                type="button"
                onClick={onClose}
                className="btn-primary mt-6 w-full text-base"
                aria-label={`Xác nhận đưa ${team.name} vào Bảng ${group}`}
              >
                Đưa vào Bảng {group}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}