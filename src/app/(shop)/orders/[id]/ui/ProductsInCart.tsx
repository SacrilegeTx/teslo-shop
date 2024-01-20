import type { OrderItem } from '@prisma/client';
import type { Product } from '@/interfaces';

import { titleFont } from '@/config/font';
import { currencyFormat } from '@/utils';
import { ProductImageCard } from '@/components';

interface ProductProps {
  items: (OrderItem & { product: Product })[];
}

export function ProductsInCart({ items }: ProductProps) {
  return (
    <div>
      {items.map((item) => (
        <div key={item.product.slug + '-' + item.size} className="flex flex-row justify-between">
          <div className="flex flex-row py-3">
            <ProductImageCard
              alt={item.product.title}
              className="w-22 h-22 mr-5 rounded"
              height={90}
              src={item.product.images[0]}
              width={90}
            />
            <div className="flex flex-col">
              <span className={`${titleFont.className} mb-2 text-sm antialiased`}>
                {item.product.title} [{item.size}]
              </span>
              <span className="mb-2 text-sm">
                {currencyFormat(item.product.price)} x {item.quantity}
              </span>
              <span className="mb-2 text-sm font-semibold">
                Subtotal: {currencyFormat(item.product.price * item.quantity)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
