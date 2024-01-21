import { redirect } from 'next/navigation';

import { Title } from '@/components';
import { getCounties, getUserAddress } from '@/actions';
import { auth } from '@/auth.config';

import { AddressForm } from './ui/AddressForm';

export default async function AddressPage() {
  const countries = await getCounties();
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }

  const userAddress = (await getUserAddress(session.user.id ?? '')) ?? undefined;

  return (
    <div className="mb-72 flex flex-col px-10 sm:items-center sm:justify-center sm:px-0">
      <div className="flex w-full flex-col justify-center text-left xl:w-[1000px]">
        <Title subtitle="Dirección de entrega" title="Dirección" />

        <AddressForm countries={countries} userStoredAddress={userAddress} />
      </div>
    </div>
  );
}
