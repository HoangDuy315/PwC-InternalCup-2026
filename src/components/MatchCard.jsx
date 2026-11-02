import TeamAvatar from "./TeamAvatar.jsx";

// 1 bên của trận đấu: đội thật (nếu đã có) hoặc nhãn chờ (A1, Nhất A...)
function Side({ team, label, align, isWinner }) {
  const isRight = align === "right";
  return (
    <div
      className={`flex min-w-0 flex-1 items-center gap-2 ${isRight ? "flex-row-reverse text-right" : ""}`}
    >
      {team ? (
        <TeamAvatar team={team} size="sm" />
      ) : (
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pwc-light text-xs font-bold text-pwc-dark/60 ring-1 ring-black/10">
          ?
        </span>
      )}
      <div className="min-w-0">
        <p
          className={`truncate font-bold ${
            team
              ? isWinner
                ? "text-pwc-orangeDark"
                : "text-pwc-black"
              : "text-pwc-dark/50"
          }`}
        >
          {team ? team.name : label}
        </p>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-pwc-dark/50">
          {label}
        </p>
      </div>
    </div>
  );
}

/**
 * Card 1 trận đấu với ô nhập tỉ số.
 * - knockout: trận loại trực tiếp → nếu hòa thì cho chọn đội thắng luân lưu
 * - winnerId: id đội thắng (để tô màu)
 * - onPenPick(side): chọn đội thắng luân lưu ('home' | 'away')
 */
export default function MatchCard({
  match,
  score,
  onChange,
  tag,
  tagDark,
  knockout,
  winnerId,
  onPenPick,
  readOnly = false,
}) {
  // readOnly: người xem thường chỉ xem tỉ số, không sửa được
  const disabled = readOnly || !match.homeTeam || !match.awayTeam;
  const isDraw =
    score.home !== "" &&
    score.away !== "" &&
    Number(score.home) === Number(score.away);
  const inputClass =
    "h-11 w-12 rounded-md border border-black/15 bg-white text-center text-lg font-black text-pwc-black " +
    (readOnly
      ? "disabled:bg-pwc-light disabled:text-pwc-black disabled:opacity-100 "
      : "disabled:bg-pwc-light disabled:text-pwc-dark/40 ") +
    "[appearance:textfield] " +
    "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

  const penBtn = (side, team) => (
    <button
      type="button"
      onClick={() => onPenPick(side)}
      aria-pressed={score.pen === side}
      className={`truncate rounded-md px-3 py-1.5 text-xs font-bold transition-colors ${
        score.pen === side
          ? "bg-pwc-orange text-white"
          : "bg-white text-pwc-dark ring-1 ring-black/15 hover:bg-pwc-light"
      }`}
    >
      {team.name}
    </button>
  );

  return (
    <article className="rounded-xl border border-black/5 bg-white p-4 shadow-card">
      <div className="mb-3 flex items-center justify-between text-xs font-semibold text-pwc-dark/70">
        <span
          className={`rounded px-2 py-0.5 font-bold text-white ${tagDark ? "bg-pwc-dark" : "bg-pwc-orange"}`}
        >
          {tag}
        </span>
        {match.time && <span>{match.time}</span>}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Side
          team={match.homeTeam}
          label={match.homeLabel}
          align="left"
          isWinner={Boolean(winnerId) && winnerId === match.homeTeam?.id}
        />

        <div className="flex shrink-0 items-center gap-1.5">
          <input
            type="number"
            inputMode="numeric"
            min="0"
            max="99"
            value={score.home}
            disabled={disabled}
            onChange={(e) => onChange("home", e.target.value)}
            aria-label={`Bàn thắng của ${match.homeTeam?.name || match.homeLabel}`}
            className={inputClass}
          />
          <span className="font-black text-pwc-dark/40">–</span>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            max="99"
            value={score.away}
            disabled={disabled}
            onChange={(e) => onChange("away", e.target.value)}
            aria-label={`Bàn thắng của ${match.awayTeam?.name || match.awayLabel}`}
            className={inputClass}
          />
        </div>

        <Side
          team={match.awayTeam}
          label={match.awayLabel}
          align="right"
          isWinner={Boolean(winnerId) && winnerId === match.awayTeam?.id}
        />
      </div>

      {/* Trận loại trực tiếp hòa → chọn đội thắng luân lưu */}
      {/* Người xem: chỉ hiện đội thắng luân lưu (nếu admin đã chọn) */}
      {knockout && readOnly && isDraw && score.pen && (
        <p className="mt-3 rounded-lg bg-pwc-amber/10 px-3 py-2 text-center text-xs font-semibold text-pwc-dark">
          Thắng luân lưu:{" "}
          <strong>
            {score.pen === "home" ? match.homeTeam?.name : match.awayTeam?.name}
          </strong>
        </p>
      )}

      {knockout && !disabled && isDraw && onPenPick && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 rounded-lg bg-pwc-amber/10 px-3 py-2">
          <span className="text-xs font-semibold text-pwc-dark">
            Hòa – đội thắng luân lưu:
          </span>
          {penBtn("home", match.homeTeam)}
          {penBtn("away", match.awayTeam)}
        </div>
      )}
    </article>
  );
}