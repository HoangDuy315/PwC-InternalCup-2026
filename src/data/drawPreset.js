// Tổ hợp xếp sẵn, chỉ áp dụng sau khi bấm icon reset
// Thứ tự trong mảng = thứ tự vị trí trong bảng (A1, A2, A3)
export const PRESET_GROUPS = {
  A: ["team-5", "team-4", "team-3"], // A1: TLS, A2: Last Dance, A3: Prime
  B: ["team-1", "team-2", "team-6"], // Team Báo, Team RAS, Ex PwC
};
 
// true: ra đúng thứ tự trong mảng; false: random trong bảng
export const PRESET_FIXED_ORDER = {
  A: true,
  B: false,
};
 
// Đội luôn ở vị trí số 1 của bảng (các đội còn lại random)
export const PRESET_FIRST = {
  B: "team-1", // B1: Team Báo
};