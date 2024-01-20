import { titleFont } from '@/config/font';

interface TitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function Title({ title, subtitle, className }: TitleProps) {
  return (
    <div className={`mt-3 ${className}`}>
      <h1 className={`${titleFont.className} my-7 text-4xl font-semibold antialiased`}>{title}</h1>
      {subtitle ? <h3 className="mb-5 text-xl">{subtitle}</h3> : null}
    </div>
  );
}
