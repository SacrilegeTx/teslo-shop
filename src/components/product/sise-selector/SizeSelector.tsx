import type { Size } from '@/interfaces';

import clsx from 'clsx';

interface SizeProps {
  selectedSize?: Size;
  availableSizes: Size[];
  onSizeSelected: (size: Size) => void;
}

export function SizeSelector({ selectedSize, availableSizes, onSizeSelected }: SizeProps) {
  return (
    <div className="mt-2 flex gap-3">
      {availableSizes.map((size) => (
        <button
          key={size}
          className={clsx('rounded-md bg-gray-800 px-3 py-1 text-white hover:bg-indigo-600', {
            'bg-indigo-600': size === selectedSize,
          })}
          type="button"
          onClick={() => {
            onSizeSelected(size);
          }}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
