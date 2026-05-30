'use client';

import { useState } from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Mail, Lock, Eye, EyeOff, Plane } from 'lucide-react';
import { loginAction } from '@/actions/auth';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);
    const result = await loginAction(formData);
    if (result?.error) {
      setError(result.error);
    }
    setIsPending(false);
  }

  return (
    <main className="flex min-h-screen bg-zinc-950 text-zinc-50">
      {/* Left Pane - Visual */}
      <div className="relative hidden lg:flex flex-1 flex-col justify-between overflow-hidden bg-zinc-900/50 border-r border-white/5 p-12">
        <div className="absolute inset-0 z-0">
          <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-primary-600/20 blur-[100px]" />
          <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-emerald-600/20 blur-[100px]" />
        </div>

        <div className="z-10 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-500 to-emerald-400 text-zinc-950">
            <Plane size={24} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight">OI Travel</span>
        </div>

        <div className="z-10 max-w-md">
          <h2 className="text-4xl font-light leading-tight mb-4 text-zinc-200">
            Welcome back to your <br />
            <span className="text-gradient font-semibold">
              global adventures
            </span>
          </h2>
          <p className="text-zinc-400">
            Sign in to manage your premium itineraries, explore new
            destinations, and organize your trips seamlessly.
          </p>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="flex flex-1 items-center justify-center p-8 sm:p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-semibold mb-2">Sign In</h1>
            <p className="text-zinc-400 text-sm">
              Enter your credentials to access your account
            </p>
          </div>

          <form action={handleSubmit} className="flex flex-col gap-6 mt-4">
            <Input
              name="email"
              type="email"
              aria-label="Email"
              placeholder="Enter your email"
              variant="bordered"
              size="lg"
              startContent={<Mail className="text-zinc-500" size={18} />}
              isRequired
              classNames={{
                inputWrapper:
                  'border-white/10 bg-zinc-900/50 hover:border-white/20 focus-within:!border-emerald-500',
                input: 'text-zinc-100 placeholder:text-zinc-500',
              }}
            />
            <Input
              name="password"
              aria-label="Password"
              placeholder="Enter your password"
              variant="bordered"
              size="lg"
              startContent={<Lock className="text-zinc-500" size={18} />}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                  aria-label="toggle password visibility"
                >
                  {isVisible ? (
                    <EyeOff
                      className="text-zinc-500 pointer-events-none"
                      size={18}
                    />
                  ) : (
                    <Eye
                      className="text-zinc-500 pointer-events-none"
                      size={18}
                    />
                  )}
                </button>
              }
              type={isVisible ? 'text' : 'password'}
              isRequired
              classNames={{
                inputWrapper:
                  'border-white/10 bg-zinc-900/50 hover:border-white/20 focus-within:!border-emerald-500',
                input: 'text-zinc-100 placeholder:text-zinc-500',
              }}
            />

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
              isLoading={isPending}
              size="lg"
              className="mt-2 font-medium text-base rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-emerald-500/20 border-0"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-zinc-500">Don&apos;t have an account? </span>
            <Link
              href="/signup"
              className="text-primary-400 hover:text-primary-300 hover:underline font-medium transition-colors"
            >
              Sign up for free
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
