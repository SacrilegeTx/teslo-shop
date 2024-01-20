'use client';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { type ReactElement } from 'react';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';

import { generatePaginationNumbers } from '@/utils';

interface PaginationProps {
  totalPages: number;
}

export function Pagination({ totalPages }: PaginationProps): ReactElement {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const pageString = searchParams.get('page') ?? 1;
  const currentPage = isNaN(+pageString) ? 1 : +pageString;
  const allPages = generatePaginationNumbers(currentPage, totalPages);

  const createPagination = (pageNumber: number | string): string => {
    const params = new URLSearchParams(searchParams);

    if (pageNumber === '...') {
      return `${pathName}?${params.toString()}`;
    }

    if (+pageNumber <= 0) {
      return pathName;
    }

    if (+pageNumber > totalPages) {
      return `${pathName}?${params.toString()}`;
    }
    params.set('page', String(pageNumber));

    return `${pathName}?${params.toString()}`;
  };

  return (
    <div className="mb-32 mt-10 flex justify-center text-center">
      <nav aria-label="Page navigation example">
        <ul className="list-style-none flex">
          <li className="page-item disabled">
            <Link
              className="page-link relative block rounded border-0 bg-transparent px-3 py-1.5 text-gray-800 outline-none transition-all duration-300 hover:bg-gray-200 hover:text-gray-800 focus:shadow-none"
              href={createPagination(currentPage - 1)}
            >
              <IoChevronBackOutline size={30} />
            </Link>
          </li>
          {allPages.map((page, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={page + '-' + index} className="page-item">
              <Link
                className={clsx(
                  'page-link relative block rounded border-0 px-3 py-1.5 text-gray-800 outline-none transition-all duration-300 hover:bg-gray-200 hover:text-gray-800 focus:shadow-none',
                  {
                    'bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 hover:text-white':
                      currentPage === page,
                    disabled: currentPage === totalPages,
                  },
                )}
                href={createPagination(page)}
              >
                {page}
              </Link>
            </li>
          ))}

          <li className="page-item">
            <Link
              className="page-link relative block rounded border-0 bg-transparent px-3 py-1.5 text-gray-800 outline-none transition-all duration-300 hover:bg-gray-200 hover:text-gray-800 focus:shadow-none"
              href={createPagination(currentPage + 1)}
            >
              <IoChevronForwardOutline size={30} />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
