'use client';
import clsx from 'clsx';
import Link from 'next/link';
import React, { useState, type ReactElement } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

import { login } from '@/actions/auth/login';
import { registerUser } from '@/actions';

interface FormInputs {
  name: string;
  email: string;
  password: string;
}

export function RegisterForm(): ReactElement {
  const [errorMessage, setErrorMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const { name, email, password } = data;
    const res = await registerUser(name, email, password);

    if (!res.ok) {
      setErrorMessage(res.message);

      return;
    }

    setErrorMessage('');
    await login(email.toLocaleLowerCase(), password);
    window.location.replace('/');
  };

  return (
    <form
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      className="flex flex-col"
      onSubmit={handleSubmit(onSubmit)}
    >
      <label htmlFor="name">Nombre completo</label>
      <input
        autoComplete="off"
        className={clsx(
          'mb-5 rounded border bg-gray-200 px-5 py-2',
          'focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600',
          {
            'ocus:outline-none border-red-500 focus:border-transparent focus:ring-2 focus:ring-red-600':
              errors.name,
          },
        )}
        type="text"
        {...register('name', { required: true })}
      />

      <label htmlFor="email">Correo electrónico</label>
      <input
        autoComplete="off"
        className={clsx(
          'mb-5 rounded border bg-gray-200 px-5 py-2',
          'focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600',
          {
            'ocus:outline-none border-red-500 focus:border-transparent focus:ring-2 focus:ring-red-600':
              errors.email,
          },
        )}
        type="email"
        {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
      />

      <label htmlFor="password">Contraseña</label>
      <input
        className={clsx(
          'mb-5 rounded border bg-gray-200 px-5 py-2',
          'focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600',
          {
            'ocus:outline-none border-red-500 focus:border-transparent focus:ring-2 focus:ring-red-600':
              errors.password,
          },
        )}
        type="password"
        {...register('password', {
          required: true,
          minLength: 6,
          // pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
        })}
      />

      {errorMessage ? (
        <div className="w-full rounded-md bg-red-500 px-5 py-2 text-center text-white">
          {errorMessage}
        </div>
      ) : null}

      <button
        className="mt-5 w-full rounded-md bg-gray-800 px-5 py-2 text-center text-white hover:bg-indigo-600"
        type="button"
      >
        Crear cuenta
      </button>

      {/* divisor line */}
      <div className="my-5 flex items-center">
        <div className="flex-1 border-t border-gray-500" />
        <div className="px-2 text-gray-800">O</div>
        <div className="flex-1 border-t border-gray-500" />
      </div>

      <Link
        className="mt-5 w-full rounded-md bg-gray-800 px-5 py-2 text-center text-white hover:bg-indigo-600"
        href="/auth/login"
      >
        Ingresar
      </Link>
    </form>
  );
}
