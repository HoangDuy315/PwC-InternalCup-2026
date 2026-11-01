import { Link } from 'react-router-dom';
import { TOURNAMENT } from '../data/tournament.js';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-pwc-black text-white/70">
      <div className="h-1 w-full bg-gradient-to-r from-pwc-orange via-pwc-amber to-pwc-orange" aria-hidden="true" />
      <div className="container-page flex flex-col items-center justify-between gap-4 py-8 text-sm sm:flex-row">
        <p>
          © {year} <span className="font-semibold text-white">{TOURNAMENT.shortName}</span>. Made by Di IT 
        </p>
        <nav aria-label="Liên kết chân trang">
          <ul className="flex gap-4">
            <li><Link className="rounded hover:text-pwc-amber" to="/">Giới thiệu</Link></li>
            <li><Link className="rounded hover:text-pwc-amber" to="/draw">Bốc thăm</Link></li>
            <li><Link className="rounded hover:text-pwc-amber" to="/teams">Danh sách đội</Link></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}