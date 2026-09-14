import fs from 'node:fs';
import postcss from 'postcss';

const sources = ['src/styles.css', 'src/redesign.css'].filter(file => fs.existsSync(file));
const root = postcss.parse(sources.map(file => fs.readFileSync(file, 'utf8')).join('\n'));

// CSS imports are valid only before ordinary rules. Keep each external import once.
const imports = [];
const seenImports = new Set();
root.walkAtRules('import', at => {
  const key = at.params.replace(/\s+/g, ' ').trim();
  if (!seenImports.has(key)) {
    imports.push(at.clone());
    seenImports.add(key);
  }
  at.remove();
});

const normalizeSelector = selector => selector.replace(/\s+/g, ' ').trim();
const contextKey = node => {
  const parts = [];
  for (let parent = node.parent; parent && parent.type !== 'root'; parent = parent.parent) {
    if (parent.type === 'atrule') parts.unshift(`@${parent.name} ${parent.params}`);
  }
  return parts.join(' > ');
};

// Keep only the final effective block for each exact selector in each cascade context.
// Important declarations remain authoritative over later non-important declarations.
const buckets = new Map();
let order = 0;
root.walkRules(rule => {
  if (rule.parent?.type === 'atrule' && /keyframes$/i.test(rule.parent.name)) return;
  const key = `${contextKey(rule)}|||${normalizeSelector(rule.selector)}`;
  if (!buckets.has(key)) buckets.set(key, { rules: [], declarations: new Map(), lastOrder: 0 });
  const bucket = buckets.get(key);
  bucket.rules.push(rule);
  bucket.lastOrder = order++;
  rule.walkDecls(decl => {
    const current = bucket.declarations.get(decl.prop);
    if (!current || decl.important || !current.important) {
      bucket.declarations.set(decl.prop, {
        prop: decl.prop,
        value: decl.value,
        important: decl.important,
        source: order++,
      });
    }
  });
});

for (const bucket of buckets.values()) {
  const target = bucket.rules.at(-1);
  target.removeAll();
  [...bucket.declarations.values()]
    .sort((a, b) => a.source - b.source)
    .forEach(({ prop, value, important }) => target.append({ prop, value, important }));
  bucket.rules.slice(0, -1).forEach(rule => rule.remove());
}

