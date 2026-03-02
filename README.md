# Smart Living Ecosystem - Frontend

A mobile-first web application built with Next.js 14, TypeScript, and Tailwind CSS.

> **Note**: This is the frontend directory of the Smart Living Ecosystem monorepo. See the root [README](../README.md) for the overall project structure.

## Features

- 🎨 Mobile-first responsive design
- 🌓 Light & Dark mode support
- 🔐 Role-based navigation (Renter, Owner, Admin)
- 📱 Optimized for mobile devices
- 🚀 Ready for REST API integration

## Getting Started

### Installation

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Development

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

```bash
npm run build
npm start
```

### Linting & Formatting

```bash
npm run lint
npm run format
```

## Project Structure

```
frontend/
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navbar.tsx
│   └── theme/
│       └── ThemeProvider.tsx
├── pages/
│   ├── _app.tsx
│   ├── index.tsx
│   └── api/
├── styles/
│   └── globals.css
├── utils/
│   └── api.ts
└── types/
    └── index.ts
```

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **Linting**: ESLint
- **Formatting**: Prettier
