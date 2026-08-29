'use client';

import { Activity, Users, Store, Code } from 'lucide-react';

interface ConnectionStatusProps {
  connections: Record<string, number>;
  isConnected: boolean;
}

function StatCard({
  icon,
  label,
  value,
  unit,
  color,
  soft,
  pulse,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  color: string;
  soft: string;
  pulse?: boolean;
}) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
      <div className="flex items-center gap-2">
        <span
          className="grid h-7 w-7 place-items-center rounded-full"
          style={{ background: soft, color }}
        >
          {icon}
        </span>
        <span className="text-xs font-medium text-[var(--text-secondary)]">{label}</span>
      </div>

      <p className="mt-3 flex items-baseline gap-1">
        <span
          className="text-2xl font-semibold tracking-tight tabular-nums"
          style={{ color: pulse ? color : 'var(--text)' }}
        >
          {value}
        </span>
        {unit && <span className="text-xs text-[var(--text-muted)]">{unit}</span>}
      </p>
    </div>
  );
}

export function ConnectionStatus({ connections, isConnected }: ConnectionStatusProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatCard
        icon={<Activity className="h-3.5 w-3.5" />}
        label="WS 연결 상태"
        value={isConnected ? 'Online' : 'Offline'}
        color={isConnected ? 'var(--ok)' : 'var(--danger)'}
        soft={isConnected ? 'var(--ok-soft)' : 'var(--danger-soft)'}
        pulse
      />
      <StatCard
        icon={<Users className="h-3.5 w-3.5" />}
        label="고객 접속자"
        value={connections['customer'] || 0}
        unit="명"
        color="var(--accent)"
        soft="var(--accent-soft)"
      />
      <StatCard
        icon={<Store className="h-3.5 w-3.5" />}
        label="업소 관리자"
        value={connections['owner'] || 0}
        unit="세션"
        color="var(--info)"
        soft="var(--info-soft)"
      />
      <StatCard
        icon={<Code className="h-3.5 w-3.5" />}
        label="개발자 모니터"
        value={connections['dev'] || 0}
        unit="세션"
        color="var(--violet)"
        soft="var(--violet-soft)"
      />
    </div>
  );
}
