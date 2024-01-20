'use client';

import type { Address, Country } from '@/interfaces';

import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useAddressStore } from '@/store';
import { deleteUserAddress, setUserAddress } from '@/actions';

interface FormInputs {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string | null;
  zip: string;
  city: string;
  country: string;
  phone: string;
  rememberAddress: boolean;
}

interface AddressProps {
  countries: Country[];
  userStoredAddress?: Partial<Address> | undefined;
}

export function AddressForm({ countries, userStoredAddress = {} }: AddressProps) {
  const setAddress = useAddressStore((state) => state.setAddress);
  const address = useAddressStore((state) => state.address);
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
  });
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    reset,
  } = useForm<FormInputs>({
    defaultValues: {
      ...userStoredAddress,
      rememberAddress: true,
    },
  });

  useEffect(() => {
    if (address.firstName) {
      reset(address);
    }
  }, [address, reset]);

  const onSubmit = async (data: FormInputs): Promise<void> => {
    const { rememberAddress, ...rest } = data;

    setAddress(rest);

    if (rememberAddress) {
      // Server action: Save in database
      await setUserAddress(rest, session!.user.id ?? '');
    } else {
      // Server action: Delete from database
      await deleteUserAddress(session!.user.id ?? '');
    }
    router.push('/checkout');
  };

  return (
    <form
      className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="mb-2 flex flex-col">
        <span>Nombres</span>
        <input
          className={clsx(
            'mb-5 rounded border bg-gray-200 px-5 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600',
            {
              'ocus:outline-none border-red-500 focus:border-transparent focus:ring-2 focus:ring-red-600':
                errors.firstName,
            },
          )}
          type="text"
          {...register('firstName', { required: true })}
        />
      </div>

      <div className="mb-2 flex flex-col">
        <span>Apellidos</span>
        <input
          className={clsx(
            'mb-5 rounded border bg-gray-200 px-5 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600',
            {
              'ocus:outline-none border-red-500 focus:border-transparent focus:ring-2 focus:ring-red-600':
                errors.lastName,
            },
          )}
          type="text"
          {...register('lastName', { required: true })}
        />
      </div>

      <div className="mb-2 flex flex-col">
        <span>Dirección</span>
        <input
          className={clsx(
            'mb-5 rounded border bg-gray-200 px-5 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600',
            {
              'ocus:outline-none border-red-500 focus:border-transparent focus:ring-2 focus:ring-red-600':
                errors.address,
            },
          )}
          type="text"
          {...register('address', { required: true })}
        />
      </div>

      <div className="mb-2 flex flex-col">
        <span>Dirección 2 (opcional)</span>
        <input
          className={clsx(
            'mb-5 rounded border bg-gray-200 px-5 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600',
          )}
          type="text"
          {...register('address2')}
        />
      </div>

      <div className="mb-2 flex flex-col">
        <span>Código postal</span>
        <input
          className={clsx(
            'mb-5 rounded border bg-gray-200 px-5 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600',
            {
              'ocus:outline-none border-red-500 focus:border-transparent focus:ring-2 focus:ring-red-600':
                errors.zip,
            },
          )}
          type="text"
          {...register('zip', { required: true })}
        />
      </div>

      <div className="mb-2 flex flex-col">
        <span>Ciudad</span>
        <input
          className={clsx(
            'mb-5 rounded border bg-gray-200 px-5 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600',
            {
              'ocus:outline-none border-red-500 focus:border-transparent focus:ring-2 focus:ring-red-600':
                errors.city,
            },
          )}
          type="text"
          {...register('city', { required: true })}
        />
      </div>

      <div className="mb-2 flex flex-col">
        <span>País</span>
        <select
          className={clsx(
            'mb-5 rounded border bg-gray-200 px-5 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600',
            {
              'ocus:outline-none border-red-500 focus:border-transparent focus:ring-2 focus:ring-red-600':
                errors.country,
            },
          )}
          {...register('country', { required: true })}
        >
          <option value="">[ Seleccione ]</option>
          {countries.map((country: Country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
          {/* <option value='CRI'>Costa Rica</option> */}
        </select>
      </div>

      <div className="mb-2 flex flex-col">
        <span>Teléfono</span>
        <input
          className={clsx(
            'mb-5 rounded border bg-gray-200 px-5 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600',
            {
              'ocus:outline-none border-red-500 focus:border-transparent focus:ring-2 focus:ring-red-600':
                errors.phone,
            },
          )}
          type="text"
          {...register('phone', { required: true })}
        />
      </div>

      <div className="mb-2 flex flex-col sm:mt-1">
        <div className="mb-10 inline-flex items-center">
          <label
            className="relative flex cursor-pointer items-center rounded-full p-3"
            htmlFor="checkbox"
          >
            <input
              className="before:content[''] border-blue-gray-200 before:bg-blue-gray-500 peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-500 transition-all before:absolute before:left-2/4 before:top-2/4 before:block before:h-12 before:w-12 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:opacity-0 before:transition-opacity checked:border-indigo-500 checked:bg-indigo-500 checked:before:bg-indigo-500 hover:before:opacity-10"
              id="checkbox"
              type="checkbox"
              {...register('rememberAddress')}
              // checked
            />
            <div className="pointer-events-none absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
              <svg
                className="h-3.5 w-3.5"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  fillRule="evenodd"
                />
              </svg>
            </div>
          </label>
          <span className="ml-2">¿Recordar información?</span>
        </div>
        <button
          className={clsx(
            'flex w-full cursor-pointer justify-center rounded-md bg-indigo-500 p-3 text-center text-white sm:w-1/2',
            {
              'cursor-not-allowed bg-gray-500': !isValid,
            },
          )}
          disabled={!isValid}
          type="submit"
        >
          Siguiente
        </button>
      </div>
    </form>
  );
}
