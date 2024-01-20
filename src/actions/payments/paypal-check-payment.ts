'use server';
/* eslint-disable @typescript-eslint/naming-convention */

import type { PaypalOrderStatusResponse } from '@/interfaces';

import { revalidatePath } from 'next/cache';

import prisma from './../../lib/prisma';

interface PaypalResponse {
  status: boolean;
  message?: string;
}

export const paypalCheckPayment = async (transactionId: string): Promise<PaypalResponse> => {
  const token = await getPaypalBearerToken();

  if (!token) {
    return {
      status: false,
      message: 'Could not get paypal bearer token',
    };
  }
  const payment = await verifyPaypalPayment(transactionId, token);

  if (!payment) {
    return {
      status: false,
      message: 'Could not verify paypal payment',
    };
  }

  const { status, purchase_units } = payment;

  if (status !== 'COMPLETED') {
    return {
      status: false,
      message: 'Could not verify paypal payment',
    };
  }
  const { invoice_id: orderId } = purchase_units[0];

  // Actualizar la orden en la base de datos, los campos isPaid y paidAt (prisma)
  try {
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        isPaid: true,
        paidAt: new Date(),
      },
    });
    // revalidar el path
    revalidatePath(`/orders/${orderId}`);

    return {
      status: true,
    };
  } catch (error) {
    return {
      status: false,
      message: 'Could not update order',
    };
  }
};

const getPaypalBearerToken = async (): Promise<string | null> => {
  const url = process.env.PAYPAL_OAUTH_URL ?? '';
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const auth = Buffer.from(`${clientId}:${clientSecret}`, 'utf-8').toString('base64');
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${auth}`,
    },
  };
  const data = 'grant_type=client_credentials';

  const requestOptions = {
    method: 'POST',
    headers: config.headers,
    body: data,
  };

  try {
    const response = await fetch(url, { ...requestOptions, cache: 'no-store' });
    const token = await response.json();

    return token.access_token;
  } catch (error) {
    return null;
  }
};

const verifyPaypalPayment = async (
  transactionId: string,
  bearerToken: string,
): Promise<PaypalOrderStatusResponse | null> => {
  const url = `${process.env.PAYPAL_ORDERS_URL}/${transactionId}`;
  const config = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };
  const requestOptions = {
    method: 'GET',
    headers: config.headers,
  };

  try {
    const response = await fetch(url, { ...requestOptions, cache: 'no-store' });
    const payment = await response.json();

    return payment;
  } catch (error) {
    return null;
  }
};
