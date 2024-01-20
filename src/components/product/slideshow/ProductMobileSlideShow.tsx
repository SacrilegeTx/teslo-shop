'use client';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

import './slideshow.css';

import { Autoplay, FreeMode, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { ProductImageCard } from '@/components';

interface ProductMobileProps {
  images: string[];
  title: string;
  className?: string;
}

export function ProductMobileSlideShow({ images, title, className }: ProductMobileProps) {
  return (
    <div className={className}>
      <Swiper
        pagination
        autoplay={{ delay: 2500 }}
        className="mySwiper2"
        modules={[FreeMode, Autoplay, Pagination]}
        style={{
          width: '100vw',
          height: '500px',
          accentColor: 'white',
        }}
      >
        {images.map((image) => (
          <SwiperSlide key={image}>
            <ProductImageCard
              alt={title}
              className="object-fill"
              height={500}
              src={image}
              width={600}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
