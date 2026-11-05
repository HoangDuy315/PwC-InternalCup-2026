import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAnimationControls, motion } from "framer-motion";
// import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { useSharedState } from "../hooks/useSharedState.js";
import {
  ArrowRightIcon,
  CheckIcon,
  ResetIcon,
  ShuffleIcon,
} from "../components/Icons.jsx";
import { Link } from "react-router-dom";
import { useDraw } from "../context/DrawContext.jsx";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";
import { secureRandomInt } from "../utils/random.js";
import {
  PRESET_GROUPS,
  PRESET_FIXED_ORDER,
  PRESET_FIRST,
} from "../data/drawPreset.js";
import Wheel from "../components/Wheel.jsx";
import GroupBoard from "../components/GroupBoard.jsx";
import ResultModal from "../components/ResultModal.jsx";
import DrawHistory from "../components/DrawHistory.jsx";
 
const SPIN_MS = 5000; // thời gian quay chuẩn (4–6 giây)
const SPIN_MS_REDUCED = 600; // khi người dùng bật giảm chuyển động
 
export default function Draw() {
  const {
    teams,
    remainingTeams,
    groupA,
    groupB,
    history,
    isComplete,
    pendingTeam,
    nextGroup,
    nextTurn,
    mode,
    startSpin,
    commitPending,
    reset,
  } = useDraw();
  const reducedMotion = usePrefersReducedMotion();
 
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [lastAddedId, setLastAddedId] = useState(null);
  const [announcement, setAnnouncement] = useState("");
 
  const timerRef = useRef(null);
  const spinButtonRef = useRef(null);
  const winnerRef = useRef(null);
  const resetIconRef = useRef(null); // vùng icon trong nút Reset
  const spinDuration = reducedMotion ? SPIN_MS_REDUCED : SPIN_MS;
 
  // ===== Shuffle: thứ tự hiển thị các ô trên vòng quay =====
 
  const [wheelOrder, setWheelOrder] = useSharedState("wheelOrder", []);
  const [, setGoals] = useSharedState("goals", {}); // dùng để reset vua phá lưới
  const wheelControls = useAnimationControls();
 
  // Sắp xếp các đội còn lại theo thứ tự đã shuffle (đội chưa có trong order thì xếp theo teams.js)
  const wheelTeams = useMemo(() => {
    const pos = new Map(wheelOrder.map((id, i) => [id, i]));
    const rank = (t) =>
      pos.has(t.id)
        ? pos.get(t.id)
        : 1000 + teams.findIndex((x) => x.id === t.id);
    return [...remainingTeams].sort((a, b) => rank(a) - rank(b));
  }, [remainingTeams, wheelOrder, teams]);
 
  // Xáo trộn Fisher–Yates bằng secureRandomInt, đảm bảo thứ tự mới khác thứ tự cũ
  const handleShuffle = () => {
    if (isSpinning || winner || pendingTeam || wheelTeams.length < 2) return;
    const current = wheelTeams.map((t) => t.id);
    let next = current;
    for (
      let attempt = 0;
      attempt < 10 && next.join("|") === current.join("|");
      attempt += 1
    ) {
      next = [...current];
      for (let i = next.length - 1; i > 0; i -= 1) {
        const j = secureRandomInt(i + 1);
        [next[i], next[j]] = [next[j], next[i]];
      }
    }
    setWheelOrder(next);
    wheelControls.start({
      scale: [1, 0.92, 1.03, 1],
      transition: { duration: 0.45 },
    });
    setAnnouncement("Đã xáo trộn thứ tự vòng quay.");
  };
 
  useEffect(() => {
    winnerRef.current = winner;
  }, [winner]);
 
  // Khi vào trang: chốt đội pending nếu có. Khi rời trang: hủy timer.
  useEffect(() => {
    commitPending();
    return () => window.clearTimeout(timerRef.current);
  }, [commitPending]);
 
  // Còn đúng 1 đội: tự động xếp vào bảng còn thiếu (Bảng B), không cần quay
  const isLastTeam = remainingTeams.length === 1;
  useEffect(() => {
    if (!isLastTeam || isSpinning || winner || pendingTeam) return undefined;
    const lastTeam = remainingTeams[0];
    const t = window.setTimeout(() => {
      startSpin(lastTeam.id); // đánh dấu pending
      commitPending(); // chốt vào bảng của lượt 6 (Bảng B)
      setLastAddedId(lastTeam.id);
      setAnnouncement(
        `${lastTeam.name} được tự động xếp vào Bảng ${nextGroup}.`
      );
    }, 600);
    return () => window.clearTimeout(t);
  }, [
    isLastTeam,
    isSpinning,
    winner,
    pendingTeam,
    remainingTeams,
    nextGroup,
    startSpin,
    commitPending,
  ]);
 
  // Chọn đội trúng cho lượt hiện tại
  // Chọn đội trúng cho lượt hiện tại
  // Chọn đội trúng cho lượt hiện tại
  const pickTeam = () => {
    let pool = remainingTeams;
    // Chế độ xếp sẵn: chỉ chọn trong các đội thuộc bảng của lượt này
    if (mode === "preset" && nextGroup) {
      const allowed = PRESET_GROUPS[nextGroup] || [];
      // Giữ đúng thứ tự trong drawPreset.js, bỏ các đội đã bốc
      const ordered = allowed
        .map((id) => remainingTeams.find((t) => t.id === id))
        .filter(Boolean);
      if (ordered.length > 0) {
        // Bảng cố định thứ tự: lấy đội đầu tiên còn lại (A1 → A2 → A3)
        if (PRESET_FIXED_ORDER[nextGroup]) return ordered[0];
        // Đội cố định ở vị trí số 1 (vd B1 = Team Báo), chỉ áp dụng khi bảng chưa có đội nào
        const firstId = PRESET_FIRST[nextGroup];
        const groupCount = nextGroup === "A" ? groupA.length : groupB.length;
        const firstTeam = ordered.find((t) => t.id === firstId);
        if (firstTeam && groupCount === 0) return firstTeam;
        pool = ordered;
      }
    }
    return pool[secureRandomInt(pool.length)];
  };
 
  // Xử lý bấm QUAY
  const handleSpin = () => {
    if (
      isSpinning ||
      winner ||
      pendingTeam ||
      isComplete ||
      remainingTeams.length <= 1
    )
      return;
 
    // 1) Chọn đội trúng
    const team = pickTeam();
    const n = wheelTeams.length;
    const index = wheelTeams.findIndex((t) => t.id === team.id);
 
    // 2) Tính góc để kim (ở đỉnh) dừng đúng giữa ô của đội đó
    const segAngle = 360 / n;
    const centerAngle = (index + 0.5) * segAngle;
    const targetMod = (360 - centerAngle) % 360;
    const currentMod = ((rotation % 360) + 360) % 360;
    const delta = (targetMod - currentMod + 360) % 360;
    const extraSpins = reducedMotion ? 1 : 5 + secureRandomInt(2);
    const nextRotation = rotation + extraSpins * 360 + delta;
 
    // 3) Ghi nhận pending rồi bắt đầu quay
    startSpin(team.id);
    setIsSpinning(true);
    setLastAddedId(null);
    setAnnouncement("Vòng quay đang quay…");
    setRotation(nextRotation);
 
    // 4) Khi dừng: hiện popup chúc mừng
    timerRef.current = window.setTimeout(() => {
      setIsSpinning(false);
      setWinner(team);
      setAnnouncement(`${team.name} được xếp vào Bảng ${nextGroup}.`);
    }, spinDuration + 150);
  };
 
  // Đóng popup → chốt đội vào bảng
  const handleCloseModal = useCallback(() => {
    if (winnerRef.current) setLastAddedId(winnerRef.current.id);
    setWinner(null);
    commitPending();
    window.requestAnimationFrame(() => spinButtonRef.current?.focus());
  }, [commitPending]);
 
  // Xóa các state cục bộ sau khi reset
  // Xóa các state cục bộ sau khi reset + xóa luôn vua phá lưới
  const clearLocal = () => {
    setGoals({}); // reset bốc thăm → xóa luôn vua phá lưới trên server
    window.clearTimeout(timerRef.current);
    setIsSpinning(false);
    setWinner(null);
    setLastAddedId(null);
    setAnnouncement("Đã reset. Có thể bốc thăm lại từ đầu.");
  };
 
  // Bấm chữ "Reset": reset ngay, về chế độ random
  const handleRandomReset = () => {
    reset("random");
    clearLocal();
  };
 
  // Bấm icon reset: reset ngay, chuyển sang chế độ xếp sẵn
  const handleQuickReset = () => {
    reset("preset");
    clearLocal();
  };
 
  // 1 nút Reset duy nhất: bấm chuột trúng icon → xếp sẵn, còn lại → random
  const handleResetClick = (e) => {
    const icon = resetIconRef.current;
    // e.detail === 0: bấm bằng bàn phím (Enter/Space) → luôn random
    if (e.detail > 0 && icon) {
      const r = icon.getBoundingClientRect();
      const hitIcon =
        e.clientX >= r.left - 6 &&
        e.clientX <= r.right + 4 &&
        e.clientY >= r.top - 10 &&
        e.clientY <= r.bottom + 10;
      if (hitIcon) {
        handleQuickReset();
        return;
      }
    }
    handleRandomReset();
  };
 
  const spinDisabled =
    isSpinning ||
    Boolean(winner) ||
    Boolean(pendingTeam) ||
    isComplete ||
    isLastTeam;
  const spinLabel = isComplete
    ? "Hoàn tất bốc thăm"
    : isSpinning
      ? "Đang quay…"
      : isLastTeam
        ? "Đang xếp đội cuối…"
        : "QUAY";
  const drawnCount = history.length;
 
  return (
    <div className="bg-pwc-light">
      {/* Tiêu đề trang */}
      <section className="bg-pwc-black text-white">
        <div className="container-page py-10 sm:py-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-pwc-amber">
            Bốc thăm chia bảng
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Vòng quay may mắn
          </h1>
          <p className="mt-3 max-w-2xl text-white/75">
            Mỗi lượt quay chọn ngẫu nhiên 1 đội. Thứ tự xếp bảng: A → B → A → B
            → A → B.
          </p>
          <div className="mt-6 max-w-md">
            <div className="flex justify-between text-xs font-semibold text-white/70">
              <span>Tiến độ</span>
              <span>
                {drawnCount}/{teams.length} đội
              </span>
            </div>
            <div
              className="mt-2 h-2 overflow-hidden rounded-full bg-white/15"
              role="progressbar"
              aria-label="Tiến độ bốc thăm"
              aria-valuemin={0}
              aria-valuemax={teams.length}
              aria-valuenow={drawnCount}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-pwc-orange to-pwc-amber transition-all duration-500"
                style={{ width: `${(drawnCount / teams.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </section>
 
      <div className="container-page grid gap-8 py-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-start">
        {/* Cột trái: vòng quay + nút */}
        <section
          aria-label="Vòng quay"
          className="relative rounded-2xl bg-white p-5 shadow-card sm:p-8"
        >
          <div className="mb-6 text-center">
            {isComplete ? (
              <p className="inline-flex items-center gap-2 rounded-full bg-pwc-black px-4 py-2 text-sm font-bold text-white">
                <CheckIcon className="h-4 w-4 text-pwc-amber" /> Đã chia đủ 6
                đội vào 2 bảng
              </p>
            ) : (
              <p className="text-sm font-semibold text-pwc-dark">
                Lượt <span className="text-pwc-orangeDark">{nextTurn}</span>/
                {teams.length} · Đội trúng sẽ vào{" "}
                <span className="rounded bg-pwc-amber px-2 py-0.5 font-extrabold text-pwc-black">
                  Bảng {nextGroup}
                </span>
              </p>
            )}
          </div>
 
          <motion.div animate={wheelControls}>
            <Wheel
              teams={wheelTeams}
              rotation={rotation}
              duration={spinDuration}
              isComplete={isComplete}
            />
          </motion.div>
 
          <div className="mt-8 flex flex-col items-center gap-3">
            <button
              ref={spinButtonRef}
              type="button"
              onClick={handleSpin}
              disabled={spinDisabled}
              aria-label={
                isComplete
                  ? "Đã hoàn tất bốc thăm"
                  : isSpinning
                    ? "Vòng quay đang quay"
                    : `Quay để chọn đội cho Bảng ${nextGroup}`
              }
              className={[
                "btn w-full max-w-xs py-4 text-lg font-black tracking-widest",
                isComplete
                  ? "bg-pwc-dark text-white"
                  : "bg-pwc-orange text-white shadow-lg shadow-pwc-orange/30 hover:bg-pwc-orangeDark",
              ].join(" ")}
            >
              {spinLabel}
            </button>
 
            <div className="flex flex-wrap items-center justify-center gap-3">
              {isComplete && (
                <Link
                  to="/teams"
                  className="btn-amber"
                  aria-label="Xem danh sách đội và kết quả chia bảng"
                >
                  Xem danh sách đội <ArrowRightIcon className="h-4 w-4" />
                </Link>
              )}
              {!isComplete && (
                <button
                  type="button"
                  className="btn-dark py-2.5"
                  onClick={handleShuffle}
                  disabled={
                    isSpinning ||
                    Boolean(winner) ||
                    Boolean(pendingTeam) ||
                    wheelTeams.length < 2
                  }
                  aria-label="Xáo trộn thứ tự các đội trên vòng quay"
                >
                  <ShuffleIcon className="h-4 w-4" /> Shuffle
                </button>
              )}
              {/* Nút Reset 2 vùng bấm, nhìn như 1 nút, đều reset ngay không xác nhận:
                  - Icon: chế độ xếp sẵn
                  - Chữ: random bình thường */}
              {/* Nút Reset: nhìn và hoạt động như 1 nút bình thường */}
               {/* Nút Reset: ẩn khi đã bốc thăm xong (lịch đã cố định) */}
              {/* <button
                type="button"
                onClick={handleResetClick}
                disabled={isSpinning}
                aria-label="Reset kết quả bốc thăm"
                className="btn-outline py-2.5"
              >
                <span ref={resetIconRef} className="inline-flex">
                  <ResetIcon className="h-4 w-4" />
                </span>
                Reset
              </button> */}
              {!isComplete && (
                <button
                  type="button"
                  onClick={handleResetClick}
                  disabled={isSpinning}
                  aria-label="Reset kết quả bốc thăm"
                  className="btn-outline py-2.5"
                >
                  <span ref={resetIconRef} className="inline-flex">
                    <ResetIcon className="h-4 w-4" />
                  </span>
                  Reset
                </button>
              )}
            </div>
          </div>
 
          <p className="sr-only" aria-live="polite">
            {announcement}
          </p>
        </section>
 
        {/* Cột phải: 2 bảng + lịch sử */}
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <GroupBoard
              group="A"
              entries={groupA}
              isNext={nextGroup === "A"}
              lastAddedId={lastAddedId}
            />
            <GroupBoard
              group="B"
              entries={groupB}
              isNext={nextGroup === "B"}
              lastAddedId={lastAddedId}
            />
          </div>
          <DrawHistory history={history} />
        </div>
      </div>
 
      <ResultModal
        team={winner}
        group={nextGroup}
        turn={nextTurn}
        total={teams.length}
        onClose={handleCloseModal}
        reducedMotion={reducedMotion}
      />
    </div>
  );
}