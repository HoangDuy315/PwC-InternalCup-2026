// ===============================================================
// DANH SÁCH 6 ĐỘI – PwC ALL-STAR CUP 2026
// - id: mã duy nhất, KHÔNG trùng nhau (đổi id sẽ reset kết quả bốc thăm đã lưu)
// - name: tên đội hiển thị trên vòng quay và các trang
// - captain: đội trưởng
// - players: danh sách cầu thủ { name, number } (members sẽ tự đếm)
//   number: số áo, để null nếu chưa có
// - color: màu ô trên vòng quay
// - logo: đường dẫn ảnh (đặt file trong /public/logos/...), để null nếu chưa có
// ===============================================================
const RAW_TEAMS = [
  {
    id: "team-1",
    name: "Báo",
    captain: "Dennis Gin",
    color: "#D04A02",
    logo: null,
    players: [
      { name: "Bùi Ngọc Đức", number: 14 },
      { name: "Dennis Gin", number: 10 },
      { name: "Lê Hoàng Nam", number: 8 },
      { name: "Ngô Văn Vỹ", number: 43 },
      { name: "Nguyễn Hoàng Anh", number: 5 },
      { name: "Nguyễn Hùng Anh", number: 11 },
      { name: "Nguyễn Ngọc Khánh", number: 74 },
      { name: "Nguyễn Vương Hoàng Phúc", number: 13 },
      { name: "Phạm Đăng Khoa", number: 22 },
      { name: "Phạm Long Minh Thông", number: 85 },
      { name: "Trần Quốc Tín", number: 6 },
      { name: "Trương Quang Tùng", number: 7 },
      { name: "Tô Huỳnh Minh Khôi", number: 20 },
      { name: "Vũ Thế Lê Anh", number: 1 },
      { name: "Nguyễn Anh Hào", number: 2 },
    ],
  },
  {
    id: "team-2",
    name: "RAS",
    captain: "Phó Đức Giang",
    color: "#2D2D2D",
    logo: null,
    players: [
      { name: "Phó Đức Giang", number: 18 },
      { name: "Châu Trần Bảo Minh", number: 86 },
      { name: "Hoàng", number: 4 },
      { name: "Thạch", number: 7 },
      { name: "Toàn", number: 15 },
      { name: "Sơn mập", number: 75 },
      { name: "Lợi", number: 16 },
      { name: "Nam Assensio", number: 23 },
      { name: "Huy Bảo", number: 19 },
      { name: "Tấn", number: 99 },
    ],
  },
  {
    id: "team-3",
    name: "Prime",
    captain: "Nguyễn Hoài Bảo Anh",
    color: "#EB8C00",
    logo: null,
    players: [
      { name: "Nguyễn Hoài Bảo Anh", number: 12 },
      { name: "Mai Trần Bảo Anh", number: 10 },
      { name: "Nguyễn Vũ Anh Tuấn", number: 7 },
      { name: "Hoàng Đình Chương", number: 8 },
      { name: "Đặng Cao Trình", number: 23 },
      { name: "Võ Văn Hữu Nghĩa", number: 1 },
      { name: "Nguyễn Hồ Anh Hưng", number: 21 },
      { name: "Dương Nguyễn Bảo Hiếu", number: 28 },
      { name: "Nguyễn Trần Minh Duy", number: 6 },
      { name: "Lê Hưng Thiện Trí", number: 15 },
    ],
  },
  {
    id: "team-4",
    name: "Last Dance",
    captain: "Lò Trung Chính",
    color: "#000000",
    logo: null,
    players: [
      { name: "Lò Trung Chính", number: 18 },
      { name: "Nguyễn Văn Quyết", number: 45 },
      { name: "Nguyễn Trọng Nghĩa", number: 17 },
      { name: "Trần Lê Quang Phú", number: 10 },
      { name: "Lê Mậu Phú", number: 25 },
      { name: "Nguyễn Hoàng Duy", number: 7 },
      { name: "Dương Công Quyết", number: 1 },
      { name: "Hoàng Nhật Đức", number: 16 },
      { name: "Trần Anh Tài", number: 14 },
      { name: "Nguyễn Hải Long", number: 23 },
      { name: "Do Binh Kiet", number: 8 },
    ],
  },
  {
    id: "team-5",
    name: "TLS",
    captain: "Đào Ngọc Thắng",
    color: "#E0301E",
    logo: null,
    players: [
      { name: "Đào Duy Long", number: 6 },
      { name: "Đào Ngọc Thắng", number: 5 },
      { name: "Liên Đệ Trung", number: 29 },
      { name: "Lâm Quốc Việt", number: 10 },
      { name: "Nguyễn Trọng Nghĩa", number: 66 },
      { name: "Nguyễn Văn Hoàng", number: 35 },
      { name: "Phạm Trung Tiến", number: 22 },
      { name: "Phạm Vũ Việt Dũng", number: 21 },
      { name: "Trương Gia Phúc", number: 15 },
      { name: "Dương Hoàng Nam", number: 11 },
      { name: "Nguyễn Võ Trí Dũng", number: 9 },
    ],
  },
  {
    id: "team-6",
    name: "Ex PwC",
    captain: "Nguyễn Anh Đức",
    color: "#FFB600",
    logo: null,
    players: [
      { name: "Nguyễn Anh Đức", number: 29 },
      { name: "Nguyễn Minh Phúc", number: null },
      { name: "Nguyễn Trọng Anh", number: null },
      { name: "Nguyễn Phúc Yên", number: null },
      { name: "Phạm Minh Khánh", number: null },
      { name: "Cường Tesu", number: null },
      { name: "Lê Hà Dương", number: null },
      { name: "Phạm Vũ Long", number: null },
      { name: "Võ Xuân Thời", number: null },
    ],
  },
];

// Chuẩn hóa cầu thủ: chấp nhận cả "Tên" hoặc { name, number }
const toPlayer = (p) =>
  typeof p === "string"
    ? { name: p, number: null }
    : { name: p.name, number: p.number ?? null };

// Tự tính số thành viên + chuẩn hóa danh sách cầu thủ
export const TEAMS = RAW_TEAMS.map((t) => {
  const players = t.players.map(toPlayer);
  return { ...t, players, members: players.length };
});

// Chữ ký bộ đội: nếu danh sách id thay đổi, dữ liệu cũ sẽ tự bị bỏ qua
export const TEAMS_SIGNATURE = TEAMS.map((t) => t.id).join("|");

// Tra cứu nhanh đội theo id
export const TEAM_BY_ID = Object.fromEntries(TEAMS.map((t) => [t.id, t]));

// Lấy số áo theo đội + tên cầu thủ (null nếu chưa có)
export const getJerseyNumber = (teamId, name) =>
  TEAM_BY_ID[teamId]?.players.find((p) => p.name === name)?.number ?? null;