'use client';
import type { Size, Product, CartProduct } from '@/interfaces';

import { useState } from 'react';

import { QuantitySelector, SizeSelector } from '@/components';
import { useCartStore } from '@/store/cart/cart-store';

interface CartProps {
  product: Product;
}

export function AddToCart({ product }: CartProps) {
  const [size, setSize] = useState<Size | undefined>();
  const [quantity, setQuantity] = useState<number>(1);
  const [posted, setPosted] = useState(false);
  const addProductToCart = useCartStore((state) => state.addProductToCart);

  const addToCart = (): void => {
    setPosted(true);
    if (!size) {
      return;
    }
    const cartProduct: CartProduct = {
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      size,
      quantity,
      image: product.images[0],
    };

    addProductToCart(cartProduct);
    setPosted(false);
    setSize(undefined);
    setQuantity(1);
  };

  return (
    <>
      {posted && !size ? (
        <span className="fade-in mt-2 text-red-500">Debe seleccionar una talla*</span>
      ) : null}
      {/* Size select in line */}
      <div className="my-5">
        <p className="text-xl font-bold text-gray-500">Tallas disponibles</p>
        <SizeSelector availableSizes={product.sizes} selectedSize={size} onSizeSelected={setSize} />
      </div>
      {/* Quantity */}
      <div className="mt-5">
        <p className="text-xl font-bold text-gray-500">Cantidad</p>
        <QuantitySelector quantity={quantity} onQuantityChanged={setQuantity} />
      </div>
      <div className="mt-5">
        <button
          className="rounded-md bg-gray-800 px-5 py-2 text-white hover:bg-indigo-600"
          type="button"
          onClick={addToCart}
        >
          Agregar al carrito
        </button>
      </div>
    </>
  );
}
