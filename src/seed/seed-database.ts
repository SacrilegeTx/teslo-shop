/* eslint-disable no-console */

import type { Size } from '@prisma/client';

import { initialData } from './seed';
import prisma from './../lib/prisma';
import { countries } from './seed-countries';

async function main() {
  // Borrar registros previos
  await Promise.all([
    prisma.orderAddress.deleteMany(),
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),
    prisma.userAddress.deleteMany(),
    prisma.countries.deleteMany(),
    prisma.user.deleteMany(),
    prisma.productImage.deleteMany(),
    prisma.category.deleteMany(),
    prisma.product.deleteMany(),
  ]);
  // Insertar usuarios en masa y sus roles
  const users = await prisma.user.createMany({
    data: initialData.users,
  });

  console.log({ users });
  // Insertar las categorias en masa
  const categories = await prisma.category.createMany({
    data: initialData.categories.map((category) => ({ name: category })),
  });

  console.log({ categories });
  // Extraer todas las categorias de la base de datos y convertirlos en un Map Record<string, string> para poder acceder a ellos por nombre
  const categoriesByName = (await prisma.category.findMany()).reduce<Record<string, string>>(
    (obj, category) => {
      obj[category.name.toLocaleLowerCase()] = category.id.toString();

      return obj;
    },
    {},
  );

  console.log({ categoriesByName });
  // Insertar los productos en masa pero se tiene que usar el id de las categorias respectivas
  const products = await prisma.product.createMany({
    data: initialData.products.map((product) => ({
      title: product.title,
      description: product.description,
      price: product.price,
      inStock: product.inStock,
      slug: product.slug,
      gender: product.gender,
      categoryId: categoriesByName[product.type] ?? '',
      tags: product.tags,
      sizes: product.sizes as Size[],
    })),
  });

  console.log({ products });
  // Insertar las imagenes asociandolas a los productos, esto de la inserción anterior
  // La imagen no tiene un productId como campo por lo que se tiene que iterar de nuevo el array de productos inicial
  // el array inicial tampoco tiene el campo id por lo que se tiene que extraer de la inserción anterior
  const productsWithId = await prisma.product.findMany();

  if (productsWithId.length !== initialData.products.length) {
    throw new Error(
      'The number of products inserted does not match the number of products to be inserted',
    );
  }
  if (productsWithId === undefined) return;
  const images = await prisma.productImage.createMany({
    data: initialData.products.flatMap((product, index) =>
      product.images.map((image) => ({
        imageUrl: image,
        productId: productsWithId[index].id,
      })),
    ),
  });

  console.log({ images });
  // Insertar paises en masa SeedCountry[]
  const country = await prisma.countries.createMany({
    data: countries,
  });

  // print 10 first countries
  console.log({ country });

  console.log('Seed executed successfully');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
