'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import { ProductImageCard, QuantitySelector } from '@/components';
import { titleFont } from '@/config/font';
import { useCartStore } from '@/store';

import { LoadingProductsInCart } from './LoadingProductsInCart';

export function ProductsInCart() {
  const [loaded, setLoaded] = useState(false);

  const products = useCartStore((state) => state.cart);
  const updateProduct = useCartStore((state) => state.updateProductInCart);
  const removeProduct = useCartStore((state) => state.removeProductFromCart);

  useEffect(() => {
    setLoaded(true);
  }, []);

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
              <Link
                className={`${titleFont.className} cursor-pointer text-sm antialiased hover:underline`}
                href={`/product/${item.slug}`}
              >
                {item.title} [<span className="text-sm">{item.size}</span>]
              </Link>
              <span className="text-sm">${item.price}</span>
              <QuantitySelector
                quantity={item.quantity}
                onQuantityChanged={(value) => {
                  updateProduct(item, value);
                }}
              />
              <button
                className="my-5 text-sm underline"
                type="button"
                onClick={() => {
                  removeProduct(item);
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
