'use client';

import { useState } from 'react';
import { WebhookLog, WSEvent } from '@/types';
import { Terminal, RefreshCw, ChevronRight, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EventStreamProps {
  logs: (WebhookLog | WSEvent)[];
  onClear: () => void;
  onRefresh: () => void;
}

const FILTERS = [
  'all',
  'order.created',
  'order.preparing',
  'order.completed',
  'order.cancelled',
  'menu.updated',
] as const;

const EVENT_COLOR: Record<string, string> = {
  'order.created': 'var(--accent)',
  'order.preparing': 'var(--info)',
  'order.completed': 'var(--ok)',
  'order.cancelled': 'var(--danger)',
  'menu.updated': 'var(--violet)',
};

const colorFor = (event: string) => EVENT_COLOR[event] ?? 'var(--text-secondary)';

export function EventStream({ logs, onClear, onRefresh }: EventStreamProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const filteredLogs =
    selectedFilter === 'all'
      ? logs
      : logs.filter((log) =>
          'event' in log ? log.event === selectedFilter : log.event_type === selectedFilter,
        );

  return (
    <div className="w-full space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="scrollbar-none flex items-center gap-1.5 overflow-x-auto">
          {FILTERS.map((f) => {
            const isActive = selectedFilter === f;
            return (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 font-mono text-[11px] transition-colors ${
                  isActive
                    ? 'bg-[var(--surface-overlay)] text-[var(--text)]'
                    : 'text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text-secondary)]'
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onRefresh}
            aria-label="새로고침"
            className="grid h-8 w-8 place-items-center rounded-full text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-overlay)] hover:text-[var(--text)]"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]"
          >
            <Trash2 className="h-3.5 w-3.5" />
            비우기
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="scrollbar-thin max-h-[34rem] overflow-y-auto rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
        {filteredLogs.length === 0 ? (
          <div className="py-20 text-center">
            <Terminal className="mx-auto h-7 w-7 text-[var(--text-muted)] opacity-40" />
            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              수신된 이벤트가 없습니다
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              주문이 발생하면 여기에 실시간으로 표시됩니다.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {filteredLogs.map((item, idx) => {
              const eventName = 'event' in item ? item.event : item.event_type;
              // Legacy rows can carry a null created_at; don't render "Invalid Date".
              const timestamp =
                ('created_at' in item ? item.created_at : null) ?? new Date().toISOString();
              const latency =
                'latency_ms' in item && item.latency_ms != null ? item.latency_ms : undefined;
              // Live WS events and DB rows both carry small `id` values that
              // collide; prefix by source so React never reuses the wrong row.
              const key = 'event' in item ? `live-${idx}-${eventName}` : `db-${item.id}`;
              const isExpanded = expandedKey === key;
              const color = colorFor(eventName);

              return (
                <li key={key}>
                  <button
                    onClick={() => setExpandedKey(isExpanded ? null : key)}
                    aria-expanded={isExpanded}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--surface-raised)]"
                  >
                    <ChevronRight
                      className={`h-3.5 w-3.5 shrink-0 text-[var(--text-muted)] transition-transform ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                    />

                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: color }}
                    />

                    <span
                      className="min-w-0 shrink-0 truncate font-mono text-[12px] font-medium"
                      style={{ color }}
                    >
                      {eventName}
                    </span>

                    <span className="ml-auto flex shrink-0 items-center gap-2.5">
                      {latency !== undefined && (
                        <span className="font-mono text-[11px] tabular-nums text-[var(--text-muted)]">
                          {latency.toFixed(1)}ms
                        </span>
                      )}
                      <time
                        dateTime={timestamp}
                        className="font-mono text-[11px] tabular-nums text-[var(--text-muted)]"
                      >
                        {new Date(timestamp).toLocaleTimeString('ko-KR', {
                          hour12: false,
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </time>
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="overflow-hidden"
                      >
                        <pre className="scrollbar-thin mx-4 mb-3 overflow-x-auto rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg)] p-3 font-mono text-[11px] leading-relaxed text-[var(--text-secondary)]">
                          {JSON.stringify(item, null, 2)}
                        </pre>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
