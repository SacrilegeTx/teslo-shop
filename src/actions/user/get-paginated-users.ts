'use server';

import type { User } from '@/interfaces';

import { auth } from '@/auth.config';

import prisma from './../../lib/prisma';

interface PaginationOptions {
  page?: number;
  limit?: number;
}

interface OrderUser {
  currentPage?: number;
  total?: number;
  status: boolean;
  users: User[];
  message?: string;
}

const initialUser: OrderUser = {
  status: false,
  users: [],
};

export const getPaginatedUsers = async ({
  page = 1,
  limit = 7,
}: PaginationOptions): Promise<OrderUser | null> => {
  const session = await auth();

  if (session?.user?.role !== 'ADMIN') {
    return {
      ...initialUser,
      message: 'Must be logged in as admin to view this page',
    };
  }
  if (isNaN(+page) || isNaN(+limit)) {
    throw new Error('Invalid pagination options');
  }
  if (page < 1) page = 1;
  try {
    const usersAll = Promise.all([
      await prisma.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.user.count(),
    ]);
    const [user, totalCount] = await usersAll;
    const total = Math.ceil(totalCount / limit);

    return {
      currentPage: page,
      total,
      users: user,
      status: true,
    };
  } catch (error) {
    return {
      ...initialUser,
      message: (error as Error).message,
    };
  }
};
