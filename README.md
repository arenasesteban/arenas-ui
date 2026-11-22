# Arenas UI

**A framework-independent component library and design system for Tailwind CSS v4.**

Arenas UI is designed to simplify the development of consistent, reusable, and customizable interfaces using semantic HTML, CSS classes, and Tailwind CSS.

## Overview

Arenas UI aims to provide a collection of ready-to-use components that integrate naturally with Tailwind CSS v4.

The library follows an HTML-first approach, relying on native browser capabilities and introducing JavaScript only when additional interactive behavior is necessary.

Its architecture is designed to work across different frontend frameworks without requiring React or any specific UI framework.

## Features

- **Tailwind CSS v4 integration:** Build-time integration through the `@plugin` directive.
- **Framework independence:** Components based on semantic HTML and reusable CSS classes.
- **Customizable design:** Visual customization through CSS variables and Tailwind utilities.
- **Light and dark themes:** A consistent design system with two official themes.
- **Accessibility:** Component contracts designed around semantic HTML, keyboard interaction, and accessible states.
- **Minimal JavaScript:** Native HTML and CSS first, with optional JavaScript for advanced interactions.

## Project Structure

Arenas UI uses a pnpm monorepository with all internal projects organized under `packages/`.

```text
arenas-ui/
├── packages/
│   ├── ui/                  # Component library and Tailwind CSS plugin
│   └── playground/          # Astro development and testing environment
│
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
└── README.md
```

Additional packages will be introduced progressively as the project evolves.

## Getting Started

To explore the project locally, clone the repository and install its dependencies.

### Requirements

- Node.js 26 LTS
- pnpm 12.22.0
- Git

### Installation

```bash
git clone https://github.com/arenasesteban/arenas-ui.git
cd arenas-ui
pnpm install --frozen-lockfile
```

### Development

Build the workspace:

```bash
pnpm build
```

Start the internal Astro playground:

```bash
pnpm --filter @arenasesteban/playground dev
```

Run the configured quality checks:

```bash
pnpm check
```

## Project Status

**Under Active Development**

Arenas UI is currently under active development. Public components and a stable npm release are not yet available.