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
    name: "Team Báo",
    captain: "Huỳnh Nguyên Trí (mập)",
    color: "#D04A02",
    logo: null,
    players: [
      { name: "Bùi Ngọc Đức", number: null },
      { name: "Huỳnh Nguyên Trí (mập)", number: null },
      { name: "Lê Hoàng Nam", number: null },
      { name: "Ngô Văn Vỹ", number: null },
      { name: "Nguyễn Hoàng Anh", number: null },
      { name: "Nguyễn Hùng Anh", number: null },
      { name: "Nguyễn Ngọc Khánh", number: null },
      { name: "Nguyễn Vương Hoàng Phúc", number: null },
      { name: "Phạm Đăng Khoa", number: null },
      { name: "Phạm Long Minh Thông", number: null },
      { name: "Trần Quốc Tín", number: null },
      { name: "Trương Quang Tùng", number: null },
      { name: "Tô Huỳnh Minh Khôi", number: null },
      { name: "Vũ Thế Lê Anh", number: null },
      { name: "Nguyễn Anh Hào", number: null },
    ],
  },
  {
    id: "team-2",
    name: "Team RAS",
    captain: "Phó Đức Giang",
    color: "#2D2D2D",
    logo: null,
    players: [
      { name: "Phó Đức Giang", number: null },
      { name: "Châu Trần Bảo Minh", number: null },
      { name: "Hoàng", number: null },
      { name: "Thạch", number: null },
      { name: "Toàn", number: null },
      { name: "Sơn mập", number: null },
      { name: "Lợi", number: null },
      { name: "Nam Assensio", number: null },
      { name: "Huy Bảo", number: null },
      { name: "Tấn", number: null },
    ],
  },
  {
    id: "team-3",
    name: "Prime",
    captain: "Nguyễn Hoài Bảo Anh",
    color: "#EB8C00",
    logo: null,
    players: [
      { name: "Nguyễn Hoài Bảo Anh", number: null },
      { name: "Mai Trần Bảo Anh", number: null },
      { name: "Hoàng Đình Chương", number: null },
      { name: "Đặng Cao Trình", number: null },
      { name: "Võ Văn Hữu Nghĩa", number: null },
      { name: "Nguyễn Hồ Anh Hùng", number: null },
      { name: "Dương Nguyễn Bảo Hiếu", number: null },
      { name: "Nguyễn Trần Minh Duy", number: null },
    ],
  },
  {
    id: "team-4",
    name: "Last Dance",
    captain: "Lò Trung Chính",
    color: "#000000",
    logo: null,
    players: [
      { name: "Lò Trung Chính", number: null },
      { name: "Nguyễn Văn Quyết", number: 45 },
      { name: "Nguyễn Trọng Nghĩa", number: 17 },
      { name: "Trần Lê Quang Phú", number: 10 },
      { name: "Lê Mậu Phú", number: 25 },
      { name: "Nguyễn Hoàng Duy", number: 7 },
      { name: "Dương Công Quyết", number: 1 },
      { name: "Hoàng Nhật Đức", number: 16 },
      { name: "Trần Anh Tài", number: 14 },
      { name: "Nguyễn Hải Long", number: 23 },
      { name: "Dương Trọng Anh", number: 8 },
      { name: "Phạm Vũ Long", number: null },
    ],
  },
  {
    id: "team-5",
    name: "TLS",
    captain: "Đào Ngọc Thắng",
    color: "#E0301E",
    logo: null,
    players: [
      { name: "Đào Duy Long", number: null },
      { name: "Đào Ngọc Thắng", number: null },
      { name: "Liên Đệ Trung", number: null },
      { name: "Lâm Quốc Việt", number: null },
      { name: "Nguyễn Trọng Nghĩa", number: null },
      { name: "Nguyễn Văn Hoàng", number: null },
      { name: "Phạm Trung Tiến", number: null },
      { name: "Phạm Vũ Việt Dũng", number: null },
      { name: "Trương Gia Phúc", number: null },
      { name: "Dương Hoàng Nam", number: null },
      { name: "Nguyễn Võ Trí Dũng", number: null },
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
      { name: "Thanh Tú", number: null },
      { name: "Cường Tesu", number: null },
      { name: "Hạ Dương Lê", number: null },
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