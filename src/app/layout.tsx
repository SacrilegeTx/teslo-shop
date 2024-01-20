import type { Metadata } from 'next';

import React, { type ReactElement, type ReactNode } from 'react';

import './globals.css';
import { onest } from '@/config/font';
import { Providers } from '@/components';

export const metadata: Metadata = {
  title: {
    template: '%s - Teslo | Shop Ecommerce',
    default: 'Home - Teslo | Shop Ecommerce',
  },
  description: 'Una tienda virtual de productos',
};

interface RootProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootProps): ReactElement {
  return (
    <html lang="en">
      <body className={onest.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
