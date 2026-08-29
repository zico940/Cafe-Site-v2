import type { Metadata } from 'next';
import { Inter, IBM_Plex_Sans_KR } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { Coffee, Store, Code } from 'lucide-react';
import { NavLink } from '@/components/NavLink';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-latin',
  display: 'swap',
});

// Inter ships no Hangul glyphs — without a Korean face the entire UI
// falls back to an unstyled system font for most of its text.
const plexKr = IBM_Plex_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-kr',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AURA Cafe | 스마트 카페 주문 및 관리 시스템',
  description: '실시간 주문 추적, 바리스타 제어 및 Webhook 모니터링 카페 주문 시스템',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${inter.variable} ${plexKr.variable}`}>
      <body
        className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--text)] antialiased selection:bg-[var(--accent)] selection:text-[var(--accent-ink)]"
        style={{ fontFamily: 'var(--font-latin), var(--font-kr), system-ui, sans-serif' }}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--accent-ink)]"
        >
          본문으로 건너뛰기
        </a>

        <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
            <Link href="/customer" className="group flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-[var(--accent)] text-[var(--accent-ink)] transition-transform group-hover:-rotate-6">
                <Coffee className="h-[18px] w-[18px]" strokeWidth={2.5} />
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-[15px] font-semibold tracking-tight text-[var(--text)]">
                  AURA Cafe
                </span>
                <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  Real-time Order
                </span>
              </span>
            </Link>

            <nav aria-label="주요 메뉴" className="flex items-center gap-1">
              <NavLink
                href="/customer"
                icon={<Coffee className="h-4 w-4" />}
                label="고객 주문"
                short="주문"
              />
              <NavLink
                href="/owner"
                icon={<Store className="h-4 w-4" />}
                label="사장님"
                short="매장"
              />
              <NavLink
                href="/dev-logs"
                icon={<Code className="h-4 w-4" />}
                label="개발자 로그"
                short="로그"
              />
            </nav>
          </div>
        </header>

        <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
          {children}
        </main>

        <footer className="border-t border-[var(--border)] px-4 py-6">
          <p className="mx-auto max-w-6xl text-xs text-[var(--text-muted)]">
            © 2026 AURA Cafe System · FastAPI &amp; Next.js
          </p>
        </footer>
      </body>
    </html>
  );
}
