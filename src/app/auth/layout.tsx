import { redirect } from 'next/navigation';
import { type ReactNode } from 'react';

import { auth } from '@/auth.config';

interface ShopLayoutProps {
  children: ReactNode;
}

export default async function ShopLayout({ children }: ShopLayoutProps) {
  const session = await auth();

  if (session?.user) redirect('/');

  return (
    <main className="flex justify-center">
      <div className="w-full px-10 sm:w-[350px]">{children}</div>
    </main>
  );
}
