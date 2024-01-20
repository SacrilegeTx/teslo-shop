'use client';

import {
  PayPalButtons,
  usePayPalScriptReducer,
  type PayPalButtonsComponentProps,
} from '@paypal/react-paypal-js';

import { paypalCheckPayment, setTransactionId } from '@/actions';

interface PaypalProps {
  orderId: string;
  amount: number;
}

export function PaypalButton({ orderId, amount }: PaypalProps) {
  const [{ isPending }] = usePayPalScriptReducer();
  const roundedAmount = Math.round(amount * 100) / 100;

  const createOrder: PayPalButtonsComponentProps['createOrder'] = async (
    data,
    actions,
  ): Promise<string> => {
    const transactionId = await actions.order.create({
      purchase_units: [
        {
          invoice_id: orderId,
          amount: {
            value: `${roundedAmount}`,
          },
        },
      ],
    });

    // Guardar el id de la transacción en la orden (prisma)
    const res = await setTransactionId(orderId, transactionId);

    if (!res.status) {
      throw new Error(
        `Could not set transaction id ${transactionId} for order ${orderId}. Error Message: ${res.message}`,
      );
    }

    return transactionId;
  };

  const onApprove: PayPalButtonsComponentProps['onApprove'] = async (
    data,
    actions,
  ): Promise<void> => {
    const details = await actions.order?.capture();

    if (!details) return;
    await paypalCheckPayment(details.id);
  };

  // console.log({ createOrder })

  if (isPending) {
    return (
      <div className="animate-pulse">
        <div className="h-12 w-full rounded-md bg-gray-300" />
        <div className="mt-5 h-12 w-full rounded-md bg-gray-300" />
      </div>
    );
  }

  return (
    <div className="relative z-0">
      <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
    </div>
  );
}
