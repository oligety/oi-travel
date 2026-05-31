import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { signOut } from '@/auth';
import { Map, Plus, Settings } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { ItineraryList } from './itinerary-list';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const role = session.user.role;

  // Show all itineraries for everyone
  const itineraries = await prisma.itinerary.findMany({
    orderBy: { startDate: 'asc' },
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-white/5 bg-zinc-950/80 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-primary-500 to-emerald-400 text-zinc-950">
            <Map size={18} strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold tracking-tight">OI Travel</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-400 hidden sm:inline-block">
            {session.user.email}
          </span>
          {role === 'ADMIN' && (
            <Link href="/dashboard/admin">
              <Button
                size="sm"
                variant="ghost"
                className="text-zinc-200 hover:bg-white/10"
              >
                <Settings size={16} className="mr-2" />
                Admin
              </Button>
            </Link>
          )}
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/login' });
            }}
          >
            <Button
              type="submit"
              size="sm"
              variant="ghost"
              className="bg-white/10 text-zinc-200 hover:bg-rose-500/20 hover:text-rose-400 font-medium h-9 px-4"
            >
              Sign Out
            </Button>
          </form>
        </div>
      </nav>

      {/* Main Content Dashboard */}
      <main className="mx-auto max-w-6xl px-6 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-light tracking-tight">
            Welcome back,{' '}
            <span className="font-semibold text-gradient">
              {session.user.name || 'Traveler'}
            </span>
          </h1>
          <p className="mt-2 text-zinc-400">
            Here&apos;s an overview of your upcoming global adventures.
          </p>
        </header>

        {/* Trips Grid section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Your Itineraries</h2>
            {role !== 'VIEWER' && (
              <Link href="/dashboard/itineraries/new">
                <Button className="font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20">
                  <Plus size={16} className="mr-2" />
                  New Trip
                </Button>
              </Link>
            )}
          </div>

          <ItineraryList
            itineraries={itineraries}
            role={role}
            currentUserId={session.user.id}
          />
        </section>
      </main>
    </div>
  );
}
