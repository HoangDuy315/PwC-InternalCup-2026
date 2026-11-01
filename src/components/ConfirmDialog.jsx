import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Hộp thoại xác nhận dùng chung (vd: Reset bốc thăm)
export default function ConfirmDialog({ open, title, message, confirmLabel = 'Xác nhận', onConfirm, onCancel }) {
  const cancelRef = useRef(null);
  const confirmRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const focusTimer = window.setTimeout(() => cancelRef.current?.focus(), 50);
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel();
      // Giữ focus giữa 2 nút trong hộp thoại
      if (e.key === 'Tab') {
        e.preventDefault();
        const next = document.activeElement === cancelRef.current ? confirmRef.current : cancelRef.current;
        next?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-desc"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="confirm-title" className="text-lg font-extrabold text-pwc-black">
              {title}
            </h2>
            <p id="confirm-desc" className="mt-2 text-sm text-pwc-dark">
              {message}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button ref={cancelRef} type="button" className="btn-outline" onClick={onCancel}>
                Hủy
              </button>
              <button ref={confirmRef} type="button" className="btn-primary" onClick={onConfirm}>
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}