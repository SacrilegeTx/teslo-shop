'use server';
import type { Address } from '@/interfaces';

import prisma from './../../lib/prisma';

export const getUserAddress = async (userId: string): Promise<Address | null> => {
  try {
    const address = await prisma.userAddress.findUnique({
      where: { userId } /* ,
      include: { country: true } */,
    });

    if (!address) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId: addressUserId, ...rest } = address;

    return {
      ...rest,
      country: address?.countryId,
    };
  } catch (error) {
    return null;
  }
};
