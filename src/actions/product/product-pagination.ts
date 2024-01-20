'use server';

import { type Gender } from '@prisma/client';

import { type Product } from '@/interfaces';

import prisma from './../../lib/prisma';

interface PaginationOptions {
  page?: number;
  limit?: number;
  gender?: Gender;
}

export const getPaginatedProductsWithImages = async ({
  page = 1,
  limit = 12,
  gender,
}: PaginationOptions): Promise<{
  products: Product[];
  curentPage: number;
  total: number;
}> => {
  if (isNaN(+page) || isNaN(+limit)) {
    throw new Error('Invalid pagination options');
  }
  if (page < 1) page = 1;
  try {
    const productsAll = Promise.all([
      prisma.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: {
          ProductImage: {
            take: 2,
            select: {
              imageUrl: true,
            },
          },
        },
        where: {
          gender,
        },
      }),
      prisma.product.count(),
    ]);
    const [products, totalCount] = await productsAll;
    const total = Math.ceil(totalCount / limit);

    return {
      curentPage: page,
      total,
      products: products.map((product) => ({
        ...product,
        images: product.ProductImage.map((image) => image.imageUrl),
      })),
    };
  } catch (error) {
    throw new Error('Could not fetch products');
  }
};
