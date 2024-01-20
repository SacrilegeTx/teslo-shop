'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { type Product } from '@/interfaces';

interface ProductItemProps {
  product: Product;
}

export function ProductGridItem({ product }: ProductItemProps) {
  const [displayImage, setDisplayImage] = useState(product.images[0]);

  return (
    <div className="fade-in overflow-hidden rounded-md">
      <Link href={`/product/${product.slug}`}>
        <Image
          alt={product.title}
          className="w-full rounded object-cover"
          height={500}
          priority={false}
          src={`/products/${displayImage}`}
          width={500}
          onMouseEnter={() => {
            setDisplayImage(product.images[1]);
          }}
          onMouseLeave={() => {
            setDisplayImage(product.images[0]);
          }}
        />
      </Link>
      <div className="flex flex-col p-4">
        <Link className="hover:text-blue-600" href={`/product/${product.slug}`}>
          {product.title}
        </Link>
        <p className="text-sm text-gray-600">${product.price}</p>
      </div>
    </div>
  );
}
