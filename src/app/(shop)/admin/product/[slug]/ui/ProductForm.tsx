'use client';

import type { Category, Product, ProductImage } from '@/interfaces';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { IoTrashOutline } from 'react-icons/io5';

import { ProductImageCard } from '@/components';
import { createOrUpdatProduct, deleteProductImage } from '@/actions';

interface AdminProps {
  product: Partial<Product> & { ProductImage?: ProductImage[] };
  categories: Category[];
}

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

interface FormInput {
  title: string;
  slug: string;
  description: string;
  price: number;
  inStock: number;
  sizes: string[];
  tags: string;
  gender: 'men' | 'women' | 'kid' | 'unisex';
  categoryId: string;
  images?: FileList;
}

export function ProductForm({ product, categories }: AdminProps) {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    watch /* ,
    formState: { isValid } */,
  } = useForm<FormInput>({
    defaultValues: {
      ...product,
      tags: product.tags?.join(', '),
      sizes: product.sizes ?? [],
      images: undefined,
    },
  });

  watch('sizes');

  const onSizeChanged = (size: string): void => {
    const sizes = new Set(getValues('sizes'));

    sizes.has(size) ? sizes.delete(size) : sizes.add(size);

    setValue('sizes', Array.from(sizes));
  };

  const onSubmit = async (data: FormInput): Promise<void> => {
    const formData = new FormData();

    if (product.id) formData.append('id', product.id);
    formData.append('title', data.title);
    formData.append('slug', data.slug);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('inStock', data.inStock.toString());
    formData.append('sizes', data.sizes.join(','));
    formData.append('tags', data.tags);
    formData.append('categoryId', data.categoryId);
    formData.append('gender', data.gender);

    // Check if there are images
    if (data.images) {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < data.images.length; i++) {
        formData.append('images', data.images[i]);
      }
    }

    const { success, productTx } = await createOrUpdatProduct(formData);

    if (success) {
      router.replace(`/admin/product/${productTx?.slug}`);
    }
  };

  return (
    <form
      className="mb-16 grid grid-cols-1 gap-3 px-5 sm:grid-cols-2 sm:px-0"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Textos */}
      <div className="w-full">
        <div className="mb-2 flex flex-col">
          <span>Título</span>
          <input
            className="mb-5 rounded border bg-gray-200 px-5 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600"
            type="text"
            {...register('title', { required: true })}
          />
        </div>

        <div className="mb-2 flex flex-col">
          <span>Slug</span>
          <input
            className="mb-5 rounded border bg-gray-200 px-5 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600"
            type="text"
            {...register('slug', { required: true })}
          />
        </div>

        <div className="mb-2 flex flex-col">
          <span>Descripción</span>
          <textarea
            className="mb-5 rounded border bg-gray-200 px-5 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600"
            rows={5}
            {...register('description', { required: true })}
          />
        </div>

        <div className="mb-2 flex flex-col">
          <span>Price</span>
          <input
            className="mb-5 rounded border bg-gray-200 px-5 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600"
            type="number"
            {...register('price', { required: true, min: 0 })}
          />
        </div>

        <div className="mb-2 flex flex-col">
          <span>Tags</span>
          <input
            className="mb-5 rounded border bg-gray-200 px-5 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600"
            type="text"
            {...register('tags', { required: true })}
          />
        </div>

        <div className="mb-2 flex flex-col">
          <span>Gender</span>
          <select
            className="mb-5 rounded border bg-gray-200 px-5 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600"
            {...register('gender', { required: true })}
          >
            <option value="">[Seleccione]</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kid">Kid</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        <div className="mb-2 flex flex-col">
          <span>Categoria</span>
          <select
            className="mb-5 rounded border bg-gray-200 px-5 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600"
            {...register('categoryId', { required: true })}
          >
            <option value="">[Seleccione]</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button
          className={clsx(
            'flex w-full cursor-pointer justify-center rounded-md bg-indigo-500 p-3 text-center text-lg text-white sm:w-1/2',
          )}
          type="submit"
        >
          Guardar
        </button>
      </div>

      {/* Selector de tallas y fotos */}
      <div className="w-full">
        <div className="mb-2 flex flex-col">
          <span>Inventario</span>
          <input
            className="mb-5 rounded border bg-gray-200 px-5 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600"
            type="number"
            {...register('inStock', { required: true, min: 1 })}
          />
        </div>
        {/* As checkboxes */}
        <div className="mb-2 flex flex-col">
          <span>Tallas</span>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <div
                key={size}
                className={clsx(
                  'flex cursor-pointer flex-row rounded-md bg-gray-800 px-3 py-1 text-white hover:bg-indigo-600',
                  {
                    'bg-indigo-600': getValues('sizes').includes(size),
                  },
                )}
                onClick={() => {
                  onSizeChanged(size);
                }}
              >
                <span>{size}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col py-2">
            <span>Fotos</span>
            <input
              type="file"
              {...register('images')}
              multiple
              accept="image/png, image/jpeg, image/avif"
              className="mb-2 rounded border bg-gray-200 px-5 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {product.ProductImage?.map((image) => (
              <div key={image.id} className="w-50 h-50 relative mr-2 rounded-md border">
                <ProductImageCard
                  key={image.id}
                  alt={product.title ?? ''}
                  className="h-full w-full object-cover"
                  height={300}
                  src={image.imageUrl}
                  width={300}
                />

                <button
                  className="absolute right-0 top-0 rounded-full bg-red-500 p-2 text-white"
                  type="button"
                  onClick={() => deleteProductImage(image.id, image.imageUrl)}
                >
                  <IoTrashOutline size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}
