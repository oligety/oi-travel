'use client';

import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-primary-700/20 blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="z-10 w-full max-w-5xl px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-extrabold tracking-tight sm:text-7xl"
          >
            Design Your <span className="text-primary-500">Perfect Trip</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 max-w-2xl text-lg leading-8 text-default-500"
          >
            Discover, plan, and organize your travel itinerary all in one place.
            Let&apos;s start your next adventure right now.
          </motion.p>
        </div>

        {/* Search Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 sm:mt-20"
        >
          <Card
            isBlurred
            className="border-none bg-background/60 dark:bg-default-100/50"
            shadow="lg"
          >
            <CardHeader className="pb-0 pt-6 px-6 flex-col items-start">
              <h4 className="font-bold text-large">Plan your itinerary</h4>
            </CardHeader>
            <CardBody className="py-6 px-6">
              <form className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <Input
                    label="Destination"
                    placeholder="Where to?"
                    labelPlacement="outside"
                    size="lg"
                    radius="md"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    type="date"
                    label="Start Date"
                    labelPlacement="outside"
                    size="lg"
                    radius="md"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    type="date"
                    label="End Date"
                    labelPlacement="outside"
                    size="lg"
                    radius="md"
                  />
                </div>
                <div>
                  <Button
                    color="primary"
                    size="lg"
                    radius="md"
                    className="w-full sm:w-auto px-8 font-semibold shadow-lg shadow-primary-500/30"
                  >
                    Start Planning
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
