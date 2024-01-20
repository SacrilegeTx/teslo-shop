'use client';
import { IoAddCircleOutline, IoRemoveCircleOutline } from 'react-icons/io5';

interface QuantityProps {
  quantity: number;
  onQuantityChanged: (value: number) => void;
}

export function QuantitySelector({ quantity, onQuantityChanged }: QuantityProps) {
  // const [count, setCount] = useState(quantity)
  const onValueChanged = (value: number): void => {
    if (quantity + value < 1 || quantity + value > 5) {
      return;
    }
    onQuantityChanged(quantity + value);
  };

  return (
    <div className="mt-2 flex gap-3">
      <button className="rounded-md px-3 py-1" type="button" onClick={() => onValueChanged(-1)}>
        <IoRemoveCircleOutline size={30} />
      </button>
      <p className="rounded px-3 py-1 text-center">{quantity}</p>
      <button className="rounded-md px-3 py-1" type="button" onClick={() => onValueChanged(1)}>
        <IoAddCircleOutline size={30} />
      </button>
    </div>
  );
}
