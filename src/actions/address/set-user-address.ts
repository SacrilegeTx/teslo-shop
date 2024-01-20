'use server';

import type { Address, AddressResponse } from '@/interfaces';

import prisma from './../../lib/prisma';

export const setUserAddress = async (
  address: Address,
  userId: string,
): Promise<AddressResponse> => {
  try {
    const response = await createOrReplaceAddress(address, userId);

    return response;
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: 'Something went wrong' }),
    };
  }
};

const createOrReplaceAddress = async (
  address: Address,
  userId: string,
): Promise<AddressResponse> => {
  try {
    const storedAddress = await prisma.userAddress.findUnique({
      where: { userId },
    });

    if (!storedAddress) {
      await prisma.userAddress.create({
        data: {
          userId,
          ...address,
          countryId: address.country,
          country: undefined, // Remove the 'country' property
        },
      });

      return {
        statusCode: 200,
        body: JSON.stringify({ msg: 'Address created' }),
      };
    }
    await prisma.userAddress.update({
      where: { userId },
      data: {
        ...address,
        countryId: address.country,
        country: undefined, // Remove the 'country' property
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ msg: 'Address updated' }),
    };
  } catch (error) {
    throw new Error('Could not create or replace address');
  }
};
