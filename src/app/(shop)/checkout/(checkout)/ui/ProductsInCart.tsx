'use client';
import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';

import { titleFont } from '@/config/font';
import { useCartStore } from '@/store';
import { currencyFormat } from '@/utils';
import { ProductImageCard } from '@/components';

import { LoadingProductsInCart } from './LoadingProductsInCart';

export function ProductsInCart() {
  const [loaded, setLoaded] = useState(false);

  const { totalItems } = useCartStore((state) => state.getSummaryInformation());

  const products = useCartStore((state) => state.cart);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (totalItems === 0) {
    redirect('/empty');
  }

  // If not loaded return skeleton with image
  if (!loaded) {
    return <LoadingProductsInCart />;
  }

  return (
    <div>
      {products.map((item) => (
        <div key={`${item.slug}-${item.size}`} className="flex flex-row justify-between">
          <div className="flex flex-row py-5">
            <ProductImageCard
              alt={item.title}
              className="w-22 h-22 mr-5 rounded"
              height={150}
              src={item.image}
              width={150}
            />
            <div className="flex flex-col">
              <span className={`${titleFont.className} mb-2 text-sm antialiased`}>
                {item.title} [<span className="text-sm">{item.size}</span>]
              </span>
              <span className="mb-2 text-sm">Cantidad: {item.quantity}</span>
              <span className="mb-2 text-sm font-bold">
                {currencyFormat(item.price * item.quantity)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
