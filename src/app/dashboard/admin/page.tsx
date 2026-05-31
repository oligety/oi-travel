import { auth } from '@/auth';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { ArrowLeft, Users } from 'lucide-react';
import { format } from 'date-fns';

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  if (session.user.role !== 'ADMIN') {
    notFound(); // Hide the admin page completely for non-admins
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/dashboard"
              className="inline-block mb-4 text-zinc-400 hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2 text-sm">
                <ArrowLeft size={16} /> Back to Dashboard
              </span>
            </Link>
            <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
              <Users className="text-primary-400" /> Admin Portal
            </h1>
            <p className="text-zinc-400 mt-2">
              Manage users and global application settings.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-zinc-900/30 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-zinc-400">Name</TableHead>
                <TableHead className="text-zinc-400">Email</TableHead>
                <TableHead className="text-zinc-400">Role</TableHead>
                <TableHead className="text-zinc-400">Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  className="border-white/10 hover:bg-white/5 transition-colors"
                >
                  <TableCell className="font-medium text-zinc-200">
                    {user.name || 'N/A'}
                  </TableCell>
                  <TableCell className="text-zinc-400">{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.role === 'ADMIN'
                          ? 'bg-rose-400/10 text-rose-400 border border-rose-400/20'
                          : user.role === 'VIEWER'
                            ? 'bg-blue-400/10 text-blue-400 border border-blue-400/20'
                            : 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'
                      }`}
                    >
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-zinc-500">
                    {format(user.createdAt, 'MMM d, yyyy')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
