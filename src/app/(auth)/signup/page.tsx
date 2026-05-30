'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, Lock, Eye, EyeOff, Plane } from 'lucide-react';
import { signUpAction } from '@/actions/auth';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);
    const result = await signUpAction(formData);

    if (result?.error) {
      setError(result.error);
      setIsPending(false);
    } else {
      router.push('/login');
    }
  }

  return (
    <main className="flex min-h-screen bg-zinc-950 text-zinc-50">
      {/* Left Side - Brand / Info (Hidden on mobile) */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-white/5 bg-zinc-950 p-12 lg:flex">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-primary-600/20 blur-[100px]" />
          <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-emerald-600/20 blur-[100px]" />
        </div>

        <div className="z-10 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-500 to-emerald-400 text-zinc-950">
            <Plane size={24} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-100">
            OI Travel
          </span>
        </div>

        <div className="z-10 max-w-md">
          <h2 className="text-4xl font-light leading-tight mb-4 text-zinc-200">
            Begin your <br />
            <span className="text-gradient font-semibold">
              global adventures
            </span>
          </h2>
          <p className="text-zinc-400">
            Join our premium community of travelers. Curate your perfect
            itineraries and explore the world seamlessly.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-1 items-center justify-center p-8 sm:p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-semibold mb-2">Create Account</h1>
            <p className="text-zinc-400 text-sm">
              Enter your details to get started
            </p>
          </div>

          <form action={handleSubmit} className="flex flex-col gap-6 mt-4">
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                size={18}
              />
              <Input
                name="name"
                type="text"
                aria-label="Full Name"
                placeholder="Enter your name"
                className="pl-10 h-12 border-white/10 bg-zinc-900/50 hover:border-white/20 focus-visible:ring-1 focus-visible:ring-emerald-500 text-zinc-100 placeholder:text-zinc-500 rounded-xl"
                required
              />
            </div>

            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                size={18}
              />
              <Input
                name="email"
                type="email"
                aria-label="Email"
                placeholder="Enter your email"
                className="pl-10 h-12 border-white/10 bg-zinc-900/50 hover:border-white/20 focus-visible:ring-1 focus-visible:ring-emerald-500 text-zinc-100 placeholder:text-zinc-500 rounded-xl"
                required
              />
            </div>

            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                size={18}
              />
              <Input
                name="password"
                type={isVisible ? 'text' : 'password'}
                aria-label="Password"
                placeholder="Create a password"
                className="pl-10 pr-10 h-12 border-white/10 bg-zinc-900/50 hover:border-white/20 focus-visible:ring-1 focus-visible:ring-emerald-500 text-zinc-100 placeholder:text-zinc-500 rounded-xl"
                required
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none"
                type="button"
                onClick={toggleVisibility}
                aria-label="toggle password visibility"
              >
                {isVisible ? (
                  <EyeOff
                    className="text-zinc-500 hover:text-zinc-300 transition-colors"
                    size={18}
                  />
                ) : (
                  <Eye
                    className="text-zinc-500 hover:text-zinc-300 transition-colors"
                    size={18}
                  />
                )}
              </button>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-sm text-rose-500 bg-rose-500/10 px-4 py-2 rounded-lg border border-rose-500/20"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="mt-2 h-12 font-medium text-base rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-emerald-500/20 border-0 hover:opacity-90"
            >
              {isPending ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-zinc-500">Already have an account? </span>
            <Link
              href="/login"
              className="text-primary-400 hover:text-primary-300 hover:underline font-medium transition-colors"
            >
              Sign in instead
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
