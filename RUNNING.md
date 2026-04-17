# Running the Application

This guide covers how to install dependencies, start the development server, build for production, and navigate the application.

---

## Prerequisites

- **Node.js** — version 18 or later is recommended. Check your version:

  ```bash
  node --version
  ```

- **npm** — included with Node.js. Check your version:

  ```bash
  npm --version
  ```

---

## Installation

Clone the repository (or navigate to the project folder) and install dependencies:

```bash
cd module6-project
npm install
```

---

## Development Server

Start the Vite development server:

```bash
npm run dev
```

Expected output:

```
  VITE v8.x.x  ready in Xms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open your browser and navigate to [http://localhost:5173](http://localhost:5173). The server supports **Hot Module Replacement (HMR)** — changes to source files appear in the browser instantly without a full reload.

---

## Navigating the Application

The app uses a **hash-based router**. All routes are prefixed with `#`:

| URL | Page |
|---|---|
| `http://localhost:5173/` | Home |
| `http://localhost:5173/#/products` | Product Catalog |
| `http://localhost:5173/#/dashboard` | Dashboard |
| `http://localhost:5173/#/analytics` | Analytics |
| `http://localhost:5173/#/kanban` | Kanban Board |
| `http://localhost:5173/#/feed` | Social Feed |
| `http://localhost:5173/#/settings` | Settings |

You can also click any link in the top navigation bar to move between pages.

---

## Feature Interaction Examples

### Search

1. Open [http://localhost:5173/#/products](http://localhost:5173/#/products).
2. Type `laptop` in the **Search products…** input.
3. The catalog filters live — only products whose title or description contains "laptop" appear.
4. Clear the field to restore the full list.

You can also use the **global search bar in the Navbar** from any page. Typing there automatically navigates to `/products` and applies the query.

### Category Filter

1. On the Product Catalog page, open the **Category** dropdown.
2. Select `Electronics`.
3. Only electronics products are shown; the result count updates accordingly.

### Price Filter

1. Open the **Price Range** dropdown.
2. Select `Under $100`.
3. Products priced at $100 or more are hidden.

### Combined Filter + Search

1. Type `pro` in the search box.
2. Then select `Electronics` in the Category dropdown.
3. The results narrow to electronics products whose name or description contains "pro".
4. Click **Clear Filters** to reset everything at once.

### Sort

1. Open the **Sort by** dropdown.
2. Select `Price: Low to High`.
3. Products reorder from cheapest to most expensive.

### Pagination

With filters cleared, the catalog shows 3 products on page 1.

1. Click **Next** to move to page 2.
2. The **Previous** button becomes active; **Next** disables when on the last page.
3. Applying a filter that leaves fewer than 4 results hides the pagination controls entirely.

### Add to Cart

1. On any product card, click **Add to Cart**.
2. The button briefly shows "Added!" feedback.
3. The cart count in the page header increments.

### Dark / Light Theme

Click the theme toggle icon in the top-right of the Navbar. The preference is saved to `localStorage` and persists across page refreshes.

---

## Production Build

Compile TypeScript and bundle assets for production:

```bash
npm run build
```

Output is written to the `dist/` folder. Preview the production build locally:

```bash
npm run preview
```

The preview server starts at [http://localhost:4173](http://localhost:4173) by default.

---

## Linting

Run ESLint across the entire project:

```bash
npm run lint
```

Fix auto-fixable issues:

```bash
npm run lint -- --fix
```
