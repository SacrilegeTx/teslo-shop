import { titleFont } from '@/config/font';

export function Footer() {
  // Footer
  return (
    <footer className="bg-transparent">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <span className={`${titleFont.className} text-center font-bold text-gray-500 antialiased`}>
          Teslo
        </span>
        <span className="text-center text-gray-500">| Shop</span>
        <span className="text-center text-sm text-gray-500">
          &copy; 2023 <a href="#" />
        </span>
      </div>
    </footer>
  );
}
