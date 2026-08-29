'use client';

import { useState, useEffect, useCallback } from 'react';
import { MenuItem, Order, OrderItem, WSEvent } from '@/types';
import { fetchMenus, createOrder, fetchOrder } from '@/lib/api';
import { getStoredOrderId, setStoredOrderId, clearStoredOrderId } from '@/lib/orderStorage';
import { useCart } from '@/hooks/useCart';
import { useWebSocket } from '@/hooks/useWebSocket';
import { MenuGrid, MenuGridSkeleton } from '@/components/customer/MenuGrid';
import { CartDrawer } from '@/components/customer/CartDrawer';
import { OrderStatusPanel } from '@/components/customer/OrderStatusPanel';
import { PageHeader, LiveBadge } from '@/components/PageHeader';
import { Sparkles } from 'lucide-react';

export default function CustomerPage() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuError, setMenuError] = useState<string | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cart = useCart();

  // Load initial menus
  const loadMenus = async () => {
    try {
      setLoading(true);
      const data = await fetchMenus();
      setMenus(data);
      setMenuError(null);
    } catch (e) {
      console.error('Failed to load menus', e);
      setMenuError('메뉴를 불러오지 못했습니다. 서버 연결을 확인해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenus();
  }, []);

  // Restore an in-flight order after refresh/reopen — device-remembers, no accounts
  useEffect(() => {
    const id = getStoredOrderId();
    if (!id) return;
    (async () => {
      try {
        const order = await fetchOrder(id);
        setActiveOrder(order);
      } catch {
        clearStoredOrderId();
      }
    })();
  }, []);

  // WebSocket listener for customer channel
  const handleWSEvent = useCallback((event: WSEvent) => {
    if (activeOrder && (event.order_id === activeOrder.id || event.order_number === activeOrder.order_number)) {
      if (event.event === 'order.preparing' || event.event === 'order.completed' || event.event === 'order.cancelled') {
        setActiveOrder((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            status: event.status || (event.event.replace('order.', '') as any),
            updated_at: new Date().toISOString(),
          };
        });
      }
    }

    if (event.event === 'menu.updated') {
      loadMenus();
    }
  }, [activeOrder]);

  const { isConnected } = useWebSocket('customer', handleWSEvent);

  // Submit Order handler
  const handleSubmitOrder = async () => {
    if (cart.items.length === 0) return;
    try {
      setIsSubmitting(true);
      const orderItems: OrderItem[] = cart.items.map((item) => ({
        menu_id: item.menu.id,
        name: item.menu.name,
        quantity: item.quantity,
        unit_price: item.menu.price,
      }));

      const newOrder = await createOrder(orderItems);
      setActiveOrder(newOrder);
      setStoredOrderId(newOrder.id);
      cart.clearCart();
    } catch (e) {
      console.error('Failed to submit order', e);
      const errorMsg = e instanceof Error ? e.message : '알 수 없는 오류';
      if (errorMsg.includes('Network') || errorMsg.includes('0:')) {
        alert('네트워크 연결을 확인해 주세요.');
      } else if (errorMsg.includes('API 5')) {
        alert('서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      } else {
        alert(`주문 생성 중 오류가 발생했습니다.\n${errorMsg}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetOrder = () => {
    setActiveOrder(null);
    clearStoredOrderId();
  };

  return (
    <div className="space-y-8 pb-24 lg:pb-0">
      <PageHeader
        eyebrow="스마트 테이블 셀프 오더"
        eyebrowIcon={<Sparkles className="h-3.5 w-3.5" />}
        title="원하시는 음료를 선택해 주세요"
        description="갓 로스팅한 원두로 제조하는 실시간 주문 서비스입니다."
      >
        <LiveBadge isConnected={isConnected} />
      </PageHeader>

      {activeOrder ? (
        <div className="mx-auto max-w-lg">
          <OrderStatusPanel order={activeOrder} onResetOrder={handleResetOrder} />
        </div>
      ) : (
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_20rem]">
          <div>
            {menuError ? (
              <div className="rounded-[var(--radius-lg)] border border-[var(--danger)] bg-[var(--danger-soft)] p-6 text-center text-sm text-[var(--danger)]">
                {menuError}
                <button onClick={loadMenus} className="ml-2 underline underline-offset-2">
                  다시 시도
                </button>
              </div>
            ) : loading ? (
              <MenuGridSkeleton />
            ) : (
              <MenuGrid menus={menus} onAddToCart={cart.addItem} />
            )}
          </div>

          <div className="lg:sticky lg:top-20">
            <CartDrawer
              items={cart.items}
              totalAmount={cart.totalAmount}
              totalCount={cart.totalCount}
              onUpdateQuantity={cart.updateQuantity}
              onRemoveItem={cart.removeItem}
              onSubmitOrder={handleSubmitOrder}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}
    </div>
  );
}
