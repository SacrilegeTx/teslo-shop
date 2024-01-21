/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type { User } from '@prisma/client';
import type { Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import type { User as IUser } from './interfaces';

import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcryptjs from 'bcryptjs';

import prisma from './lib/prisma';
import { auntheticatedRoutes } from './utils';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/new-account',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = auntheticatedRoutes.includes(nextUrl.pathname);

      if (isOnDashboard) {
        if (isLoggedIn) return true;

        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return true;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.data = user;
      }

      return token;
    },
    async session({ session, token }: { session: Session; token?: JWT }) {
      // if (!token) return session;
      session.user = token!.data as IUser & JWT['data'];

      return session;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;

        // Buscar el correo en la base de datos de prisma
        const user: User | null = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) return null;

        // Verificar que la contraseña sea la misma con bcryptjs
        if (!bcryptjs.compareSync(password, user.password)) {
          return null;
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...rest } = user;

        return rest;
      },
    }),
  ],
};

export const { signIn, signOut, auth, handlers } = NextAuth(authConfig);
