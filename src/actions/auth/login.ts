'use server';
import { AuthError } from 'next-auth';

import { signIn } from '@/auth.config';

export async function authenticate(
  _prevState: string | undefined,
  formData: FormData,
): Promise<string> {
  try {
    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirect: false,
    });

    return 'Authentication successful.';
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

interface LoginResponse {
  ok: boolean;
  message: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    await signIn('credentials', {
      email,
      password,
    });

    return { ok: true, message: 'Authentication successful.' };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { ok: false, message: 'Invalid credentials.' };
        default:
          return { ok: false, message: 'Something went wrong.' };
      }
    }
    throw error;
  }
};
