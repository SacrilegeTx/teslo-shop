'use server';
import type { Country } from '@/interfaces';

import prisma from './../../lib/prisma';

export const getCounties = async (): Promise<Country[]> => {
  try {
    const countries = await prisma.countries.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return countries;
  } catch (error) {
    return [];
  }
};
