# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js App Router (with `app/[lang]/...` for i18n). Pages for posts, tools, works, sitemap, robots.
- `components/`: Reusable React components (e.g., `profile-card.tsx`, `mdx-components.tsx`).
- `content/`: Source content. Posts live under `content/posts/YYYY-MM-DD title/` with `en.md`, `zh.md`, and assets alongside.
- `dictionaries/`: i18n strings (`en.ts`, `zh.ts`, `index.ts`). Keep keys in sync.
- `lib/`: Utilities (dates, arrays, metadata helpers).
- `styles/`: Tailwind CSS globals (`styles/globals.css`).
- `public/`: Static assets (`public/images`, `public/static`).
- Root config: `next.config.mjs`, `velite.config.ts`, `tailwind.config.js`, `.eslintrc.json`, `.editorconfig`.

## Build, Test, and Development Commands
- `npm install`: Install dependencies.
- `npm run dev`: Start local dev server.
- `npm run lint`: Run ESLint (includes `next-on-pages` plugin checks).
- `npm run build`: Production build.
- `npm start`: Serve the production build.
CI runs lint and build on push via `.github/workflows/ci.yml`.

## Coding Style & Naming Conventions
- Language: TypeScript (strict mode). Framework: Next.js 14 App Router + React 18.
- Indentation: 2 spaces; LF line endings (`.editorconfig`).
- File naming: kebab-case for files (`flippable-card.tsx`), PascalCase for components, camelCase for variables.
- Styling: Tailwind CSS; prefer utility classes and `tailwind-merge` to resolve conflicts.
- Linting: ESLint (`next/core-web-vitals`, `plugin:next-on-pages/recommended`). Fix warnings before PR.

## Testing Guidelines
- No formal test suite yet. Validate pages and content locally (`npm run dev`) and ensure production build passes.
- If adding tests, place unit tests next to modules or under `__tests__/` with `*.test.ts(x)` and keep them fast.

## Commit & Pull Request Guidelines
- Commits: Clear, imperative messages (e.g., "Update featured works", "Fix slug"). Group related changes.
- PRs must include: concise description, rationale, screenshots for UI changes, and links to issues (if any).
- i18n: Update both `en` and `zh` where applicable (content and `dictionaries/`).
- Content: For new posts, use folder pattern `content/posts/YYYY-MM-DD title/` with `en.md`, `zh.md`, and related images.
- Checks: Ensure `npm run lint` and `npm run build` succeed before requesting review.

## Security & Configuration Tips
- Do not commit secrets. Use environment variables for any local credentials.
- Target Node 18+ locally to match Next.js and Cloudflare Pages tooling.

