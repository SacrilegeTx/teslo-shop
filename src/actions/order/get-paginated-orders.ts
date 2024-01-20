'use server';
import type { Order, OrderAddress } from '@prisma/client';

import { auth } from '@/auth.config';

import prisma from './../../lib/prisma';

interface PaginationOptions {
  page?: number;
  limit?: number;
}

interface OrderAdmin {
  currentPage?: number;
  total?: number;
  status: boolean;
  // orders: Array<Order & Partial<OrderAddress>>
  orders: Order[];
  address: Partial<OrderAddress>;
  message?: string;
}

const initialOrder: OrderAdmin = {
  status: false,
  orders: [],
  address: {},
};

export const getPaginatedOrders = async ({
  page = 1,
  limit = 7,
}: PaginationOptions): Promise<OrderAdmin | null> => {
  const session = await auth();

  if (session?.user.role !== 'ADMIN') {
    return {
      ...initialOrder,
      message: 'Must be logged in as admin to view this page',
    };
  }
  if (isNaN(+page) || isNaN(+limit)) {
    throw new Error('Invalid pagination options');
  }
  if (page < 1) page = 1;
  try {
    const ordersAll = Promise.all([
      await prisma.order.findMany({
        skip: (page - 1) * limit,
        take: limit,
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
      }),
      prisma.order.count(),
    ]);
    const [order, totalCount] = await ordersAll;
    const total = Math.ceil(totalCount / limit);

    return {
      currentPage: page,
      total,
      status: true,
      orders: order,
      address: order[0]!.OrderAddress!,
    };
  } catch (error) {
    return {
      ...initialOrder,
      message: (error as Error).message,
    };
  }
};
