import Link from 'next/link';

import { getPaginatedProductsWithImages } from '@/actions';
import { Pagination, ProductImageCard, Title } from '@/components';
import { currencyFormat } from '@/utils';

interface AdminProps {
  searchParams: {
    page?: string;
  };
}

export default async function AdminProductsPage({ searchParams }: AdminProps) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const { products, total } = await getPaginatedProductsWithImages({
    page,
  });

  return (
    <>
      <Title title="Mantimiento de Productos" />

      {/* Div for create new Product */}
      <div className="mb-5 flex justify-end">
        <Link
          className="rounded-md bg-indigo-500 px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-indigo-600"
          href="/admin/product/create"
        >
          Crear Producto
        </Link>
      </div>

      <div className="mb-10">
        <table className="min-w-full">
          <thead className="border-b bg-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900" scope="col">
                Imagen
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900" scope="col">
                Título
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900" scope="col">
                Precio
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900" scope="col">
                Género
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900" scope="col">
                Inventario
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900" scope="col">
                Tallas
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b bg-white transition duration-300 ease-in-out hover:bg-gray-100"
              >
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  <Link href={`/product/${product.slug}`}>
                    <ProductImageCard
                      alt={product.title}
                      className="h-20 w-20 rounded-md object-cover"
                      height={80}
                      src={product.images[0]?.toString()}
                      width={80}
                    />
                  </Link>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-light uppercase text-gray-900">
                  <Link className="hover:underline" href={`/admin/product/${product.slug}`}>
                    {product.title}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">
                  {currencyFormat(product.price)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-light uppercase text-gray-900">
                  {product.gender}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  {product.inStock === 0 ? (
                    <span className="rounded-md bg-red-500 px-2 py-1 text-white">Agotado</span>
                  ) : (
                    product.inStock
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">
                  {product.sizes.join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {total > 1 && <Pagination totalPages={total} />}
      </div>
    </>
  );
}
