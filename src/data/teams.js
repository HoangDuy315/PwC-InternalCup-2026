// ===============================================================
// DANH SÁCH 6 ĐỘI – PwC ALL-STAR CUP 2026
// - id: mã duy nhất, KHÔNG trùng nhau (đổi id sẽ reset kết quả bốc thăm đã lưu)
// - name: tên đội hiển thị trên vòng quay và các trang
// - captain: đội trưởng
// - players: danh sách cầu thủ (members sẽ tự đếm theo danh sách này)
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
      "Bùi Ngọc Đức",
      "Huỳnh Nguyên Trí (mập)",
      "Lê Hoàng Nam",
      "Ngô Văn Vỹ",
      "Nguyễn Hoàng Anh",
      "Nguyễn Hùng Anh",
      "Nguyễn Ngọc Khánh",
      "Nguyễn Vương Hoàng Phúc",
      "Phạm Đăng Khoa",
      "Phạm Long Minh Thông",
      "Trần Quốc Tín",
      "Trương Quang Tùng",
      "Tô Huỳnh Minh Khôi",
      "Vũ Thế Lê Anh",
      "Nguyễn Anh Hào",
    ],
  },
  {
    id: "team-2",
    name: "Team RAS",
    captain: "Phó Đức Giang",
    color: "#2D2D2D",
    logo: null,
    players: [
      "Phó Đức Giang",
      "Châu Trần Bảo Minh",
      "Hoàng",
      "Thạch",
      "Toàn",
      "Sơn mập",
      "Lợi",
      "Nam Assensio",
      "Huy Bảo",
      "Tấn",
    ],
  },
  {
    id: "team-3",
    name: "Prime",
    captain: "Nguyễn Hoài Bảo Anh",
    color: "#EB8C00",
    logo: null,
    players: [
      "Nguyễn Hoài Bảo Anh",
      "Mai Trần Bảo Anh",
      "Hoàng Đình Chương",
      "Đặng Cao Trình",
      "Võ Văn Hữu Nghĩa",
      "Nguyễn Hồ Anh Hưng",
      "Dương Nguyễn Bảo Hiếu",
      "Nguyễn Trần Minh Duy",
    ],
  },
  {
    id: "team-4",
    name: "Last Dance",
    captain: "Lò Trung Chính",
    color: "#000000",
    logo: null,
    players: [
      "Lò Trung Chính",
      "Nguyễn Văn Quyết",
      "Nguyễn Trọng Nghĩa",
      "Trần Lê Quang Phú",
      "Lê Mậu Phú",
      "Nguyễn Hoàng Duy",
      "Dương Công Quyết",
      "Hoàng Nhật Đức",
      "Trần Anh Tài",
      "Nguyễn Hải Long",
      "Dương Trọng Anh",
      "Phạm Vũ Long",
    ],
  },
  {
    id: "team-5",
    name: "TLS",
    captain: "Đào Ngọc Thắng",
    color: "#E0301E",
    logo: null,
    players: [
      "Đào Duy Long",
      "Đào Ngọc Thắng",
      "Liên Đệ Trung",
      "Lâm Quốc Việt",
      "Nguyễn Trọng Nghĩa",
      "Nguyễn Văn Hoàng",
      "Phạm Trung Tiến",
      "Phạm Vũ Việt Dũng",
      "Trương Gia Phúc",
      "Dương Hoàng Nam",
      "Nguyễn Võ Trí Dũng",
    ],
  },
  {
    id: "team-6",
    name: "Ex PwC",
    captain: "Nguyễn Anh Đức",
    color: "#FFB600",
    logo: null,
    players: [
      "Nguyễn Anh Đức",
      "Nguyễn Minh Phúc",
      "Nguyễn Trọng Anh",
      "Nguyễn Phúc Yên",
      "Phạm Minh Khánh",
      "Thanh Tú",
      "Cường Tesu",
      "Hạ Dương Lê",
    ],
  },
];

// Tự tính số thành viên từ danh sách cầu thủ
export const TEAMS = RAW_TEAMS.map((t) => ({
  ...t,
  members: t.players.length,
}));

// Chữ ký bộ đội: nếu danh sách id thay đổi, dữ liệu cũ trong localStorage sẽ tự bị bỏ qua
export const TEAMS_SIGNATURE = TEAMS.map((t) => t.id).join("|");

// Tra cứu nhanh đội theo id
export const TEAM_BY_ID = Object.fromEntries(TEAMS.map((t) => [t.id, t]));