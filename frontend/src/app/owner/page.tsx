'use client';

import { useState, useEffect, useCallback } from 'react';
import { MenuItem, Order, OrderStatus, WSEvent } from '@/types';
import {
  fetchOrders,
  updateOrderStatus,
  fetchMenus,
  createMenu,
  updateMenu,
  deleteMenu,
  toggleMenuAvailability,
} from '@/lib/api';
import { useWebSocket } from '@/hooks/useWebSocket';
import { playNewOrderSound } from '@/lib/audio';
import { OrderCard } from '@/components/owner/OrderCard';
import { MenuManager } from '@/components/owner/MenuManager';
import { PageHeader, LiveBadge } from '@/components/PageHeader';
import { Store, Coffee, Settings, RefreshCw, AlertTriangle } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export default function OwnerPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'menus'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataStale, setDataStale] = useState(false);

  // Load orders & menus
  const loadData = async () => {
    try {
      setLoading(true);
      const [fetchedOrders, fetchedMenus] = await Promise.all([
        fetchOrders(),
        fetchMenus(),
      ]);
      setOrders(fetchedOrders);
      setMenus(fetchedMenus);
    } catch (e) {
      console.error('Failed to load owner data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle incoming WebSocket events
  const handleWSEvent = useCallback((event: WSEvent) => {
    if (event.event === 'order.created') {
      playNewOrderSound();
      setDataStale(false);
      fetchOrders()
        .then(setOrders)
        .catch(e => {
          console.error('Failed to refresh orders:', e);
          setDataStale(true);
        });
    } else if (event.event.startsWith('order.')) {
      setDataStale(false);
      fetchOrders()
        .then(setOrders)
        .catch(e => {
          console.error('Failed to refresh orders:', e);
          setDataStale(true);
        });
    } else if (event.event === 'menu.updated') {
      setDataStale(false);
      fetchMenus()
        .then(setMenus)
        .catch(e => {
          console.error('Failed to refresh menus:', e);
          setDataStale(true);
        });
    }
  }, []);

  const { isConnected } = useWebSocket('owner', handleWSEvent);

  // Update order status
  const handleUpdateStatus = async (orderId: number, newStatus: OrderStatus) => {
    try {
      const updated = await updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  // Menu management handlers
  const handleAddMenu = async (menuData: Partial<MenuItem>) => {
    try {
      await createMenu(menuData);
      const updated = await fetchMenus();
      setMenus(updated);
    } catch (e) {
      console.error('Failed to add menu', e);
      alert('메뉴 추가 중 오류가 발생했습니다.');
    }
  };

  const handleUpdateMenu = async (id: number, menuData: Partial<MenuItem>) => {
    try {
      await updateMenu(id, menuData);
      const updated = await fetchMenus();
      setMenus(updated);
    } catch (e) {
      console.error('Failed to update menu', e);
      alert('메뉴 수정 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteMenu = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteMenu(id);
      const updated = await fetchMenus();
      setMenus(updated);
    } catch (e) {
      console.error('Failed to delete menu', e);
      alert('메뉴 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleToggleAvailability = async (id: number) => {
    try {
      await toggleMenuAvailability(id);
      const updated = await fetchMenus();
      setMenus(updated);
    } catch (e) {
      console.error('Failed to toggle availability', e);
      alert('메뉴 상태 변경 중 오류가 발생했습니다.');
    }
  };

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const preparingOrders = orders.filter((o) => o.status === 'preparing');
  const completedOrders = orders.filter((o) => o.status === 'completed' || o.status === 'cancelled');

  const activeCount = pendingOrders.length + preparingOrders.length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="매장 관리자 대시보드"
        eyebrowIcon={<Store className="h-3.5 w-3.5" />}
        title="주문 수신 & 바리스타 스테이션"
        description="신규 주문이 들어오면 소리로 알려드립니다. 제조 상태를 실시간으로 관리하세요."
        accent="info"
      >
        <LiveBadge isConnected={isConnected} />
        <button
          onClick={loadData}
          aria-label="데이터 새로고침"
          className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text)]"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </PageHeader>

      {dataStale && (
        <div
          role="alert"
          className="flex items-center gap-2.5 rounded-[var(--radius)] border border-[var(--danger-line)] bg-[var(--danger-soft)] px-4 py-3 text-[13px] text-[var(--danger)]"
        >
          <AlertTriangle className="h-4 w-4 shrink-0" />
          데이터 갱신에 실패했습니다. 새로고침을 눌러 다시 시도해 주세요.
        </div>
      )}

      {/* Tabs */}
      <div className="flex w-fit items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1">
        <TabButton
          active={activeTab === 'orders'}
          onClick={() => setActiveTab('orders')}
          icon={<Coffee className="h-4 w-4" />}
          label="주문 접수"
          count={activeCount}
        />
        <TabButton
          active={activeTab === 'menus'}
          onClick={() => setActiveTab('menus')}
          icon={<Settings className="h-4 w-4" />}
          label="메뉴 관리"
          count={menus.length}
        />
      </div>

      {activeTab === 'orders' ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <OrderColumn
            title="신규 주문"
            color="var(--accent)"
            orders={pendingOrders}
            emptyText="대기 중인 신규 주문이 없습니다."
            onUpdateStatus={handleUpdateStatus}
          />
          <OrderColumn
            title="제작 중"
            color="var(--info)"
            orders={preparingOrders}
            emptyText="현재 제작 중인 주문이 없습니다."
            onUpdateStatus={handleUpdateStatus}
          />
          <OrderColumn
            title="완료"
            color="var(--ok)"
            orders={completedOrders.slice(0, 5)}
            totalCount={completedOrders.length}
            emptyText="완료 이력이 없습니다."
            onUpdateStatus={handleUpdateStatus}
          />
        </div>
      ) : (
        <MenuManager
          menus={menus}
          onAddMenu={handleAddMenu}
          onUpdateMenu={handleUpdateMenu}
          onDeleteMenu={handleDeleteMenu}
          onToggleAvailability={handleToggleAvailability}
        />
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
        active
          ? 'bg-[var(--surface-overlay)] text-[var(--text)]'
          : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
      }`}
    >
      {icon}
      {label}
      <span
        className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
          active
            ? 'bg-[var(--accent)] text-[var(--accent-ink)]'
            : 'bg-[var(--surface-overlay)] text-[var(--text-muted)]'
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function OrderColumn({
  title,
  color,
  orders,
  totalCount,
  emptyText,
  onUpdateStatus,
}: {
  title: string;
  color: string;
  orders: Order[];
  totalCount?: number;
  emptyText: string;
  onUpdateStatus: (orderId: number, newStatus: OrderStatus) => void;
}) {
  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-2 px-1 text-[13px] font-semibold text-[var(--text)]">
        <span className="h-2 w-2 rounded-full" style={{ background: color }} />
        {title}
        <span className="text-[var(--text-muted)]">{totalCount ?? orders.length}</span>
      </h2>

      {orders.length === 0 ? (
        <p className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] px-4 py-10 text-center text-xs text-[var(--text-muted)]">
          {emptyText}
        </p>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} onUpdateStatus={onUpdateStatus} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
