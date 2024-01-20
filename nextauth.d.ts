import { type DefaultSession } from 'next-auth';
declare module 'next-auth' {
  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string;
  }
  interface Session extends DefaultSession {
    user?: User & DefaultSession['user'];
  }
}
