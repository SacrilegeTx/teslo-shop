'use server';
import type { Order, OrderAddress } from '@prisma/client';

import { auth } from '@/auth.config';

import prisma from './../../lib/prisma';

interface OrderByUser {
  status: boolean;
  // orders: Array<Partial<Order & { address: OrderAddress }>>
  orders: Partial<Order>[];
  address: Partial<OrderAddress>;
  message?: string;
}

const initialOrderByUser: OrderByUser = {
  status: false,
  orders: [],
  address: {},
};

export const getOrderByUser = async (): Promise<OrderByUser> => {
  const session = await auth();

  if (!session) {
    return {
      ...initialOrderByUser,
      message: 'User session not found',
    };
  }
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: session.user?.id,
      },
      include: {
        OrderAddress: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      status: true,
      orders,
      address: orders[0]!.OrderAddress!,
    };
  } catch (error) {
    return {
      ...initialOrderByUser,
      message: (error as Error).message,
    };
  }
};
