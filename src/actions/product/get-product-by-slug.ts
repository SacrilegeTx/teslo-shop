'use server';
import { type Product } from '@/interfaces';

import prisma from './../../lib/prisma';

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    const product = await prisma.product.findUnique({
      include: {
        ProductImage: {
          select: {
            imageUrl: true,
            id: true,
          },
        },
      },
      where: {
        slug,
      },
    });

    if (!product) return null;

    return {
      ...product,
      images: product.ProductImage.map((image) => image.imageUrl),
    };
  } catch (error) {
    throw new Error('Error getting product by slug');
  }
};
