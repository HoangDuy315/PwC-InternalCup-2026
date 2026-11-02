import { useCallback, useEffect, useRef, useState } from "react";
import { onValue, ref, set } from "firebase/database";
import { db } from "../firebase.js";

// Giống useState nhưng lưu trên Firebase: mọi máy thấy cùng dữ liệu theo thời gian thực
export function useSharedState(path, initial) {
  const [value, setValue] = useState(initial);
  const valueRef = useRef(initial);
  const initialRef = useRef(initial);

  // Lắng nghe thay đổi từ server
  useEffect(
    () =>
      onValue(ref(db, path), (snap) => {
        const v = snap.exists() ? snap.val() : initialRef.current;
        valueRef.current = v;
        setValue(v);
      }),
    [path],
  );

  // Ghi lên server (hỗ trợ cả dạng setX(prev => ...))
  const update = useCallback(
    (next) => {
      const v = typeof next === "function" ? next(valueRef.current) : next;
      valueRef.current = v;
      setValue(v);
      set(ref(db, path), v);
    },
    [path],
  );

  return [value, update];
}