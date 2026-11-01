// ===============================================================
// LỊCH THI ĐẤU – chỉnh giờ đá tại đây
// home/away: vị trí trong bảng (1 = A1/B1, 2 = A2/B2, 3 = A3/B3)
// Giờ đá dưới đây chỉ là ví dụ (2 trận cùng giờ = đá song song 2 sân)
// ===============================================================
export const GROUP_STAGE = [
  { id: 'M1', round: 1, group: 'A', home: 1, away: 2, time: '13:00' },
  { id: 'M2', round: 1, group: 'B', home: 1, away: 2, time: '13:00' },
  { id: 'M3', round: 2, group: 'A', home: 1, away: 3, time: '13:40' },
  { id: 'M4', round: 2, group: 'B', home: 1, away: 3, time: '13:40' },
  { id: 'M5', round: 3, group: 'A', home: 2, away: 3, time: '14:20' },
  { id: 'M6', round: 3, group: 'B', home: 2, away: 3, time: '14:20' },
];

// Bán kết: Nhất A – Nhì B, Nhất B – Nhì A
export const SEMI_FINALS = [
  { id: 'SF1', home: { group: 'A', rank: 1 }, away: { group: 'B', rank: 2 }, time: '15:30' },
  { id: 'SF2', home: { group: 'B', rank: 1 }, away: { group: 'A', rank: 2 }, time: '15:30' },
];

export const ROUND_LABELS = { 1: 'Lượt 1', 2: 'Lượt 2', 3: 'Lượt 3' };