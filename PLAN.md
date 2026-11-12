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
- [ ] Complete responsive checks across all CORE pages.
- [ ] Test keyboard navigation, error states and route handling.
- [ ] Finish README.md, PLAN.md, REPORT.md and DEBUG-LOG.md.
- [ ] Deploy the project and check direct page links and refresh.
- [ ] Run the complete shopping flow on the live site.

## Work stages

### Foundation

Project setup, types, shared layout, routing and local login.

### Shopping flow

Catalog, product details, cart, checkout and order confirmation.

### Completion

Responsive checks, debugging, documentation, deployment and final testing.

## FULL features already started

- Search with debounce
- Category filters and sorting
- Pagination and URL state
- Product image gallery and API reviews
- Cart persistence and notifications
- Promo code and shipping calculations
- Loading skeletons and catalog retry

## Later work

After CORE is complete, review the remaining FULL requirements for product ratings, local reviews, related products, Orders, Profile, Formik and Yup, TypeScript architecture and performance.

The merch showcase and About page are postponed.

## Risks

| Risk | Response |
| --- | --- |
| DummyJSON is unavailable | Display an error state and provide retry where implemented. Test with the browser offline. |
| Navigation changes break the shopping flow | Test product links, saved filters, login redirects and checkout after route changes. |
| Content overflows on mobile | Check every CORE page at 375px and fix layouts before deployment. |
| Extra features delay CORE completion | Finish required checks and submission work before adding more FULL features. |

## Definition of done

A task is complete when its expected behavior works, relevant checks pass and the change is committed.

Before submission:

- Typecheck, lint and production build pass.
- The complete shopping flow works on the live site.
- CORE pages work on mobile and desktop.
- Direct links and page refresh work after deployment.
- Documentation describes the delivered features and remaining limitations.

## Scope

Login and checkout are local simulations. Product data comes from DummyJSON. Orders are confirmed locally and the project processes no real payments.