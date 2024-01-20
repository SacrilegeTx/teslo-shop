'use client';
import type { User } from '@/interfaces';

import { changeUserRole } from '@/actions';

interface UsersProps {
  users: User[];
}

export function UsersTable({ users }: UsersProps) {
  return (
    <table className="min-w-full">
      <thead className="border-b bg-gray-200">
        <tr>
          <th className="px-6 py-4 text-left text-sm font-medium text-gray-900" scope="col">
            Email
          </th>
          <th className="px-6 py-4 text-left text-sm font-medium text-gray-900" scope="col">
            Nombre completo
          </th>
          <th className="px-6 py-4 text-left text-sm font-medium text-gray-900" scope="col">
            Role
          </th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr
            key={user.id}
            className="border-b bg-white transition duration-300 ease-in-out hover:bg-gray-100"
          >
            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
              {user.email}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm font-light uppercase text-gray-900">
              {user.name}
            </td>
            <td className="flex items-center whitespace-nowrap  px-6 py-4 text-sm font-light text-gray-900">
              {/* Create a new select for roles with new classnames */}
              <select
                className="rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={user.role}
                onChange={(e) => {
                  void changeUserRole(user.id, e.target.value);
                }}
              >
                <option value="ADMIN">Admin</option>
                <option value="USER">User</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
