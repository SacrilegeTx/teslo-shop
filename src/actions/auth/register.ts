'use server';
import type { User } from '@prisma/client';

import bcryptjs from 'bcryptjs';

import prisma from './../../lib/prisma';

interface RegisterUserResponse {
  ok: boolean;
  user?: Partial<User>;
  message: string;
}

export const registerUser = async (
  name: string,
  email: string,
  password: string,
): Promise<RegisterUserResponse> => {
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: bcryptjs.hashSync(password),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return {
      ok: true,
      user,
      message: 'User registered successfully.',
    };
  } catch (error) {
    return {
      ok: false,
      message: 'Could not register user.',
    };
  }
};
