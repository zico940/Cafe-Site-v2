'use client';

import { CartItem } from '@/types';
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CartDrawerProps {
  items: CartItem[];
  totalAmount: number;
  totalCount: number;
  onUpdateQuantity: (menuId: number, delta: number) => void;
  onRemoveItem: (menuId: number) => void;
  onSubmitOrder: () => void;
  isSubmitting: boolean;
}

export function CartDrawer({
  items,
  totalAmount,
  totalCount,
  onUpdateQuantity,
  onRemoveItem,
  onSubmitOrder,
  isSubmitting,
}: CartDrawerProps) {
  const isEmpty = items.length === 0;

  return (
    <>
      <section
        aria-label="장바구니"
        className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]"
      >
        <header className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3.5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
            <ShoppingBag className="h-4 w-4 text-[var(--accent)]" />
            주문 내역
          </h2>
          {!isEmpty && (
            <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-xs font-semibold text-[var(--accent)]">
              {totalCount}개
            </span>
          )}
        </header>

        {isEmpty ? (
          <div className="px-4 py-12 text-center">
            <ShoppingBag className="mx-auto h-8 w-8 text-[var(--text-muted)] opacity-40" />
            <p className="mt-3 text-sm font-medium text-[var(--text-secondary)]">
              장바구니가 비어 있습니다
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              메뉴를 선택해 담아주세요.
            </p>
          </div>
        ) : (
          <>
            <ul className="scrollbar-thin max-h-[min(50vh,20rem)] divide-y divide-[var(--border)] overflow-y-auto">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.li
                    key={item.menu.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-3 px-4 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium text-[var(--text)]">
                          {item.menu.name}
                        </p>
                        <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                          {(item.menu.price * item.quantity).toLocaleString()}원
                        </p>
                      </div>

                      <div className="flex items-center gap-0.5 rounded-full border border-[var(--border)] bg-[var(--surface-raised)] p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.menu.id, -1)}
                          aria-label={`${item.menu.name} 수량 줄이기`}
                          className="grid h-7 w-7 place-items-center rounded-full text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-overlay)] hover:text-[var(--text)]"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span
                          aria-label={`수량 ${item.quantity}개`}
                          className="w-6 text-center text-[13px] font-semibold text-[var(--text)]"
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.menu.id, 1)}
                          aria-label={`${item.menu.name} 수량 늘리기`}
                          className="grid h-7 w-7 place-items-center rounded-full text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-overlay)] hover:text-[var(--text)]"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.menu.id)}
                        aria-label={`${item.menu.name} 삭제`}
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[var(--text-muted)] transition-colors hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <div className="space-y-3 border-t border-[var(--border)] bg-[var(--surface-raised)] px-4 py-4">
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] text-[var(--text-secondary)]">결제 예정 금액</span>
                <span className="text-xl font-semibold tracking-tight text-[var(--text)]">
                  {totalAmount.toLocaleString()}
                  <span className="ml-0.5 text-sm font-normal text-[var(--text-secondary)]">원</span>
                </span>
              </div>

              <SubmitButton
                onClick={onSubmitOrder}
                isSubmitting={isSubmitting}
                className="hidden lg:flex"
              />
            </div>
          </>
        )}
      </section>

      {/* Mobile: the sidebar cart falls below a long menu list, so the primary
          action would be unreachable without scrolling the whole catalog. */}
      <AnimatePresence>
        {!isEmpty && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
            className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--border)] bg-[var(--surface)]/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden"
          >
            <div className="mx-auto flex max-w-6xl items-center gap-3">
              <div className="min-w-0 pl-1">
                <p className="text-[11px] text-[var(--text-muted)]">{totalCount}개 · 합계</p>
                <p className="text-base font-semibold text-[var(--text)]">
                  {totalAmount.toLocaleString()}원
                </p>
              </div>
              <SubmitButton
                onClick={onSubmitOrder}
                isSubmitting={isSubmitting}
                className="w-auto flex-1"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function SubmitButton({
  onClick,
  isSubmitting,
  className = '',
}: {
  onClick: () => void;
  isSubmitting: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={isSubmitting}
      className={`flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3.5 text-[15px] font-semibold text-[var(--accent-ink)] transition-all hover:bg-[var(--accent-hover)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          주문 전송 중
        </>
      ) : (
        <>
          주문하기
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </>
      )}
    </button>
  );
}
