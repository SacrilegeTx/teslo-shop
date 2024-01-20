import Image from 'next/image';

interface ProductProps {
  src?: string;
  alt: string;
  className?: React.StyleHTMLAttributes<HTMLImageElement>['className'];
  height: number;
  width: number;
}

export function ProductImageCard({ src, alt, className, height, width }: ProductProps) {
  const defaultSrc = src
    ? src.startsWith('http')
      ? src
      : `/products/${src}`
    : '/imgs/placeholder.jpg';

  return (
    <Image
      alt={alt}
      className={className}
      height={height}
      priority={false}
      src={defaultSrc}
      width={width}
    />
  );
}
