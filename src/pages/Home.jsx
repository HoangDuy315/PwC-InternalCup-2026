import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TOURNAMENT } from "../data/tournament.js";
import { CONTACTS } from "../data/contacts.js";
import { RULES } from "../data/rules.js";
import InfoCard from "../components/InfoCard.jsx";
import mainBg from "../Asset/mainbg1.png";
import tva from "../Asset/tva.png";
import ContactCard from "../components/ContactCard.jsx";
import {
  ArrowRightIcon,
  CalendarIcon,
  GridIcon,
  HeartIcon,
  LinkIcon,
  MapPinIcon,
  TrophyIcon,
  UsersIcon,
} from "../components/Icons.jsx";

const PURPOSE_ICONS = [LinkIcon, HeartIcon, UsersIcon];

export default function Home() {
  return (
    <>
      {/* ===== HERO ===== */}
        {/* ===== HERO ===== */}
         {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-pwc-black text-white">
        {/* Desktop: ảnh làm nền toàn khung */}
        <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
          <img src={mainBg} alt="" className="h-full w-full object-cover object-[center_30%]" />
          <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/70 to-transparent" />
        </div>

        <div className="container-page relative flex flex-col pb-10 pt-10 sm:pt-14 lg:min-h-[calc(100vh-4rem)] lg:pt-16 lg:[text-shadow:0_2px_12px_rgba(0,0,0,0.6)]">
          {/* ----- Tiêu đề ----- */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/30 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-pwc-amber"
            >
              <span className="h-2 w-2 rounded-full bg-pwc-amber" aria-hidden="true" />
              Giải đấu nội bộ
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-5 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl"
            >
              {TOURNAMENT.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-3 max-w-xl text-lg font-medium text-white/90 sm:text-xl"
            >
              {TOURNAMENT.slogan}
            </motion.p>
          </div>

          {/* Mobile/tablet: ảnh hiện đủ khung, không bị cắt */}
          <motion.img
            src={mainBg}
            alt="Các cầu thủ tham dự PwC Internal Cup"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="-mx-4 mt-6 block h-auto w-[calc(100%+2rem)] max-w-none sm:mx-0 sm:w-full sm:rounded-xl lg:hidden"
          />

          {/* ----- Nút + số liệu: mobile nằm dưới ảnh, desktop đẩy xuống đáy ----- */}
          <div className="mt-6 lg:mt-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            >
              <Link
                to="/schedule"
                className="btn-primary px-7 py-4 text-base shadow-lg"
                aria-label="Đến trang bốc thăm chia bảng"
              >
                Go to lịch thi đấu <ArrowRightIcon />
              </Link>
              <Link to="/teams" className="btn-ghost-light bg-black/30 px-7 py-4 text-base backdrop-blur-sm">
                Xem danh sách đội
              </Link>
            </motion.div>

            <dl className="mt-8 grid max-w-xl grid-cols-3 gap-6 border-t border-white/20 pt-6">
              {[
                { k: 'Đội tham dự', v: '6' },
                { k: 'Bảng đấu', v: '2' },
                { k: 'Đội / bảng', v: '3' },
              ].map((s) => (
                <div key={s.k}>
                  <dt className="text-xs uppercase tracking-wider text-white/80">{s.k}</dt>
                  <dd className="mt-1 text-3xl font-black text-pwc-amber sm:text-4xl">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ===== GIỚI THIỆU ===== */}
      <section id="about" className="bg-white py-20">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="eyebrow">Về giải đấu</p>
            <h2 className="section-title">Hơn cả một trận bóng</h2>
            <p className="mt-5 text-lg leading-relaxed text-pwc-dark">
              {TOURNAMENT.intro}
            </p>
            <div className="mt-6 rounded-xl border-l-4 border-pwc-orange bg-pwc-light p-5">
              <p className="text-sm font-bold uppercase tracking-wider text-pwc-orangeDark">
                Đối tượng tham gia
              </p>
              <p className="mt-1 text-pwc-dark">{TOURNAMENT.audience}</p>
            </div>
          </div>
          <ul className="grid gap-4">
            {TOURNAMENT.purposes.map((p, i) => {
              const IconComp = PURPOSE_ICONS[i % PURPOSE_ICONS.length];
              return (
                <motion.li
                  key={p.title}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex gap-4 rounded-xl border border-black/5 bg-white p-5 shadow-card"
                >
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-pwc-black text-pwc-amber">
                    <IconComp />
                  </span>
                  <div>
                    <h3 className="font-extrabold text-pwc-black">{p.title}</h3>
                    <p className="mt-1 text-sm text-pwc-dark">
                      {p.description}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </section>
      
            {/* ===== THƯ VIỆN ẢNH ===== */}
      {RULES.photoAlbums?.length > 0 && (
        <section id="photos" className="bg-white pb-20">
          <div className="container-page">
            <p className="eyebrow">Hình ảnh</p>
            <h2 className="section-title">Thư viện ảnh</h2>

            {/* Album chính: banner full chiều rộng */}
            <a
              href={RULES.photoAlbums[0].url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={"Mở " + RULES.photoAlbums[0].title + " trên Google Drive (mở tab mới)"}
              className="group mt-6 grid overflow-hidden rounded-2xl border border-black/5 bg-pwc-black shadow-card transition-shadow hover:shadow-xl md:grid-cols-2"
            >
              {/* Ảnh xem trước */}
              <div className="relative aspect-[16/9] overflow-hidden md:aspect-auto md:min-h-[280px]">
                <img
                  src={tva}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover object-[center_30%] transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/40" />
              </div>

              {/* Nội dung */}
              <div className="flex flex-col justify-center gap-3 p-6 text-white sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-pwc-amber">Google Drive</p>
                <p className="text-2xl font-black sm:text-3xl">{RULES.photoAlbums[0].title}</p>
                {RULES.photoAlbums[0].description && (
                  <p className="text-white/80">{RULES.photoAlbums[0].description}</p>
                )}
                <span className="mt-2 inline-flex w-fit items-center gap-2 rounded-md bg-pwc-orange px-5 py-3 text-sm font-semibold text-white transition-colors group-hover:bg-pwc-orangeDark">
                  Xem ảnh <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </a>

            {/* Album phụ (nếu có từ 2 album trở lên) */}
            {RULES.photoAlbums.length > 1 && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {RULES.photoAlbums.slice(1).map((a) => (
                  <a
                    key={a.url}
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={"Mở " + a.title + " trên Google Drive (mở tab mới)"}
                    className="group flex items-center justify-between gap-4 rounded-xl border border-black/5 bg-white p-5 shadow-card transition-shadow hover:shadow-lg"
                  >
                    <div className="min-w-0">
                      <p className="font-extrabold text-pwc-black">{a.title}</p>
                      {a.description && <p className="mt-1 text-sm text-pwc-dark/80">{a.description}</p>}
                    </div>
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pwc-orange text-white transition-transform group-hover:translate-x-1">
                      <ArrowRightIcon className="h-4 w-4" />
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ===== THÔNG TIN CHÍNH ===== */}
      <section id="info" className="bg-pwc-light py-20">
        <div className="container-page">
          <p className="eyebrow">Thông tin chính</p>
          <h2 className="section-title">Những điều cần biết</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <InfoCard icon={CalendarIcon} title="Thời gian" index={0}>
              <p>{TOURNAMENT.date}</p>
              <p className="text-pwc-dark/80">{TOURNAMENT.time}</p>
            </InfoCard>
                        <InfoCard icon={MapPinIcon} title="Địa điểm" index={1}>
              {TOURNAMENT.venueUrl ? (
                <>
                  <a
                    href={TOURNAMENT.venueUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded underline decoration-pwc-orange/40 underline-offset-4 transition-colors hover:text-pwc-orangeDark hover:decoration-pwc-orange"
                    aria-label={`Mở bản đồ: ${TOURNAMENT.venue} (mở tab mới)`}
                  >
                    {TOURNAMENT.venue}
                  </a>
                  <a
                    href={TOURNAMENT.venueUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-pwc-orange/10 px-3 py-1.5 text-sm font-bold text-pwc-orangeDark transition-colors hover:bg-pwc-orange/20"
                    aria-label="Xem đường đi trên Google Maps (mở tab mới)"
                  >
                    <MapPinIcon className="h-4 w-4" /> Xem bản đồ
                  </a>
                </>
              ) : (
                <p>{TOURNAMENT.venue}</p>
              )}
            </InfoCard>
            <InfoCard icon={GridIcon} title="Thể thức" index={2}>
              <p>{TOURNAMENT.format}</p>
            </InfoCard>
            <InfoCard icon={TrophyIcon} title="Giải thưởng" index={3}>
              <ul className="space-y-1">
                {TOURNAMENT.prizes.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </InfoCard>
          </div>
        </div>
      </section>

      {/* ===== CONTACT POINTS ===== */}
      <section id="contact" className="bg-white py-20">
        <div className="container-page">
          <p className="eyebrow">Contact Points</p>
          <h2 className="section-title">Liên hệ Ban tổ chức</h2>
          <p className="mt-3 max-w-2xl text-pwc-dark">
            Có câu hỏi về đăng ký, lịch thi đấu hay hậu cần? Liên hệ trực tiếp
            với chúng tôi.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CONTACTS.map((c, i) => (
              <ContactCard key={c.id} contact={c} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA CUỐI TRANG ===== */}
      <section className="bg-gradient-to-r from-pwc-orange to-pwc-amber">
        <div className="container-page flex flex-col items-start justify-between gap-6 py-12 sm:flex-row sm:items-center">
          <h2 className="text-2xl font-black text-pwc-black sm:text-3xl">
            Sẵn sàng xem đội bạn rơi vào bảng nào?
          </h2>
          <Link to="/draw" className="btn-dark px-7 py-4 text-base">
            Bắt đầu bốc thăm <ArrowRightIcon />
          </Link>
        </div>
      </section>
    </>
  );
}