// Consolidate repeated media/supports containers after selector consolidation.
for (const atName of ['media', 'supports']) {
  const groups = new Map();
  root.nodes.filter(node => node.type === 'atrule' && node.name === atName).forEach((node, index) => {
    const key = `${node.name} ${node.params.replace(/\s+/g, ' ').trim()}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push({ node, index });
  });
  for (const group of groups.values()) {
    if (group.length < 2) continue;
    const target = group.at(-1).node;
    group.slice(0, -1).forEach(({ node }) => {
      target.prepend(...node.nodes.map(child => child.clone()));
      node.remove();
    });
  }
}

// A second pass removes exact duplicates brought together from media containers.
const secondBuckets = new Map();
root.walkRules(rule => {
  if (rule.parent?.type === 'atrule' && /keyframes$/i.test(rule.parent.name)) return;
  const key = `${contextKey(rule)}|||${normalizeSelector(rule.selector)}`;
  if (!secondBuckets.has(key)) secondBuckets.set(key, []);
  secondBuckets.get(key).push(rule);
});
for (const rules of secondBuckets.values()) {
  if (rules.length < 2) continue;
  const target = rules.at(-1);
  const declarations = new Map();
  rules.forEach(rule => rule.walkDecls(decl => {
    const current = declarations.get(decl.prop);
    if (!current || decl.important || !current.important) declarations.set(decl.prop, decl.clone());
  }));
  target.removeAll();
  declarations.forEach(decl => target.append(decl));
  rules.slice(0, -1).forEach(rule => rule.remove());
}

// Remove empty rules, stale comments, and duplicate keyframes; retain the last animation definition.
root.walkRules(rule => { if (!rule.nodes?.length) rule.remove(); });
root.walkComments(comment => comment.remove());
const keyframes = new Map();
root.walkAtRules(/keyframes$/i, at => {
  const key = `${at.name}:${at.params}`;
  if (keyframes.has(key)) keyframes.get(key).remove();
  keyframes.set(key, at);
});

// Confirmed legacy components removed from main.jsx. Dynamic route/status classes are
// intentionally not inferred here and remain untouched.
const obsoleteClasses = new Set([
  'clay-button--cream', 'soft-link', 'hero-notes', 'hero-collage', 'hero-photo',
  'hero-photo--main', 'hero-photo--small', 'hero-sticker', 'hero-doodle',
  'brand-marquee', 'product-grid--home', 'gift-photo-stack', 'social-strip',
  'social-rail', 'editor-image-preview', 'gift-callout', 'social-diary-cta',
  'social-diary-note', 'social-orbit-line', 'social-orbit-node', 'social-orbit-pos-1',
  'social-orbit-pos-2', 'social-orbit-pos-3', 'social-orbit-pos-4',
  'social-orbit-pos-5', 'social-orbit-shell', 'gift-ribbon', 'journal-grid',
]);
root.walkRules(rule => {
  if (rule.parent?.type === 'atrule' && /keyframes$/i.test(rule.parent.name)) return;
  const liveSelectors = rule.selectors.filter(selector => {
    const classes = [...selector.matchAll(/\.([_a-zA-Z]+[\w-]*)/g)].map(match => match[1]);
    return !classes.some(name => obsoleteClasses.has(name));
  });
  if (!liveSelectors.length) rule.remove();
  else rule.selectors = liveSelectors;
});

// Drop animation definitions that no surviving declaration calls.
const animationValues = [];
root.walkDecls(/^animation(?:-name)?$/, decl => animationValues.push(decl.value));
root.walkAtRules(/keyframes$/i, at => {
  if (!animationValues.some(value => new RegExp(`(^|[\\s,])${at.params.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}([\\s,]|$)`).test(value))) at.remove();
});

// Keep the single file navigable without reintroducing cascade layers.
const sectionMarkers = [
  ['*', 'Foundations and global element defaults'],
  ['.blob', 'Ambient decoration and shared tactile components'],
  ['.admin-login,\n.admin-page', 'Admin application'],
  [':root', 'Public design tokens and typography'],
  ['.home-hero', 'Landing page'],
  ['.product-card', 'Catalogue and product presentation'],
  ['.page-hero', 'Public route heroes'],
  ['.gift-options', 'Gifts page'],
  ['.manifesto', 'History page'],
  ['.care-grid', 'Care page'],
  ['.checkout-page', 'Cart and checkout'],
  ['.site-footer', 'Footer'],
];
for (const [selector, label] of sectionMarkers) {
  const node = root.nodes.find(item => item.type === 'rule' && normalizeSelector(item.selector) === normalizeSelector(selector));
  if (node) node.before(postcss.comment({ text: ` ${label} ` }));
}
const firstKeyframes = root.nodes.find(node => node.type === 'atrule' && /keyframes$/i.test(node.name));
if (firstKeyframes) firstKeyframes.before(postcss.comment({ text: ' Motion definitions ' }));
const firstResponsive = root.nodes.find(node => node.type === 'atrule' && ['media', 'supports'].includes(node.name));
if (firstResponsive) firstResponsive.before(postcss.comment({ text: ' Responsive and capability contexts ' }));

const banner = postcss.comment({ text: `\n * DOMIVKA — consolidated production stylesheet\n * Structure: foundations → shared UI → public routes → commerce/admin → motion → responsive contexts\n * Generated from the verified final cascade; obsolete duplicate declarations removed.\n ` });
root.prepend(banner);
root.prepend(...imports);

fs.writeFileSync('src/styles.css', root.toString());
