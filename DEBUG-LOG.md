# Debug Log

These issues came up while building and testing CTRL+ME.

## 1. Returning from a product opened the hero

### Problem

After selecting Back to the catalog, the filters and page number were restored but the screen showed the hero.

### Steps to reproduce

1. Scroll to the product catalog.
2. Change a filter or move to another results page.
3. Open a product.
4. Select Back to the catalog.
5. Check the URL and scroll position.

### Investigation and cause

I reproduced the issue in the browser and reviewed the return link and catalog effect in VS Code.

The URL parameters were restored correctly. The catalog section needed a separate scroll action after React rendered it.

### Fix

Added a scroll effect using the catalog section ref and `requestAnimationFrame`. Scroll margin left room for the sticky header.

When the catalog received its own route, the return link and scroll handling were updated for `/catalog`.

### Result

Returning from a product showed the catalog with the saved filters and page.

### What I learned

Restoring URL parameters and restoring scroll position are separate parts of navigation.

### Commits

- [Initial scroll fix](https://github.com/sophieodd/10x-shop/commit/e72e15c)
- [Separate catalog route](https://github.com/sophieodd/10x-shop/commit/e624c1b)

## 2. Product pages opened near the bottom

### Problem

Opening a product from further down the catalog kept the previous scroll position. The top of the product page was out of view.

### Steps to reproduce

1. Scroll down the catalog.
2. Open a product.
3. Check where the product page starts.

### Investigation and cause

I reproduced the issue in the browser and reviewed `ProductDetails.tsx` in VS Code.

The product route loaded successfully but nothing reset the scroll position when the product changed.

### Fix

Added a `useEffect` in `ProductDetails` that calls `window.scrollTo` when the product ID changes.

### Result

Product pages opened at the top. Returning to the catalog still restored the catalog view.

### What I learned

SPA navigation can keep the previous page's scroll position. Different navigation flows need different scroll behavior.

### Commit

- [Product scroll fix](https://github.com/sophieodd/10x-shop/commit/e72e15c)

## 3. Main navigation disappeared on mobile

### Problem

The header hid Shop and Catalog on smaller screens. There was no mobile menu to replace them.

### Steps to reproduce

1. Open the shop at a narrow browser width.
2. Look for the Shop and Catalog links.
3. Try navigating between those pages.

### Investigation and cause

I reviewed `Header.tsx` in VS Code. The navigation used `hidden` with a responsive display class, so the links disappeared below the breakpoint.

A second-row layout was tried first but made the mobile header feel crowded.

### Fix

Added a hamburger button and an expandable navigation menu. The button exposes its open state with `aria-expanded`.

The menu closes after selecting a link, clicking outside or pressing Escape. Shop and Catalog also received separate routes.

### Result

Both navigation links became available through the mobile menu.

### What I learned

Hiding desktop navigation needs a usable replacement on smaller screens. The replacement also needs keyboard controls and a clear open state.

### Commit

- [Mobile navigation and routes](https://github.com/sophieodd/10x-shop/commit/e624c1b)

## 4. Cart overflowed in Firefox at 375px

### Problem

The cart page overflowed horizontally in Firefox at a 375px viewport width.

### Steps to reproduce

1. Open the cart in Firefox.
2. Set the viewport width to 375px.
3. Check for horizontal scrolling or content extending beyond the screen.

### Investigation and cause

I reproduced the overflow in Firefox. The cart grid and its children were keeping their minimum content widths instead of shrinking to fit the viewport.

### Fix

Added `min-w-0` to the cart containers and used `minmax(0, ...)` for the responsive grid columns.

### Result

The cart fits the 375px viewport in Firefox.

### What I learned

Grid children can keep their intrinsic minimum width. Setting a zero minimum lets them shrink within a narrow column.

### Commit

- [Firefox cart overflow fix](https://github.com/sophieodd/10x-shop/commit/714cd44006eef86608011508126419ca5a81677a)