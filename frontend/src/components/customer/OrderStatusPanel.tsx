'use client';

import { Order } from '@/types';
import { CoffeeBrewingAnimation } from './CoffeeBrewingAnimation';
import { CompletionCelebration } from './CompletionCelebration';
import { Clock, Coffee, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface OrderStatusPanelProps {
  order: Order;
  onResetOrder: () => void;
}

const STEPS = [
  { key: 'pending', label: '주문 접수', icon: Clock },
  { key: 'preparing', label: '제조 중', icon: Coffee },
  { key: 'completed', label: '픽업 준비', icon: CheckCircle2 },
] as const;

export function OrderStatusPanel({ order, onResetOrder }: OrderStatusPanelProps) {
  if (order.status === 'completed') {
    return <CompletionCelebration orderNumber={order.order_number} onResetOrder={onResetOrder} />;
  }

  const currentStep = STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className="w-full space-y-4">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]"
      >
        {/* Ticket number — the one thing the customer actually looks for */}
        <div className="border-b border-dashed border-[var(--border-strong)] px-6 py-8 text-center">
          <p className="text-xs font-medium tracking-wide text-[var(--text-muted)]">
            고객님의 주문번호
          </p>
          <p className="mt-1.5 text-7xl font-semibold leading-none tracking-[-0.04em] text-[var(--accent)]">
            {order.order_number}
          </p>
          <p className="mt-3 text-[13px] text-[var(--text-secondary)]">
            매장 전광판에서도 확인하실 수 있습니다
          </p>
        </div>

        {/* Progress stepper */}
        {order.status !== 'cancelled' && (
          <ol className="flex items-start gap-1 px-4 py-6" aria-label="주문 진행 상태">
            {STEPS.map((step, i) => {
              const done = i < currentStep;
              const active = i === currentStep;
              const Icon = step.icon;

              return (
                <li key={step.key} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full items-center">
                    <span
                      className={`h-[2px] flex-1 rounded-full ${
                        i === 0
                          ? 'bg-transparent'
                          : done || active
                            ? 'bg-[var(--accent)]'
                            : 'bg-[var(--border-strong)]'
                      }`}
                    />
                    <span
                      className={`relative grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 transition-colors ${
                        done
                          ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)]'
                          : active
                            ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
                            : 'border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-muted)]'
                      }`}
                    >
                      {active && (
                        <span className="absolute h-9 w-9 animate-ping rounded-full bg-[var(--accent)] opacity-20" />
                      )}
                      <Icon className="h-4 w-4" strokeWidth={2.5} />
                    </span>
                    <span
                      className={`h-[2px] flex-1 rounded-full ${
                        i === STEPS.length - 1
                          ? 'bg-transparent'
                          : done
                            ? 'bg-[var(--accent)]'
                            : 'bg-[var(--border-strong)]'
                      }`}
                    />
                  </div>
                  <span
                    className={`text-center text-[11px] font-medium ${
                      done || active ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {step.label}
                  </span>
                </li>
              );
            })}
          </ol>
        )}

        {/* Line items */}
        <div className="border-t border-[var(--border)] bg-[var(--surface-raised)] px-5 py-4">
          <ul className="space-y-2">
            {order.items.map((item, idx) => (
              <li key={idx} className="flex items-baseline justify-between gap-3 text-[13px]">
                <span className="min-w-0 truncate text-[var(--text-secondary)]">
                  {item.name}
                  <span className="ml-1.5 text-[var(--text-muted)]">×{item.quantity}</span>
                </span>
                <span className="shrink-0 text-[var(--text)]">
                  {(item.unit_price * item.quantity).toLocaleString()}원
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-baseline justify-between border-t border-[var(--border)] pt-3">
            <span className="text-[13px] text-[var(--text-secondary)]">합계</span>
            <span className="text-base font-semibold text-[var(--text)]">
              {order.total_price.toLocaleString()}원
            </span>
          </div>
        </div>
      </motion.section>

      {order.status === 'pending' && (
        <div className="flex items-start gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] px-5 py-4">
          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
            <Clock className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-[var(--text)]">
              바리스타에게 주문이 전달되었습니다
            </h2>
            <p className="mt-1 text-[13px] leading-relaxed text-[var(--text-secondary)]">
              잠시만 기다려 주시면 곧 제조를 시작합니다.
            </p>
          </div>
        </div>
      )}

      {order.status === 'preparing' && (
        <CoffeeBrewingAnimation statusText="바리스타가 음료를 추출하고 있습니다" />
      )}

      {order.status === 'cancelled' && (
        <div className="rounded-[var(--radius-lg)] border border-[var(--danger-line)] bg-[var(--danger-soft)] px-5 py-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-[var(--danger)]" />
          <h2 className="mt-3 text-base font-semibold text-[var(--text)]">
            주문이 취소되었습니다
          </h2>
          <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
            자세한 내용은 매장 카운터로 문의해 주세요.
          </p>
          <button
            onClick={onResetOrder}
            className="mt-4 rounded-full bg-[var(--surface-overlay)] px-5 py-2.5 text-[13px] font-semibold text-[var(--text)] transition-colors hover:bg-[var(--border-strong)]"
          >
            다시 주문하기
          </button>
        </div>
      )}
    </div>
  );
}
