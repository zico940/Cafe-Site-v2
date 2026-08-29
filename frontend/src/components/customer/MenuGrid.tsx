'use client';

import { useState } from 'react';
import { MenuItem } from '@/types';
import { CATEGORIES } from '@/lib/constants';
import { Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuGridProps {
  menus: MenuItem[];
  onAddToCart: (menu: MenuItem) => void;
}

export function MenuGrid({ menus, onAddToCart }: MenuGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [justAdded, setJustAdded] = useState<number | null>(null);

  const filteredMenus =
    selectedCategory === 'all' ? menus : menus.filter((m) => m.category === selectedCategory);

  const handleAdd = (menu: MenuItem) => {
    onAddToCart(menu);
    setJustAdded(menu.id);
    setTimeout(() => setJustAdded((id) => (id === menu.id ? null : id)), 1000);
  };

  return (
    <div className="w-full space-y-5">
      {/* Category filter */}
      <div
        role="tablist"
        aria-label="메뉴 카테고리"
        className="scrollbar-none -mx-1 flex items-center gap-1.5 overflow-x-auto px-1 pb-1"
      >
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const count =
            cat.id === 'all' ? menus.length : menus.filter((m) => m.category === cat.id).length;

          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors ${
                isActive
                  ? 'bg-[var(--accent)] text-[var(--accent-ink)]'
                  : 'border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text)]'
              }`}
            >
              {cat.name}
              <span className={isActive ? 'opacity-60' : 'opacity-45'}>{count}</span>
            </button>
          );
        })}
      </div>

      {filteredMenus.length === 0 ? (
        <p className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] py-16 text-center text-sm text-[var(--text-muted)]">
          이 카테고리에 등록된 메뉴가 없습니다.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filteredMenus.map((menu) => {
              const added = justAdded === menu.id;

              return (
                <motion.div
                  key={menu.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Whole card is the button — a 2.5rem icon target is a poor
                      tap target on a table-side phone. */}
                  <button
                    type="button"
                    disabled={!menu.is_available}
                    onClick={() => handleAdd(menu)}
                    aria-label={`${menu.name} 담기, ${menu.price.toLocaleString()}원`}
                    className={`group flex h-full w-full flex-col rounded-[var(--radius-lg)] border p-4 text-left transition-all ${
                      menu.is_available
                        ? 'border-[var(--border)] bg-[var(--surface)] hover:-translate-y-0.5 hover:border-[var(--accent-line)] hover:bg-[var(--surface-raised)] hover:shadow-[var(--shadow-md)] active:translate-y-0'
                        : 'cursor-not-allowed border-[var(--border)] bg-[var(--surface)] opacity-45'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-[15px] font-semibold text-[var(--text)]">
                          {menu.name}
                        </h3>
                        <p className="mt-0.5 truncate text-xs text-[var(--text-muted)]">
                          {menu.name_en}
                        </p>
                      </div>

                      {!menu.is_available && (
                        <span className="shrink-0 rounded-full border border-[var(--danger-line)] bg-[var(--danger-soft)] px-2 py-0.5 text-[11px] font-semibold text-[var(--danger)]">
                          품절
                        </span>
                      )}
                    </div>

                    <p className="mt-2.5 line-clamp-2 min-h-[2.5rem] text-[13px] leading-relaxed text-[var(--text-secondary)]">
                      {menu.description || '최상급 원두로 준비한 프리미엄 음료입니다.'}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-[15px] font-semibold text-[var(--text)]">
                        {menu.price.toLocaleString()}
                        <span className="ml-0.5 text-xs font-normal text-[var(--text-muted)]">원</span>
                      </span>

                      <span
                        className={`grid h-9 w-9 place-items-center rounded-full transition-colors ${
                          !menu.is_available
                            ? 'bg-[var(--surface-overlay)] text-[var(--text-muted)]'
                            : added
                              ? 'bg-[var(--ok)] text-[var(--accent-ink)]'
                              : 'bg-[var(--surface-overlay)] text-[var(--text-secondary)] group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-ink)]'
                        }`}
                      >
                        {added ? (
                          <Check className="h-4 w-4" strokeWidth={2.5} />
                        ) : (
                          <Plus className="h-4 w-4" strokeWidth={2.5} />
                        )}
                      </span>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export function MenuGridSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="메뉴 불러오는 중">
      <div className="flex gap-1.5">
        {[64, 88, 96, 120, 104].map((w, i) => (
          <div
            key={i}
            className="h-9 animate-pulse rounded-full bg-[var(--surface-raised)]"
            style={{ width: w }}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-[168px] animate-pulse rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]"
            style={{ animationDelay: `${i * 70}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
