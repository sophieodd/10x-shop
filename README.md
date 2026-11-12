# CTRL+ME | 10X Shop

My front-end diploma project for 10X. Built with React, TypeScript and Tailwind CSS v4 using products from DummyJSON.

CTRL+ME brings together my interest in design, tech and questionable shopping decisions. The shop uses electric blue, magenta and lavender with a little attitude.

## Features

- Shop homepage and a separate catalog page
- Product search, category filters, sorting and pagination
- Filters and page numbers saved in the URL
- Product details with an image gallery and customer reviews
- Product discounts and stock limits
- Shopping cart with quantity controls and item removal
- Cart and promo code saved between visits
- Mini cart preview and cart notifications
- Promo code `10X10` for an extra 10% off
- Free shipping from $100 after discounts and $10 shipping below that amount
- Local login with form validation
- Checkout with delivery details and order confirmation
- Mobile navigation and responsive layouts
- Loading skeletons, error messages and an Error Boundary

## Technology

- React
- TypeScript with strict checking
- React Router
- Tailwind CSS v4
- Vite
- DummyJSON

## How it works

`ProductCatalog` fetches products and manages search, filters and pagination. `ProductGrid` arranges the results and `ProductCard` displays each product.

The cart uses React Context so the header, product pages and cart page share the same state. Cart data is saved in localStorage. Pricing calculations are shared through `cartPricing.ts`.

Login uses a local React Context. Checkout validates the delivery form, displays a confirmation and clears the cart.

## Project structure

```text
src/
  components/
    AccountMenu.tsx
    CartPage.tsx
    CheckoutPage.tsx
    ErrorBoundary.tsx
    Footer.tsx
    Header.tsx
    Hero.tsx
    LoginPage.tsx
    MiniCart.tsx
    ProductCard.tsx
    ProductCatalog.tsx
    ProductDetails.tsx
    ProductGrid.tsx
  hooks/
    useDebounce.ts
  App.tsx
  AuthProvider.tsx
  CartProvider.tsx
  auth.ts
  cart.ts
  cartPricing.ts
  index.css
  main.tsx
```

## Run locally

Install the dependencies:

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
| `npm run typecheck` | Checks the app and Vite configuration with TypeScript |
| `npm run lint` | Checks the code with ESLint |
| `npm run build` | Checks types and creates a production build |
| `npm run preview` | Serves the production build locally |

## Try the checkout

1. Add a product to the cart.
2. Check the acknowledgment box.
3. Select Proceed to checkout.
4. Log in with any non-empty username and a password of at least six characters.
5. Enter valid delivery details.
6. Place the order.

For example, use `sophie` and `demo123`.

Login and checkout are local simulations. No credentials are sent to an authentication service and no payment is taken.

## Current limitations

- Products and reviews come from DummyJSON.
- Order confirmation lasts for the current visit. Order history is not implemented yet.
- Orders and Profile pages are planned for the FULL stage.
- Responsive and browser testing is still in progress.

## Live demo

Deployment is pending.

## Credits

Created by Sophie for the 10X front-end diploma project.

Product data comes from DummyJSON. ChatGPT helped with implementation, debugging and explanations.