# DOMIVKA Candles

A warm, animated, multi-page e-commerce catalogue for **DOMIVKA Candles**.

The project includes a public candle catalogue, product pages, shopping cart, checkout flow, promo codes, an admin panel, persistent catalogue API, multi-photo products, and editable categories.

---

## Features

### Public website

- Multi-page/hash-routed React website
- Responsive layout for desktop, tablet, and mobile
- DOMIVKA visual identity and real product photography
- Claymorphism-inspired UI
- Animated sections and interactions
- Catalogue with category filters
- Products can belong to multiple categories
- Individual product pages
- Multiple photos per product
- Product image gallery with thumbnails and previous/next navigation
- Shopping cart
- Quantity controls
- Checkout form
- Promo-code input and **Apply** button
- Delivery and total calculation
- Instagram integration
- Persistent cart via `localStorage`

### Admin panel

Admin route:

```text
/#/admin
```

The admin can:

- log in securely through the backend API
- add products
- edit products
- delete products
- upload/add multiple product photos
- select the primary product photo
- remove individual photos
- assign multiple categories to one product
- add categories
- rename categories
- delete categories

Product fields include:

- ID / slug
- English product name
- Ukrainian product name
- price
- categories
- badge
- short catalogue-card description
- full product-page story/description
- product details/features
- multiple product images

---

# Tech stack

- React
- Vite
- JavaScript
- CSS
- Node.js HTTP server
- JSON catalogue storage
- Railway for deployment
- Make.com webhook for order automation

No external backend framework is required for the included API.

---

# Project structure

Recommended production structure:

```text
domivka-candles/
├── public/
│   ├── images/
│   ├── favicon.ico
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── apple-touch-icon.png
│   └── site.webmanifest
│
├── src/
│   ├── main.jsx
│   └── styles.css
│
├── server/
│   └── index.mjs
│
├── data/
│   ├── products.json
│   └── categories.json
│
├── seed/
│   ├── products.json
│   └── categories.json
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
└── README.md
```

## Important

`data/` is runtime/persistent catalogue data.

`seed/` is the initial catalogue copied into `data/` when persistent storage is empty.

Do **not** structure it as:

```text
data/seed/
```

The intended structure is:

```text
data/
seed/
```

as two separate root-level folders.

---

# Local development

## 1. Install dependencies

```bash
npm install
```

## 2. Create local environment file

Copy:

```text
.env.example
```

to:

```text
.env
```

Example:

```env
VITE_ORDER_ENDPOINT=

VITE_CATALOG_API_URL=http://localhost:8787/api

ADMIN_EMAIL=admin@domivka.local
ADMIN_PASSWORD=change-me
ADMIN_SECRET=replace-with-a-long-random-secret

PORT=8787
CORS_ORIGIN=http://localhost:5173
```

## 3. Start backend

In one terminal:

```bash
npm run api
```

Backend:

```text
http://localhost:8787
```

API:

```text
http://localhost:8787/api
```

## 4. Start frontend

In another terminal:

```bash
npm run dev
```

Vite usually runs at:

```text
http://localhost:5173
```

---

# Build

Create a production frontend build:

```bash
npm run build
```

The build is generated in:

```text
dist/
```

The included Node server can serve both:

- the Vite `dist` frontend
- the `/api/*` backend routes

Start the complete production build locally with:

```bash
npm start
```

---

# Environment variables

## Frontend

### `VITE_CATALOG_API_URL`

Catalogue/admin API URL.

For local development:

```env
VITE_CATALOG_API_URL=http://localhost:8787/api
```

For a frontend and backend deployed together on Railway:

```env
VITE_CATALOG_API_URL=/api
```

This is the recommended production value.

---

### `VITE_ORDER_ENDPOINT`

Optional endpoint receiving completed checkout orders as JSON.

Example with Make.com:

```env
VITE_ORDER_ENDPOINT=https://hook.eu2.make.com/YOUR_WEBHOOK_ID
```

