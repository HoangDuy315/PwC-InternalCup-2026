// Ô số có nút +/− cho admin (thẻ vàng, thẻ đỏ, penalty phân hạng)
const BADGE_STYLE = {
  y: "bg-yellow-300 text-black",
  r: "bg-red-600 text-white",
  p: "bg-pwc-light text-pwc-black ring-1 ring-black/15",
};

function CountCell({ value, type, canEdit, onMinus, onPlus, label }) {
  const badge = (
    <span
      className={
        "inline-flex h-5 min-w-5 items-center justify-center rounded-sm px-1 text-[11px] font-black " +
        BADGE_STYLE[type]
      }
    >
      {value}
    </span>
  );
  if (!canEdit) return <td className="px-2 py-2.5 text-center">{badge}</td>;
  return (
    <td className="px-1 py-2.5">
      <div className="flex items-center justify-center gap-1">
        <button
          type="button"
          onClick={onMinus}
          disabled={value <= 0}
          aria-label={"Bớt 1 " + label}
          className="h-6 w-6 rounded text-sm font-bold text-pwc-dark ring-1 ring-black/15 hover:bg-pwc-light disabled:opacity-30"
        >
          −
        </button>
        {badge}
        <button
          type="button"
          onClick={onPlus}
          aria-label={"Thêm 1 " + label}
          className="h-6 w-6 rounded bg-pwc-dark text-sm font-bold text-white hover:bg-pwc-black"
        >
          +
        </button>
      </div>
    </td>
  );
}

export default function StandingsTable({ group, rows, canEdit = false, onCardChange }) {
  const isA = group === "A";
  return (
    <section
      aria-labelledby={"standings-" + group}
      className="overflow-hidden rounded-xl border border-black/5 bg-white shadow-card"
    >
      <header className={"px-5 py-3 text-white " + (isA ? "bg-pwc-orange" : "bg-pwc-dark")}>
        <h3 id={"standings-" + group} className="text-lg font-extrabold">
          Bảng {group}
        </h3>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-pwc-light text-xs uppercase text-pwc-dark/70">
            <tr>
              <th scope="col" className="px-3 py-2 text-left">#</th>
              <th scope="col" className="px-3 py-2 text-left">Đội</th>
              <th scope="col" className="px-2 py-2 text-center" title="Số trận">Tr</th>
              <th scope="col" className="px-2 py-2 text-center" title="Thắng">T</th>
              <th scope="col" className="px-2 py-2 text-center" title="Hòa">H</th>
              <th scope="col" className="px-2 py-2 text-center" title="Bại">B</th>
              <th scope="col" className="px-2 py-2 text-center" title="Bàn thắng">BT</th>
              <th scope="col" className="px-2 py-2 text-center" title="Hiệu số">HS</th>
              <th scope="col" className="px-2 py-2 text-center" title="Thẻ vàng">TV</th>
              <th scope="col" className="px-2 py-2 text-center" title="Thẻ đỏ">TĐ</th>
              <th scope="col" className="px-2 py-2 text-center" title="Bàn thắng loạt penalty phân hạng (3 lượt)">PEN</th>
              <th scope="col" className="px-3 py-2 text-center" title="Điểm">Đ</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={12} className="px-3 py-4 text-center text-pwc-dark/60">
                  Chưa có đội – hãy bốc thăm trước.
                </td>
              </tr>
            )}
            {rows.map((r, i) => {
              const gd = r.gf - r.ga;
              return (
                <tr key={r.team.id} className={"border-t border-black/5 " + (i < 2 ? "bg-pwc-amber/10" : "")}>
                  <td className="px-3 py-2.5 font-bold">{i + 1}</td>
                  <td className="px-3 py-2.5">
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: r.team.color }}
                        aria-hidden="true"
                      />
                      <span className="whitespace-nowrap font-semibold text-pwc-black">{r.team.name}</span>
                      <span className="text-xs text-pwc-dark/50">{"(" + group + r.slot + ")"}</span>
                    </span>
                  </td>
                  <td className="px-2 py-2.5 text-center">{r.played}</td>
                  <td className="px-2 py-2.5 text-center">{r.w}</td>
                  <td className="px-2 py-2.5 text-center">{r.d}</td>
                  <td className="px-2 py-2.5 text-center">{r.l}</td>
                  <td className="px-2 py-2.5 text-center">{r.gf}</td>
                  <td className="px-2 py-2.5 text-center">{gd > 0 ? "+" + gd : gd}</td>
                  <CountCell
                    value={r.yellow}
                    type="y"
                    label={"thẻ vàng của " + r.team.name}
                    canEdit={canEdit}
                    onMinus={() => onCardChange(r.team.id, "y", -1)}
                    onPlus={() => onCardChange(r.team.id, "y", 1)}
                  />
                  <CountCell
                    value={r.red}
                    type="r"
                    label={"thẻ đỏ của " + r.team.name}
                    canEdit={canEdit}
                    onMinus={() => onCardChange(r.team.id, "r", -1)}
                    onPlus={() => onCardChange(r.team.id, "r", 1)}
                  />
                  <CountCell
                    value={r.pen}
                    type="p"
                    label={"bàn penalty phân hạng của " + r.team.name}
                    canEdit={canEdit}
                    onMinus={() => onCardChange(r.team.id, "p", -1)}
                    onPlus={() => onCardChange(r.team.id, "p", 1)}
                  />
                  <td className="px-3 py-2.5 text-center font-black text-pwc-black">{r.pts}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="border-t border-black/5 px-4 py-2 text-xs text-pwc-dark/60">
        Ô tô vàng: 2 đội vào bán kết. Xếp hạng: Điểm → Hiệu số → Đối đầu → Bàn thắng → Ít thẻ đỏ → Ít thẻ vàng →
        Penalty 3 lượt (cột PEN).
      </p>
    </section>
  );
}