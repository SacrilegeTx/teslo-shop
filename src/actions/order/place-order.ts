'use server';
/* eslint-disable @typescript-eslint/no-confusing-void-expression */

import type { Address, Size } from '@/interfaces';

import { auth } from '@/auth.config';
import { taxProduct, taxTotal } from '@/utils';

import prisma from './../../lib/prisma';

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export const placeOrder = async (
  productIds: ProductToOrder[],
  address: Address,
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
) => {
  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) {
    return {
      ok: false,
      message: "User's session not found",
    };
  }

  // Obtener la información de los productos
  // Nota: recuerden que podemos llevar 2 productos con el mismo id pero con tallas diferentes
  // por lo que se tiene que agrupar los productos por id y talla
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds.map((p) => p.productId),
      },
    },
  });

  // Calcular el total de la orden
  const itemsInOrder = productIds.reduce((acc, product) => acc + product.quantity, 0);

  // Calcular precio total, subtotal y el impuesto (tax)
  const { total, subtotal, tax } = productIds.reduce(
    (totals, item) => {
      const product = products.find((p) => p.id === item.productId);

      if (!product) {
        throw new Error(`${item.productId} not found`);
      }

      const subTotal = product.price * item.quantity;

      totals.subtotal += subTotal;
      totals.tax += subTotal * taxProduct;
      totals.total += subTotal * taxTotal;

      return totals;
    },
    { total: 0, subtotal: 0, tax: 0 },
  );

  try {
    // Crear la transacción de la orden en la base de datos
    const prismaTransaction = await prisma.$transaction(async (tx) => {
      // 1. Actualizar el stock de los productos
      // eslint-disable-next-line @typescript-eslint/promise-function-async
      const updateQuantityProductsPromises = products.map((product) => {
        const quantity = productIds
          .filter((p) => p.productId === product.id)
          .reduce((acc, item) => acc + item.quantity, 0);

        if (product.inStock < quantity) {
          throw new Error(`${product.title} not enough stock`);
        }

        if (quantity === 0) {
          throw new Error(`${product.id} quantity is 0`);
        }

        return tx.product.update({
          where: { id: product.id },
          data: {
            inStock: {
              decrement: quantity,
            },
          },
        });
      });

      const updatedQuantityProducts = await Promise.all(updateQuantityProductsPromises);

      for (const product of updatedQuantityProducts) {
        if (product.inStock < 0) {
          throw new Error(`${product.title} negative stock`);
        }
      }

      // 2. Crear la orden - Encabezado - Detalles
      const order = await tx.order.create({
        data: {
          userId,
          total,
          subtotal,
          tax,
          itemsInOrder,
          OrderItem: {
            createMany: {
              data: productIds.map((item) => ({
                quantity: item.quantity,
                size: item.size,
                productId: item.productId,
                price: products.find((p) => p.id === item.productId)?.price ?? 0,
              })),
            },
          },
        },
      });

      // 3. Crear la direccion de la orden
      // const { userId, ...restAddress } = address <-- en este punto no puedo desuctructurar el userId porque no existe dentro de address
      // a pesar que si llega como valor en el objeto. Está para investigar un poco más
      await tx.orderAddress.create({
        data: {
          orderId: order.id,
          firstName: address.firstName,
          lastName: address.lastName,
          phone: address.phone,
          address: address.address,
          city: address.city,
          countryId: address.country,
          zip: address.zip,
          // ...address,
          // countryId: address.country,
          country: undefined,
        },
      });

      return {
        order,
      };
    });

    return {
      ok: true,
      order: prismaTransaction.order,
      prismaTx: prismaTransaction,
    };
  } catch (error: unknown) {
    return {
      ok: false,
      message: (error as Error).message,
    };
  }
};
