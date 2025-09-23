# CLAUDE.md

## Application Overview

This app displays a menu for a restaurant and an admin interface to manage menu items.

## Development Commands

**Development server:**
```bash
npm run dev
```
Opens on http://localhost:3000 with hot reload

**Build:**
```bash
npm run build
```

**Production server:**
```bash
npm run start
```

**Linting:**
```bash
npm run lint
```

## Architecture

This is a Next.js 15.5.4 project using:
- **App Router** (`app/` directory structure)
- **TypeScript** with strict mode enabled
- **Tailwind CSS v4** for styling with PostCSS
- **React 19.1.0** with React DOM
- **ESLint** with Next.js configuration

### Project Structure
```
app/
├── layout.tsx          # Root layout with Geist fonts
├── page.tsx            # Home page component
└── globals.css         # Global styles with Tailwind and CSS variables
```

### Key Configuration Files
- `tsconfig.json` - TypeScript config with `@/*` path mapping
- `next.config.ts` - Next.js configuration (minimal)
- `eslint.config.mjs` - ESLint with Next.js core-web-vitals and TypeScript rules
- `postcss.config.mjs` - PostCSS with Tailwind CSS v4 plugin

### Styling System
- Uses Tailwind CSS v4 with `@import "tailwindcss"`
- CSS custom properties for theming (`--background`, `--foreground`)
- Automatic dark mode support via `prefers-color-scheme`
- Geist Sans and Geist Mono fonts loaded via `next/font/google`

### TypeScript Setup
- Strict TypeScript configuration
- Path alias `@/*` points to project root
- Next.js TypeScript plugin enabled
- React 19 types included