'use server';

import { revalidatePath } from 'next/cache';
import { v2 as cloudinary } from 'cloudinary';

import { pathCloudinary } from '@/utils/pathEcommerceCloudinary';

import prisma from './../../lib/prisma';

cloudinary.config(process.env.CLOUDINARY_URL ?? '');

interface Response {
  success: boolean;
  message?: string;
}

// we need to delete images only where stored in cloudinary, if so then delete from database
export const deleteProductImage = async (imageId: string, imageUrl: string): Promise<Response> => {
  if (!imageUrl.startsWith('http')) {
    return {
      success: false,
      message: 'Invalid image URL',
    };
  }
  const publicId = imageUrl.split('/').pop()?.split('.')[0];

  if (!publicId) {
    return {
      success: false,
      message: 'Invalid image URL',
    };
  }

  try {
    // delete from cloudinary
    await cloudinary.uploader.destroy(`${pathCloudinary}/${publicId}`);
    const deletedImage = await prisma.productImage.delete({
      where: { id: imageId },
      select: {
        product: {
          select: {
            slug: true,
          },
        },
      },
    });

    // Revalidate paths
    revalidatePath('/admin/products');
    revalidatePath(`/admin/product/${deletedImage.product.slug}`);
    revalidatePath(`/product/${deletedImage.product.slug}`);

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};
