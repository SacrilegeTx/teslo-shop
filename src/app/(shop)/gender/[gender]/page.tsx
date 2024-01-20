// import { notFound } from 'next/navigation'
import { type Gender } from '@prisma/client';
import { redirect } from 'next/navigation';

import { getPaginatedProductsWithImages } from '@/actions';
import { ProductGrid, Title, Pagination } from '@/components';

export const revalidate = 60;

interface GenderPageProps {
  params: {
    gender: string;
  };
  searchParams: {
    page?: string;
  };
}

export default async function GenderPage({ params, searchParams }: GenderPageProps) {
  const { gender } = params;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const { products, total } = await getPaginatedProductsWithImages({
    page,
    gender: gender as Gender,
  });

  const labels: Record<string, string> = {
    men: 'Hombres',
    women: 'Mujeres',
    kid: 'Niños',
    unisex: 'Unisex',
  };

  /* if (id === 'kids') {
    notFound()
  } */
  if (page > 1 && products.length === 0) redirect('/');

  return (
    <div>
      <Title
        className="mb-2"
        subtitle="Todos los productos"
        title={`Artículos de ${labels[gender]}`}
      />
      {products.length > 0 ? (
        <>
          <ProductGrid products={products} />
          <Pagination totalPages={total} />
        </>
      ) : (
        <li>No hay productos en esta categoria</li>
      )}
    </div>
  );
}
