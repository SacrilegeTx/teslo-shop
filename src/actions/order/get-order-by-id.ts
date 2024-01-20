'use server';
import type { Order, OrderItem } from '@prisma/client';
import type { Address, Product } from '@/interfaces';

import { auth } from '@/auth.config';

import prisma from './../../lib/prisma';

interface OrderProps {
  order: Order | null;
  items: (OrderItem & { product: Product })[] | [];
  address: Address | null;
  message?: string;
}

const inititalOrder: OrderProps = {
  order: null,
  items: [],
  address: null,
};

export const getOrderById = async (id: string): Promise<OrderProps> => {
  const session = await auth();

  try {
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        OrderItem: {
          include: {
            product: {
              include: {
                ProductImage: true,
              },
            },
          },
        },
        OrderAddress: {
          include: {
            country: true,
          },
        },
      },
    });

    if (!order) {
      throw new Error(`Order ${id.split('-').at(-1)} not found`);
    }

    if (session?.user.role === 'USER' && session.user.id !== order.userId) {
      throw new Error('You are not authorized to view this order');
    }

    return {
      order,
      items: order.OrderItem.map((item) => ({
        ...item,
        product: {
          ...item.product,
          images: item.product.ProductImage.map((image) => image.imageUrl),
        },
      })),
      address: {
        ...order.OrderAddress!,
        country: order.OrderAddress?.country.name ?? '',
      } satisfies Address,
      message: `Order ${id.split('-').at(-1)} found`,
    };
  } catch (error) {
    return {
      ...inititalOrder,
      message: `Order ${id.split('-').at(-1)} not found`,
    };
  }
};
