'use client';

import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-950">
      {/* Dynamic Background Glowing Orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-[10%] top-[10%] h-[500px] w-[500px] rounded-full bg-primary-600/30 blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className="absolute -right-[10%] bottom-[10%] h-[600px] w-[600px] rounded-full bg-emerald-700/20 blur-[150px]"
        />
      </div>

      {/* Main Content Area */}
      <div className="z-10 w-full max-w-6xl px-6 lg:px-8 mt-[-8vh]">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-zinc-300 backdrop-blur-md"
          >
            ✨ The future of travel planning is here
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl font-extrabold tracking-tight sm:text-7xl md:text-8xl text-white drop-shadow-sm"
          >
            Design Your <br className="hidden sm:block" />
            <span className="text-gradient">Perfect Trip</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400 font-light"
          >
            Discover, plan, and organize your global itineraries effortlessly.
            Experience a curated journey tailored exactly to your lifestyle.
          </motion.p>
        </div>

        {/* Floating Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-16 mx-auto max-w-4xl"
        >
          <div className="glass-panel rounded-3xl p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-3 sm:gap-2 transition-all hover:border-white/20">
            <div className="flex-1 w-full">
              <Input
                placeholder="Where do you want to go?"
                startContent={<MapPin className="text-zinc-500" size={20} />}
                classNames={{
                  inputWrapper:
                    'bg-transparent border-none shadow-none hover:bg-white/5 focus-within:!bg-white/10 h-14 transition-colors',
                  input: 'text-lg placeholder:text-zinc-500',
                }}
              />
            </div>
            <div className="hidden sm:block w-px h-10 bg-white/10" />
            <div className="flex-[0.7] w-full">
              <Input
                type="text"
                placeholder="Dates"
                startContent={<Calendar className="text-zinc-500" size={20} />}
                classNames={{
                  inputWrapper:
                    'bg-transparent border-none shadow-none hover:bg-white/5 focus-within:!bg-white/10 h-14 transition-colors',
                  input: 'text-lg placeholder:text-zinc-500',
                }}
              />
            </div>
            <div className="w-full sm:w-auto mt-2 sm:mt-0">
              <Button
                size="lg"
                className="w-full sm:w-auto h-14 px-8 font-semibold text-base rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-shadow border-0"
                endContent={<ArrowRight size={18} />}
              >
                Explore
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Top Navigation Login Link (Absolute positioned for Landing) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute top-8 right-8"
        >
          <Button
            as={Link}
            href="/login"
            variant="flat"
            className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-md rounded-full font-medium px-6"
          >
            Sign In
          </Button>
        </motion.div>
      </div>
    </main>
  );
}
