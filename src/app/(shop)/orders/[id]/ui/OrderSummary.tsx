import type { Order } from '@prisma/client';

import { currencyFormat } from '@/utils';

interface OrdersProps {
  order: Order;
}

export function OrderSummary({ order }: OrdersProps) {
  return (
    <>
      <h2 className="mb-2 text-2xl">Resumen de tu Compra</h2>
      <div className="my-2 flex flex-row justify-between">
        <span className="text-md">Nro de productos</span>
        <span className="text-md">{order.itemsInOrder}</span>
      </div>
      <div className="my-2 flex flex-row justify-between">
        <span className="text-md">Subtotal</span>
        <span className="text-md">{currencyFormat(order.subtotal)}</span>
      </div>
      <div className="my-2 flex flex-row justify-between">
        <span className="text-md">Impuestos (15%)</span>
        <span className="text-md">{currencyFormat(order.tax)}</span>
      </div>
      <div className="my-5 flex flex-row justify-between">
        <span className="text-xl">Total</span>
        <span className="text-xl">{currencyFormat(order.total)}</span>
      </div>
    </>
  );
}
