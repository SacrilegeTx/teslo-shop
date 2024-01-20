import Link from 'next/link';

import { Title } from '@/components';

// import { redirect } from 'next/navigation'
import { ProductsInCart } from './ui/ProductsInCart';
import { OrderSummary } from './ui/OrderSummary';

export default function CartPage() {
  // redirect('/empty')
  return (
    <div className="mb-72 flex items-center justify-center px-10 sm:px-0">
      <div className="flex w-[1000px] flex-col">
        <Title title="Carrito" />
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          <div className="mt-5 flex flex-col">
            <span className="text-xl">Agregar más items</span>
            <Link className="mb-5 underline" href="/">
              Volver a la tienda
            </Link>

            {/* Cart items */}
            <ProductsInCart />
          </div>
          {/* Checkout - Resumen de la compra y totales */}
          <div className="flex h-fit flex-col rounded-xl p-7">
            <h2 className="mb-2 text-2xl">Resumen de tu Compra</h2>
            <OrderSummary />
            <Link
              className="mt-5 w-full rounded-md bg-gray-800 px-5 py-2 text-center text-white hover:bg-indigo-600"
              href="/checkout/address/"
            >
              Proceder al pago
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
