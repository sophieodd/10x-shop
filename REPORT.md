# 10X Shop Report

## Project

CTRL+ME is my front-end diploma project for 10X. I built it with React, TypeScript and Tailwind CSS v4 using DummyJSON products.

The goal is a working shopping flow from browsing products to local order confirmation.

## Current status

The shop is deployed on Vercel:

[https://sophies-10x-shop.vercel.app/](https://sophies-10x-shop.vercel.app/)

The CORE shopping flow has been checked locally and on the live site, including Chrome and Firefox. Type checking, linting and the production build pass. Responsive layouts, keyboard navigation, API failure states and direct route refresh have been checked.

The November 14 Lighthouse runs surfaced two accessibility items to review: heading order on the Catalog page and color contrast on the Product details page.

## Planned and delivered

| Feature | Status |
| --- | --- |
| React, TypeScript and Tailwind setup | Complete |
| Strict TypeScript checking | Complete |
| Shared header and footer | Complete |
| Shop and Catalog routes | Complete |
| ProductCard and ProductGrid components | Complete |
| Catalog data from DummyJSON | Complete |
| Product details and quantity selection | Complete |
| Local login and validation | Complete |
| Guest redirect from checkout to login | Complete |
| Shared cart with quantity changes and removal | Complete |
| Checkout validation and local confirmation | Complete |
| Loading, error and empty states | Implemented and checked |
| Error Boundary | Fallback and reload verified locally |
| Mobile navigation | Implemented and checked |
| Responsive checks | Complete |
| Deployment | Complete |
| Unknown live route | Custom 404 and catalog link checked |
| Valid live routes and refresh | Complete |
| Complete Chrome and Firefox flow | Complete |
| Keyboard and API failure-state checks | Complete |
| Lighthouse checks across four pages | Captured; two accessibility items remain to review |

## Additional features delivered

- Search with debounce and a header search panel
- Category filters, price filtering and sorting
- Pagination with URL state
- Product image gallery, DummyJSON reviews and related products
- Local review submission saved in the browser
- Product discounts
- Cart persistence and saved promo code
- Promo code `10X10`
- Shipping calculations and free shipping progress
- Mini cart preview and cart notifications
- Catalog skeletons and retry
- Light and dark themes with a saved preference
- About and Fine Print pages
- Compressed About page images
- Lazy-loaded product card thumbnails
- Link to the separately deployed CRM

## Checks completed

- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- Guest checkout returned to checkout after login.
- Invalid checkout fields displayed errors.
- A valid order displayed confirmation and cleared the cart.
- Returning from a product restored the catalog filters and page.
- Product pages opened at the top.
- Mobile navigation and the account dialog were checked.
- Responsive layouts were checked.
- The Error Boundary caught a test render error and displayed its fallback.
- After clearing the test trigger, Reload restored the shop.
- An unknown live route displayed the custom 404 page.
- Valid deployed routes opened directly and worked after refresh.
- The shopping flow was checked on the live site in Chrome and Firefox.
- Keyboard navigation and API failure states were checked.
- About images were compressed to under 1 MB each.
- Cart and product API data are validated before the app uses them.

## Lighthouse results

### November 13 homepage comparison

These earlier runs tested the deployed homepage with mobile emulation and Slow 4G throttling. Keep them as a historical before-and-after comparison.

| Category | Before | After |
| --- | ---: | ---: |
| Performance | 97 | 97 |
| Accessibility | 96 | 100 |
| Best Practices | 100 | 100 |
| SEO | 83 | 100 |

| Metric | Before | After |
| --- | ---: | ---: |
| First Contentful Paint | 2.1 s | 2.1 s |
| Largest Contentful Paint | 2.1 s | 2.1 s |
| Total Blocking Time | 10 ms | 50 ms |
| Cumulative Layout Shift | 0 | 0 |
| Speed Index | 2.1 s | 2.1 s |

Reports:

- [Before](docs/lighthouse/before.html)
- [After](docs/lighthouse/after.html)

### November 14 page runs

These runs used Lighthouse 13.5.0 with mobile emulation on a Moto G Power device profile in Chromium 157. Network and CPU throttling were simulated.

| Page | Performance | Accessibility | Best Practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| Home | 98 | 100 | 100 | 100 |
| Catalog | 90 | 98 | 100 | 100 |
| Product details | 90 | 96 | 100 | 100 |
| About | 97 | 100 | 100 | 100 |

Reports:

- [Home](docs/lighthouse/home-2026-11-14.html)
- [Catalog](docs/lighthouse/catalog-2026-11-14.html)
- [Product details](docs/lighthouse/product-3-2026-11-14.html)
- [About](docs/lighthouse/about-2026-11-14.html)

Each score is from a single run and may vary. The Catalog report flags heading order. The Product details report flags insufficient contrast on the “Back to the catalog” link. Those findings still need review.

## What changed after the earlier reports

White text needed stronger contrast on blue backgrounds. Small magenta text also needed different colors on light and dark surfaces.

Lavender banners and discount badges were given dark text. The faint coordinates in the hero were made brighter. A meta description and `public/robots.txt` were added.

About images were compressed and product card thumbnails now load lazily. The latest reports cover four pages, though the remaining heading and contrast findings still need review.

## Earlier production build snapshot

These figures came from an earlier local production build and predate the latest changes.

| Output | Size | Gzip |
| --- | ---: | ---: |
| Main JavaScript bundle | 338.54 kB | 103.45 kB |
| CSS | 42.94 kB | 8.66 kB |
| HTML | 1.56 kB | 0.76 kB |

## Problems and fixes

### Cart Context types

The cart provider exposed `setQuantity`, `removeItem` and `clearCart` before the Context type included them. TypeScript reported errors in the provider and cart page.

Updating the Context type allowed the components to use the complete cart API.

### Product navigation and scrolling

URL parameters restored the catalog filters but the screen returned to the hero. Product pages also inherited the previous scroll position.

Scroll effects were added for the catalog and product pages. The behavior was checked in both directions.

### Mobile navigation

The first header hid navigation links on mobile. A second-row layout was tried before adding a hamburger menu.

The menu now exposes Shop and Catalog links and supports closing by selection, outside click and Escape.

### Firefox cart overflow

At 375px wide, the cart page overflowed horizontally in Firefox. The cart grid and its columns were updated with `min-w-0` and `minmax(0, ...)` so their contents can shrink within the viewport.

### Checkout acknowledgment after login

Checkout now keeps the acknowledgment in shared cart state. This lets a guest return to checkout after logging in without losing the checkbox state.

### Theme contrast

Some sections used the same color variable for normal text and permanently dark backgrounds. Changing the theme made those backgrounds light while their text stayed white.

The permanently dark sections received fixed dark backgrounds. Other surfaces continue to follow the selected theme.

The scroll and navigation fixes are documented with commit links in `DEBUG-LOG.md`.

## Development process

Work was organised into feature branches and merged through pull requests.

The catalog was split into ProductCatalog, ProductGrid and ProductCard. Shared cart and login state use Context providers. Pricing calculations are kept in `utils/cartPricing.ts`.

Page components, shared components, Context providers, hooks and utility functions are separated into folders.

## What I would improve

I would check mobile navigation earlier and review the required page structure before adding extra features.

I would separate text colors from fixed background colors before introducing a second theme.

I would also update documentation after each milestone and keep a debugging note when an issue is fixed.

## AI assistance

I used ChatGPT for code examples, explanations, debugging and Git guidance.

It helped me connect shared state, forms, routes and pricing calculations. I applied the changes in VS Code and checked the results in the browser.

I asked for revisions when the layout or behavior did not match the project. I chose the brand direction, text and visual style. TypeScript errors, browser behavior and Lighthouse results guided the corrections.

## Completion

The CORE shopping flow is implemented and has been checked locally and on the live site. Two accessibility findings from the latest Lighthouse runs still need review.

Login and checkout are local simulations. No real authentication or payment processing is included.

## Later scope

Orders and a Profile page remain outside the delivered scope. Formik/Yup login and route-level lazy loading have not been implemented.

The merch showcase remains postponed. About and Fine Print have been delivered.