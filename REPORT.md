# 10X Shop Report

## Project

CTRL+ME is my front-end diploma project for 10X. I built it with React, TypeScript and Tailwind CSS v4 using DummyJSON products.

The goal is a working shopping flow from browsing products to local order confirmation.

## Current status

The main shopping flow works locally. Type checking, linting and the production build pass.

Final responsive checks, browser testing and deployment are still pending.

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
| Error Boundary | Implemented |
| Mobile navigation | Implemented |
| Full responsive and browser checks | Pending |
| Deployment and live route checks | Pending |

## Additional features delivered

- Search with debounce
- Category filters and sorting
- Pagination with URL state
- Product image gallery and API reviews
- Product discounts
- Cart persistence
- Promo code 10X10
- Shipping calculations and free shipping progress
- Mini cart preview
- Cart notifications
- Catalog skeletons and retry

## Checks completed

- npm run typecheck passed.
- npm run lint passed.
- npm run build passed.
- Guest checkout returned to checkout after login.
- Invalid checkout fields displayed errors.
- A valid order displayed confirmation and cleared the cart.
- Returning from a product restored the catalog filters and page.
- Product pages opened at the top.
- Mobile navigation and the account dialog were tested during development.

A complete browser and device test is still required.

## Latest recorded build

| Output | Size | Gzip |
| --- | --- | --- |
| Main JavaScript bundle | 310.76 kB | 95.57 kB |
| CSS | 28.51 kB | 6.14 kB |
| HTML | 0.77 kB | 0.42 kB |

These figures come from the local production build. Lighthouse measurements have not been collected yet.

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

## Development process

Work was organised into feature branches and merged through pull requests.

The catalog was split into ProductCatalog, ProductGrid and ProductCard. Shared cart and login state use Context providers. Pricing calculations are kept in cartPricing.ts.

## What I would improve

I would check mobile navigation earlier and review the required page structure before adding extra features.

I would also update documentation after each completed milestone and keep a debugging note when an issue is fixed.

## AI assistance

I used ChatGPT for code examples, explanations, debugging and Git guidance.

I applied the changes in VS Code and checked the results in the browser. I asked for revisions when the layout or behavior did not match the project.

I chose the brand direction, text and visual style. Build errors and navigation problems were reviewed during development.

## Remaining work

- Finish responsive checks across all CORE pages.
- Test keyboard navigation and failure states.
- Check Chrome and Firefox.
- Test the Error Boundary fallback.
- Deploy the app.
- Verify direct links and refresh on deployed routes.
- Run the complete shopping flow on the live site.
- Collect Lighthouse results.
- Add the live link to README.md.

## Later scope

Orders, Profile, local review submission, related products and other remaining FULL requirements will follow CORE completion.

The merch showcase and About page are postponed.