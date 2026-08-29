'use client';

import { Order, OrderStatus } from '@/types';
import { PreparingTimer } from './PreparingTimer';
import { Play, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: number, newStatus: OrderStatus) => void;
}

const STATUS_META: Record<OrderStatus, { label: string; color: string; soft: string; line: string }> = {
  pending: {
    label: '대기 중',
    color: 'var(--accent)',
    soft: 'var(--accent-soft)',
    line: 'var(--accent-line)',
  },
  preparing: {
    label: '제작 중',
    color: 'var(--info)',
    soft: 'var(--info-soft)',
    line: 'var(--info-line)',
  },
  completed: {
    label: '완료',
    color: 'var(--ok)',
    soft: 'var(--ok-soft)',
    line: 'var(--ok-line)',
  },
  cancelled: {
    label: '취소',
    color: 'var(--danger)',
    soft: 'var(--danger-soft)',
    line: 'var(--danger-line)',
  },
};

export function OrderCard({ order, onUpdateStatus }: OrderCardProps) {
  const meta = STATUS_META[order.status];
  const isDone = order.status === 'completed' || order.status === 'cancelled';

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className={`overflow-hidden rounded-[var(--radius-lg)] border bg-[var(--surface)] ${
        isDone ? 'border-[var(--border)] opacity-60' : 'border-[var(--border-strong)]'
      }`}
      style={!isDone ? { borderColor: meta.line } : undefined}
    >
      {/* Status accent rail — readable at a glance from across the counter */}
      <div className="h-[3px]" style={{ background: isDone ? 'transparent' : meta.color }} />

      <div className="flex items-center justify-between gap-3 px-4 pb-3 pt-3.5">
        <div className="flex items-baseline gap-2.5">
          <span className="text-2xl font-semibold leading-none tracking-tight text-[var(--text)]">
            <span className="text-[var(--text-muted)]">#</span>
            {order.order_number}
          </span>
          <time className="text-xs text-[var(--text-muted)]" dateTime={order.created_at}>
            {new Date(order.created_at).toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </time>
        </div>

        <span
          className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold"
          style={{ background: meta.soft, color: meta.color }}
        >
          {meta.label}
        </span>
      </div>

      <ul className="space-y-1.5 border-t border-[var(--border)] px-4 py-3">
        {order.items.map((item, idx) => (
          <li key={idx} className="flex items-baseline justify-between gap-3 text-[13px]">
            <span className="min-w-0 truncate font-medium text-[var(--text)]">{item.name}</span>
            <span className="shrink-0 tabular-nums text-[var(--text-secondary)]">
              <span className="font-semibold text-[var(--text)]">×{item.quantity}</span>
              <span className="ml-2 text-xs text-[var(--text-muted)]">
                {(item.unit_price * item.quantity).toLocaleString()}원
              </span>
            </span>
          </li>
        ))}
      </ul>

      {order.status === 'preparing' && (
        <div className="px-4 pb-1">
          <PreparingTimer startTime={order.updated_at || order.created_at} />
        </div>
      )}

      <div className="flex items-center justify-between gap-3 border-t border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3">
        <span className="text-[13px] text-[var(--text-secondary)]">
          합계{' '}
          <span className="ml-0.5 font-semibold text-[var(--text)]">
            {order.total_price.toLocaleString()}원
          </span>
        </span>

        <div className="flex items-center gap-2">
          {order.status === 'pending' && (
            <>
              <button
                onClick={() => onUpdateStatus(order.id, 'cancelled')}
                className="rounded-full px-3 py-2 text-xs font-semibold text-[var(--text-muted)] transition-colors hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]"
              >
                취소
              </button>
              <button
                onClick={() => onUpdateStatus(order.id, 'preparing')}
                className="flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-[var(--accent-ink)] transition-all hover:bg-[var(--accent-hover)] active:scale-95"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                제작 시작
              </button>
            </>
          )}

          {order.status === 'preparing' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'completed')}
              className="flex items-center gap-1.5 rounded-full bg-[var(--ok)] px-4 py-2 text-xs font-semibold text-[var(--accent-ink)] transition-all hover:brightness-110 active:scale-95"
            >
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
              제작 완료
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
