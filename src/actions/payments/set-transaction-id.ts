'use server';
import prisma from '../../lib/prisma';

interface TransactionResponse {
  status: boolean;
  message: string;
}

export const setTransactionId = async (
  orderId: string,
  transactionId: string,
): Promise<TransactionResponse> => {
  try {
    const order = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        transactionId,
      },
    });

    if (!order) {
      return {
        status: false,
        message: `Order ${orderId} not found`,
      };
    }

    return {
      status: true,
      message: 'Transaction ID set',
    };
  } catch (error) {
    return {
      status: false,
      message: (error as Error).message,
    };
  }
};
