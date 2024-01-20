import { notFound } from 'next/navigation';

import { getProductBySlug } from '@/actions';
import { ProductMobileSlideShow, StockLabel } from '@/components';
import { ProductSlideShow } from '@/components/product/slideshow/ProductSlideShow';
import { titleFont } from '@/config/font';

import { AddToCart } from './ui/AddToCart';

export const revalidate = 604800; // 1 week

interface ProductProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductProps) {
  // read route params
  const { slug } = params;

  // fetch data
  const product = await getProductBySlug(slug);

  return {
    title: product?.title ?? 'Product not found',
    description: product?.description ?? '',
    openGraph: {
      title: product?.title ?? 'Product not found',
      description: product?.description ?? '',
      images: [`/products/${product?.images[1]}`],
    },
  };
}

export default async function ProductPage({ params }: ProductProps) {
  const { slug } = params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mb-20 mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
      {/* Mobile Slideshow */}
      <ProductMobileSlideShow
        className="block md:hidden"
        images={product.images}
        title={product.title}
      />
      {/* Slideshow */}
      <div className="col-span-1 md:col-span-2">
        <ProductSlideShow
          className="hidden md:block"
          images={product.images}
          title={product.title}
        />
      </div>
      {/* Details */}
      <div className="col-span-1 px-5">
        <StockLabel slug={slug} />
        <h1 className={`${titleFont.className} text-2xl font-bold antialiased`}>{product.title}</h1>
        <p className="text-gray-500">${product.price}</p>
        <AddToCart product={product} />
        <h3 className="mt-5 text-xl font-bold text-gray-500">Descripcción</h3>
        <p className="text-wrap text-gray-500">{product.description}</p>
      </div>
    </div>
  );
}
