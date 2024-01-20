'use client';
import React, { useEffect, useState } from 'react';

import { getStockProductBySlug } from '@/actions';
import { titleFont } from '@/config/font';

interface StockProps {
  slug: string;
}

export function StockLabel({ slug }: StockProps) {
  const [stockProduct, setStockProduct] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getStock = async (): Promise<void> => {
      const inStock = await getStockProductBySlug(slug);

      setStockProduct(inStock);
      setIsLoading(false);
    };

    void getStock();
  }, [slug]);

  return (
    <div>
      {isLoading ? (
        <h1
          className={`${titleFont.className} animate-pulse bg-gray-200 text-lg font-bold antialiased`}
        >
          &nbsp;
        </h1>
      ) : (
        <h1 className={`${titleFont.className} text-lg font-bold antialiased`}>
          Stock: {stockProduct}
        </h1>
      )}
    </div>
  );
}
