const KEY = 'activeOrderId';

export function getStoredOrderId(): number | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? Number(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredOrderId(id: number): void {
  try {
    localStorage.setItem(KEY, String(id));
  } catch {
    // private browsing / quota exceeded — falls back to in-memory-only behavior
  }
}

export function clearStoredOrderId(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
