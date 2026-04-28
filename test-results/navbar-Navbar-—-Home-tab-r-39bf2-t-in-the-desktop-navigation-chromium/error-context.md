# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navbar.spec.ts >> Navbar — Home tab removal >> Home tab is not present in the desktop navigation
- Location: tests/navbar.spec.ts:4:3

# Error details

```
Error: expect(locator).not.toBeVisible() failed

Locator:  getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Home' })
Expected: not visible
Received: visible
Timeout:  5000ms

Call log:
  - Expect "not toBeVisible" with timeout 5000ms
  - waiting for getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Home' })
    9 × locator resolved to <a href="#/" aria-label="Home" class="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white shrink-0 focus:outline-none focus:ring-2 focus:ring-primary rounded">…</a>
      - unexpected value "visible"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - banner [ref=e4]:
      - navigation "Main navigation" [ref=e5]:
        - generic [ref=e6]:
          - link "Home" [ref=e7] [cursor=pointer]:
            - /url: "#/"
            - img [ref=e9]
            - generic [ref=e11]: Module 6
          - list [ref=e12]:
            - listitem [ref=e13]:
              - link "Products" [ref=e14] [cursor=pointer]:
                - /url: "#/products"
            - listitem [ref=e15]:
              - link "Dashboard" [ref=e16] [cursor=pointer]:
                - /url: "#/dashboard"
            - listitem [ref=e17]:
              - link "Analytics" [ref=e18] [cursor=pointer]:
                - /url: "#/analytics"
            - listitem [ref=e19]:
              - link "Kanban" [ref=e20] [cursor=pointer]:
                - /url: "#/kanban"
            - listitem [ref=e21]:
              - link "Feed" [ref=e22] [cursor=pointer]:
                - /url: "#/feed"
          - generic [ref=e23]:
            - generic [ref=e24]: Search
            - generic [ref=e25]:
              - img [ref=e26]
              - searchbox "Search" [ref=e28]
          - generic [ref=e29]:
            - link "Cart" [ref=e30] [cursor=pointer]:
              - /url: "#/cart"
              - img [ref=e31]
            - button "User menu for Account" [ref=e34]:
              - generic [ref=e35]: A
              - generic [ref=e36]: Account
              - img [ref=e37]
    - main [ref=e39]:
      - generic [ref=e41]:
        - generic [ref=e42]:
          - heading "Featured Products" [level=1] [ref=e43]
          - paragraph [ref=e44]: Discover our curated collection of premium products, crafted for quality and designed to impress.
        - region "Search and filter products" [ref=e45]:
          - generic [ref=e46]:
            - generic [ref=e47]: Search products
            - img
            - searchbox "Search products" [ref=e48]
          - generic [ref=e49]:
            - generic [ref=e50]:
              - generic [ref=e51]: Category
              - combobox "Category" [ref=e52]:
                - option "All" [selected]
                - option "Accessories"
                - option "Electronics"
                - option "Footwear"
                - option "Office"
            - generic [ref=e53]:
              - generic [ref=e54]: Price Range
              - combobox "Price Range" [ref=e55]:
                - option "All Prices" [selected]
                - option "Under $100"
                - option "$100 – $200"
                - option "Over $200"
            - generic [ref=e56]:
              - generic [ref=e57]: Sort By
              - combobox "Sort By" [ref=e58]:
                - option "Featured" [selected]
                - 'option "Price: Low to High"'
                - 'option "Price: High to Low"'
                - option "Highest Rated"
                - 'option "Name: A–Z"'
                - 'option "Name: Z–A"'
          - paragraph [ref=e59]: 6 products found
        - region "Product grid" [ref=e60]:
          - generic [ref=e61]:
            - 'article "Product: Premium Minimalist Watch" [ref=e62]':
              - generic [ref=e63]:
                - img "Premium Minimalist Watch" [ref=e64]
                - generic [ref=e65]: Best Seller
              - generic [ref=e66]:
                - heading "Premium Minimalist Watch" [level=2] [ref=e67]
                - paragraph [ref=e68]: A sleek timepiece crafted with Swiss precision. Features sapphire crystal glass and a stainless steel case with water resistance up to 50m.
                - generic [ref=e69]:
                  - 'img "Rating: 4.7 out of 5 stars" [ref=e70]':
                    - img [ref=e72]
                    - img [ref=e75]
                    - img [ref=e78]
                    - img [ref=e81]
                    - img [ref=e84]
                  - generic [ref=e86]: (2,341)
                - generic [ref=e87]:
                  - generic [ref=e88]: $249.99
                  - button "Add Premium Minimalist Watch to cart" [ref=e89]:
                    - img [ref=e90]
                    - text: Add to Cart
            - 'article "Product: Wireless Noise-Cancelling Headphones" [ref=e92]':
              - generic [ref=e93]:
                - img "Wireless Noise-Cancelling Headphones" [ref=e94]
                - generic [ref=e95]: New
              - generic [ref=e96]:
                - heading "Wireless Noise-Cancelling Headphones" [level=2] [ref=e97]
                - paragraph [ref=e98]: Immersive 40-hour battery life with adaptive ANC technology. Premium drivers deliver studio-quality sound with deep bass and crystal-clear highs.
                - generic [ref=e99]:
                  - 'img "Rating: 4.5 out of 5 stars" [ref=e100]':
                    - img [ref=e102]
                    - img [ref=e105]
                    - img [ref=e108]
                    - img [ref=e111]
                    - img [ref=e114]
                  - generic [ref=e116]: (5,892)
                - generic [ref=e117]:
                  - generic [ref=e118]: $379.00
                  - button "Add Wireless Noise-Cancelling Headphones to cart" [ref=e119]:
                    - img [ref=e120]
                    - text: Add to Cart
            - 'article "Product: Trail Running Shoes" [ref=e122]':
              - img "Trail Running Shoes" [ref=e124]
              - generic [ref=e125]:
                - heading "Trail Running Shoes" [level=2] [ref=e126]
                - paragraph [ref=e127]: Engineered for the toughest terrain. Breathable mesh upper with grippy rubber outsole for ultimate traction on wet and dry surfaces.
                - generic [ref=e128]:
                  - 'img "Rating: 4.3 out of 5 stars" [ref=e129]':
                    - img [ref=e131]
                    - img [ref=e134]
                    - img [ref=e137]
                    - img [ref=e140]
                    - img [ref=e143]
                  - generic [ref=e145]: (1,204)
                - generic [ref=e146]:
                  - generic [ref=e147]: $129.95
                  - button "Add Trail Running Shoes to cart" [ref=e148]:
                    - img [ref=e149]
                    - text: Add to Cart
        - navigation "Pagination" [ref=e151]:
          - button "Previous page" [disabled] [ref=e152]: ← Previous
          - generic "Page 1 of 2" [ref=e153]
          - button "Next page" [ref=e154]: Next →
    - contentinfo [ref=e155]:
      - paragraph [ref=e157]: © 2026 Module 6 Project
  - generic "Notifications"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Navbar — Home tab removal', () => {
  4  |   test('Home tab is not present in the desktop navigation', async ({ page }) => {
  5  |     await page.goto('/');
  6  | 
  7  |     const nav = page.getByRole('navigation', { name: 'Main navigation' });
  8  |     const homeLink = nav.getByRole('link', { name: 'Home' });
  9  | 
> 10 |     await expect(homeLink).not.toBeVisible();
     |                                ^ Error: expect(locator).not.toBeVisible() failed
  11 |   });
  12 | 
  13 |   test('remaining nav links are still visible', async ({ page }) => {
  14 |     await page.goto('/');
  15 | 
  16 |     const nav = page.getByRole('navigation', { name: 'Main navigation' });
  17 | 
  18 |     await expect(nav.getByRole('link', { name: 'Products' })).toBeVisible();
  19 |     await expect(nav.getByRole('link', { name: 'Dashboard' })).toBeVisible();
  20 |     await expect(nav.getByRole('link', { name: 'Analytics' })).toBeVisible();
  21 |     await expect(nav.getByRole('link', { name: 'Kanban' })).toBeVisible();
  22 |     await expect(nav.getByRole('link', { name: 'Feed' })).toBeVisible();
  23 |   });
  24 | });
  25 | 
```