If it is empty, the website remains usable as a demo, but no external automation receives the order.

---

## Backend

### `ADMIN_EMAIL`

Admin-panel login email.

Example:

```env
ADMIN_EMAIL=owner@example.com
```

---

### `ADMIN_PASSWORD`

Admin-panel password.

Use a strong password.

```env
ADMIN_PASSWORD=replace-with-a-strong-password
```

Never commit a real production password to GitHub.

---

### `ADMIN_SECRET`

Secret used by the Node API to sign admin authorization tokens.

Generate one on macOS/Linux:

```bash
openssl rand -hex 32
```

Then add the generated value:

```env
ADMIN_SECRET=YOUR_RANDOM_SECRET
```

Do not expose or commit this value.

---

### `PORT`

Local backend port.

```env
PORT=8787
```

On Railway, normally **do not manually define `PORT`**. Railway supplies it automatically and the server reads `process.env.PORT`.

---

### `CORS_ORIGIN`

Allowed frontend origin.

Local:

```env
CORS_ORIGIN=http://localhost:5173
```

If frontend and API use the same Railway domain, CORS is usually not needed for same-origin calls. You can set it to the final public site origin if desired.

Example:

```env
CORS_ORIGIN=https://your-domain.com
```

---

# Do not use frontend admin credentials in production

The project may contain/demo these optional variables:

```env
VITE_ADMIN_EMAIL=
VITE_ADMIN_PASSWORD=
```

They are only for frontend-only local/demo mode.

Anything beginning with `VITE_` is bundled into browser JavaScript and can be inspected by visitors.

For production use only:

```env
ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_SECRET=
```

with:

```env
VITE_CATALOG_API_URL=/api
```

---

# Catalogue API

Base URL:

```text
/api
```

## Authentication

### Login

```http
POST /api/login
```

Body:

```json
{
  "email": "admin@example.com",
  "password": "your-password"
}
```

Successful response:

```json
{
  "token": "SIGNED_ADMIN_TOKEN"
}
```

Admin write requests use:

```http
Authorization: Bearer SIGNED_ADMIN_TOKEN
```

Tokens expire automatically.

---

# Products API

## Get all products

```http
GET /api/products
```

No authentication required.

---

## Create product

```http
POST /api/products
```

Authentication required.

Example body:

```json
{
  "id": "pink-carousel",
  "name": "Pink Carousel",
  "ukName": "Рожева карусель",
  "price": 820,
  "image": "/images/pink-carousel.webp",
  "images": [
    "/images/pink-carousel.webp",
    "/images/pink-carousel-2.webp"
  ],
  "collection": "Gift",
  "categories": [
    "Gift",
    "Statement"
  ],
  "badge": "gift-ready",
  "short": "Керамічна свічка як маленький святковий об’єкт.",
  "story": "Повний опис товару.",
  "details": [
    "ручне оформлення",
    "подарункова подача"
  ]
}
```

Required fields include:

- `id`
- `ukName`
- at least one image
- at least one category

---

## Update product

```http
PUT /api/products/:id
```

Authentication required.

---

## Delete product

```http
DELETE /api/products/:id
```

Authentication required.

---

# Categories API

## Get categories

```http
GET /api/categories
```

No authentication required.

---

## Create category

```http
POST /api/categories
```

Authentication required.

Body:

```json
{
  "name": "Christmas"
}
```

---

## Rename category

```http
PUT /api/categories/:name
```

Authentication required.

Body:

```json
{
  "name": "Winter Collection"
}
```

When a category is renamed, linked products are automatically migrated to the new category name.

---

## Delete category

```http
DELETE /api/categories/:name
```

Authentication required.

When a category is deleted, it is automatically removed from linked products.

---

# Multiple product photos

Each product supports:

```json
{
  "image": "/images/main.webp",
  "images": [
    "/images/main.webp",
    "/images/detail-1.webp",
    "/images/detail-2.webp"
  ]
}
```

