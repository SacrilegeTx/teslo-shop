import { titleFont } from '@/config/font';

export function LoadingProductsInCart() {
  return (
    <div className="flex flex-row justify-center">
      <div className="flex flex-row py-5">
        <div className="w-22 h-22 mr-5 animate-pulse rounded bg-gray-300" />
        <div className="flex flex-col">
          <span className={`${titleFont.className} text-sm antialiased`}>
            Cargando productos...
          </span>
        </div>
      </div>
    </div>
  );
}
