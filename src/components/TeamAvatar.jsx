import { getContrastText, getInitials } from '../utils/color.js';

// Avatar đội: dùng logo nếu có, không thì hiển thị chữ cái đầu trên nền màu đội
export default function TeamAvatar({ team, size = 'md' }) {
  const sizes = {
    sm: 'h-9 w-9 text-xs',
    md: 'h-12 w-12 text-sm',
    lg: 'h-16 w-16 text-lg',
  };
  if (team.logo) {
    return (
      <img
        src={team.logo}
        alt={`Logo ${team.name}`}
        className={`${sizes[size]} shrink-0 rounded-full bg-white object-cover ring-2 ring-white`}
      />
    );
  }
  return (
    <span
      className={`${sizes[size]} inline-flex shrink-0 items-center justify-center rounded-full font-extrabold ring-2 ring-white`}
      style={{ backgroundColor: team.color, color: getContrastText(team.color) }}
      aria-hidden="true"
    >
      {getInitials(team.name)}
    </span>
  );
}