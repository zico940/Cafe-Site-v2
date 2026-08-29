'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { playOrderCompleteSound } from '@/lib/audio';

interface CompletionCelebrationProps {
  orderNumber: number;
  onResetOrder: () => void;
}

export function CompletionCelebration({ orderNumber, onResetOrder }: CompletionCelebrationProps) {
  useEffect(() => {
    playOrderCompleteSound();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const end = Date.now() + 2200;
    let raf = 0;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 60,
        startVelocity: 45,
        origin: { x: 0, y: 0.7 },
        colors: ['#f0a532', '#f7b955', '#45c98a', '#f5f1ec'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 60,
        startVelocity: 45,
        origin: { x: 1, y: 0.7 },
        colors: ['#f0a532', '#f7b955', '#45c98a', '#f5f1ec'],
      });
      if (Date.now() < end) raf = requestAnimationFrame(frame);
    };
    frame();

    // Without this the loop keeps firing after unmount (e.g. tab change mid-burst)
    return () => cancelAnimationFrame(raf);
  }, [orderNumber]);

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--ok-line)] bg-[var(--surface)] px-6 py-10 text-center"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[var(--ok)] opacity-[0.06] blur-3xl" />

      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 18 }}
        className="relative mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--ok)] text-[var(--accent-ink)]"
      >
        <Check className="h-8 w-8" strokeWidth={3} />
      </motion.span>

      <p className="relative mt-5 text-sm font-semibold text-[var(--ok)]">음료 준비 완료</p>

      <h2 className="relative mt-2 text-2xl font-semibold tracking-tight text-[var(--text)]">
        주문번호{' '}
        <span className="text-[var(--accent)]">{orderNumber}</span>번
      </h2>

      <p className="relative mx-auto mt-3 max-w-xs text-[13px] leading-relaxed text-[var(--text-secondary)]">
        픽업대에 음료가 준비되었습니다. 번호표를 제시해 주세요.
      </p>

      <button
        onClick={onResetOrder}
        className="relative mt-7 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-[14px] font-semibold text-[var(--accent-ink)] transition-all hover:bg-[var(--accent-hover)] active:scale-[0.98]"
      >
        새로운 주문하기
        <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
      </button>
    </motion.section>
  );
}
