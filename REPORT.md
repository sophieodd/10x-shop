# 10X Shop Report

## Project

CTRL+ME is my front-end diploma project for 10X. I built it with React, TypeScript and Tailwind CSS v4 using DummyJSON products.

The goal is a working shopping flow from browsing products to local order confirmation.

## Current status

The shop is deployed on Vercel:

https://sophies-10x-shop.vercel.app/

The main shopping flow has been tested locally. Type checking, linting and production builds have passed during development. Responsive checks are complete.

The deployed homepage has also been tested with Lighthouse. Final cross-browser testing and the complete live checkout flow still need to be recorded.

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
| Loading, error and empty states | Implemented |
| Error Boundary | Fallback and reload verified locally |
| Mobile navigation | Implemented |
| Responsive checks | Complete |
| Deployment | Complete |
| Unknown live route | Checked: custom 404 and catalog link appear |
| Valid live routes and refresh | Final verification pending |
| Complete Chrome and Firefox flow | Final verification pending |
| Lighthouse report | Complete |

## Additional features delivered

- Search with debounce and a header search panel
- Category filters, price filtering and sorting
- Pagination with URL state
- Product image gallery and API reviews
- Product discounts
- Cart persistence
- Promo code 10X10
- Shipping calculations and free shipping progress
- Mini cart preview
- Cart notifications
- Catalog skeletons and retry
- Light and dark themes with a saved preference
- About and Fine Print pages
- A link to the separately deployed CRM

## Checks completed

- npm run typecheck passed during development.
- npm run lint passed during development.
- npm run build passed during development.
- Guest checkout returned to checkout after login.
- Invalid checkout fields displayed errors.
- A valid order displayed confirmation and cleared the cart.
- Returning from a product restored the catalog filters and page.
- Product pages opened at the top.
- Mobile navigation and the account dialog were tested during development.
- Responsive layouts were checked.
- The Error Boundary caught a test render error and displayed its fallback.
- After clearing the test trigger, Reload restored the shop.
- An unknown live route displayed the custom 404 page.
- Lighthouse contrast, meta description and robots.txt checks passed after fixes.

## Lighthouse results

The reports were captured on November 13, 2026 using Lighthouse 13.5.0 in Chromium 157.

Both runs tested the deployed homepage with mobile emulation, Slow 4G throttling and the dark theme.

| Category | Before | After |
| --- | --- | --- |
| Performance | 97 | 97 |
| Accessibility | 96 | 100 |
| Best Practices | 100 | 100 |
| SEO | 83 | 100 |

| Metric | Before | After |
| --- | --- | --- |
| First Contentful Paint | 2.1 s | 2.1 s |
| Largest Contentful Paint | 2.1 s | 2.1 s |
| Total Blocking Time | 10 ms | 50 ms |
| Cumulative Layout Shift | 0 | 0 |
| Speed Index | 2.1 s | 2.1 s |

Reports:

- [Before](docs/lighthouse/before.html)
- [After](docs/lighthouse/after.html)

### What changed

White text needed stronger contrast on blue backgrounds. Small magenta text also needed different colors on light and dark surfaces.

Lavender banners and discount badges were given dark text. The faint coordinates in the hero were made brighter.

A meta description and public/robots.txt were added.

The second report also identified an accessible-name warning on the map link. Its label was updated to include the visible coordinates after that report was captured. That specific change needs a follow-up check.

Lighthouse results vary between runs. These results cover one page and theme, not every screen or interaction.

## Earlier recorded build

| Output | Size | Gzip |
| --- | --- | --- |
| Main JavaScript bundle | 310.76 kB | 95.57 kB |
| CSS | 28.51 kB | 6.14 kB |
| HTML | 0.77 kB | 0.42 kB |

These figures came from an earlier local build. They are retained as a development record and do not represent the latest bundle after the theme and other additions.

## Problems and fixes

### Cart Context types

The cart provider exposed setQuantity, removeItem and clearCart before the Context type included them. TypeScript reported errors in the provider and cart page.

Updating the Context type allowed the components to use the complete cart API.

### Product navigation and scrolling

URL parameters restored the catalog filters but the screen returned to the hero. Product pages also inherited the previous scroll position.

Scroll effects were added for the catalog and product pages. The behavior was checked in both directions.

### Mobile navigation

The first header hid navigation links on small screens. A second-row layout was tried before adding a hamburger menu.

The menu now exposes Shop and Catalog links and supports closing by selection, outside click and Escape.

The scroll and navigation fixes are documented with commit links in DEBUG-LOG.md.

### Theme contrast

Some sections used the same color variable for normal text and permanently dark backgrounds. Changing the theme made those backgrounds light while their text stayed white.

The permanently dark sections received fixed dark backgrounds. Other surfaces continue to follow the selected theme. Lighthouse helped identify additional text contrast problems.

## Development process

Work was organised into feature branches and merged through pull requests.

The catalog was split into ProductCatalog, ProductGrid and ProductCard. Shared cart and login state use Context providers. Pricing calculations are kept in cartPricing.ts.

## What I would improve

I would check mobile navigation earlier and review the required page structure before adding extra features.

I would separate text colors from fixed background colors before introducing a second theme.

I would also update documentation after each milestone and keep a debugging note when an issue is fixed.

## AI assistance

I used ChatGPT for code examples, explanations, debugging and Git guidance.
It helped me connect shared state, forms, routes and pricing calculations.
I applied the changes in VS Code and checked the results in the browser.
I asked for revisions when the layout or behavior did not match the project.
I chose the brand direction, text and visual style.
TypeScript errors, browser behavior and Lighthouse results guided the corrections.

## Remaining verification

- Confirm direct opening and refresh of valid deployed routes.
- Run the complete shopping flow on the live site.
- Complete the flow in Chrome and Firefox.
- Finish keyboard and API failure-state checks.
- Recheck the map link's accessible name.
- Record any remaining fixes and the final build output.

## Later scope

Orders, Profile, local review submission and related products remain outside the delivered scope.

Other FULL items, including Formik/Yup login and route-level lazy loading, have not been completed.

The merch showcase remains postponed. About and Fine Print have been delivered.