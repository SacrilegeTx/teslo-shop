import Link from 'next/link';

import { ProductImageCard } from '@/components';
import { titleFont } from '@/config/font';

export function PageNotFound() {
  return (
    <div className="flex h-[800px] w-full flex-col-reverse items-center justify-center align-middle md:flex-row">
      <div className="mx-5 px-5 text-center">
        <h2 className={`${titleFont.className} text-9xl antialiased`}>404</h2>
        <p className="text-xl font-semibold">Whoops! Lo sentimos mucho.</p>
        <p className="font-light">
          <span>Puedes regresar al </span>
          <Link className="font-normal transition-all hover:underline" href="/">
            inicio
          </Link>
        </p>
      </div>

      <div className="mx-5 px-5">
        <ProductImageCard
          alt="Starman"
          className="p-5 sm:p-0"
          height={550}
          src="/imgs/starman_750x750.png"
          width={550}
        />
      </div>
    </div>
  );
}
