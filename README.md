# DOMIVKA Candles — multipage catalogue + checkout + admin

## Run the website

```bash
npm install
npm run dev
```

## What is included

- Multi-page/hash-routed DOMIVKA website
- Catalogue, categories, search, product detail pages
- Cart + checkout
- Promo-code field with **Apply** button and recalculated discount/total
- Demo promo codes: `DOMIVKA10` (-10%) and `HOME15` (-15%)
- Admin authorization at `#/admin`
- Admin catalogue CRUD: add / edit / delete products
- Product editor includes both **outer card** and **inner product page** fields:
  - UA and EN names
  - slug / ID
  - price
  - category
  - badge
  - card description
  - image URL/path or uploaded image
  - full product story/description
  - feature/details list

## Admin mode

### Quick frontend-only demo

If `VITE_CATALOG_API_URL` is not configured, the admin works with browser `localStorage`.

Default demo credentials:

- Email: `admin@domivka.local`
- Password: `domivka2026`

You can override them with `VITE_ADMIN_EMAIL` and `VITE_ADMIN_PASSWORD`.

**Important:** frontend-only credentials are visible in the compiled JavaScript and catalogue changes exist only in that browser. Use this mode only for preview/testing.

### Persistent/server mode

A dependency-free Node catalogue API is included in `server/index.mjs`. It stores catalogue data in `data/products.json` and protects write operations with a signed admin token.

1. Copy `.env.example` to your own environment/config and set strong values for:
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `ADMIN_SECRET`
2. Start the API:

```bash
npm run api
```

3. Run Vite with:

```env
VITE_CATALOG_API_URL=http://localhost:8787/api
```

For production, deploy the Node server on persistent hosting/storage. After `npm run build`, the included server can also serve the `dist` directory.

## Promo codes

Promo codes currently live in `src/main.jsx` under `PROMO_CODES`. The order payload stores the applied code, discount, shipping, and final total.

## Order endpoint

Set `VITE_ORDER_ENDPOINT` to send the final order JSON to Make.com, a serverless function, CRM, Telegram workflow, or your own backend.

## Multiple product photos

Each catalogue item now supports an `images` array. The first image is treated as the primary image for catalogue cards, cart and admin list. On the product page, additional images automatically become a thumbnail gallery with previous/next controls.

In `#/admin` you can:
- upload several image files at once (`multiple` file input);
- add several image URLs/paths one by one;
- choose which image is primary;
- remove individual images;
- edit the gallery later without recreating the product.

For production, store uploaded files in object storage/CDN and save their URLs in `images`. The built-in local demo can still use data URLs, but those are intended for testing only.

## Category management (v5)

The admin panel now has a dedicated **Categories** manager. Admins can add, rename, and delete categories without touching code. Product editing uses checkbox selection, so one product can belong to multiple categories at once.

When a category is renamed, all linked products are migrated to the new name. When a category is deleted, it is automatically removed from linked products. In API mode categories persist in `data/categories.json` and are available through `/api/categories`; in local/demo mode they persist in `localStorage`.
# domivka-candles
