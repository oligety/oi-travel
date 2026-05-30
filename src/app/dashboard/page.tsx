import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { signOut } from '@/auth';
import { Map, Compass, Plus } from 'lucide-react';
export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

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
            <Button className="font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20">
              <Plus size={16} className="mr-2" />
              New Trip
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Empty State Card */}
            <div className="glass-panel flex flex-col items-center justify-center rounded-3xl p-10 text-center col-span-full py-20 border-dashed border-2 border-zinc-800">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 border border-white/5">
                <Compass className="text-primary-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-zinc-200">
                No trips planned yet
              </h3>
              <p className="mt-2 text-zinc-500 max-w-sm">
                Your passport is waiting. Start exploring destinations and
                crafting your first perfect itinerary.
              </p>
              <Button className="mt-6 font-medium shadow-lg shadow-primary/20 px-8 bg-primary hover:bg-primary/90">
                Explore Destinations
              </Button>
            </div>

            {/* Future trips will render here as cards */}
          </div>
        </section>
      </main>
    </div>
  );
}
