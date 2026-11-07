import TeamAvatar from "./TeamAvatar.jsx";

function Side({ team, label, align, isWinner }) {
  const isRight = align === "right";
  const nameClass = team
    ? isWinner
      ? "text-pwc-orangeDark"
      : "text-pwc-black"
    : "text-pwc-dark/50";
  return (
    <div
      className={
        "flex min-w-0 flex-1 items-center gap-2 " +
        (isRight ? "flex-row-reverse text-right" : "")
      }
    >
      {team ? (
        <TeamAvatar team={team} size="sm" />
      ) : (
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pwc-light text-xs font-bold text-pwc-dark/60 ring-1 ring-black/10">
          ?
        </span>
      )}
      <div className="min-w-0">
        <p className={"truncate font-bold " + nameClass}>
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
 * Card 1 trận đấu.
 * - readOnly: người xem thường, chỉ xem
 * - lockScore: khóa ô tỉ số (tỉ số tự tính từ danh sách ghi bàn)
 * - knockout: trận loại trực tiếp → hòa thì chọn đội thắng luân lưu
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
  lockScore = false,
}) {
  const disabled = readOnly || !match.homeTeam || !match.awayTeam;
  const inputDisabled = disabled || lockScore;
  const showOnly = readOnly || lockScore;

  const isDraw =
    score.home !== "" &&
    score.away !== "" &&
    Number(score.home) === Number(score.away);

  const inputClass =
    "h-11 w-12 rounded-md border border-black/15 bg-white text-center text-lg font-black text-pwc-black " +
    (showOnly
      ? "disabled:bg-pwc-light disabled:text-pwc-black disabled:opacity-100 "
      : "disabled:bg-pwc-light disabled:text-pwc-dark/40 ") +
    "[appearance:textfield] " +
    "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

  const penBtn = (side, team) => (
    <button
      type="button"
      onClick={() => onPenPick(side)}
      aria-pressed={score.pen === side}
      className={
        "truncate rounded-md px-3 py-1.5 text-xs font-bold transition-colors " +
        (score.pen === side
          ? "bg-pwc-orange text-white"
          : "bg-white text-pwc-dark ring-1 ring-black/15 hover:bg-pwc-light")
      }
    >
      {team.name}
    </button>
  );

  const homeName = match.homeTeam?.name || match.homeLabel;
  const awayName = match.awayTeam?.name || match.awayLabel;

  return (
    <article className="rounded-xl border border-black/5 bg-white p-4 shadow-card">
      <div className="mb-3 flex items-center justify-between text-xs font-semibold text-pwc-dark/70">
        <span
          className={
            "rounded px-2 py-0.5 font-bold text-white " +
            (tagDark ? "bg-pwc-dark" : "bg-pwc-orange")
          }
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
            disabled={inputDisabled}
            onChange={(e) => onChange && onChange("home", e.target.value)}
            aria-label={"Bàn thắng của " + homeName}
            className={inputClass}
          />
          <span className="font-black text-pwc-dark/40">–</span>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            max="99"
            value={score.away}
            disabled={inputDisabled}
            onChange={(e) => onChange && onChange("away", e.target.value)}
            aria-label={"Bàn thắng của " + awayName}
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

      {/* Người xem: chỉ hiện đội thắng luân lưu */}
      {knockout && readOnly && isDraw && score.pen && (
        <p className="mt-3 rounded-lg bg-pwc-amber/10 px-3 py-2 text-center text-xs font-semibold text-pwc-dark">
          Thắng luân lưu:{" "}
          <strong>
            {score.pen === "home" ? match.homeTeam?.name : match.awayTeam?.name}
          </strong>
        </p>
      )}

      {/* Admin: hòa → chọn đội thắng luân lưu */}
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