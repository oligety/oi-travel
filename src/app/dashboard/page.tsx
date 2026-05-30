import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Button } from '@heroui/button';
import { signOut } from '@/auth';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-4 text-lg">
        Welcome back, {session.user.name || session.user.email}!
      </p>

      <form
        action={async () => {
          'use server';
          await signOut({ redirectTo: '/login' });
        }}
        className="mt-8"
      >
        <Button type="submit" color="danger" variant="flat">
          Sign Out
        </Button>
      </form>
    </main>
  );
}
