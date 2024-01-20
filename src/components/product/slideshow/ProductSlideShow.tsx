'use client';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import './slideshow.css';

import { useState, type CSSProperties } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { type Swiper as SwiperCore } from 'swiper';
import { Autoplay, FreeMode, Navigation, Thumbs } from 'swiper/modules';

import { ProductImageCard } from '@/components';

interface ProductSlideProps {
  images: string[];
  title: string;
  className?: string;
}

export function ProductSlideShow({ images, title, className }: ProductSlideProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore>();

  return (
    <div className={className}>
      <Swiper
        navigation
        autoplay={{ delay: 2500 }}
        className="mySwiper2"
        modules={[FreeMode, Navigation, Thumbs, Autoplay]}
        spaceBetween={10}
        style={
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          {
            '--swiper-navigation-color': '#fff',
            '--swiper-pagination-color': '#fff',
          } as CSSProperties
        }
        // && !thumbsSwiper.destroyed ? thumbsSwiper : null <- solucion en caso falle la app
        thumbs={{ swiper: thumbsSwiper }}
      >
        {images.map((image) => (
          <SwiperSlide key={image}>
            <ProductImageCard
              alt={title}
              className="rounded-lg object-fill"
              height={800}
              src={image}
              width={1024}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        freeMode
        watchSlidesProgress
        className="mySwiper"
        modules={[FreeMode, Navigation, Thumbs]}
        slidesPerView={4}
        spaceBetween={10}
        onSwiper={setThumbsSwiper}
      >
        {images.map((image) => (
          <SwiperSlide key={image}>
            <ProductImageCard
              alt={title}
              className="rounded-lg object-fill"
              height={300}
              src={image}
              width={300}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
