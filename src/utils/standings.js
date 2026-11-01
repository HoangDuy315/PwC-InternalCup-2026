// Lấy tỉ số hợp lệ của 1 trận (null nếu chưa nhập đủ hoặc tỉ số thuộc bốc thăm cũ)
export function getScore(match, scores) {
  const s = scores[match.id];
  if (!s || !match.homeTeam || !match.awayTeam) return null;
  if (s.homeId !== match.homeTeam.id || s.awayId !== match.awayTeam.id)
    return null;
  if (s.home === "" || s.away === "" || s.home == null || s.away == null)
    return null;
  return { home: Number(s.home), away: Number(s.away) };
}

// Tính bảng xếp hạng: Thắng 3đ, Hòa 1đ. Xếp theo Điểm → Hiệu số → Bàn thắng → Vị trí bốc thăm
export function computeStandings(entries, matches, scores) {
  const table = {};
  entries.forEach((e, i) => {
    table[e.team.id] = {
      team: e.team,
      slot: i + 1,
      played: 0,
      w: 0,
      d: 0,
      l: 0,
      gf: 0,
      ga: 0,
      pts: 0,
    };
  });

  matches.forEach((m) => {
    const s = getScore(m, scores);
    if (!s) return;
    const h = table[m.homeTeam.id];
    const a = table[m.awayTeam.id];
    if (!h || !a) return;
    h.played += 1;
    a.played += 1;
    h.gf += s.home;
    h.ga += s.away;
    a.gf += s.away;
    a.ga += s.home;
    if (s.home > s.away) {
      h.w += 1;
      h.pts += 3;
      a.l += 1;
    } else if (s.home < s.away) {
      a.w += 1;
      a.pts += 3;
      h.l += 1;
    } else {
      h.d += 1;
      a.d += 1;
      h.pts += 1;
      a.pts += 1;
    }
  });

  return Object.values(table).sort(
    (x, y) =>
      y.pts - x.pts ||
      y.gf - y.ga - (x.gf - x.ga) ||
      y.gf - x.gf ||
      x.slot - y.slot,
  );
}