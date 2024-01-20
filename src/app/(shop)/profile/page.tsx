import { redirect } from 'next/navigation';

import { auth } from '@/auth.config';
import { Title } from '@/components';

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) redirect('/');

  return (
    <div>
      <Title title="Profile" />
      <pre>
        <code>{JSON.stringify(session, null, 2)}</code>
      </pre>
      <span className="mb-10 text-2xl">{session.user.role}</span>
    </div>
  );
}