The first image in `images` is treated as the primary image.

It is displayed in:

- catalogue cards
- cart
- admin product list

If several images exist, the product page displays the complete gallery.

The admin panel allows:

- adding several URLs
- uploading several files
- selecting a primary image
- deleting individual photos
- editing the gallery later

## Production note for uploads

The current local/demo upload implementation can store browser-generated data URLs.

For a real public store, product images should eventually be uploaded to an external storage/CDN, for example:

- Cloudinary
- Supabase Storage
- Amazon S3

The backend should then store only their public URLs.

---

# Promo codes

Promo codes currently live in:

```text
src/main.jsx
```

under:

```js
PROMO_CODES
```

Demo examples:

```text
DOMIVKA10
HOME15
```

The checkout calculates:

```text
subtotal
− discount
+ shipping
= final total
```

The applied promo code and discount are included in the order payload.

## Production recommendation

For a real store, promo-code validation should later be moved to the backend so visitors cannot inspect all valid codes in the compiled frontend JavaScript.

---

# Checkout / orders

Checkout currently collects customer and delivery information and prepares a JSON order payload.

The delivery location is split into separate fields:

- city
- delivery method / branch

The order also contains:

- ordered items
- quantities
- product prices
- subtotal
- promo code
- discount
- shipping
- total

To send orders externally, configure:

```env
VITE_ORDER_ENDPOINT=https://your-endpoint.com
```

---

# Make.com integration

Recommended order automation:

```text
DOMIVKA checkout
      ↓
Make.com Custom Webhook
      ↓
Store order
      ↓
Send Telegram notification
      ↓
Send owner email
      ↓
Optional customer confirmation
      ↓
Optional Google Sheets / Airtable / CRM
```

## Create Make.com webhook

1. Open Make.com.
2. Create a new Scenario.
3. Add:
   ```text
   Webhooks → Custom webhook
   ```
4. Create a webhook, for example:
   ```text
   DOMIVKA New Order
   ```
5. Copy the generated webhook URL.
6. Add it to Railway:

```env
VITE_ORDER_ENDPOINT=https://hook.eu2.make.com/XXXXXXXX
```

7. Redeploy the Railway service.
8. In Make.com click **Run once**.
9. Submit a test order from the DOMIVKA website.
10. Make.com will detect the order structure automatically.

After the webhook receives a test order, add further modules such as:

```text
Telegram Bot → Send a Message
Gmail → Send an Email
Google Sheets → Add a Row
Airtable → Create a Record
```

Turn the Make scenario **ON** after testing.

---

# Railway deployment

The recommended initial production/demo architecture is:

```text
GitHub repository
        ↓
Railway service
        ├── React/Vite frontend
        ├── Node catalogue API
        └── Railway persistent volume
```

One service is enough because the Node server serves both the API and built frontend.

---

## 1. Push project to GitHub

Example:

```bash
git init
git add .
git commit -m "Initial DOMIVKA production version"

git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/domivka-candles.git
git push -u origin main
```

---

## 2. `.gitignore`

Use:

```gitignore
node_modules/
dist/
.env
.env.local
.DS_Store
```

`node_modules` and `dist` should normally not be committed.

If they were previously committed, adding `.gitignore` alone does not remove them from Git history/current tracking.

Remove them from tracking:

```bash
git rm -r --cached node_modules dist
git add .gitignore
git commit -m "Remove generated files from repository"
git push
```

Your local files remain on your computer.

---

## 3. Connect Railway to GitHub

In Railway:

```text
New Project
→ Deploy from GitHub Repo
→ domivka-candles
```

If the repository does not appear, install/configure the Railway GitHub App and give it access to the repository.

---

## 4. Railway variables

For the current combined frontend/backend deployment, add:

```env
VITE_CATALOG_API_URL=/api

ADMIN_EMAIL=YOUR_ADMIN_EMAIL
ADMIN_PASSWORD=YOUR_STRONG_PASSWORD
ADMIN_SECRET=YOUR_RANDOM_SECRET
```

