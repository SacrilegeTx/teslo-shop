import clsx from 'clsx';
import { IoCardOutline } from 'react-icons/io5';

interface PaidProps {
  isPaid: boolean;
}

export function PaidOrder({ isPaid }: PaidProps) {
  return (
    <div
      className={clsx(
        'mb-5 flex items-center rounded-lg px-3.5 py-2 text-xs font-bold text-white',
        {
          'bg-red-500': !isPaid,
          'bg-green-700': isPaid,
        },
      )}
    >
      <IoCardOutline className="mr-2" size={30} />
      <span className="mx-2">{isPaid ? 'Orden Pagada' : 'Pendiente de pago'}</span>
    </div>
  );
}
