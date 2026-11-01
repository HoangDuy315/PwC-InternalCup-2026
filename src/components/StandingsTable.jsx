// Bảng xếp hạng 1 bảng đấu; top 2 được tô nổi (vào bán kết)
export default function StandingsTable({ group, rows }) {
  const isA = group === "A";
  return (
    <section
      aria-labelledby={`standings-${group}`}
      className="overflow-hidden rounded-xl border border-black/5 bg-white shadow-card"
    >
      <header
        className={`px-5 py-3 text-white ${isA ? "bg-pwc-orange" : "bg-pwc-dark"}`}
      >
        <h3 id={`standings-${group}`} className="text-lg font-extrabold">
          Bảng {group}
        </h3>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-pwc-light text-xs uppercase text-pwc-dark/70">
            <tr>
              <th scope="col" className="px-3 py-2 text-left">
                #
              </th>
              <th scope="col" className="px-3 py-2 text-left">
                Đội
              </th>
              <th scope="col" className="px-2 py-2 text-center" title="Số trận">
                Tr
              </th>
              <th scope="col" className="px-2 py-2 text-center" title="Thắng">
                T
              </th>
              <th scope="col" className="px-2 py-2 text-center" title="Hòa">
                H
              </th>
              <th scope="col" className="px-2 py-2 text-center" title="Bại">
                B
              </th>
              <th scope="col" className="px-2 py-2 text-center" title="Hiệu số">
                HS
              </th>
              <th scope="col" className="px-3 py-2 text-center" title="Điểm">
                Đ
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-3 py-4 text-center text-pwc-dark/60"
                >
                  Chưa có đội – hãy bốc thăm trước.
                </td>
              </tr>
            )}
            {rows.map((r, i) => {
              const gd = r.gf - r.ga;
              return (
                <tr
                  key={r.team.id}
                  className={`border-t border-black/5 ${i < 2 ? "bg-pwc-amber/10" : ""}`}
                >
                  <td className="px-3 py-2.5 font-bold">{i + 1}</td>
                  <td className="px-3 py-2.5">
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: r.team.color }}
                        aria-hidden="true"
                      />
                      <span className="font-semibold text-pwc-black">
                        {r.team.name}
                      </span>
                      <span className="text-xs text-pwc-dark/50">
                        ({group}
                        {r.slot})
                      </span>
                    </span>
                  </td>
                  <td className="px-2 py-2.5 text-center">{r.played}</td>
                  <td className="px-2 py-2.5 text-center">{r.w}</td>
                  <td className="px-2 py-2.5 text-center">{r.d}</td>
                  <td className="px-2 py-2.5 text-center">{r.l}</td>
                  <td className="px-2 py-2.5 text-center">
                    {gd > 0 ? `+${gd}`: gd}
                  </td>
                  <td className="px-3 py-2.5 text-center font-black text-pwc-black">
                    {r.pts}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="border-t border-black/5 px-4 py-2 text-xs text-pwc-dark/60">
        Ô tô vàng: 2 đội vào bán kết
      </p>
    </section>
  );
}