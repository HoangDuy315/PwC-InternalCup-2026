import { useEffect, useReducer, useState } from 'react';

// Đọc an toàn từ localStorage (tránh lỗi khi JSON hỏng hoặc trình duyệt chặn storage)
export function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

// Ghi an toàn vào localStorage
export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Bỏ qua: chế độ ẩn danh hoặc hết dung lượng
  }
}

// Hook giống useState nhưng tự đồng bộ với localStorage
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readStorage(key, initialValue));

  useEffect(() => {
    writeStorage(key, value);
  }, [key, value]);

  return [value, setValue];
}

// Hook useReducer có lưu trữ: init(storedValue) trả về state ban đầu đã được kiểm tra hợp lệ
export function usePersistentReducer(reducer, key, init) {
  const [state, dispatch] = useReducer(reducer, undefined, () => init(readStorage(key, null)));

  useEffect(() => {
    writeStorage(key, state);
  }, [key, state]);

  return [state, dispatch];
}