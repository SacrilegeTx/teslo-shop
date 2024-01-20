'use server';

import type { Size } from '@/interfaces';

import { z } from 'zod';
import { Gender, type Product } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { v2 as cloudinary } from 'cloudinary';

import { pathCloudinary } from '@/utils/pathEcommerceCloudinary';

import prisma from './../../lib/prisma';

cloudinary.config(process.env.CLOUDINARY_URL ?? '');

const productSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  title: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  description: z.string(),
  price: z.coerce
    .number()
    .min(0)
    .transform((val) => Number(val.toFixed(2))),
  inStock: z.coerce
    .number()
    .min(0)
    .transform((val) => Number(val.toFixed(0))),
  categoryId: z.string().uuid(),
  sizes: z.coerce.string().transform((val) => val.split(',').map((size) => size.trim())),
  tags: z.string(),
  gender: z.nativeEnum(Gender),
});

interface Response {
  success: boolean;
  message?: string | z.ZodError<Product>;
  productTx?: Product;
}

export const createOrUpdatProduct = async (formData: FormData): Promise<Response> => {
  const data = Object.fromEntries(formData.entries());
  const parsedProduct = productSchema.safeParse(data);

  if (!parsedProduct.success) {
    return {
      success: false,
      message: parsedProduct.error,
    };
  }
  const productForm = parsedProduct.data;
  const { id, ...restProduct } = productForm;

  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      let productTx: Product;
      const tagsArray = restProduct.tags.split(',').map((tag) => tag.trim());

      if (id) {
        productTx = await tx.product.update({
          where: { id },
          data: {
            ...restProduct,
            sizes: {
              set: restProduct.sizes as Size[],
            },
            tags: {
              set: tagsArray,
            },
          },
        });
      } else {
        productTx = await tx.product.create({
          data: {
            ...restProduct,
            sizes: {
              set: restProduct.sizes as Size[],
            },
            tags: {
              set: tagsArray,
            },
          },
        });
      }

      // Load & save images
      const images = formData.getAll('images');

      if (images) {
        const uploadedImages = await uploadImages(images as File[]);

        if (!uploadedImages) {
          throw new Error('Error uploading images');
        }
        // insert into ProductImage table & associate with product
        await tx.productImage.createMany({
          data: uploadedImages.map((url) => ({
            imageUrl: url,
            productId: productTx.id,
          })),
        });
      }

      return {
        productTx,
      };
    });

    // TODO: revalidate paths
    revalidatePath('/admin/products');
    revalidatePath(`/admin/product/${prismaTx.productTx.slug}`);
    revalidatePath(`/products/${prismaTx.productTx.slug}`);

    return {
      success: true,
      productTx: prismaTx.productTx,
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

const uploadImages = async (images: File[]): Promise<string[] | null> => {
  try {
    const uploadedImages = await Promise.all(
      images.map(async (image) => {
        const buffer = await image.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const uploadedImage = await cloudinary.uploader.upload(`data:image/png;base64,${base64}`, {
          folder: pathCloudinary,
        });

        return uploadedImage.secure_url;
      }),
    );

    return uploadedImages;
  } catch (error) {
    return null;
  }
};
