'use client';
import clsx from 'clsx';
import Link from 'next/link';
import React, { useEffect, type ReactElement } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { IoInformationOutline } from 'react-icons/io5';

import { authenticate } from '@/actions';

export function LoginForm() {
  const [state, dispatch] = useFormState(authenticate, undefined);

  useEffect(() => {
    if (state === 'Authentication successful.') {
      window.location.replace('/');
    }
  }, [state]);

  return (
    <form action={dispatch} className="flex flex-col">
      <label htmlFor="email">Correo electrónico</label>
      <input className="mb-5 rounded border bg-gray-200 px-5 py-2" name="email" type="email" />

      <label htmlFor="email">Contraseña</label>
      <input
        className="mb-5 rounded border bg-gray-200 px-5 py-2"
        name="password"
        type="password"
      />

      <div aria-atomic="true" aria-live="polite" className="flex h-8 items-end space-x-1">
        {state !== 'Authentication successful.' && state !== undefined && (
          <>
            <IoInformationOutline className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">{state}</p>
          </>
        )}
      </div>

      <LoginButton />

      {/* divisor line */}
      <div className="my-5 flex items-center">
        <div className="flex-1 border-t border-gray-500" />
        <div className="px-2 text-gray-800">O</div>
        <div className="flex-1 border-t border-gray-500" />
      </div>

      <Link
        className="mt-5 w-full rounded-md bg-gray-800 px-5 py-2 text-center text-white hover:bg-indigo-600"
        href="/auth/new-account"
      >
        Crear una nueva cuenta
      </Link>
    </form>
  );
}

function LoginButton(): ReactElement {
  const { pending } = useFormStatus();

  return (
    <button
      className={clsx({
        'mt-5 w-full rounded-md bg-gray-800 px-5 py-2 text-center text-white hover:bg-indigo-600':
          !pending,
        'mt-5 w-full rounded-md bg-gray-400 px-5 py-2 text-center text-gray-800': pending,
      })}
      disabled={pending}
      type="submit"
    >
      Ingresar
    </button>
  );
}
