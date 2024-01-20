import clsx from 'clsx';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { IoCardOutline } from 'react-icons/io5';

import { Pagination, Title } from '@/components';
import { getPaginatedOrders } from '@/actions';

interface AdminProps {
  searchParams: {
    page?: string;
  };
}

export default async function AdminOrdersPage({ searchParams }: AdminProps) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const allOrders = await getPaginatedOrders({ page });

  if (!allOrders) {
    redirect('/empty');
  }

  const { total, orders, address, status } = allOrders;

  if (!status) {
    redirect('/auth/login');
  }

  return (
    <>
      <Title title="Todas las Ordenes" />

      <div className="mb-10">
        <table className="min-w-full">
          <thead className="border-b bg-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900" scope="col">
                #ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900" scope="col">
                Nombre completo
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900" scope="col">
                Estado
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900" scope="col">
                Opciones
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b bg-white transition duration-300 ease-in-out hover:bg-gray-100"
              >
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  # {order.id.split('-').at(-1)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-light uppercase text-gray-900">
                  {address?.firstName} {address?.lastName}
                </td>
                <td className="flex items-center whitespace-nowrap  px-6 py-4 text-sm font-light text-gray-900">
                  <IoCardOutline
                    className={clsx({
                      'text-red-800': !order.isPaid,
                      'text-green-800': order.isPaid,
                    })}
                  />
                  <span
                    className={clsx({
                      'mx-2 text-red-800': !order.isPaid,
                      'mx-2 text-green-800': order.isPaid,
                    })}
                  >
                    {order.isPaid ? 'Orden pagada' : 'Pendiente de pago'}
                  </span>
                </td>
                <td className="px-6 text-sm font-light text-gray-900 ">
                  <Link className="hover:underline" href={`/orders/${order.id}`}>
                    Ver orden
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {total! > 1 && <Pagination totalPages={total!} />}
      </div>
    </>
  );
}
