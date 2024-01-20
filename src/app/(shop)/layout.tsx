import { type ReactNode } from 'react';

import { Footer, Sidebar } from '@/components';

import { TopMenu } from '../../components/ui/top-menu/TopMenu';

interface ShopLayoutProps {
  children: ReactNode;
}

export default function ShopLayout({ children }: ShopLayoutProps) {
  return (
    <main className="min-h-screen">
      <TopMenu />
      <Sidebar />
      <div className="px-0 sm:px-10">{children}</div>
      <Footer />
    </main>
  );
}
