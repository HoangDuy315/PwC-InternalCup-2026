import { motion } from "framer-motion";
import { getInitials } from "../utils/color.js";
import { MailIcon, PhoneIcon } from "./Icons.jsx";

// Card liên hệ: role và phone là tùy chọn, chỉ hiển thị khi có dữ liệu
export default function ContactCard({ contact, index = 0 }) {
  const telHref = contact.phone
    ? `tel:${contact.phone.replace(/[^\d+]/g, "")}`
    : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group flex flex-col rounded-xl border border-black/5 bg-white p-6 shadow-card transition-shadow hover:shadow-lg"
    >
      <div className="flex items-center gap-4">
        {contact.avatar ? (
          <img
            src={contact.avatar}
            alt={`Ảnh đại diện ${contact.name}`}
            className="h-14 w-14 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span
            className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-pwc-dark text-lg font-extrabold text-pwc-amber"
            aria-hidden="true"
          >
            {getInitials(contact.name)}
          </span>
        )}
        <div className="min-w-0">
          <h3 className="text-lg font-bold leading-snug text-pwc-black">
            {contact.name}
          </h3>
          <p className="text-sm font-medium text-pwc-orangeDark">
            {contact.role || "Ban tổ chức"}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-2 border-t border-black/5 pt-4 text-sm">
        <a
          href={`mailto:${contact.email}`}
          className="flex items-center gap-3 rounded-md p-1 text-pwc-dark hover:text-pwc-orangeDark"
          aria-label={`Gửi email cho ${contact.name}: ${contact.email}`}
        >
          <MailIcon className="h-4 w-4 shrink-0" />
          <span className="break-all">{contact.email}</span>
        </a>
        {telHref && (
          <a
            href={telHref}
            className="flex items-center gap-3 rounded-md p-1 text-pwc-dark hover:text-pwc-orangeDark"
            aria-label={`Gọi cho ${contact.name}: ${contact.phone}`}
          >
            <PhoneIcon className="h-4 w-4 shrink-0" />
            <span>{contact.phone}</span>
          </a>
        )}
      </div>
    </motion.article>
  );
}