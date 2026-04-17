# Testing the Application

The project uses [Playwright](https://playwright.dev/) for end-to-end (E2E) testing. Tests run against two browser projects: **Chromium** (desktop) and **Mobile Chrome** (375 × 667 viewport).

Playwright is configured to automatically start the Vite development server before the test run begins, so you do not need to have the app running beforehand.

---

## Prerequisites

Install project dependencies if you have not already:

```bash
npm install
```

Install the Playwright browser binaries (required once per machine):

```bash
npx playwright install
```

To install only the browsers used by this project (Chromium):

```bash
npx playwright install chromium
```

---

## Running Tests

### Run the full test suite

```bash
npx playwright test
```

Playwright starts the dev server, executes all specs in `tests/`, and prints a summary. An HTML report is generated in `playwright-report/`.

### Run a single spec file

```bash
npx playwright test tests/search.spec.ts
npx playwright test tests/filters.spec.ts
npx playwright test tests/sort.spec.ts
npx playwright test tests/pagination.spec.ts
```

### Run tests matching a name pattern

Use `--grep` with a string or regular expression:

```bash
# Run all tests whose title contains "no results"
npx playwright test --grep "no results"

# Run all tests whose title contains "sort" or "filter"
npx playwright test --grep "sort|filter"
```

### Run against a specific browser project

```bash
# Desktop Chromium only
npx playwright test --project=chromium

# Mobile Chrome only
npx playwright test --project="Mobile Chrome"
```

### Run in headed mode (visible browser window)

```bash
npx playwright test --headed
```

### Run with Playwright UI mode (interactive test explorer)

```bash
npx playwright test --ui
```

UI mode opens a visual interface where you can browse, filter, and re-run individual tests with a step-by-step timeline.

### Run in debug mode (Playwright Inspector)

```bash
npx playwright test --debug
```

The Inspector pauses execution at each step so you can inspect the page state.

---

## Viewing the HTML Report

After any test run, open the generated report:

```bash
npx playwright show-report
```

The report includes pass/fail status, screenshots on failure, and traces on the first retry.

---

## Test Suite Overview

| Spec file | What it covers |
|---|---|
| `tests/search.spec.ts` | Happy-path search (title, description, case-insensitive), result count, no-results empty state, clear restores list, edge cases (whitespace, XSS-like string, very long query) |
| `tests/filters.spec.ts` | Category filters (Electronics, Accessories, Footwear, Office), price range bands, combined filters, empty state for impossible combinations, Clear Filters behavior |
| `tests/sort.spec.ts` | Price ascending/descending, name A–Z / Z–A, rating order, featured default order and restore |
| `tests/pagination.spec.ts` | Prev/Next disabled states, page label text, different products shown per page, page 1+2 counts summing to total, filters resetting to page 1, pagination hidden when single page |
| `tests/navigation.spec.ts` | Multi-step registration flow: Next disabled until valid, no skipping steps, Back preserves prior step data, progress bar, step 3 back navigation |
| `tests/validation.spec.ts` | Required field errors, email format validation, password strength rules, password mismatch, long input handling, minimum password length |
| `tests/accessibility.spec.ts` | Input labels, `aria-describedby` on error messages, `role="alert"`, progress bar `aria-valuenow`, `aria-current`, keyboard navigation (Tab / Enter), focus management, `aria-live` regions, semantic `<form>` element |
| `tests/registration.spec.ts` | Full multi-step registration success, data persistence across steps, loading state during submit (mocked `**/api/register`), API failure error handling |

---

## Page Object Models

Page Object Models (POMs) live in `pages/` and provide reusable, strongly-typed helpers for interacting with the UI in tests.

### `SearchPage` (`pages/SearchPage.ts`)

Encapsulates all interactions with the Product Catalog page (`/#/products`).

```ts
import { SearchPage } from '../pages/SearchPage';

test('filters by category', async ({ page }) => {
  const searchPage = new SearchPage(page);
  await searchPage.goto();

  await searchPage.selectCategory('Electronics');

  const count = await searchPage.getProductCount();
  expect(count).toBeGreaterThan(0);
});
```

Key methods:

| Method | Description |
|---|---|
| `goto()` | Navigate to `/#/products` |
| `search(query)` | Type into the search input and wait for results |
| `clearSearch()` | Clear the search field |
| `selectCategory(value)` | Choose a category from the filter dropdown |
| `selectPriceRange(value)` | Choose a price range from the filter dropdown |
| `selectSort(value)` | Choose a sort option |
| `clearAllFilters()` | Click the Clear Filters button |
| `getProductCount()` | Return the number of visible product cards |
| `getProductTitles()` | Return an array of visible product title strings |
| `getProductPrices()` | Return an array of visible price numbers |
| `clickNext()` | Click the Next pagination button |
| `clickPrev()` | Click the Previous pagination button |

### `RegistrationPage` (`pages/RegistrationPage.ts`)

Encapsulates interactions with the multi-step registration form (`/#/register`).

```ts
import { RegistrationPage, generateValidFormData } from '../pages/RegistrationPage';

test('completes registration', async ({ page }) => {
  const regPage = new RegistrationPage(page);
  await regPage.goto();

  const data = generateValidFormData();
  await regPage.completeFullRegistration(data);

  await expect(regPage.successMessage).toBeVisible();
});
```

Key methods:

| Method | Description |
|---|---|
| `goto()` | Navigate to `/#/register` |
| `fillStep1(data)` | Fill first name, last name, email fields |
| `fillStep2(data)` | Fill password and confirm password fields |
| `completeStep1(data)` | Fill step 1 and click Next |
| `completeStep2(data)` | Fill step 2 and click Next |
| `completeFullRegistration(data)` | Complete all steps and submit |
| `getErrorMessages()` | Return visible validation error text |
| `generateValidFormData()` | Generate a valid `FormData` object for testing |

---

## `data-testid` Reference

Tests locate elements through `data-testid` attributes rather than CSS classes or text content, making selectors resilient to styling changes.

| `data-testid` | Element |
|---|---|
| `search-input` | Product search text field |
| `category-filter` | Category dropdown |
| `price-filter` | Price range dropdown |
| `sort-select` | Sort-by dropdown |
| `clear-filters` | Clear Filters button |
| `result-count` | Text showing number of results |
| `no-results` | Empty state message when no products match |
| `product-card` | Individual product card (`<article>`) |
| `prev-page` | Previous page button |
| `next-page` | Next page button |
| `page-indicator` | Current page / total pages label |
| `first-name` | Registration step 1 — first name input |
| `last-name` | Registration step 1 — last name input |
| `email` | Registration step 1 — email input |
| `step1-next` | Registration step 1 — Next button |
| `password` | Registration step 2 — password input |
| `confirm-password` | Registration step 2 — confirm password input |
| `submit` | Registration step 3 — Submit button |
| `success-message` | Confirmation shown after successful registration |

---

## Configuration

Playwright is configured in [`playwright.config.ts`](playwright.config.ts). Key settings:

| Setting | Value |
|---|---|
| Test directory | `./tests` |
| Base URL | `http://localhost:5173` |
| Web server command | `npm run dev` |
| Reporters | HTML (always), list (in terminal) |
| Trace | Retained on first retry |
| Screenshot | Captured on test failure |
| Browser projects | Chromium, Mobile Chrome |
| CI retries | 2 |
