'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface CoffeeBrewingAnimationProps {
  statusText?: string;
}

export function CoffeeBrewingAnimation({
  statusText = '커피를 정성껏 내리는 중입니다',
}: CoffeeBrewingAnimationProps) {
  const reduce = useReducedMotion();

  return (
    <section
      aria-label="제조 진행 중"
      className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]"
    >
      <div className="relative grid h-56 place-items-center">
        {/* Warm glow behind the cup, keeps the dark panel from reading flat */}
        <div className="pointer-events-none absolute h-40 w-40 rounded-full bg-[var(--accent)] opacity-[0.07] blur-3xl" />

        <div className="relative h-44 w-36">
          {/* Steam */}
          {!reduce &&
            [0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="absolute top-0 w-1.5 rounded-full bg-gradient-to-t from-[var(--accent)]/35 to-transparent blur-[2px]"
                style={{ left: `${38 + i * 12}%`, height: 26 }}
                animate={{ y: [4, -22], opacity: [0, 0.8, 0], scaleX: [0.7, 1.3, 0.6] }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: 'easeOut',
                }}
              />
            ))}

          {/* Portafilter */}
          <div className="absolute left-1/2 top-8 h-5 w-24 -translate-x-1/2 rounded-md border border-[var(--border-strong)] bg-[var(--surface-overlay)]">
            <span className="absolute bottom-0 left-1/2 h-1.5 w-8 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#6b4423]" />
          </div>

          {/* Extraction stream */}
          <motion.span
            className="absolute left-1/2 top-[3.25rem] w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#7c4d28] to-[#2d1a0c]"
            animate={reduce ? { height: 44 } : { height: [0, 44, 44, 0], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Cup */}
          <div className="absolute bottom-2 left-1/2 h-[5.5rem] w-24 -translate-x-1/2">
            <div className="relative h-full w-full overflow-hidden rounded-b-[1.75rem] rounded-t-md border-2 border-[var(--border-strong)] bg-[var(--bg)]">
              <motion.div
                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2d1a0c] via-[#5c3a21] to-[#7c4d28]"
                animate={reduce ? { height: '70%' } : { height: ['12%', '78%', '78%', '12%'] }}
                transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="absolute inset-x-0 top-0 h-2 bg-[#c98a4b] opacity-80" />
              </motion.div>
            </div>
            {/* Handle */}
            <span className="absolute -right-3 top-6 h-8 w-5 rounded-r-full border-2 border-l-0 border-[var(--border-strong)]" />
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--border)] px-5 py-4 text-center">
        <p className="flex items-center justify-center gap-2 text-sm font-semibold text-[var(--accent)]">
          <span className="flex gap-1" aria-hidden>
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-current"
                animate={reduce ? {} : { opacity: [0.25, 1, 0.25] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </span>
          제조 진행 중
        </p>
        <p className="mt-1 text-[13px] text-[var(--text-secondary)]">{statusText}</p>
      </div>
    </section>
  );
}
