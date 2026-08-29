export interface MenuItem {
  id: number;
  name: string;
  name_en: string;
  price: number;
  category: 'espresso' | 'milk_based' | 'sweet' | 'non_coffee';
  description?: string;
  image_url?: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  menu: MenuItem;
  quantity: number;
}

export interface OrderItem {
  menu_id: number;
  name: string;
  quantity: number;
  unit_price: number;
}

export type OrderStatus = 'pending' | 'preparing' | 'completed' | 'cancelled';

export interface Order {
  id: number;
  order_number: number;
  items: OrderItem[];
  total_price: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface WebhookLog {
  id: number;
  event_type: string;
  payload: any;
  // Legacy rows predate these columns and return null.
  direction?: string | null;
  latency_ms?: number | null;
  created_at?: string | null;
}

export interface WSEvent {
  event: string;
  order_id?: number;
  order_number?: number;
  status?: OrderStatus;
  items?: OrderItem[];
  total_price?: number;
  action?: string;
  menu_id?: number;
  [key: string]: any;
}
