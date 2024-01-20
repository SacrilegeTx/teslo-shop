import type { Address } from '@/interfaces';

interface AddressProps {
  address: Address;
}

export function AddressUser({ address }: AddressProps) {
  return (
    <>
      <h2 className="mb-2 text-2xl">Dirección de entrega</h2>
      <div className="mb-10">
        <p className="mb-2 text-xl uppercase">
          {address.firstName} {address.lastName}
        </p>
        <p className="text-md mb-2">{address.address}</p>
        {address.address2 ? <p className="text-md mb-2">{address.address2}</p> : null}
        <p className="text-md mb-2">{address.zip}</p>
        <p className="text-md mb-2">
          {address.city}, {address.country}
        </p>
        <p className="text-md">{address.phone}</p>
      </div>
      {/* Divider */}
      <hr className="my-5 mb-10 h-0.5 w-full rounded bg-gray-200" />
    </>
  );
}
