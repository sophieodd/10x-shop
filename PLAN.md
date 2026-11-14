# 10X Shop Plan

## Goal

Build CTRL+ME as my 10X front-end diploma project. The shop includes a product catalog, product details, local login, a shopping cart and checkout.

## Stack

React, TypeScript, Tailwind CSS v4, Vite, React Router and DummyJSON.

## CORE progress

- [x] Set up Vite, React, TypeScript and Tailwind CSS v4.
- [x] Create the GitHub repository and use feature branches with pull requests.
- [x] Build the shared header, footer and page routes.
- [x] Add local login with validation and checkout access checks.
- [x] Fetch products and product details from DummyJSON.
- [x] Split product rendering into ProductCatalog, ProductGrid and ProductCard.
- [x] Show loading, error and empty states.
- [x] Add shared cart state with quantity changes, removal and totals.
- [x] Build checkout validation and local order confirmation.
- [x] Add an Error Boundary.
- [x] Add mobile navigation.
- [x] Enable strict TypeScript and the typecheck command.
- [x] Check responsive layouts across CORE pages.
- [x] Check keyboard navigation, error states and route handling.
- [x] Deploy the project and check direct page links and refresh.
- [x] Run the shopping flow on the live site.
- [x] Save Lighthouse reports for the Home, Catalog, Product details and About pages.
- [ ] Review the Catalog heading order and Product details link contrast found in the latest Lighthouse runs.
- [ ] Rerun Lighthouse on the affected pages after those fixes.
- [ ] Finish README.md, PLAN.md, REPORT.md and DEBUG-LOG.md updates.

## Work stages

### Foundation

Project setup, types, shared layout, routing and local login.

### Shopping flow

Catalog, product details, cart, checkout and local order confirmation.

### Completion

Responsive checks, debugging, documentation, deployment and final testing.

## Features beyond CORE already delivered

- Search with debounce
- Category and price filters, sorting and pagination with URL state
- Product image gallery, API reviews and locally submitted reviews
- Related products
- Cart persistence and notifications
- Promo code and shipping calculations
- Catalog skeletons and retry
- Light and dark themes
- About and Fine Print pages
- Link to the separate CRM
- Compressed About images and lazy-loaded product thumbnails

## Later work

Orders, Profile, Formik/Yup login and route-level lazy loading remain outside the current scope.

The merch showcase is postponed.

## Risks

| Risk | Response |
| --- | --- |
| DummyJSON is unavailable | Display an error state and provide retry where implemented. |
| Navigation changes break the shopping flow | Check product links, saved filters, login redirects and checkout after route changes. |
| Content overflows on mobile | Check pages at narrow widths and fix layout issues before submission. |
| Extra features delay submission | Keep remaining work focused on CORE verification and documentation. |

## Definition of done

A task is complete when its expected behavior works, relevant checks pass and the change is committed.

Before submission:

- Typecheck, lint and production build pass.
- The shopping flow works on the live site.
- CORE pages work on mobile and desktop.
- Direct links and page refresh work after deployment.
- Documentation describes delivered features and remaining limitations.
- Lighthouse follow-up findings are resolved or clearly documented.

## Scope

Login and checkout are local simulations. Product data comes from DummyJSON. Orders are confirmed locally and the project processes no real payments.