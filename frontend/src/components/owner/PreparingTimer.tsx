'use client';

import { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

interface PreparingTimerProps {
  startTime: string;
}

const TARGET_SECONDS = 180; // ~3 min standard prep goal

export function PreparingTimer({ startTime }: PreparingTimerProps) {
  const [elapsed, setElapsed] = useState(() =>
    Math.max(0, Math.floor((Date.now() - new Date(startTime).getTime()) / 1000)),
  );

  useEffect(() => {
    const start = new Date(startTime).getTime();
    const tick = () => setElapsed(Math.max(0, Math.floor((Date.now() - start) / 1000)));
    tick(); // don't wait a full second for the first paint
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const ratio = elapsed / TARGET_SECONDS;
  const progress = Math.min(100, ratio * 100);
  // Barista needs to see "this one is dragging" without reading the number
  const color = ratio >= 1 ? 'var(--danger)' : ratio >= 0.75 ? 'var(--warn)' : 'var(--info)';

  return (
    <div className="mt-1 space-y-2 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-2.5">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--text-secondary)]">
          <Timer className="h-3.5 w-3.5" />
          제조 경과
        </span>
        <span className="font-mono text-[13px] font-semibold tabular-nums" style={{ color }}>
          {formatted}
        </span>
      </div>

      <div
        className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-overlay)]"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="제조 진행률"
      >
        <div
          className="h-full rounded-full transition-[width,background-color] duration-500"
          style={{ width: `${progress}%`, background: color }}
        />
      </div>
    </div>
  );
}
