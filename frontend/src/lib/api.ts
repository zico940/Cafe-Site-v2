import { API_BASE_URL } from './constants';
import { MenuItem, Order, OrderItem, WebhookLog } from '@/types';

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public isNetworkError: boolean = false,
    public isParseError: boolean = false,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      const detail = await res.text().catch(() => res.statusText);
      throw new ApiError(res.status, `API ${res.status}: ${detail}`);
    }

    try {
      return await res.json();
    } catch (e) {
      throw new ApiError(res.status, 'Invalid JSON response', false, true);
    }
  } catch (e) {
    if (e instanceof ApiError) throw e;
    throw new ApiError(0, e instanceof Error ? e.message : 'Network error', true);
  }
}

export async function fetchMenus(): Promise<MenuItem[]> {
  return fetchJson(`${API_BASE_URL}/api/menus`);
}

export async function createMenu(data: Partial<MenuItem>): Promise<MenuItem> {
  return fetchJson(`${API_BASE_URL}/api/menus`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function updateMenu(id: number, data: Partial<MenuItem>): Promise<MenuItem> {
  return fetchJson(`${API_BASE_URL}/api/menus/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function deleteMenu(id: number): Promise<{ ok: boolean }> {
  return fetchJson(`${API_BASE_URL}/api/menus/${id}`, {
    method: 'DELETE',
  });
}

export async function toggleMenuAvailability(id: number): Promise<MenuItem> {
  return fetchJson(`${API_BASE_URL}/api/menus/${id}/availability`, {
    method: 'PATCH',
  });
}

export async function createOrder(items: OrderItem[]): Promise<Order> {
  return fetchJson(`${API_BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });
}

export async function fetchOrders(status?: string): Promise<Order[]> {
  const url = status ? `${API_BASE_URL}/api/orders?status=${status}` : `${API_BASE_URL}/api/orders`;
  return fetchJson(url);
}

export async function fetchOrder(id: number): Promise<Order> {
  return fetchJson(`${API_BASE_URL}/api/orders/${id}`);
}

export async function updateOrderStatus(orderId: number, status: string): Promise<Order> {
  return fetchJson(`${API_BASE_URL}/api/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
}

export async function fetchLogs(eventType?: string): Promise<WebhookLog[]> {
  const url = eventType ? `${API_BASE_URL}/api/logs?event_type=${eventType}` : `${API_BASE_URL}/api/logs`;
  return fetchJson(url);
}

export async function fetchStats(): Promise<{ event_counts: Record<string, number>; connections: Record<string, number> }> {
  return fetchJson(`${API_BASE_URL}/api/logs/stats`);
}
