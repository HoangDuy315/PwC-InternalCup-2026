
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RULES } from "../data/rules.js";
import { ArrowRightIcon } from "../components/Icons.jsx";

// 1 mục điều lệ có thể mở/ẩn
function RuleSection({ section, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-xl border border-black/5 bg-white shadow-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-pwc-light"
      >
        <span className="text-lg font-extrabold text-pwc-black">{section.title}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pwc-orange/10 text-pwc-orangeDark"
          aria-hidden="true"
        >
          ▾
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <ul className="space-y-2 border-t border-black/5 px-5 pb-5 pt-4">
              {section.items.map((item, i) => (
                <li key={i} className="flex gap-3 text-pwc-dark">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-pwc-orange" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Rules() {
  return (
    <div className="bg-pwc-light">
      {/* Tiêu đề trang */}
      <section className="bg-pwc-black text-white">
        <div className="container-page py-10 sm:py-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-pwc-amber">Thông tin giải</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Điều lệ giải đấu</h1>
          {RULES.updatedAt && (
            <p className="mt-3 text-white/75">{"Cập nhật: " + RULES.updatedAt}</p>
          )}
        </div>
      </section>

      <div className="container-page space-y-12 py-10">
        {/* Điều lệ */}
        <section aria-labelledby="rules-title">
          <p className="eyebrow">Điều lệ</p>
          <h2 id="rules-title" className="section-title">Điều lệ giải đấu</h2>
          <div className="mt-6 space-y-3">
            {RULES.sections.map((s, i) => (
              <RuleSection key={s.title} section={s} defaultOpen={i === 0} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}