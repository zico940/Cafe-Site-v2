'use client';

import { useState, useEffect } from 'react';
import { MenuItem } from '@/types';
import { CATEGORIES } from '@/lib/constants';
import { Plus, Pencil, Trash2, X, Power } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuManagerProps {
  menus: MenuItem[];
  onAddMenu: (menu: Partial<MenuItem>) => void;
  onUpdateMenu: (id: number, menu: Partial<MenuItem>) => void;
  onDeleteMenu: (id: number) => void;
  onToggleAvailability: (id: number) => void;
}

const EMPTY_FORM = {
  name: '',
  name_en: '',
  price: 4000,
  category: 'espresso' as MenuItem['category'],
  description: '',
};

const inputClass =
  'w-full rounded-[var(--radius)] border border-[var(--border-strong)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] transition-colors focus:border-[var(--accent)] focus:outline-none';

const labelClass = 'mb-1.5 block text-xs font-medium text-[var(--text-secondary)]';

export function MenuManager({
  menus,
  onAddMenu,
  onUpdateMenu,
  onDeleteMenu,
  onToggleAvailability,
}: MenuManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  // Escape to close + no background scroll behind the modal
  useEffect(() => {
    if (!isModalOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsModalOpen(false);
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [isModalOpen]);

  const handleOpenAddModal = () => {
    setEditingMenu(null);
    setFormData(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (menu: MenuItem) => {
    setEditingMenu(menu);
    setFormData({
      name: menu.name,
      name_en: menu.name_en,
      price: menu.price,
      category: menu.category,
      description: menu.description || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMenu) onUpdateMenu(editingMenu.id, formData);
    else onAddMenu(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="w-full space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--text)]">메뉴 관리</h2>
          <p className="mt-0.5 text-[13px] text-[var(--text-secondary)]">
            메뉴 {menus.length}개 · 품절{' '}
            {menus.filter((m) => !m.is_available).length}개
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--accent)] px-4 py-2.5 text-[13px] font-semibold text-[var(--accent-ink)] transition-all hover:bg-[var(--accent-hover)] active:scale-95"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          신규 메뉴
        </button>
      </div>

      {menus.length === 0 ? (
        <p className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] py-16 text-center text-sm text-[var(--text-muted)]">
          등록된 메뉴가 없습니다. 신규 메뉴를 추가해 주세요.
        </p>
      ) : (
        <ul className="divide-y divide-[var(--border)] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
          {menus.map((menu) => (
            <li
              key={menu.id}
              className={`flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-[var(--surface-raised)] ${
                menu.is_available ? '' : 'opacity-55'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-semibold text-[var(--text)]">{menu.name}</h3>
                  {!menu.is_available && (
                    <span className="shrink-0 rounded-full bg-[var(--danger-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--danger)]">
                      품절
                    </span>
                  )}
                </div>
                <p className="mt-0.5 truncate text-xs text-[var(--text-muted)]">
                  {menu.name_en}
                  {menu.description ? ` · ${menu.description}` : ''}
                </p>
              </div>

              <span className="shrink-0 text-sm font-semibold text-[var(--text)]">
                {menu.price.toLocaleString()}원
              </span>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => onToggleAvailability(menu.id)}
                  aria-label={menu.is_available ? `${menu.name} 품절 처리` : `${menu.name} 판매 재개`}
                  title={menu.is_available ? '품절로 변경' : '판매 가능으로 변경'}
                  className="grid h-8 w-8 place-items-center rounded-full transition-colors"
                  style={{
                    color: menu.is_available ? 'var(--ok)' : 'var(--text-muted)',
                    background: menu.is_available ? 'var(--ok-soft)' : 'var(--surface-overlay)',
                  }}
                >
                  <Power className="h-3.5 w-3.5" strokeWidth={2.5} />
                </button>

                <button
                  onClick={() => handleOpenEditModal(menu)}
                  aria-label={`${menu.name} 수정`}
                  className="grid h-8 w-8 place-items-center rounded-full text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-overlay)] hover:text-[var(--text)]"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>

                <button
                  onClick={() => onDeleteMenu(menu.id)}
                  aria-label={`${menu.name} 삭제`}
                  className="grid h-8 w-8 place-items-center rounded-full text-[var(--text-muted)] transition-colors hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/65 p-0 backdrop-blur-sm sm:items-center sm:p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={editingMenu ? '메뉴 정보 수정' : '신규 메뉴 추가'}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-t-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--surface)] shadow-[var(--shadow-lg)] sm:rounded-[var(--radius-lg)]"
            >
              <header className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
                <h3 className="text-base font-semibold text-[var(--text)]">
                  {editingMenu ? '메뉴 정보 수정' : '신규 메뉴 추가'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  aria-label="닫기"
                  className="grid h-8 w-8 place-items-center rounded-full text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-overlay)] hover:text-[var(--text)]"
                >
                  <X className="h-4 w-4" />
                </button>
              </header>

              <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
                <div>
                  <label htmlFor="menu-name" className={labelClass}>
                    메뉴 이름 (한글)
                  </label>
                  <input
                    id="menu-name"
                    type="text"
                    required
                    autoFocus
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputClass}
                    placeholder="예: 바닐라 라떼"
                  />
                </div>

                <div>
                  <label htmlFor="menu-name-en" className={labelClass}>
                    메뉴 이름 (영문)
                  </label>
                  <input
                    id="menu-name-en"
                    type="text"
                    required
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    className={inputClass}
                    placeholder="예: Vanilla Latte"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="menu-price" className={labelClass}>
                      가격 (원)
                    </label>
                    <input
                      id="menu-price"
                      type="number"
                      required
                      min={0}
                      step={100}
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: parseInt(e.target.value) || 0 })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="menu-category" className={labelClass}>
                      카테고리
                    </label>
                    <select
                      id="menu-category"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value as MenuItem['category'],
                        })
                      }
                      className={inputClass}
                    >
                      {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="menu-desc" className={labelClass}>
                    메뉴 설명
                  </label>
                  <textarea
                    id="menu-desc"
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`${inputClass} resize-none`}
                    placeholder="음료의 맛과 특징을 간단히 설명해 주세요"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-full px-4 py-2.5 text-[13px] font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-overlay)] hover:text-[var(--text)]"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-[13px] font-semibold text-[var(--accent-ink)] transition-all hover:bg-[var(--accent-hover)] active:scale-95"
                  >
                    {editingMenu ? '수정 저장' : '등록하기'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
