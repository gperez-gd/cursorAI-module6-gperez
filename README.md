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
- **Add to Cart** on any product card; the cart count badge updates in the navbar and a "View Cart" link appears below the page header.
- **Clear Filters** button resets all active filters at once.

### Cart (`/cart`)

- Full cart page listing all added items with thumbnails, prices, and quantities.
- **Quantity controls** — increase or decrease per item (minimum 1).
- **Remove item** — removes an individual line item.
- **Clear cart** — removes all items at once.
- **Discount codes** — enter a promo code (SAVE10, SAVE20, WELCOME) to get a percentage discount on the subtotal.
- **Order summary sidebar** — shows subtotal, discount, free shipping, and total; updates live.
- **Proceed to Checkout** navigates to the checkout flow.
- Cart state persists in `localStorage` across page navigation.

### Checkout (`/checkout`)

Two-step checkout wizard:

1. **Shipping** — first name, last name, email, street address, city, state, ZIP, and country (ISO 3166-1 alpha-2 codes sent to the API). Client-side validation with inline errors.
2. **Payment** — card name, card number (auto-formatted), expiry (MM/YY), CVV. Submits to `POST /api/v1/checkout` with `X-CSRF-Token` when logged in and the API responds; HTTP 400/401/402/403 show an inline error; otherwise a **local confirmation** is used when the API is unreachable (default for `npm run dev` without a proxy).

### Order Confirmation (`/checkout/success`)

- Displays a success banner with the **confirmation number** and **estimated delivery date**.
- Lists all ordered items with quantities and prices.
- Shows the **shipping address** and **total charged**.
- **Continue Shopping** clears the confirmation state and returns to the product catalog.

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
│   ├── api/                  # Backend API service layer
│   │   ├── cartApi.ts        # Cart CRUD (GET/add/update/remove/discount)
│   │   ├── checkoutApi.ts    # POST /checkout with CSRF token support
│   │   └── ordersApi.ts      # List and get orders
│   ├── context/
│   │   ├── AuthContext.tsx   # Auth state, JWT + CSRF token management
│   │   └── CartContext.tsx   # Global cart state with localStorage persistence
│   ├── pages/                # Top-level page components
│   │   ├── ProductDemo.tsx   # Product catalog (search, filter, sort, pagination)
│   │   ├── CartPage.tsx      # Shopping cart with quantities and discount codes
│   │   ├── CheckoutPage.tsx  # Two-step checkout (shipping → payment)
│   │   ├── OrderConfirmationPage.tsx  # Post-order success screen
│   │   ├── Dashboard.tsx
│   │   ├── Analytics.tsx
│   │   ├── Kanban.tsx
│   │   ├── SocialFeed.tsx
│   │   ├── Settings.tsx
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── components/           # Shared and feature-specific components
│   │   ├── nav/              # Navbar (cart badge), MobileMenu, UserDropdown
│   │   ├── layout/           # Layout wrappers
│   │   ├── product/          # ProductCard, RatingStars
│   │   └── ui/               # Generic UI primitives (toasts, etc.)
│   ├── types/                # Shared TypeScript types
│   ├── utils/                # Utility functions
│   └── constants/            # Static data
├── pages/                    # Playwright Page Object Models
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   ├── SearchPage.ts
│   └── RegistrationPage.ts
├── tests/                    # Playwright E2E test specs
│   ├── cart.spec.ts
│   ├── checkout.spec.ts
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
