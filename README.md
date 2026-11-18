# Arenas UI

A framework-independent component library and design system built for Tailwind CSS v4.

## Project status

Phase 0 — Plugin Foundation & First Component.

The repository currently provides the initial pnpm workspace and TypeScript tooling. Tailwind plugin integration and public components are not yet implemented.

## Requirements

- Node.js 26.13.1
- pnpm 12.20.0

## Workspace structure

- `packages/ui` — Arenas UI package

## Local development

Install dependencies:

```bash
pnpm install --frozen-lockfile
```

Run static checks:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
```

Build the UI package:

```bash
pnpm build
```

Run all currently available checks:

```bash
pnpm check
```

Format project files:

```bash
pnpm format
```

## Development workflow

Each checkpoint uses one feature branch and one integration Pull Request.

Every Issue must have an independent Conventional Commit.

## Current limitations

The current package entrypoint is a TypeScript build scaffold. It does not register Tailwind CSS utilities or component styles yet.
