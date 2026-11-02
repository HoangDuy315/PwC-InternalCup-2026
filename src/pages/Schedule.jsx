import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import { useDraw } from "../context/DrawContext.jsx";
import { useSharedState } from "../hooks/useSharedState.js";
// import { useLocalStorage } from "../hooks/useLocalStorage.js";
import {
  GROUP_STAGE,
  SEMI_FINALS,
  FINAL,
  ROUND_LABELS,
} from "../data/schedule.js";
import { computeStandings, getScore } from "../utils/standings.js";
import MatchCard from "../components/MatchCard.jsx";
import StandingsTable from "../components/StandingsTable.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import TeamAvatar from "../components/TeamAvatar.jsx";
import TopScorers from "../components/TopScorers.jsx";
import { ArrowRightIcon, ResetIcon, TrophyIcon } from "../components/Icons.jsx";
 
const SCORE_KEY = "pwc-internal-cup:scores:v1";
const rankLabel = (ref) => `${ref.rank === 1 ? "Nhất" : "Nhì"} ${ref.group}`;
 
export default function Schedule() {
  const { groupA, groupB, isComplete } = useDraw();
  const { isAuthed } = useAuth(); // chỉ admin mới sửa tỉ số
  const readOnly = !isAuthed; // người xem thường: chỉ xem
  const [scores, setScores] = useSharedState("scores", {});
  const [confirmOpen, setConfirmOpen] = useState(false);
 
  const groups = useMemo(() => ({ A: groupA, B: groupB }), [groupA, groupB]);
 
  // Đội thắng của 1 trận loại trực tiếp (tỉ số, hoặc luân lưu nếu hòa)
  const getWinner = (match) => {
    const s = getScore(match, scores);
    if (!s) return null;
    if (s.home > s.away) return match.homeTeam;
    if (s.home < s.away) return match.awayTeam;
    const pen = scores[match.id]?.pen;
    if (pen === "home") return match.homeTeam;
    if (pen === "away") return match.awayTeam;
    return null;
  };
 
  // Gắn đội thật vào các trận vòng bảng theo vị trí A1/A2/A3, B1/B2/B3
  const groupMatches = useMemo(
    () =>
      GROUP_STAGE.map((m) => ({
        ...m,
        homeTeam: groups[m.group][m.home - 1]?.team || null,
        awayTeam: groups[m.group][m.away - 1]?.team || null,
        homeLabel: `${m.group}${m.home}`,
        awayLabel: `${m.group}${m.away}`,
      })),
    [groups],
  );
 
  // Bảng xếp hạng + trạng thái đã đá xong từng bảng
  const standings = useMemo(() => {
    const result = {};
    ["A", "B"].forEach((g) => {
      const matches = groupMatches.filter((m) => m.group === g);
      const rows = computeStandings(groups[g], matches, scores);
      const done =
        groups[g].length === 3 && matches.every((m) => getScore(m, scores));
      result[g] = { rows, done };
    });
    return result;
  }, [groupMatches, groups, scores]);
 
  // Bán kết: chỉ điền đội khi bảng tương ứng đã đá xong
  const semiMatches = useMemo(() => {
    const resolve = (ref) =>
      standings[ref.group].done
        ? standings[ref.group].rows[ref.rank - 1]?.team || null
        : null;
    return SEMI_FINALS.map((m) => ({
      ...m,
      homeTeam: resolve(m.home),
      awayTeam: resolve(m.away),
      homeLabel: rankLabel(m.home),
      awayLabel: rankLabel(m.away),
    }));
  }, [standings]);
 
  // Chung kết: 2 đội thắng bán kết
  const semiById = Object.fromEntries(
    semiMatches.map((m, i) => [m.id, { match: m, no: i + 1 }]),
  );
  const finalMatch = {
    ...FINAL,
    homeTeam: semiById[FINAL.home]
      ? getWinner(semiById[FINAL.home].match)
      : null,
    awayTeam: semiById[FINAL.away]
      ? getWinner(semiById[FINAL.away].match)
      : null,
    homeLabel: `Thắng BK${semiById[FINAL.home]?.no ?? 1}`,
    awayLabel: `Thắng BK${semiById[FINAL.away]?.no ?? 2}`,
  };
  const champion = getWinner(finalMatch);
 
  // Tỉ số chỉ hiển thị nếu khớp đúng cặp đội hiện tại (bốc thăm lại → tỉ số cũ tự bị bỏ qua)
  const scoreOf = (match) => {
    const s = scores[match.id];
    const valid =
      s &&
      match.homeTeam &&
      match.awayTeam &&
      s.homeId === match.homeTeam.id &&
      s.awayId === match.awayTeam.id;
    return valid
      ? { home: s.home, away: s.away, pen: s.pen || null }
      : { home: "", away: "", pen: null };
  };
 
  // Lấy bản ghi tỉ số hợp lệ của trận (hoặc tạo mới nếu cặp đội đã đổi)
  const baseRecord = (prev, match) => {
    const cur = prev[match.id];
    const valid =
      cur &&
      cur.homeId === match.homeTeam.id &&
      cur.awayId === match.awayTeam.id;
    return valid
      ? cur
      : {
          homeId: match.homeTeam.id,
          awayId: match.awayTeam.id,
          home: "",
          away: "",
          pen: null,
        };
  };
 
  // Cập nhật tỉ số (chỉ admin)
  const updateScore = (match, side, value) => {
    if (!isAuthed || !match.homeTeam || !match.awayTeam) return;
    const clean =
      value === ""
        ? ""
        : String(Math.max(0, Math.min(99, parseInt(value, 10) || 0)));
    setScores((prev) => ({
      ...prev,
      [match.id]: { ...baseRecord(prev, match), [side]: clean },
    }));
  };
 
  // Chọn đội thắng luân lưu (chỉ admin, bấm lại lần nữa để bỏ chọn)
  const setPenWinner = (match, side) => {
    if (!isAuthed || !match.homeTeam || !match.awayTeam) return;
    setScores((prev) => {
      const base = baseRecord(prev, match);
      return {
        ...prev,
        [match.id]: { ...base, pen: base.pen === side ? null : side },
      };
    });
  };
 
  const rounds = [1, 2, 3];
 
  return (
    <div className="bg-pwc-light">
      {/* Tiêu đề trang */}
      <section className="bg-pwc-black text-white">
        <div className="container-page py-10 sm:py-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-pwc-amber">
            Lịch thi đấu
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Vòng bảng, Bán kết & Chung kết
          </h1>
          <p className="mt-3 max-w-2xl text-white/75">
            Mỗi bảng đá vòng tròn 3 trận. Nhất A gặp Nhì B, Nhất B gặp Nhì A ở
            bán kết. 2 đội thắng bán kết gặp nhau ở chung kết.
            {isAuthed
              ? " Nhập tỉ số để các vòng tự cập nhật."
              : " Tỉ số được Ban tổ chức cập nhật trực tiếp."}
          </p>
        </div>
      </section>
 
      <div className="container-page space-y-10 py-10">
        {/* Chưa bốc thăm xong */}
        {!isComplete && (
          <div className="flex flex-col items-start justify-between gap-4 rounded-xl border-l-4 border-pwc-amber bg-white p-5 shadow-card sm:flex-row sm:items-center">
            <p className="text-pwc-dark">
              Chưa bốc thăm xong – lịch đang hiển thị theo vị trí (A1, A2…). Tên
              đội sẽ tự điền sau khi bốc thăm.
            </p>
            <Link to="/draw" className="btn-primary shrink-0">
              Đến trang bốc thăm <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        )}
 
        {/* Vòng bảng */}
        <section aria-labelledby="group-stage-title">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Vòng bảng</p>
              <h2 id="group-stage-title" className="section-title">
                Lịch các lượt đấu
              </h2>
            </div>
            {/* Nút xóa tỉ số: chỉ admin thấy */}
            {isAuthed && (
              <button
                type="button"
                className="btn-outline py-2"
                onClick={() => setConfirmOpen(true)}
                aria-label="Xóa toàn bộ tỉ số"
              >
                <ResetIcon className="h-4 w-4" /> Xóa tỉ số
              </button>
            )}
          </div>
 
          <div className="mt-6 space-y-6">
            {rounds.map((r) => (
              <div key={r}>
                <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wider text-pwc-dark/70">
                  {ROUND_LABELS[r]}
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {groupMatches
                    .filter((m) => m.round === r)
                    .map((m) => (
                      <MatchCard
                        key={m.id}
                        match={m}
                        readOnly={readOnly}
                        tag={`Bảng ${m.group}`}
                        tagDark={m.group === "B"}
                        score={scoreOf(m)}
                        onChange={(side, v) => updateScore(m, side, v)}
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>
 
        {/* Bảng xếp hạng */}
        <section aria-labelledby="standings-title">
          <p className="eyebrow">Xếp hạng</p>
          <h2 id="standings-title" className="section-title">
            Bảng xếp hạng
          </h2>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <StandingsTable group="A" rows={standings.A.rows} />
            <StandingsTable group="B" rows={standings.B.rows} />
          </div>
        </section>
 
        {/* Bán kết */}
        <section aria-labelledby="semi-title">
          <p className="eyebrow">Knock-out</p>
          <h2 id="semi-title" className="section-title">
            Bán kết
          </h2>
          <p className="mt-2 text-sm text-pwc-dark/70">
            Đội sẽ được điền tự động khi bảng tương ứng đá xong cả 3 trận. Nếu
            hòa, đội thắng được xác định bằng luân lưu.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {semiMatches.map((m, i) => (
              <MatchCard
                key={m.id}
                match={m}
                readOnly={readOnly}
                tag={`Bán kết ${i + 1}`}
                tagDark
                knockout
                winnerId={getWinner(m)?.id}
                score={scoreOf(m)}
                onChange={(side, v) => updateScore(m, side, v)}
                onPenPick={(side) => setPenWinner(m, side)}
              />
            ))}
          </div>
        </section>
 
        {/* Chung kết */}
        <section aria-labelledby="final-title">
          <p className="eyebrow">Trận cuối</p>
          <h2 id="final-title" className="section-title">
            Chung kết
          </h2>
          <p className="mt-2 text-sm text-pwc-dark/70">
            2 đội thắng bán kết sẽ được điền tự động.
          </p>
          <div className="mx-auto mt-6 max-w-2xl">
            <MatchCard
              match={finalMatch}
              readOnly={readOnly}
              tag="Chung kết"
              knockout
              winnerId={champion?.id}
              score={scoreOf(finalMatch)}
              onChange={(side, v) => updateScore(finalMatch, side, v)}
              onPenPick={(side) => setPenWinner(finalMatch, side)}
            />
          </div>
 
          {/* Nhà vô địch */}
          {champion && (
            <motion.div
              key={champion.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className="mx-auto mt-6 flex max-w-2xl flex-col items-center gap-3 rounded-2xl bg-gradient-to-br from-pwc-black via-pwc-dark to-pwc-black px-6 py-8 text-center text-white shadow-2xl"
            >
              <TrophyIcon className="h-12 w-12 text-pwc-amber" />
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-pwc-amber">
                Nhà vô địch
              </p>
              <div className="flex items-center gap-3">
                <TeamAvatar team={champion} size="lg" />
                <p className="text-3xl font-black sm:text-4xl">
                  {champion.name}
                </p>
              </div>
            </motion.div>
          )}
        </section>
 
        {/* Vua phá lưới */}
        <TopScorers />
      </div>
 
      {/* Hộp xác nhận xóa tỉ số: chỉ admin dùng */}
      {isAuthed && (
        <ConfirmDialog
          open={confirmOpen}
          title="Xóa toàn bộ tỉ số?"
          message="Tất cả tỉ số vòng bảng, bán kết và chung kết sẽ bị xóa. Kết quả bốc thăm vẫn được giữ nguyên."
          confirmLabel="Xóa"
          onConfirm={() => {
            setScores({});
            setConfirmOpen(false);
          }}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </div>
  );
}