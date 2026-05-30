'use client';

import { useState } from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { signUpAction } from '@/actions/auth';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
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
    } else if (result?.success) {
      router.push('/login');
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-primary-500/10 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-primary-700/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card
          className="w-full bg-background/60 dark:bg-default-100/50"
          isBlurred
          shadow="lg"
        >
          <CardHeader className="flex flex-col gap-1 items-center pb-0 pt-8">
            <h1 className="text-2xl font-bold">Create an account</h1>
            <p className="text-sm text-default-500">Join OI Travel today</p>
          </CardHeader>
          <CardBody className="p-8">
            <form action={handleSubmit} className="flex flex-col gap-4">
              <Input
                name="name"
                type="text"
                label="Name"
                placeholder="Enter your name"
                variant="bordered"
                startContent={<User className="text-default-400" size={18} />}
                isRequired
              />
              <Input
                name="email"
                type="email"
                label="Email"
                placeholder="Enter your email"
                variant="bordered"
                startContent={<Mail className="text-default-400" size={18} />}
                isRequired
              />
              <Input
                name="password"
                label="Password"
                placeholder="Create a password"
                variant="bordered"
                startContent={<Lock className="text-default-400" size={18} />}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                    aria-label="toggle password visibility"
                  >
                    {isVisible ? (
                      <EyeOff
                        className="text-2xl text-default-400 pointer-events-none"
                        size={18}
                      />
                    ) : (
                      <Eye
                        className="text-2xl text-default-400 pointer-events-none"
                        size={18}
                      />
                    )}
                  </button>
                }
                type={isVisible ? 'text' : 'password'}
                isRequired
              />

              {error && <p className="text-sm text-danger">{error}</p>}

              <Button
                color="primary"
                type="submit"
                isLoading={isPending}
                className="mt-4 font-semibold shadow-md"
              >
                Sign Up
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-default-500">
                Already have an account?{' '}
              </span>
              <Link
                href="/login"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </main>
  );
}
