'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  short: string;
}

export function NavLink({ href, icon, label, short }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={`relative flex items-center gap-2 rounded-[10px] px-3 py-2 text-sm font-medium transition-colors ${
        isActive
          ? 'bg-[var(--surface-overlay)] text-[var(--text)]'
          : 'text-[var(--text-secondary)] hover:bg-[var(--surface-raised)] hover:text-[var(--text)]'
      }`}
    >
      <span className={isActive ? 'opacity-100' : 'opacity-70'}>{icon}</span>
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">{short}</span>
    </Link>
  );
}
