'use client';
import Link from 'next/link';
import clsx from 'clsx';
import React, { type ReactElement } from 'react';
import {
  IoCloseOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoShirtOutline,
  IoTicketOutline,
} from 'react-icons/io5';
import { useSession } from 'next-auth/react';

import { logout } from '@/actions';
import { useUiStore } from '@/store';

export function Sidebar(): ReactElement {
  const isSideMenuOpen = useUiStore((state) => state.isSideMenuOpen);
  const closeSideMenu = useUiStore((state) => state.closeToggleSideMenu);
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user?.role === 'ADMIN';

  // eslint-disable-next-line no-console
  console.log({ session });

  return (
    <div>
      {/* Background black */}
      {isSideMenuOpen ? (
        <div className="fixed inset-0 z-10 h-screen w-screen bg-black bg-opacity-50" />
      ) : null}

      {/* Blur */}
      {isSideMenuOpen ? (
        <div
          className="fade-in fixed inset-0 z-10 h-screen w-screen backdrop-blur-sm backdrop-filter"
          onClick={closeSideMenu}
        />
      ) : null}

      {/* Sidebar */}
      <nav
        className={clsx(
          'fixed right-0 top-0 z-20 h-screen w-[500px] transform bg-white p-5 shadow-2xl transition-all duration-300',
          {
            'translate-x-full': !isSideMenuOpen,
          },
        )}
      >
        <IoCloseOutline
          className="absolute right-5 top-5 cursor-pointer"
          size={30}
          onClick={closeSideMenu}
        />
        {/* Input */}
        <div className="relative mt-14">
          <IoSearchOutline className="absolute left-2 top-2" size={20} />
          <input
            className="w-full rounded border-b-2 border-gray-200 bg-gray-50 pl-10 pr-10 text-center text-xl focus:border-blue-500 focus:outline-none"
            placeholder="Buscar"
            type="text"
          />
        </div>
        {/* Menú */}
        {isAuthenticated ? (
          <>
            <Link
              className="mt-10 flex items-center rounded p-2 transition-all hover:bg-gray-100"
              href="/profile"
              onClick={closeSideMenu}
            >
              <IoPersonOutline className="mr-2" size={30} />
              <span className="ml-3 text-xl">Perfil</span>
            </Link>
            <Link
              className="mt-10 flex items-center rounded p-2 transition-all hover:bg-gray-100"
              href="/orders"
              onClick={closeSideMenu}
            >
              <IoTicketOutline className="mr-2" size={30} />
              <span className="ml-3 text-xl">Ordenes</span>
            </Link>
          </>
        ) : null}
        {isAuthenticated ? (
          <button
            className="mt-10 flex w-full items-center rounded p-2 transition-all hover:bg-gray-100"
            type="button"
            onClick={() => {
              void logout();
            }}
          >
            <IoLogOutOutline className="mr-2" size={30} />
            <span className="ml-3 text-xl">Salir</span>
          </button>
        ) : null}
        {!isAuthenticated && (
          <Link
            className="mt-10 flex items-center rounded p-2 transition-all hover:bg-gray-100"
            href="/auth/login"
            onClick={closeSideMenu}
          >
            <IoLogInOutline className="mr-2" size={30} />
            <span className="ml-3 text-xl">Ingresar</span>
          </Link>
        )}
        {
          /* Admin */
          isAdmin ? (
            <>
              {/* Line separator with div */}
              <div className="mt-10 h-px w-full bg-gray-200" />
              <Link
                className="mt-10 flex items-center rounded p-2 transition-all hover:bg-gray-100"
                href="/admin/products"
                onClick={closeSideMenu}
              >
                <IoShirtOutline className="mr-2" size={30} />
                <span className="ml-3 text-xl">Productos</span>
              </Link>
              <Link
                className="mt-10 flex items-center rounded p-2 transition-all hover:bg-gray-100"
                href="/admin/orders"
                onClick={closeSideMenu}
              >
                <IoTicketOutline className="mr-2" size={30} />
                <span className="ml-3 text-xl">Ordenes</span>
              </Link>
              <Link
                className="mt-10 flex items-center rounded p-2 transition-all hover:bg-gray-100"
                href="/admin/users"
                onClick={closeSideMenu}
              >
                <IoPeopleOutline className="mr-2" size={30} />
                <span className="ml-3 text-xl">Usuarios</span>
              </Link>
            </>
          ) : null
        }
      </nav>
    </div>
  );
}
