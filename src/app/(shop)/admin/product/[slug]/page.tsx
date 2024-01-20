import { redirect } from 'next/navigation';

import { getAllCategories, getProductBySlug } from '@/actions';
import { Title } from '@/components';

import { ProductForm } from './ui/ProductForm';

interface ProductProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductProps) {
  const { slug } = params;
  const [product, categories] = await Promise.all([getProductBySlug(slug), getAllCategories()]);

  if (!product && slug !== 'create') {
    redirect('/admin/products');
  }
  const title = slug === 'create' ? 'Crear Producto' : 'Editar Producto';

  return (
    <>
      <Title title={title} />
      <ProductForm categories={categories} product={product ?? {}} />
    </>
  );
}
