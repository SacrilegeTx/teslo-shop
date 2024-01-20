import { redirect } from 'next/navigation';

import { getPaginatedUsers } from '@/actions';
import { Pagination, Title } from '@/components';

import { UsersTable } from './ui/UsersTable';

export const revalidate = 0;

interface AdminProps {
  searchParams: {
    page?: string;
  };
}

export default async function AdminUsersPage({ searchParams }: AdminProps) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const allUsers = await getPaginatedUsers({ page });

  if (!allUsers) {
    redirect('/auth/new-account');
  }

  const { total, users, status } = allUsers;

  if (!status) {
    redirect('/auth/login');
  }

  return (
    <>
      <Title title="Mantenimiento de usuarios" />

      <div className="mb-10">
        <UsersTable users={users} />
        {total! > 1 && <Pagination totalPages={total!} />}
      </div>
    </>
  );
}
