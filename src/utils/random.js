// Sinh số nguyên ngẫu nhiên trong [0, max) bằng crypto.getRandomValues
// Dùng rejection sampling để phân phối đều tuyệt đối (không bị lệch modulo)
export function secureRandomInt(max) {
  if (!Number.isInteger(max) || max <= 0) {
    throw new Error('secureRandomInt: max phải là số nguyên dương');
  }
  const cryptoObj = typeof window !== 'undefined' ? window.crypto : undefined;
  if (cryptoObj && typeof cryptoObj.getRandomValues === 'function') {
    const RANGE = 0x100000000; // 2^32
    const limit = RANGE - (RANGE % max);
    const buf = new Uint32Array(1);
    do {
      cryptoObj.getRandomValues(buf);
    } while (buf[0] >= limit);
    return buf[0] % max;
  }
  // Fallback cho môi trường không có Web Crypto
  return Math.floor(Math.random() * max);
}