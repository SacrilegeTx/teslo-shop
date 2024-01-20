'use server';
import type { AddressResponse } from '@/interfaces';

import prisma from './../../lib/prisma';

export const deleteUserAddress = async (userId: string): Promise<AddressResponse> => {
  try {
    await prisma.userAddress.delete({
      where: { userId },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ msg: 'Address deleted' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        msg: `Could not delete user address with userId: ${userId}`,
      }),
    };
  }
};
