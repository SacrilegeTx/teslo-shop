import type { Address } from '@/interfaces';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface StateInterface {
  address: Address;
  setAddress: (address: StateInterface['address']) => void;
}

export const useAddressStore = create<StateInterface>()(
  persist(
    (set, _get) => ({
      address: {
        firstName: '',
        lastName: '',
        address: '',
        address2: '',
        zip: '',
        city: '',
        country: '',
        phone: '',
      },
      setAddress: (address) => {
        set({ address });
      },
    }),
    {
      name: 'address-storage',
    },
  ),
);
