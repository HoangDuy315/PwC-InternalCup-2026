import { memo, useMemo } from 'react';
import { getContrastText } from '../utils/color.js';
import { CheckIcon } from './Icons.jsx';

// Kích thước hệ tọa độ SVG
const SIZE = 400;
const C = SIZE / 2; // tâm
const R = 186; // bán kính phần ô màu

// Đổi góc (độ, tính từ đỉnh theo chiều kim đồng hồ) sang tọa độ
function polar(angleDeg, radius) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: C + radius * Math.sin(rad), y: C - radius * Math.cos(rad) };
}

// Path cho 1 ô hình quạt từ startAngle tới endAngle
function slicePath(startAngle, endAngle) {
  const start = polar(startAngle, R);
  const end = polar(endAngle, R);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${C} ${C} L ${start.x} ${start.y} A ${R} ${R} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
}

// Rút gọn tên quá dài để vừa ô
function truncate(name, max) {
  return name.length > max ? `${name.slice(0, max - 1)}…` : name;
}

/**
 * Vòng quay vẽ bằng SVG.
 * - teams: danh sách đội còn lại (thứ tự trùng với index dùng để tính góc)
 * - rotation: tổng góc quay hiện tại (độ). Ô thứ i có tâm tại (i + 0.5) * 360/n
 * - duration: thời gian quay (ms). Dùng CSS transform → chạy trên GPU, không lag.
 */
function Wheel({ teams, rotation, duration, isComplete }) {
  const n = teams.length;
  const segAngle = n > 0 ? 360 / n : 360;
  const fontSize = n <= 2 ? 20 : n <= 4 ? 17 : 15;
  const maxChars = n <= 2 ? 20 : n <= 4 ? 16 : 14;

  // Tính sẵn các ô để không phải tính lại mỗi lần render
  const slices = useMemo(
    () =>
      teams.map((team, i) => {
        const start = i * segAngle;
        const end = (i + 1) * segAngle;
        const mid = start + segAngle / 2;
        const labelPos = polar(mid, R * 0.6);
        // Xoay chữ theo bán kính; lật 180° ở nửa trái để chữ không bị ngược
        const textRotate = mid <= 180 ? mid - 90 : mid + 90;
        return {
          team,
          path: n > 1 ? slicePath(start, end) : null,
          labelPos,
          textRotate,
          textColor: getContrastText(team.color),
        };
      }),
    [teams, segAngle, n]
  );

  // Các chấm đèn trang trí quanh viền
  const studs = useMemo(() => Array.from({ length: 24 }, (_, i) => polar(i * 15, R + 7)), []);

  const ariaLabel =
    n > 0
      ? `Vòng quay gồm ${n} đội: ${teams.map((t) => t.name).join(', ')}`
      : 'Vòng quay đã hoàn tất, tất cả các đội đã được chia bảng';

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[460px]" role="img" aria-label={ariaLabel}>
      {/* Kim chỉ cố định phía trên */}
      <div className="pointer-events-none absolute left-1/2 top-[-6px] z-20 -translate-x-1/2 drop-shadow-lg">
        <svg width="44" height="54" viewBox="0 0 44 54" aria-hidden="true">
          <path d="M22 52 L4 10 A20 20 0 0 1 40 10 Z" fill="#D04A02" stroke="#FFFFFF" strokeWidth="3" />
          <circle cx="22" cy="16" r="6" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Phần xoay */}
      <div
        className="h-full w-full"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: `transform ${duration}ms cubic-bezier(0.12, 0.8, 0.12, 1)`,
          willChange: 'transform',
        }}
      >
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-full w-full" aria-hidden="true">
          {/* Viền ngoài */}
          <circle cx={C} cy={C} r={C - 1} fill="#2D2D2D" />
          <circle cx={C} cy={C} r={R + 1} fill="#000000" />

          {n === 0 && <circle cx={C} cy={C} r={R} fill="#F5F5F5" />}

          {/* Trường hợp chỉ còn 1 đội: vẽ cả hình tròn */}
          {n === 1 && <circle cx={C} cy={C} r={R} fill={slices[0].team.color} />}

          {slices.map((s) =>
            s.path ? (
              <path key={s.team.id} d={s.path} fill={s.team.color} stroke="#FFFFFF" strokeWidth="2" />
            ) : null
          )}

          {/* Nhãn tên đội */}
          {slices.map((s) =>
            n === 1 ? (
              <text
                key={`label-${s.team.id}`}
                x={C}
                y={C - R * 0.55}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={s.textColor}
                fontSize={22}
                fontWeight="800"
                fontFamily="Inter, Helvetica, Arial, sans-serif"
              >
                {truncate(s.team.name, 22)}
              </text>
            ) : (
              <text
                key={`label-${s.team.id}`}
                x={s.labelPos.x}
                y={s.labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={s.textColor}
                fontSize={fontSize}
                fontWeight="800"
                fontFamily="Inter, Helvetica, Arial, sans-serif"
                transform={`rotate(${s.textRotate} ${s.labelPos.x} ${s.labelPos.y})`}
              >
                {truncate(s.team.name, maxChars)}
              </text>
            )
          )}

          {/* Chấm đèn quanh viền */}
          {studs.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="3.2" fill={i % 2 === 0 ? '#EB8C00' : '#FFFFFF'} />
          ))}
        </svg>
      </div>

      {/* Trục giữa (không xoay) */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 flex h-[22%] w-[22%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-pwc-black bg-white shadow-xl">
        {isComplete ? (
          <CheckIcon className="h-1/2 w-1/2 text-pwc-orange" />
        ) : (
          <span className="text-center text-[10px] font-black leading-tight tracking-wide text-pwc-black sm:text-xs">
            PwC
            <br />
            <span className="text-pwc-orange">CUP</span>
          </span>
        )}
      </div>
    </div>
  );
}

// memo: chỉ render lại khi props thay đổi
export default memo(Wheel);