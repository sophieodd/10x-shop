# Debug Log

These issues came up while building and testing CTRL+ME.

## 1. Returning from a product opened the hero

### Problem

After opening a product and selecting Back to the catalog, the filters and page number were restored but the screen showed the hero.

### Steps to reproduce

1. Scroll to the product catalog.
2. Change a filter or move to another results page.
3. Open a product.
4. Select Back to the catalog.
5. Check the URL and scroll position.

### Investigation

I tested the navigation in the browser and reviewed the return link and catalog effect in VS Code.

The URL state was restored. The catalog section still needed an explicit scroll action after React rendered it.

### Fix

Added a scroll effect using the catalog section ref and requestAnimationFrame. The section used scroll margin to leave room for the sticky header.

When the catalog later received its own route, the return link and scroll handling were updated for /catalog.

### Result

Returning from a product showed the catalog with the saved filters and page.

### What I learned

Restoring URL parameters and restoring scroll position are separate parts of navigation.

[Initial fix](https://github.com/sophieodd/10x-shop/commit/e72e15c)

[Separate catalog route](https://github.com/sophieodd/10x-shop/commit/e624c1b)

## 2. Product pages opened near the bottom

### Problem

Opening a product from further down the catalog kept the previous scroll position. The top of the product page was out of view.

### Steps to reproduce

1. Scroll down the catalog.
2. Open a product.
3. Check where the product page starts.

### Investigation

I reproduced the issue in the browser and reviewed ProductDetails.tsx in VS Code.

The product route loaded successfully but the page did not reset its scroll position.

### Fix

Added a useEffect in ProductDetails that calls window.scrollTo when the product ID changes.

### Result

Product pages opened at the top. Returning to the catalog still restored the catalog view.

### What I learned

SPA navigation can keep the previous page's scroll position. Each navigation flow needs the appropriate scroll behavior.

[Fix](https://github.com/sophieodd/10x-shop/commit/e72e15c)

## 3. Main navigation disappeared on mobile

### Problem

The header hid Shop and Catalog on smaller screens. There was no mobile menu to replace them.

### Steps to reproduce

1. Open the shop at a narrow browser width.
2. Look for the Shop and Catalog links in the header.
3. Try navigating between those pages.

### Investigation

I reviewed Header.tsx in VS Code. The navigation used hidden with a responsive display class, so the links disappeared below the breakpoint.

A second-row layout was tried first. It made the mobile header feel crowded.

### Fix

Added a hamburger button and an expandable navigation menu. The button exposes its open state with aria-expanded.

The menu closes after selecting a link, clicking outside or pressing Escape. Shop and Catalog also received separate routes.

### Result

Both navigation links became available on mobile through the menu.

### What I learned

Hiding desktop navigation needs a usable replacement on small screens. Mobile navigation also needs keyboard controls and a clear open state.

[Fix](https://github.com/sophieodd/10x-shop/commit/e624c1b)