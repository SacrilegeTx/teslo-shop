import { redirect } from 'next/navigation';

import { getPaginatedProductsWithImages } from '@/actions';
import { Pagination, ProductGrid, Title } from '@/components';

export const revalidate = 60;

interface ShopProps {
  searchParams: {
    page?: string;
  };
}

export default async function ShopPage({ searchParams }: ShopProps) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const { products, total } = await getPaginatedProductsWithImages({
    page,
  });

  // Redirect to first page if page is not found
  if (page > 1 && products.length === 0) redirect('/');

  return (
    <>
      <Title className="mb-2" subtitle="Todos los productos" title="Tienda" />
      <ProductGrid products={products} />
      <Pagination totalPages={total} />
    </>
  );
}
