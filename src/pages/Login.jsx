import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { isAuthed, login, sessionExpired } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/draw";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  // Đã đăng nhập thì vào thẳng trang đích
  if (isAuthed) return <Navigate to={redirectTo} replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
      return;
    }
    if (login(username, password)) {
      navigate(redirectTo, { replace: true });
    } else {
      setError("Tên đăng nhập hoặc mật khẩu không đúng.");
      setPassword("");
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-pwc-light px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-card"
      >
        <div className="bg-pwc-black px-6 py-6 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-pwc-amber">
            Admin
          </p>
          <h1 className="mt-1 text-2xl font-black">Đăng nhập</h1>
          <p className="mt-1 text-sm text-white/70">
            Cần đăng nhập để vào trang bốc thăm.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6" noValidate>
          {/* Thông báo khi bị tự đăng xuất do không thao tác */}
          {sessionExpired && !error && (
            <p
              role="status"
              className="rounded-md bg-pwc-amber/15 px-3 py-2 text-sm font-medium text-pwc-dark"
            >
              Phiên đăng nhập đã hết hạn do không thao tác trong 15 phút. Vui
              lòng đăng nhập lại.
            </p>
          )}

          {/* Tên đăng nhập */}
          <div>
            <label
              htmlFor="username"
              className="text-sm font-semibold text-pwc-dark"
            >
              Tên đăng nhập
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              className="mt-1 w-full rounded-md border border-black/15 px-3 py-2.5 text-pwc-black focus:border-pwc-orange"
            />
          </div>

          {/* Mật khẩu */}
          <div>
            <label
              htmlFor="password"
              className="text-sm font-semibold text-pwc-dark"
            >
              Mật khẩu
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                type={showPass ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="w-full rounded-md border border-black/15 px-3 py-2.5 pr-16 text-pwc-black focus:border-pwc-orange"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                className="absolute inset-y-0 right-0 px-3 text-xs font-bold text-pwc-orangeDark"
              >
                {showPass ? "Ẩn" : "Hiện"}
              </button>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
            >
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary w-full py-3 text-base">
            Đăng nhập
          </button>
        </form>
      </motion.div>
    </section>
  );
}