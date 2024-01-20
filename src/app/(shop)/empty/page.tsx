import Link from 'next/link';
import { IoCartOutline } from 'react-icons/io5';

export default function EmptyPage() {
  return (
    <div className="flex h-[800px] items-center justify-center">
      <IoCartOutline className="mx-5" size={100} />
      <div className="flex flex-col items-center">
        <h1 className="text-xl font-semibold">Tu carrito esta vacío</h1>
        <p className="text-gray-500">Agrega productos a tu carrito para poder comprarlos</p>
        <Link className="mt-5 hover:underline" href="/">
          Ir a la tienda
        </Link>
      </div>
    </div>
  );
}
