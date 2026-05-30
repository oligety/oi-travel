# OI Travel

OI Travel is a premium travel itinerary application designed to help users discover, plan, and organize their travel adventures all in one place.

## Tech Stack

This project is built with a modern and highly optimized stack:

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 & HeroUI
- **Animations:** Framer Motion
- **Code Quality:** ESLint, Prettier, Husky, Lint-Staged
- **Testing:** Vitest (Unit) & Playwright (E2E)
- **Local Dev:** Docker Compose (with PostgreSQL)

## Getting Started

First, ensure you have Node.js and Docker installed on your system.

### Running Locally

1. Install the dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Using Docker

To start the application along with a PostgreSQL database, you can use Docker Compose:

```bash
docker compose up -d
```

The app will be accessible at [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Creates an optimized production build.
- `npm run start`: Starts the application in production mode.
- `npm run lint`: Runs ESLint to check for code issues.
- `npm run format`: Formats code using Prettier.
- `npm run test`: Runs unit tests using Vitest.
- `npm run test:e2e`: Runs end-to-end tests using Playwright.
