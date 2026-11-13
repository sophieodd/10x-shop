# CTRL+ME | 10X Shop

My front-end diploma project for 10X. Built with React, TypeScript and Tailwind CSS v4 using products from DummyJSON.

CTRL+ME brings together my interest in design, tech and questionable shopping decisions. The shop uses electric blue, magenta and lavender with a little attitude.

## Live demo

[Visit CTRL+ME](https://sophies-10x-shop.vercel.app/)

## Features

### Core shopping flow

- Product catalog and product details
- Quantity selection and stock limits
- Shared shopping cart with quantity controls and item removal
- Local login with form validation
- Checkout access checks for guests
- Validated delivery form and local order confirmation
- Responsive layouts and mobile navigation
- Loading, error and empty states
- Error Boundary and a custom 404 page

### Additional features

- Separate Shop and Catalog pages
- Search, category filters, price filtering and sorting
- Pagination with filters and page numbers stored in the URL
- Header search panel
- Product image gallery and reviews from DummyJSON
- Product discounts
- Cart and promo code persistence
- Mini cart preview and cart notifications
- Promo code `10X10` for an extra 10% off
- Free shipping from $100 after discounts and $10 shipping below that amount
- Light and dark themes with a saved preference
- About and Fine Print pages
- Administrator link to the separate CRM project

## Technology

React, TypeScript with strict checking, React Router, Tailwind CSS v4, Vite and DummyJSON.

## How it works

ProductCatalog fetches products and manages search, filters and pagination. ProductGrid arranges the results and ProductCard displays each product.

The cart uses React Context so the header, product pages and cart page share the same state. Cart data is saved in localStorage. Pricing calculations are shared through cartPricing.ts.

Login uses a local React Context. Checkout validates the delivery form, displays a confirmation and clears the cart.

The CRM is a separate application. Linking to it does not share shop accounts, sessions or orders.

## Main project files

public/
  about/
  favicon.svg
  icons.svg
  robots.txt
src/
  components/
    AccountMenu.tsx
    ErrorBoundary.tsx
    Footer.tsx
    Header.tsx
    HeaderSearch.tsx
    Hero.tsx
    LoginPage.tsx
    MiniCart.tsx
    ProductCard.tsx
    ProductCatalog.tsx
    ProductGrid.tsx
    ThemeToggle.tsx
  context/
    AuthProvider.tsx
    CartProvider.tsx
    auth.ts
    cart.ts
  hooks/
    useDebounce.ts
  pages/
    AboutPage.tsx
    CartPage.tsx
    CheckoutPage.tsx
    FinePrintPage.tsx
    NotFoundPage.tsx
    ProductDetails.tsx
  utils/
    cartPricing.ts
  App.tsx
  index.css
  main.tsx
docs/
  lighthouse/
    before.html
    after.html

## Run locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local address shown in the terminal.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the development server |
| `npm run typecheck` | Checks TypeScript |
| `npm run lint` | Checks the code with ESLint |
| `npm run build` | Checks types and creates a production build |
| `npm run preview` | Serves the production build locally |

## Try the checkout

1. Add a product to the cart.
2. Check the acknowledgment box.
3. Select Proceed to checkout.
4. Log in using the demo values below.
5. Enter valid delivery details.
6. Place the order.

Demo username: `sophie`

Demo password: `demo123`

Login and checkout are local simulations. No credentials are sent to an authentication service and no payment is taken. Use made-up details.

## Quality checks

Type checking, linting and production builds have passed during development. Responsive checks have been completed.

The deployed homepage was tested with Lighthouse on November 13, 2026 using mobile emulation and Slow 4G throttling.

| Category | Score |
| --- | --- |
| Performance | 97 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

Reports are saved in [docs/lighthouse](docs/lighthouse/). These scores describe the tested homepage and do not replace manual checks across the application.

See [REPORT.md](REPORT.md) for completed checks and remaining verification.

## Current limitations

- Product data and existing reviews come from DummyJSON.
- Local data belongs to the current browser and is not synced between devices.
- Order confirmation uses React state and is lost after a page reload.
- Order history, Profile, local review submission and related products are not implemented.
- Final cross-browser and complete live checkout verification remain to be recorded.

## Credits

Created by Sophie for the 10X front-end diploma project.

Product data comes from DummyJSON. ChatGPT helped with implementation, debugging and explanations.