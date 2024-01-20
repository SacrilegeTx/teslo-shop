import { getOrderById } from '@/actions';
import { PaypalButton, Title } from '@/components';

import { AddressUser } from './ui/AddressUser';
import { PaidOrder } from './ui/PaidOrder';
import { OrderSummary } from './ui/OrderSummary';
import { ProductsInCart } from './ui/ProductsInCart';

interface OrderProps {
  params: {
    id: string;
  };
}

export default async function OrderPage({ params }: OrderProps) {
  const { id } = params;
  const { order, items, address } = await getOrderById(id);

  return (
    <div className="mb-72 flex items-center justify-center px-10 sm:px-0">
      <div className="flex w-[1000px] flex-col">
        <Title title={`Orden #${id.split('-').at(-1)}`} />
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          <div className="mt-5 flex flex-col">
            <PaidOrder isPaid={order!.isPaid} />

            {/* Cart items */}
            <ProductsInCart items={items} />
          </div>
          {/* Checkout - Resumen de la compra y totales */}
          <div className="flex flex-col justify-center rounded-xl p-7">
            <AddressUser address={address!} />
            <OrderSummary order={order!} />
            <div className="mb-2 mt-5 w-full">
              {/* <PaidOrder isPaid={order!.isPaid} /> */}
              {!order!.isPaid ? (
                <PaypalButton amount={order!.total} orderId={order!.id} />
              ) : (
                <PaidOrder isPaid={order!.isPaid} />
              )}
              {/* <PaypalButton amount={order!.total} orderId={order!.id} /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
