import TeamAvatar from "./TeamAvatar.jsx";

// 1 bên của trận đấu: đội thật (nếu đã có) hoặc nhãn chờ (A1, Nhất A...)
function Side({ team, label, align }) {
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
          className={`truncate font-bold ${team ? "text-pwc-black" : "text-pwc-dark/50"}`}
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

// Card 1 trận đấu với ô nhập tỉ số
export default function MatchCard({ match, score, onChange, tag, tagDark }) {
  const disabled = !match.homeTeam || !match.awayTeam;
  const inputClass =
    "h-11 w-12 rounded-md border border-black/15 bg-white text-center text-lg font-black text-pwc-black " +
    "disabled:bg-pwc-light disabled:text-pwc-dark/40 [appearance:textfield] " +
    "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

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
        <Side team={match.homeTeam} label={match.homeLabel} align="left" />

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

        <Side team={match.awayTeam} label={match.awayLabel} align="right" />
      </div>
    </article>
  );
}