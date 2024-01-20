'use client';
import { useState, useEffect } from 'react';

import { useCartStore } from '@/store';
import { currencyFormat } from '@/utils';

export function OrderSummary() {
  const [loaded, setLoaded] = useState(false);
  const summarInfo = useCartStore((state) => state.getSummaryInformation());

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      {loaded ? (
        <>
          <div className="my-2 flex flex-row justify-between">
            <span className="text-md">Nro de productos</span>
            <span className="text-md">{summarInfo.totalItems}</span>
          </div>
          <div className="my-2 flex flex-row justify-between">
            <span className="text-md">Subtotal</span>
            <span className="text-md">{currencyFormat(summarInfo.subTotalPrice)}</span>
          </div>
          <div className="my-2 flex flex-row justify-between">
            <span className="text-md">Impuestos (15%)</span>
            <span className="text-md">{currencyFormat(summarInfo.tax)}</span>
          </div>
          <div className="my-5 flex flex-row justify-between">
            <span className="text-xl">Total</span>
            <span className="text-xl">{currencyFormat(summarInfo.totalPrice)}</span>
          </div>
        </>
      ) : null}
    </>
  );
}
