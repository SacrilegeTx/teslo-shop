'use server';
import prisma from './../../lib/prisma';

export const getStockProductBySlug = async (slug: string): Promise<number> => {
  try {
    const product = await prisma.product.findUnique({
      select: {
        inStock: true,
      },
      where: {
        slug,
      },
    });

    if (!product) return 0;

    return product.inStock;
  } catch (error) {
    throw new Error('Error getting stock product by slug');
  }
};
