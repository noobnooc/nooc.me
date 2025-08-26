# Nooc.me - Personal Website & Blog

nooc.me is a Next.js-based personal website with integrated blog functionality built using Velite for static content generation. The site supports internationalization (English/Chinese) and is deployed on Cloudflare Pages.

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Bootstrap, Build, and Test the Repository
Execute these commands in order for initial setup:

```bash
npm install  # Takes ~40 seconds. Has deprecation warnings but works correctly.
npm run lint  # Takes ~5-10 seconds. Passes with TypeScript version warnings.
npm run build  # Takes ~36 seconds. NEVER CANCEL. Set timeout to 60+ minutes.
```

**CRITICAL TIMING**: Build times are moderate (~36s) but ALWAYS set timeouts to 60+ minutes to prevent cancellation. The build includes Velite content processing which adds overhead.

### Development Workflow
- **Development server**: `npm run dev` - Starts in ~2-3 seconds on http://localhost:3000
- **Content processing**: Velite automatically watches and rebuilds content during development
- **Linting**: `npm run lint` - Always run before committing changes
- **Formatting**: Code uses Prettier but it's not in package.json scripts. Run `npx prettier --write .` to fix formatting issues.

### Project Structure and Key Technologies

#### Core Stack
- **Next.js 14.2.15** with App Router
- **TypeScript** with strict configuration  
- **TailwindCSS** for styling with custom configuration
- **Velite** for static blog content generation
- **React 18.3.1** for UI components

#### Key Directories
```
├── app/[lang]/              # Next.js App Router pages with i18n support
├── components/              # Reusable React components  
├── content/                 # Blog content source (posts, categories, tags)
│   ├── posts/              # Markdown blog posts with frontmatter
│   ├── categories/         # Category definitions in YAML
│   └── tags/               # Tag definitions in YAML
├── lib/                    # Utility functions and configurations
├── public/                 # Static assets
├── .velite/                # Auto-generated blog content (git ignored)
└── public/static/posts/    # Auto-generated static assets (git ignored)
```

#### Configuration Files
- `velite.config.ts` - Blog content processing configuration
- `next.config.mjs` - Next.js configuration with Velite integration
- `tailwind.config.js` - TailwindCSS configuration with custom colors
- `tsconfig.json` - TypeScript configuration with path aliases (`@/*` → `./`)
- `.eslintrc.json` - ESLint configuration for Next.js and Cloudflare Pages
- `_routes.json` - Cloudflare Pages routing configuration

## Validation Requirements

**ALWAYS manually validate changes by running complete end-to-end scenarios:**

### Required Validation Scenarios
1. **Homepage functionality**:
   ```bash
   npm run dev
   # Navigate to http://localhost:3000
   # Verify: Personal info displays, projects section works, latest posts show
   ```

2. **Blog functionality**:
   ```bash
   # Click "Blog" in navigation
   # Verify: Post list displays, categories work, individual posts render correctly
   # Test: Navigate to individual blog post and verify content, images, and TOC
   ```

3. **Multi-language support**:
   ```bash
   # Test language switching between /en and /zh routes
   # Verify: Content changes language, URLs update correctly
   ```

4. **Content processing**:
   ```bash
   # After adding/editing content in /content directory
   # Verify: Velite processes changes automatically during development
   # Check: .velite/ directory updates with new content data
   ```

### Build and CI Validation
Always run the full CI pipeline locally before committing:
```bash
npm install
npm run lint      # NEVER CANCEL - Wait for completion
npm run build     # NEVER CANCEL - Takes ~36s, set 60+ minute timeout
```

## Content Management

### Adding Blog Posts
Blog posts are Markdown files in `content/posts/YYYY-MM-DD post-title/` directories:

```markdown
---
title: "Post Title"
slug: "post-slug"
lang: "en"  # or "zh"
date: "2024-01-01"
description: "Post description"
categories: ["development"]
tags: ["nextjs", "blog"]
---

# Post content in Markdown
```

### Content Processing Flow
1. **Source**: Markdown files in `content/posts/`
2. **Processing**: Velite processes during `npm run dev` or `npm run build`
3. **Output**: JSON data in `.velite/` directory
4. **Assets**: Images/videos copied to `public/static/posts/`
5. **Integration**: Next.js imports processed content from `.velite/`

## Common Issues and Solutions

### Build Issues
- **Velite errors**: Check frontmatter syntax in Markdown files
- **TypeScript errors**: Verify path aliases are correctly configured
- **Missing categories/tags**: Add category/tag definitions before referencing in posts

### Development Issues
- **Content not updating**: Restart development server if Velite watch fails
- **Styling issues**: Run `npx prettier --write .` to fix formatting
- **Image loading**: Ensure images are in post directories for Velite processing

### Deployment (Cloudflare Pages)
- Build command: `npm run build`
- Output directory: `.next`
- Environment: Node.js 18+
- Routing: Configured via `_routes.json`

## Important Notes

### What NOT to Do
- **DO NOT** manually edit files in `.velite/` or `public/static/posts/` - they're auto-generated
- **DO NOT** cancel builds or long-running commands - wait for completion
- **DO NOT** commit `.velite/` or `public/static/posts/` directories
- **DO NOT** modify `next.config.mjs` without understanding Velite integration

### Performance Expectations
- **Development startup**: 2-3 seconds
- **Content rebuild**: 1-2 seconds for single file changes
- **Full build**: ~36 seconds (NEVER CANCEL)
- **Install dependencies**: ~40 seconds

### VS Code Integration
Recommended extensions (configured in `.vscode/extensions.json`):
- `dbaeumer.vscode-eslint` - ESLint integration
- `esbenp.prettier-vscode` - Prettier formatting

Settings (in `.vscode/settings.json`):
- Format on save enabled
- TypeScript workspace version
- Custom spelling dictionary

## Frequently Referenced Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Production build (NEVER CANCEL - 60+ min timeout)
npm run lint         # Check code quality
npm run start        # Start production server
npx prettier --write . # Fix code formatting
```

### Content Management
```bash
npx velite          # Manually process content (rarely needed)
```

### Debugging
```bash
npm run build       # Check for build errors
npm run lint        # Check for linting issues
```

This is a mature, working codebase. Most commands work reliably. Always build and test your changes thoroughly using the validation scenarios above.