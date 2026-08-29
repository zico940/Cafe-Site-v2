interface PageHeaderProps {
  eyebrow: string;
  eyebrowIcon: React.ReactNode;
  title: string;
  description: string;
  accent?: 'accent' | 'info' | 'violet';
  children?: React.ReactNode;
}

const accentVar = {
  accent: 'var(--accent)',
  info: 'var(--info)',
  violet: 'var(--violet)',
} as const;

export function PageHeader({
  eyebrow,
  eyebrowIcon,
  title,
  description,
  accent = 'accent',
  children,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-5 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p
          className="flex items-center gap-1.5 text-xs font-semibold tracking-wide"
          style={{ color: accentVar[accent] }}
        >
          {eyebrowIcon}
          {eyebrow}
        </p>
        {/* Semibold, not black: weight is reserved for numbers that matter */}
        <h1 className="mt-2 text-[26px] font-semibold leading-tight tracking-[-0.02em] text-[var(--text)] sm:text-[30px]">
          {title}
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
          {description}
        </p>
      </div>

      {children && <div className="flex shrink-0 items-center gap-2">{children}</div>}
    </header>
  );
}

export function LiveBadge({ isConnected }: { isConnected: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)]"
      role="status"
    >
      <span className="relative grid h-2 w-2 place-items-center">
        {isConnected && (
          <span className="absolute h-2 w-2 animate-ping rounded-full bg-[var(--ok)] opacity-60" />
        )}
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: isConnected ? 'var(--ok)' : 'var(--danger)' }}
        />
      </span>
      {isConnected ? '실시간 연결됨' : '연결 끊김'}
    </span>
  );
}
