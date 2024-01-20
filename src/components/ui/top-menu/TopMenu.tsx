'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { IoSearchOutline, IoCartOutline } from 'react-icons/io5';

import { titleFont } from '@/config/font';
import { useCartStore } from '@/store';
import { useUiStore } from '@/store/ui/ui-store';

export function TopMenu() {
  const [loaded, setLoaded] = useState(false);
  const openSideMenu = useUiStore((state) => state.openToggleSideMenu);
  const { totalItems } = useCartStore((state) => state.getSummaryInformation());

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <nav className="flex w-full items-center justify-between px-5">
      {/* Logo */}
      <div>
        <Link href="/">
          <span className={`${titleFont.className} font-bold antialiased`}>Teslo</span>
          <span> | Shop</span>
        </Link>
      </div>
      {/* Center Menu */}
      <div className="hidden sm:block">
        <Link className="m-2 rounded-md p-2 transition-all hover:bg-gray-100" href="/gender/men">
          <span>Hombres</span>
        </Link>
        <Link className="m-2 rounded-md p-2 transition-all hover:bg-gray-100" href="/gender/women">
          <span>Mujeres</span>
        </Link>
        <Link className="m-2 rounded-md p-2 transition-all hover:bg-gray-100" href="/gender/kid">
          <span>Niños</span>
        </Link>
      </div>
      {/* Search, Cart, Menu */}
      <div className="flex items-center">
        <Link className="mx-2" href="/search">
          <IoSearchOutline className="h-5 w-5" />
        </Link>
        <Link className="mx-2" href={totalItems === 0 && loaded ? 'empty' : '/cart'}>
          <div className="relative">
            {loaded && totalItems > 0 ? (
              <span className="fade-in absolute -right-2 -top-2 rounded-full bg-indigo-600 px-1 text-xs text-white">
                {totalItems}
              </span>
            ) : null}
            <IoCartOutline className="h-5 w-5" />
          </div>
        </Link>
        <button
          className="m-2 rounded-md p-2 transition-all hover:bg-gray-100"
          type="button"
          onClick={() => {
            openSideMenu();
          }}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <g fill="none">
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </g>
          </svg>
        </button>
      </div>
    </nav>
  );
}
