import { motion } from 'framer-motion';

// Card thông tin chính (thời gian, địa điểm, thể thức, giải thưởng)
export default function InfoCard({ icon: IconComp, title, children, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="relative overflow-hidden rounded-xl border border-black/5 bg-white p-6 shadow-card"
    >
      <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pwc-orange to-pwc-amber" aria-hidden="true" />
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-pwc-orange/10 text-pwc-orange">
        <IconComp className="h-6 w-6" />
      </span>
      <h3 className="mt-4 text-sm font-bold uppercase tracking-wider text-pwc-dark/70">{title}</h3>
      <div className="mt-2 text-base font-semibold leading-relaxed text-pwc-black">{children}</div>
    </motion.div>
  );
}