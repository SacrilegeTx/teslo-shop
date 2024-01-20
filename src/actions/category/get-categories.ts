'use server';
import type { Category } from '@/interfaces';

import prisma from './../../lib/prisma';

export const getAllCategories = async (): Promise<Category[] | []> => {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return categories;
  } catch (error) {
    return [];
  }
};
