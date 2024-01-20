'use server';
import { revalidatePath } from 'next/cache';

import { auth } from '@/auth.config';

import prisma from './../../lib/prisma';

interface ChangeUserRole {
  status: boolean;
  message?: string;
}

export const changeUserRole = async (userId: string, role: string): Promise<ChangeUserRole> => {
  const session = await auth();

  if (session?.user?.role !== 'ADMIN') {
    return {
      status: false,
      message: 'Must be logged in as admin to view this page',
    };
  }
  try {
    const newRole = role === 'ADMIN' ? 'ADMIN' : 'USER';

    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
    revalidatePath('/admin/users');

    return {
      status: true,
    };
  } catch (error) {
    return {
      status: false,
      message: `Error changing user role. Error message: ${(error as Error).message}`,
    };
  }
};
