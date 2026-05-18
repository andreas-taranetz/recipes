# Copilot Instructions

This project is a recipe website built with Astro and managed with pnpm.

## Technology Stack

- **Framework**: Astro (v5+)
- **Package Manager**: pnpm
- **Styling**: CSS
- **Formatting**: Prettier with Astro plugin

## Key Principles

- **No JavaScript**: Prefer solutions that work without client-side JavaScript. Use Astro's static-first approach and CSS-only interactivity where possible.
- **Modern Browsers**: Target modern browsers only. Feel free to use modern CSS features like view transitions, container queries, `:has()`, and nesting.
- **Static Generation**: All pages are pre-rendered at build time.

## Project Structure

- `src/pages/` - Astro pages and routes
- `src/layouts/` - Reusable layout components
- `src/recipes/` - Recipe content in Markdown format
- `src/content.config.ts` - Content collection schema definitions
- `public/` - Static assets

## Coding Conventions

- Use tabs for indentation (except in Markdown files which use spaces)
- Use LF line endings
- Include a final newline in all files
- Follow the Prettier configuration (printWidth: 120)

## Commands

- `pnpm install` - Install dependencies
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
