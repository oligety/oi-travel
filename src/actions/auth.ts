'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function signUpAction(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const parsed = signUpSchema.safeParse(data);

  if (!parsed.success) {
    return {
      error: 'Invalid input data',
      fields: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = parsed.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: 'Email already in use' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return { success: true };
  } catch {
    return { error: 'Something went wrong' };
  }
}

export async function loginAction(formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  try {
    await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirectTo: '/dashboard',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials.' };
        default:
          return { error: 'Something went wrong.' };
      }
    }
    throw error;
  }
}
