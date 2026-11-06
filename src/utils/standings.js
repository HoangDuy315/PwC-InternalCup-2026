// Lấy tỉ số hợp lệ của 1 trận (null nếu chưa nhập đủ hoặc tỉ số thuộc bốc thăm cũ)
export function getScore(match, scores) {
  const s = scores[match.id];
  if (!s || !match.homeTeam || !match.awayTeam) return null;
  if (s.homeId !== match.homeTeam.id || s.awayId !== match.awayTeam.id) return null;
  if (s.home === "" || s.away === "" || s.home == null || s.away == null) return null;
  return { home: Number(s.home), away: Number(s.away) };
}

// Điểm 1 trận: thắng 3, hòa 1, thua 0
const resultPoints = (gf, ga) => (gf > ga ? 3 : gf === ga ? 1 : 0);
const goalDiff = (r) => r.gf - r.ga;

/*
  Xếp hạng theo điều lệ:
  1. Điểm
  2. Hiệu số bàn thắng thua
  3. Đối đầu trực tiếp (điểm trong các trận giữa các đội đang bằng nhau)
  4. Số bàn thắng
  5. Ít thẻ đỏ hơn
  6. Ít thẻ vàng hơn
  7. Loạt penalty phân hạng 3 lượt (nhiều bàn hơn xếp trên)
  8. Thứ tự bốc thăm (dự phòng khi chưa nhập penalty)
*/
export function computeStandings(entries, matches, scores, cards = {}) {
  const allCards = cards || {};
  const table = {};
  entries.forEach((e, i) => {
    const c = allCards[e.team.id] || {};
    table[e.team.id] = {
      team: e.team,
      slot: i + 1,
      played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0,
      red: Number(c.r) || 0,
      yellow: Number(c.y) || 0,
      pen: Number(c.p) || 0,
      h2h: 0,
    };
  });

  // Tính kết quả các trận đã có tỉ số
  const results = [];
  matches.forEach((m) => {
    const s = getScore(m, scores);
    if (!s) return;
    const h = table[m.homeTeam.id];
    const a = table[m.awayTeam.id];
    if (!h || !a) return;
    results.push({ home: m.homeTeam.id, away: m.awayTeam.id, hs: s.home, as: s.away });
    h.played += 1;
    a.played += 1;
    h.gf += s.home;
    h.ga += s.away;
    a.gf += s.away;
    a.ga += s.home;
    h.pts += resultPoints(s.home, s.away);
    a.pts += resultPoints(s.away, s.home);
    if (s.home > s.away) { h.w += 1; a.l += 1; }
    else if (s.home < s.away) { a.w += 1; h.l += 1; }
    else { h.d += 1; a.d += 1; }
  });

  const rows = Object.values(table);

  // Đối đầu trực tiếp: chỉ tính trận giữa các đội cùng điểm và cùng hiệu số
  rows.forEach((r) => {
    const tied = rows.filter((o) => o.pts === r.pts && goalDiff(o) === goalDiff(r));
    if (tied.length < 2) return;
    const ids = new Set(tied.map((o) => o.team.id));
    results.forEach((g) => {
      if (!ids.has(g.home) || !ids.has(g.away)) return;
      if (g.home === r.team.id) r.h2h += resultPoints(g.hs, g.as);
      if (g.away === r.team.id) r.h2h += resultPoints(g.as, g.hs);
    });
  });

  return rows.sort(
    (x, y) =>
      y.pts - x.pts ||
      goalDiff(y) - goalDiff(x) ||
      y.h2h - x.h2h ||
      y.gf - x.gf ||
      x.red - y.red ||
      x.yellow - y.yellow ||
      y.pen - x.pen ||
      x.slot - y.slot
  );
}