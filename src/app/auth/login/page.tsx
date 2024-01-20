import { titleFont } from '@/config/font';

import { LoginForm } from './ui/LoginForm';

export default function Login() {
  return (
    <div className="flex min-h-screen flex-col pt-32 sm:pt-52">
      <h1 className={`${titleFont.className} mb-5 text-4xl`}>Ingresar</h1>

      <LoginForm />
    </div>
  );
}