For now, `VITE_ORDER_ENDPOINT` may remain empty until Make.com is connected:

```env
VITE_ORDER_ENDPOINT=
```

After creating the Make webhook:

```env
VITE_ORDER_ENDPOINT=https://hook.eu2.make.com/...
```

Do not add production values for:

```env
VITE_ADMIN_EMAIL
VITE_ADMIN_PASSWORD
```

---

## 5. Build command

Railway build command:

```bash
npm run build
```

---

## 6. Start command

Railway start command:

```bash
npm start
```

The Node server serves the generated `dist` directory automatically.

---

# Persistent Railway catalogue storage

This is essential.

Railway service files can be recreated during deployments, so catalogue changes stored only in normal container files may disappear.

Attach a Railway Volume.

Recommended mount path:

```text
/app/data
```

The Node server writes:

```text
./data/products.json
./data/categories.json
```

which resolves to the mounted persistent volume.

---

# Initial data / seeding

A new Railway Volume starts empty.

Therefore the application should keep initial files outside the persistent volume:

```text
seed/products.json
seed/categories.json
```

On startup, if:

```text
data/products.json
data/categories.json
```

do not exist, copy the initial files from `seed/`.

Example startup helper:

```js
const seedProductsFile = path.join(root, 'seed', 'products.json');
const seedCategoriesFile = path.join(root, 'seed', 'categories.json');

function ensureInitialData() {
  fs.mkdirSync(path.dirname(dataFile), { recursive: true });

  if (!fs.existsSync(dataFile) && fs.existsSync(seedProductsFile)) {
    fs.copyFileSync(seedProductsFile, dataFile);
  }

  if (!fs.existsSync(categoriesFile) && fs.existsSync(seedCategoriesFile)) {
    fs.copyFileSync(seedCategoriesFile, categoriesFile);
  }
}

ensureInitialData();
```

This must run before the server starts serving catalogue requests.

Again, the intended folders are:

```text
data/
seed/
```

not:

```text
data/seed/
```

---

# Generate Railway public domain

After successful deployment:

```text
Railway
→ Service
→ Settings
→ Networking
→ Generate Domain
```

You will receive a URL similar to:

```text
https://domivka-candles-production.up.railway.app
```

---

# Production checks

After deployment, test:

## Website

```text
https://YOUR-DOMAIN/
```

## Products API

```text
https://YOUR-DOMAIN/api/products
```

It should return a JSON array.

## Categories API

```text
https://YOUR-DOMAIN/api/categories
```

It should return a JSON array.

## Admin

```text
https://YOUR-DOMAIN/#/admin
```

Log in using the `ADMIN_EMAIL` and `ADMIN_PASSWORD` configured in Railway.

---

# Verify persistent storage

1. Log in to admin.
2. Add a temporary product.
3. Confirm that it appears in the catalogue.
4. Redeploy/restart the Railway service.
5. Open the catalogue again.

If the product is still present, the volume is working correctly.

---

# Security notes

Before presenting a public admin panel:

- use a strong admin password
- keep `ADMIN_SECRET` private
- never commit `.env`
- never expose `ADMIN_PASSWORD` through a `VITE_` variable
- keep the GitHub repository private if the client project is not meant to be public
- change credentials if they were ever posted publicly or shared in screenshots
- use HTTPS in production
- later consider rate limiting `/api/login`

## Important

If an actual admin password or `ADMIN_SECRET` was shown in a screenshot, message, public repository, or other public location, rotate it before production.

---

# Current storage limitations

The included JSON storage is appropriate for:

- client presentation
- MVP
- small catalogue
- early sales validation

For a larger production store, migrate persistence to a database such as:

- PostgreSQL
- Supabase
- Neon
- Railway PostgreSQL

Suggested tables:

```text
products
categories
product_categories
orders
order_items
promo_codes
admins
```

---

# Recommended next production upgrades

