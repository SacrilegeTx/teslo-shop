import type { CartProduct } from '@/interfaces';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { taxProduct } from '@/utils';

interface SummayInformation {
  totalItems: number;
  subTotalPrice: number;
  totalPrice: number;
  tax: number;
}

interface StateInterface {
  cart: CartProduct[];
  addProductToCart: (product: CartProduct) => void;
  updateProductInCart: (product: CartProduct, quantity: number) => void;
  removeProductFromCart: (product: CartProduct) => void;
  getSummaryInformation: () => SummayInformation;
  clearCart: () => void;
}

export const useCartStore = create<StateInterface>()(
  persist(
    (set, get) => ({
      cart: [],
      addProductToCart: (product: CartProduct) => {
        const { cart } = get();
        const productInCart = cart.some(
          (item) => item.id === product.id && item.size === product.size,
        );

        if (productInCart) {
          set({
            cart: cart.map((item) =>
              item.id === product.id && item.size === product.size
                ? { ...item, quantity: item.quantity + product.quantity }
                : item,
            ),
          });
        } else {
          set({ cart: [...cart, product] });
        }
      },
      updateProductInCart: (product: CartProduct, quantity: number) => {
        const { cart } = get();

        set({
          cart: cart.map((item) =>
            item.id === product.id && item.size === product.size ? { ...item, quantity } : item,
          ),
        });
      },
      removeProductFromCart: (product: CartProduct) => {
        const { cart } = get();

        set({
          cart: cart.filter((item) => item.id !== product.id || item.size !== product.size),
        });
      },
      getSummaryInformation: () => {
        const { cart } = get();
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        const subTotalPrice = cart.reduce((acc, item) => acc + item.quantity * item.price, 0);
        const tax = subTotalPrice * taxProduct;
        const totalPrice = subTotalPrice + tax;

        return { totalItems, subTotalPrice, totalPrice, tax };
      },
      clearCart: () => {
        set({ cart: [] });
      },
    }),
    { name: 'shopping-cart' },
  ),
);
