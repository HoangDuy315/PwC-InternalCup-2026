import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import { CloseIcon, MenuIcon } from "./Icons.jsx";
import pwcLogo from "../Asset/avaremovebg.png";

const LINKS = [
  { to: "/", label: "Giới thiệu", end: true },
  { to: "/draw", label: "Bốc thăm" },
  { to: "/teams", label: "Danh sách đội" },
  { to: "/schedule", label: "Lịch thi đấu" },
  { to: "/rules", label: "Quy định" },
];

// Class cho link: highlight page đang active bằng gạch chân cam
const linkClass = ({ isActive }) =>
  [
    "relative px-3 py-2 text-sm font-semibold transition-colors rounded-md",
    isActive ? "text-pwc-amber" : "text-white/80 hover:text-white",
  ].join(" ");

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { isAuthed, logout } = useAuth();

  // Đóng menu mobile khi chuyển trang
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Đăng xuất + đóng menu mobile
  const handleLogout = () => {
    setOpen(false);
    logout();
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-pwc-black/95 backdrop-blur">
      <nav
        className="container-page flex h-16 items-center justify-between"
        aria-label="Điều hướng chính"
      >
        {/* Logo PwC đặt trên nền trắng vì chữ "pwc" màu đen, navbar cũng màu đen */}
        <Link
          to="/"
          className="flex items-center gap-3 rounded-md"
          aria-label="PwC Internal Cup – Trang chủ"
        >
          <span className="flex h-10 items-center rounded-md bg-white px-2.5">
            <img
              src={pwcLogo}
              alt="PwC"
              className="h-7 w-auto object-contain"
            />
          </span>
          <span className="text-base font-extrabold tracking-tight text-pwc-amber sm:text-lg">
            Internal Cup
          </span>
        </Link>

        {/* Menu desktop */}
        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.end} className={linkClass}>
                {({ isActive }) => (
                  <>
                    {l.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-3 -bottom-[13px] h-[3px] bg-pwc-amber"
                        aria-hidden="true"
                      />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}

          {/* Nút đăng xuất: chỉ hiện khi đã đăng nhập */}
          {isAuthed && (
            <li>
              <button
                type="button"
                onClick={handleLogout}
                className="ml-2 rounded-md border border-white/30 px-3 py-1.5 text-xs font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                Đăng xuất
              </button>
            </li>
          )}
        </ul>

        {/* Nút mở menu mobile */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-white hover:bg-white/10 md:hidden"
          aria-label={open ? "Đóng menu" : "Mở menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <CloseIcon className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Menu mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-white/10 bg-pwc-black md:hidden"
          >
            <ul className="container-page flex flex-col py-3">
              {LINKS.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.end}
                    className={({ isActive }) =>
                      [
                        "block rounded-md px-3 py-3 text-base font-semibold",
                        isActive
                          ? "bg-white/10 text-pwc-amber"
                          : "text-white/85 hover:bg-white/5",
                      ].join(" ")
                    }
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}

              {/* Nút đăng xuất trên mobile */}
              {isAuthed && (
                <li className="mt-2 border-t border-white/10 pt-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full rounded-md px-3 py-3 text-left text-base font-semibold text-white/85 hover:bg-white/5"
                  >
                    Đăng xuất
                  </button>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}