After the client approves the MVP:

1. Connect Make.com order automation
2. Add Telegram order notifications
3. Add email confirmations
4. Add Cloudinary/Supabase Storage for product uploads
5. Store orders in a database/CRM
6. Move promo codes to backend
7. Add payment provider if required
8. Add analytics
9. Add legal/privacy pages
10. Connect custom domain
11. Add SEO metadata and social preview
12. Add backup/export for catalogue data

---

# Useful commands

Development frontend:

```bash
npm run dev
```

Development API:

```bash
npm run api
```

Production build:

```bash
npm run build
```

Production server:

```bash
npm start
```

Preview static Vite build:

```bash
npm run preview
```

---

# Admin URL

Local:

```text
http://localhost:5173/#/admin
```

Production:

```text
https://YOUR-DOMAIN/#/admin
```

---

# Instagram

Official DOMIVKA Instagram:

```text
https://www.instagram.com/domivka_candles/
```

---

# Deployment checklist

Before client presentation:

- [ ] project pushed to GitHub
- [ ] `.env` excluded from Git
- [ ] `node_modules` excluded from Git
- [ ] `dist` excluded from Git
- [ ] Railway GitHub integration connected
- [ ] `VITE_CATALOG_API_URL=/api`
- [ ] strong `ADMIN_EMAIL`
- [ ] strong `ADMIN_PASSWORD`
- [ ] random `ADMIN_SECRET`
- [ ] Railway build succeeds
- [ ] Railway public domain generated
- [ ] `/api/products` works
- [ ] `/api/categories` works
- [ ] admin login works
- [ ] product create/edit/delete works
- [ ] category create/edit/delete works
- [ ] multiple product photos work
- [ ] Railway Volume mounted to `/app/data`
- [ ] catalogue survives a redeploy
- [ ] favicon works
- [ ] mobile layout checked
- [ ] Make.com webhook connected
- [ ] test order received successfully
- [ ] real contacts/Instagram links checked

---

# License / ownership

This project is intended as a custom website implementation for DOMIVKA.

Third-party software remains subject to its own licenses. Before final commercial handoff, confirm ownership/licensing of all product photos, fonts, icons, brand assets, and other media included in the website.

## Admin orders

Checkout orders are now saved to `data/orders.json` through the same `/api` backend and appear in the admin panel under **Замовлення**.

Statuses:
- `new` — new / not opened yet
- `seen` — seen (opening a new order marks it seen automatically)
- `in_progress` — in progress
- `delivery` — delivery

API:
- `POST /api/orders` — public checkout order creation
- `GET /api/orders` — admin only
- `PUT /api/orders/:orderNumber` — admin only, change status

`seed/orders.json` initializes the persistent Railway volume on first deploy.

## Motion / GSAP update

The storefront now uses GSAP + ScrollTrigger for route entrances, scroll reveals, parallax, product-card motion, hero depth and the circular Instagram diary gallery. GSAP is loaded from jsDelivr in `index.html`; if it cannot load, the site falls back to the static layout instead of hiding content.

The redesigned Instagram section is in `HomePage` (`src/main.jsx`) under `.social-diary`, with its responsive styling at the end of `src/styles.css`.

## Scroll-controlled landing film

The landing page now opens with a sticky, scroll-scrubbed Pink Carousel film. The video does **not autoplay**: scroll position maps directly to video time, so scrolling upward automatically plays the sequence in reverse. After the film reaches its last frame, normal page scrolling continues into the collection.

Assets:
- `public/video/candle-scroll.mp4` — web-optimized H.264 with frequent keyframes for responsive seeking
- `public/video/candle-scroll-poster.png` — initial frame/poster

Implementation:
- `ScrollFilmHero` in `src/main.jsx`
- `.scroll-film*` styles at the end of `src/styles.css`
- the Node static server supports MP4 byte-range requests for smooth seeking in production

`prefers-reduced-motion` users receive the final static product state instead of a long scrub sequence.
