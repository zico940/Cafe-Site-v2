'use client';

import { useState, useEffect, useCallback } from 'react';
import { WebhookLog, WSEvent } from '@/types';
import { fetchLogs, fetchStats } from '@/lib/api';
import { useWebSocket } from '@/hooks/useWebSocket';
import { ConnectionStatus } from '@/components/dev-logs/ConnectionStatus';
import { EventStream } from '@/components/dev-logs/EventStream';
import { PageHeader, LiveBadge } from '@/components/PageHeader';
import { Terminal, Code, RefreshCw } from 'lucide-react';

export default function DevLogsPage() {
  const [dbLogs, setDbLogs] = useState<WebhookLog[]>([]);
  const [liveEvents, setLiveEvents] = useState<WSEvent[]>([]);
  const [stats, setStats] = useState<{ event_counts: Record<string, number>; connections: Record<string, number> }>({
    event_counts: {},
    connections: { customer: 0, owner: 0, dev: 0 },
  });
  const [loading, setLoading] = useState(true);

  const loadLogsAndStats = async () => {
    try {
      setLoading(true);
      const [fetchedLogs, fetchedStats] = await Promise.all([
        fetchLogs(),
        fetchStats(),
      ]);
      setDbLogs(fetchedLogs);
      setStats(fetchedStats);
    } catch (e) {
      console.error('Failed to fetch dev logs', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogsAndStats();
  }, []);

  // Handle incoming WebSocket events from dev channel
  const handleWSEvent = useCallback((event: WSEvent) => {
    setLiveEvents((prev) => [event, ...prev.slice(0, 49)]); // Keep last 50 live events
    fetchStats().then(setStats).catch(e => console.error('Failed to update stats:', e));
  }, []);

  const { isConnected } = useWebSocket('dev', handleWSEvent);

  const handleClearLogs = () => {
    setLiveEvents([]);
    setDbLogs([]);
  };

  const combinedLogs = [...liveEvents, ...dbLogs];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Webhook & WebSocket 관제"
        eyebrowIcon={<Code className="h-3.5 w-3.5" />}
        title="개발자 이벤트 모니터링"
        description="EventBus 핸들러, WebSocket 브로드캐스트 패킷과 처리 레이턴시를 확인합니다."
        accent="violet"
      >
        <LiveBadge isConnected={isConnected} />
        <button
          onClick={loadLogsAndStats}
          aria-label="새로고침"
          className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text)]"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </PageHeader>

      <ConnectionStatus connections={stats.connections} isConnected={isConnected} />

      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--text)]">
            <Terminal className="h-4 w-4 text-[var(--violet)]" />
            이벤트 스트림
          </h2>
          <span className="text-xs tabular-nums text-[var(--text-muted)]">
            {combinedLogs.length}건 수신
          </span>
        </div>

        {loading ? (
          <div className="space-y-2" aria-busy="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-11 animate-pulse rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)]"
                style={{ animationDelay: `${i * 70}ms` }}
              />
            ))}
          </div>
        ) : (
          <EventStream logs={combinedLogs} onClear={handleClearLogs} onRefresh={loadLogsAndStats} />
        )}
      </section>
    </div>
  );
}
