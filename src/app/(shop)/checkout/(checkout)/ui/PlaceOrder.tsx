'use client';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';

import { LoadingOrderSummary } from '@/app/(shop)/cart/ui/LoadingOrderSummary';
import { useAddressStore, useCartStore } from '@/store';
import { placeOrder } from '@/actions';
import { currencyFormat } from '@/utils';

export function PlaceOrder() {
  const [loaded, setLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const router = useRouter();

  const address = useAddressStore((state) => state.address);
  const summaryInfo = useCartStore((state) => state.getSummaryInformation());
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const onPlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      const productsToOrder = cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        size: item.size,
      }));

      //! Server Action
      const res = await placeOrder(productsToOrder, address);

      if (!res.ok) {
        setIsPlacingOrder(false);
        setErrorMessage(res.message!);

        return;
      }
      router.replace('/orders/' + res.order!.id);
    } catch (error) {
    } finally {
      setIsPlacingOrder(false);
      clearCart();
    }
  };

  if (!loaded) {
    return <LoadingOrderSummary />;
  }

  return (
    <div className="flex flex-col justify-center rounded-xl p-7">
      <h2 className="mb-2 text-2xl">Dirección de entrega</h2>
      <div className="mb-10">
        <p className="mb-2 text-xl uppercase">
          {address.firstName} {address.lastName}
        </p>
        <p className="text-md mb-2">{address.address}</p>
        {address.address2 ? <p className="text-md mb-2">{address.address2}</p> : null}
        <p className="text-md mb-2">{address.zip}</p>
        <p className="text-md mb-2">
          {address.city}, {address.country}
        </p>
        <p className="text-md">{address.phone}</p>
      </div>
      {/* Divider */}
      <hr className="my-2 mb-5 h-0.5 w-full rounded bg-gray-200" />
      <h2 className="mb-2 text-2xl">Resumen de tu Compra</h2>
      <div className="my-2 flex flex-row justify-between">
        <span className="text-md">Nro de productos</span>
        <span className="text-md">{summaryInfo.totalItems}</span>
      </div>
      <div className="my-2 flex flex-row justify-between">
        <span className="text-md">Subtotal</span>
        <span className="text-md">{currencyFormat(summaryInfo.subTotalPrice)}</span>
      </div>
      <div className="my-2 flex flex-row justify-between">
        <span className="text-md">Impuestos (15%)</span>
        <span className="text-md">{currencyFormat(summaryInfo.tax)}</span>
      </div>
      <div className="my-5 flex flex-row justify-between">
        <span className="text-xl">Total</span>
        <span className="text-xl">{currencyFormat(summaryInfo.totalPrice)}</span>
      </div>
      <div className="mb-2 mt-5 w-full">
        <p className="mb-5">
          {/* Disclaimer */}
          <span className="text-xs">
            Al hacer clic en `&ldquo;`Colocar orden`&ldquo;`, aceptas nuestros{' '}
            <a className="text-indigo-600 underline" href="#">
              Términos y condiciones
            </a>{' '}
            y nuestra{' '}
            <a className="text-indigo-600 underline" href="#">
              Política de privacidad
            </a>
          </span>
        </p>
        {/* Si existe mensaje de error (errorMessage) se muestra */}
        {errorMessage ? <p className="mb-5 text-sm text-red-500">{errorMessage}</p> : null}
        <button
          className={clsx(
            'w-full rounded bg-indigo-600 py-3 text-lg font-bold text-white hover:bg-indigo-700',
            // 'bg-gray-800 text-white text-center w-full px-5 py-2 rounded-md hover:bg-indigo-600 mt-5',
            {
              'disabled:cursor-not-allowed disabled:opacity-50': isPlacingOrder,
            },
          )}
          disabled={isPlacingOrder}
          type="button"
          onClick={() => {
            void onPlaceOrder();
          }}
        >
          Colocar orden
        </button>
      </div>
    </div>
  );
}
