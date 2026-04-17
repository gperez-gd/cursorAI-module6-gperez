# Module 6 Project

A multi-page React demo application built with TypeScript, Vite, and Tailwind CSS. It showcases a variety of UI patterns including a searchable product catalog, a dashboard, analytics, a Kanban board, a social feed, and settings — all wired together with a lightweight hash-based router.

---

## Features

### Product Catalog (`/products`)

- Browse a catalog of 6 products across categories: Electronics, Accessories, Footwear, and Office.
- **Search** by product title or description (case-insensitive).
- **Filter by category** using a dropdown (Electronics, Accessories, Footwear, Office).
- **Filter by price range** (under $100, $100–$200, over $200).
- **Sort** results by Featured, Price (low–high / high–low), Rating, or Name (A–Z / Z–A).
- **Pagination** displays 3 products per page with Previous / Next controls.
- **Add to Cart** on any product card; the cart count updates in the page header.
- **Clear Filters** button resets all active filters at once.

### Global Navbar Search

- A debounced search field (300 ms) lives in the top navigation bar.
- Typing a query automatically navigates to the Product Catalog and filters results in real time.
- Clearing the search restores the full product list.

### Dashboard (`/dashboard`)

A summary dashboard displaying key metrics and stat items for a quick operational overview.

### Analytics (`/analytics`)

A data-visualization page presenting charts and trend information.

### Kanban Board (`/kanban`)

A drag-and-drop style task board organized into columns for project management workflows.

### Social Feed (`/feed`)

A scrollable feed of user-generated posts with avatar, content, and interaction elements.

### Settings (`/settings`)

A settings panel for configuring application preferences.

### Dark / Light Theme

- Theme is initialized from `localStorage` before the React app mounts (no flash of wrong theme).
- Falls back to the operating system's `prefers-color-scheme` preference.
- Toggle is accessible from the navigation bar.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 |
| Language | TypeScript 6 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS 4 |
| E2E Testing | Playwright 1.59 |
| Linting | ESLint 9 |

---

## Project Structure

```
module6-project/
├── src/
│   ├── main.tsx              # Application entry point
│   ├── App.tsx               # Root component, hash router, theme init
│   ├── pages/                # Top-level page components
│   │   ├── Home.tsx
│   │   ├── ProductDemo.tsx   # Product catalog (search, filter, sort, pagination)
│   │   ├── Dashboard.tsx
│   │   ├── Analytics.tsx
│   │   ├── Kanban.tsx
│   │   ├── SocialFeed.tsx
│   │   └── Settings.tsx
│   ├── components/           # Shared and feature-specific components
│   │   ├── nav/              # Navbar
│   │   ├── layout/           # Layout wrappers
│   │   ├── product/          # ProductCard, RatingStars
│   │   ├── dashboard/
│   │   ├── analytics/
│   │   ├── kanban/
│   │   ├── feed/
│   │   ├── settings/
│   │   └── ui/               # Generic UI primitives (toasts, etc.)
│   ├── types/                # Shared TypeScript types
│   ├── utils/                # Utility functions
│   └── constants/            # Static data (e.g. team members)
├── pages/                    # Playwright Page Object Models
│   ├── SearchPage.ts
│   └── RegistrationPage.ts
├── tests/                    # Playwright E2E test specs
│   ├── search.spec.ts
│   ├── filters.spec.ts
│   ├── sort.spec.ts
│   ├── pagination.spec.ts
│   ├── navigation.spec.ts
│   ├── validation.spec.ts
│   ├── accessibility.spec.ts
│   └── registration.spec.ts
├── public/                   # Static assets
├── playwright.config.ts      # Playwright configuration
├── vite.config.ts            # Vite + Tailwind configuration
└── package.json
```

---

## Quick Start

See [RUNNING.md](RUNNING.md) for full installation and usage instructions, and [TESTING.md](TESTING.md) for the test suite guide.
