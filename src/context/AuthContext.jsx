import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// Tài khoản admin (chỉ kiểm tra phía trình duyệt)
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'lastdancevodich';

const AUTH_KEY = 'pwc-internal-cup:auth';
const ACTIVITY_KEY = 'pwc-internal-cup:last-activity';
const IDLE_TIMEOUT = 15 * 60 * 1000; // 15 phút không thao tác → đăng xuất
const CHECK_INTERVAL = 5 * 1000; // kiểm tra mỗi 5 giây
const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'wheel', 'touchstart'];

// Helpers đọc/ghi sessionStorage an toàn
const store = {
  get: (k) => {
    try {
      return window.sessionStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k, v) => {
    try {
      window.sessionStorage.setItem(k, v);
    } catch {
      // Bỏ qua nếu trình duyệt chặn storage
    }
  },
  remove: (k) => {
    try {
      window.sessionStorage.removeItem(k);
    } catch {
      // Bỏ qua
    }
  },
};

const getLastActivity = () => Number(store.get(ACTIVITY_KEY)) || 0;
const isExpired = () => Date.now() - getLastActivity() > IDLE_TIMEOUT;

// Khi load trang (kể cả F5): chỉ còn đăng nhập nếu chưa quá 5 phút
function readAuth() {
  if (store.get(AUTH_KEY) !== '1') return false;
  if (isExpired()) {
    store.remove(AUTH_KEY);
    store.remove(ACTIVITY_KEY);
    return false;
  }
  return true;
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthed, setIsAuthed] = useState(readAuth);
  const [sessionExpired, setSessionExpired] = useState(false);

  // Đăng nhập: trả về true nếu đúng tài khoản
  const login = useCallback((username, password) => {
    const ok = username.trim() === ADMIN_USER && password === ADMIN_PASS;
    if (ok) {
      store.set(AUTH_KEY, '1');
      store.set(ACTIVITY_KEY, String(Date.now()));
      setSessionExpired(false);
      setIsAuthed(true);
    }
    return ok;
  }, []);

  // Đăng xuất: expired = true khi do hết thời gian chờ
  const logout = useCallback((expired = false) => {
    store.remove(AUTH_KEY);
    store.remove(ACTIVITY_KEY);
    setSessionExpired(expired === true);
    setIsAuthed(false);
  }, []);

  // Theo dõi thao tác người dùng + tự đăng xuất khi idle quá 5 phút
  useEffect(() => {
    if (!isAuthed) return undefined;

    let lastWrite = 0;
    // Ghi thời điểm thao tác gần nhất (giới hạn 1 lần/giây để không lag)
    const onActivity = () => {
      const now = Date.now();
      if (now - lastWrite < 1000) return;
      lastWrite = now;
      store.set(ACTIVITY_KEY, String(now));
    };

    // Kiểm tra định kỳ
    const check = () => {
      if (isExpired()) logout(true);
    };

    // Quay lại tab sau thời gian dài → kiểm tra ngay
    const onVisible = () => {
      if (document.visibilityState === 'visible') check();
    };

    ACTIVITY_EVENTS.forEach((ev) => window.addEventListener(ev, onActivity, { passive: true }));
    document.addEventListener('visibilitychange', onVisible);
    const interval = window.setInterval(check, CHECK_INTERVAL);

    return () => {
      ACTIVITY_EVENTS.forEach((ev) => window.removeEventListener(ev, onActivity));
      document.removeEventListener('visibilitychange', onVisible);
      window.clearInterval(interval);
    };
  }, [isAuthed, logout]);

  const value = useMemo(
    () => ({ isAuthed, sessionExpired, login, logout }),
    [isAuthed, sessionExpired, login, logout]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải được dùng bên trong <AuthProvider>');
  return ctx;
}