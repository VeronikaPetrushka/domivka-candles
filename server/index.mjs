import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const envFile = path.join(root, '.env');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const [key, ...rest] = trimmed.split('=');
    if (!(key in process.env)) process.env[key] = rest.join('=').trim();
  }
}
const dataFile = path.join(root, 'data', 'products.json');
const categoriesFile = path.join(root, 'data', 'categories.json');
const distDir = path.join(root, 'dist');
const PORT = Number(process.env.PORT || 8787);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@domivka.local';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'domivka2026';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'change-this-secret-before-production';
const MAX_BODY = 30 * 1024 * 1024;

function json(res, status, value) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  });
  res.end(JSON.stringify(value));
}
function readProducts() {
  try { return JSON.parse(fs.readFileSync(dataFile, 'utf8')); } catch { return []; }
}
function writeProducts(products) {
  fs.mkdirSync(path.dirname(dataFile), { recursive: true });
  fs.writeFileSync(dataFile, JSON.stringify(products, null, 2));
}
function readCategories() {
  try {
    const list = JSON.parse(fs.readFileSync(categoriesFile, 'utf8'));
    return Array.isArray(list) ? list.map(String).filter(Boolean) : [];
  } catch { return ['Sweet','Sea','Floral','Statement','Gift']; }
}
function writeCategories(categories) {
  fs.mkdirSync(path.dirname(categoriesFile), { recursive: true });
  fs.writeFileSync(categoriesFile, JSON.stringify(categories, null, 2));
}
function productCategories(p) {
  const list = Array.isArray(p?.categories) ? p.categories : [];
  const legacy = String(p?.collection || '').trim();
  return [...new Set([...list, legacy].map(x => String(x || '').trim()).filter(Boolean))];
}
function body(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (raw.length > MAX_BODY) { reject(new Error('Payload too large')); req.destroy(); }
    });
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); } catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}
function b64(value) { return Buffer.from(value).toString('base64url'); }
function signToken(email) {
  const payload = b64(JSON.stringify({ email, exp: Date.now() + 12 * 60 * 60 * 1000 }));
  const sig = crypto.createHmac('sha256', ADMIN_SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}
function verifyToken(req) {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  const expected = crypto.createHmac('sha256', ADMIN_SECRET).update(payload).digest('base64url');
  const a = Buffer.from(sig), b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try { return JSON.parse(Buffer.from(payload, 'base64url').toString()).exp > Date.now(); } catch { return false; }
}
function normalizeProduct(p) {
  const legacy = String(p.image || '').trim();
  const images = [...new Set([...(Array.isArray(p.images) ? p.images : []), legacy].map(x => String(x || '').trim()).filter(Boolean))];
  const categories = productCategories(p);
  return {
    id: String(p.id || '').trim(), name: String(p.name || '').trim(), ukName: String(p.ukName || '').trim(),
    price: Number(p.price || 0), image: images[0] || '', images, collection: categories[0] || '', categories,
    badge: String(p.badge || '').trim(), short: String(p.short || '').trim(), story: String(p.story || '').trim(),
    details: Array.isArray(p.details) ? p.details.map(String).filter(Boolean) : [],
  };
}
function safeEqual(a, b) {
  const aa=Buffer.from(String(a)), bb=Buffer.from(String(b));
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}
function serveStatic(req, res) {
  if (!fs.existsSync(distDir)) return false;
  const rawPath = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
  let file = path.join(distDir, rawPath === '/' ? 'index.html' : rawPath);
  if (!file.startsWith(distDir)) return false;
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(distDir, 'index.html');
  if (!fs.existsSync(file)) return false;
  const ext = path.extname(file);
  const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon'};
  res.writeHead(200, {'Content-Type': types[ext] || 'application/octet-stream'});
  fs.createReadStream(file).pipe(res);
  return true;
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return json(res, 204, {});
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  try {
    if (pathname === '/api/login' && req.method === 'POST') {
      const input = await body(req);
      if (safeEqual(input.email, ADMIN_EMAIL) && safeEqual(input.password, ADMIN_PASSWORD)) return json(res, 200, { token: signToken(ADMIN_EMAIL) });
      return json(res, 401, { message: 'Невірний email або пароль.' });
    }
    if (pathname === '/api/categories' && req.method === 'GET') return json(res, 200, readCategories());
    if (pathname === '/api/categories' && req.method === 'POST') {
      if (!verifyToken(req)) return json(res, 401, { message: 'Unauthorized' });
      const input = await body(req);
      const name = String(input.name || '').trim();
      if (!name) return json(res, 400, { message: 'Назва категорії обов’язкова.' });
      const categories = readCategories();
      if (categories.some(x => x.toLowerCase() === name.toLowerCase())) return json(res, 409, { message: 'Така категорія вже існує.' });
      categories.push(name); writeCategories(categories); return json(res, 201, { name });
    }
    if (pathname.startsWith('/api/categories/') && ['PUT','DELETE'].includes(req.method)) {
      if (!verifyToken(req)) return json(res, 401, { message: 'Unauthorized' });
      const oldName = decodeURIComponent(pathname.slice('/api/categories/'.length));
      const categories = readCategories();
      const index = categories.findIndex(x => x === oldName);
      if (index < 0) return json(res, 404, { message: 'Category not found' });
      const products = readProducts().map(normalizeProduct);
      if (req.method === 'DELETE') {
        categories.splice(index, 1);
        const updated = products.map(p => {
          const next = productCategories(p).filter(x => x !== oldName);
          return normalizeProduct({ ...p, categories: next, collection: next[0] || '' });
        });
        writeCategories(categories); writeProducts(updated);
        return json(res, 200, { ok: true });
      }
      const input = await body(req);
      const newName = String(input.name || '').trim();
      if (!newName) return json(res, 400, { message: 'Назва категорії обов’язкова.' });
      if (categories.some((x,i) => i !== index && x.toLowerCase() === newName.toLowerCase())) return json(res, 409, { message: 'Така категорія вже існує.' });
      categories[index] = newName;
      const updated = products.map(p => {
        const next = productCategories(p).map(x => x === oldName ? newName : x);
        return normalizeProduct({ ...p, categories: next, collection: next[0] || '' });
      });
      writeCategories(categories); writeProducts(updated);
      return json(res, 200, { oldName, name: newName });
    }

    if (pathname === '/api/products' && req.method === 'GET') return json(res, 200, readProducts());
    if (pathname === '/api/products' && req.method === 'POST') {
      if (!verifyToken(req)) return json(res, 401, { message: 'Unauthorized' });
      const item = normalizeProduct(await body(req));
      if (!item.id || !item.ukName || !item.images.length || !item.categories.length) return json(res, 400, { message: 'Missing required fields' });
      const products = readProducts();
      if (products.some(p => p.id === item.id)) return json(res, 409, { message: 'Такий ID вже існує.' });
      writeProducts([item, ...products]); return json(res, 201, item);
    }
    if (pathname.startsWith('/api/products/') && ['PUT','DELETE'].includes(req.method)) {
      if (!verifyToken(req)) return json(res, 401, { message: 'Unauthorized' });
      const id = decodeURIComponent(pathname.slice('/api/products/'.length));
      const products = readProducts();
      const index = products.findIndex(p => p.id === id);
      if (index < 0) return json(res, 404, { message: 'Item not found' });
      if (req.method === 'DELETE') { products.splice(index,1); writeProducts(products); return json(res, 200, { ok:true }); }
      const item = normalizeProduct(await body(req));
      if (!item.id || !item.ukName || !item.images.length || !item.categories.length) return json(res, 400, { message: 'Missing required fields' });
      if (item.id !== id && products.some(p => p.id === item.id)) return json(res, 409, { message: 'Такий ID вже існує.' });
      products[index] = item; writeProducts(products); return json(res, 200, item);
    }
    if (pathname.startsWith('/api/')) return json(res, 404, { message: 'Not found' });
    if (serveStatic(req,res)) return;
    res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'}); res.end('Build the Vite app first: npm run build');
  } catch (err) {
    json(res, 500, { message: err.message || 'Server error' });
  }
});
server.listen(PORT, () => console.log(`DOMIVKA API/server: http://localhost:${PORT}`));
