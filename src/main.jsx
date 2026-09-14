import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
if (gsap && ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

const IG = 'https://www.instagram.com/domivka_candles/';

// Catalogue values are intentionally centralized here. Replace demo prices/names
// with the exact current Instagram catalogue before production launch.
const DEFAULT_PRODUCTS = [
  {
    id: 'pink-carousel',
    name: 'Pink Carousel',
    ukName: 'Рожева карусель',
    price: 820,
    images: ['/images/pink-carousel-gift.webp', '/images/carousel-2.png'],
    collection: 'Gift',
    badge: 'gift-ready',
    short: 'Керамічна свічка як маленький святковий об’єкт.',
    story: 'Для подарунків, красивих полиць і вечорів, коли хочеться трошки більше магії.',
    details: ['ручне оформлення', 'подарункова подача', 'обмежені кольорові варіації'],
  },
  {
    id: 'croissant-heart',
    name: 'Croissant Heart',
    ukName: 'Круасан-серце',
    price: 690,
    images: ['/images/croissant-heart.webp', '/images/croissant-2.png'],
    collection: 'Sweet',
    badge: 'playful',
    short: 'Іронічна свічка, натхненна ранковою випічкою.',
    story: 'Тепла, трохи французька і дуже подарункова — для тих, хто любить красиві дрібниці.',
    details: ['скульптурна форма', 'ручна заливка', 'декоративний акцент'],
  },
  {
    id: 'coconut',
    name: 'Coconut Calm',
    ukName: 'Кокосовий спокій',
    price: 760,
    images: ['/images/coconut-candle.webp', '/images/coconut-2.png'],
    collection: 'Sea',
    badge: 'slow ritual',
    short: 'Тропічний настрій у природній формі.',
    story: 'Свічка для ванної, тераси або тихого вечора з музикою й відкритим вікном.',
    details: ['натуральна фактура', 'затишний декор', 'кожен екземпляр виглядає трохи по-різному'],
  },
  {
    id: 'shells',
    name: 'Shell Stories',
    ukName: 'Морські історії',
    price: 640,
    images: ['/images/shell-collection.webp', '/images/shell-2.png'],
    collection: 'Sea',
    badge: 'collection',
    short: 'Мініатюрні мушлі, морські зірки та форми з відчуттям літа.',
    story: 'Маленькі скульптурні свічки, які легко комбінувати у сет або подарункову композицію.',
    details: ['декоративні форми', 'можна комбінувати', 'підходить для gift set'],
  },
  {
    id: 'crystal-shoes',
    name: 'Crystal Slippers',
    ukName: 'Кришталеві туфельки',
    price: 980,
    images: ['/images/crystal-shoes.webp', '/images/whales-2.png'],
    collection: 'Statement',
    badge: 'statement',
    short: 'Свічка-об’єкт, яку хочеться розглядати ще до запалювання.',
    story: 'Грайлива форма для vanity table, подарункової композиції або незвичного декору.',
    details: ['виразна форма', 'арт-об’єкт', 'для особливих подарунків'],
  },
  {
    id: 'pearl-shell',
    name: 'Pearl Shell',
    ukName: 'Перлинна мушля',
    price: 790,
    images: ['/images/pearl-shell.webp', '/images/oysters-2.png'],
    collection: 'Sea',
    badge: 'bestseller mood',
    short: 'Перлинна композиція у мушлі — ніжна, тактильна, трохи казкова.',
    story: 'Працює як маленька прикраса інтер’єру й як подарунок, який запам’ятовується.',
    details: ['перлинний декор', 'морська естетика', 'ручна композиція'],
  },
  {
    id: 'biscuit',
    name: 'Biscuit Glow',
    ukName: 'Печиво зі світлом',
    price: 720,
    images: ['/images/biscuit-candle.webp', '/images/cookie-2.png'],
    collection: 'Sweet',
    badge: 'cute classic',
    short: 'Найзатишніша форма: ніби домашнє печиво, але це свічка.',
    story: 'Для кухні, coffee corner або подарунку людині, яка любить “cute but not childish”.',
    details: ['текстурована форма', 'теплий карамельний образ', 'wood-wick look'],
  },
  {
    id: 'meringue',
    name: 'Meringue Bloom',
    ukName: 'Зефірна квітка',
    price: 680,
    images: ['/images/meringue-bloom.webp', '/images/zefir-2.png'],
    collection: 'Floral',
    badge: 'soft',
    short: 'М’які хвилі, кремові й рожеві відтінки та дуже домашня подача.',
    story: 'Невелика свічка для bedside table, ванної або подарункового боксу.',
    details: ['пастельні відтінки', 'скульптурний рельєф', 'компактний формат'],
  },
  {
    id: 'calla',
    name: 'Calla Light',
    ukName: 'Світло кали',
    price: 930,
    images: ['/images/calla-lily.webp', '/images/calla-2.png'],
    collection: 'Floral',
    badge: 'art object',
    short: 'Висока квіткова форма, що виглядає як предмет декору.',
    story: 'Лаконічна, але характерна — для столу, полиці або атмосферної фотозони.',
    details: ['виразний силует', 'скульптурна форма', 'декоративний акцент'],
  },
  {
    id: 'donut',
    name: 'Donut Party',
    ukName: 'Пончиковий настрій',
    price: 710,
    images: ['/images/donut-candles.webp', '/images/donut-2.png'],
    collection: 'Sweet',
    badge: 'fun gift',
    short: 'Яскраві “пончики” для подарунку, фотосесії або просто гарного настрою.',
    story: 'Колір, посипка, трохи ностальгії — одна з найграйливіших ліній DOMIVKA.',
    details: ['яскравий декор', 'подарункова форма', 'кольорові варіації'],
  },
];

const DEFAULT_CATEGORIES = ['Sweet', 'Sea', 'Floral', 'Statement', 'Gift'];
const PROMO_CODES = {
  DOMIVKA10: { type: 'percent', value: 10, label: '-10%' },
  HOME15: { type: 'percent', value: 15, label: '-15%' },
};
const ORDER_STATUSES = [
  { value:'new', label:'Нове', short:'Нове' },
  { value:'seen', label:'Побачене', short:'Побачене' },
  { value:'in_progress', label:'В процесі виконання', short:'В процесі' },
  { value:'delivery', label:'Доставка', short:'Доставка' },
];
const orderStatusLabel = value => ORDER_STATUSES.find(item=>item.value===value)?.label || 'Нове';
const CATALOG_API = (import.meta.env.VITE_CATALOG_API_URL || '').replace(/\/$/, '');
const LOCAL_ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@domivka.local';
const LOCAL_ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'domivka2026';

function productImages(product) {
  const list = Array.isArray(product?.images) ? product.images : [];
  const legacy = String(product?.image || '').trim();
  return [...new Set([...list.map(x => String(x || '').trim()), legacy].filter(Boolean))];
}

function primaryImage(product) {
  return productImages(product)[0] || '';
}

function productCategories(product) {
  const list = Array.isArray(product?.categories) ? product.categories : [];
  const legacy = String(product?.collection || '').trim();
  return [...new Set([...list.map(x => String(x || '').trim()), legacy].filter(Boolean))];
}

function categoryLabel(product) {
  const cats = productCategories(product);
  return cats.length ? cats.join(' · ') : 'Без категорії';
}

function normalizeProduct(product) {
  const images = productImages(product);
  return {
    id: String(product.id || '').trim(),
    name: String(product.name || '').trim(),
    ukName: String(product.ukName || '').trim(),
    price: Number(product.price || 0),
    image: images[0] || '', // legacy field kept for cart/API compatibility
    images,
    collection: productCategories(product)[0] || '', // legacy field kept for older data
    categories: productCategories(product),
    badge: String(product.badge || '').trim(),
    short: String(product.short || '').trim(),
    story: String(product.story || '').trim(),
    details: Array.isArray(product.details) ? product.details.filter(Boolean) : [],
  };
}

function hydrateCatalogueProduct(product) {
  const normalized = normalizeProduct(product);
  const demo = DEFAULT_PRODUCTS.find(item => item.id === normalized.id);
  if (!demo) return normalized;

  const demoImages = productImages(demo);
  const usesBundledPrimary = normalized.images[0] === demoImages[0];
  if (!usesBundledPrimary) return normalized;

  const images = [...new Set([...normalized.images, ...demoImages])];
  return { ...normalized, image: images[0] || '', images };
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9а-яіїєґ]+/gi, '-')
    .replace(/^-+|-+$/g, '') || `item-${Date.now()}`;
}

function money(v) {
  return `${new Intl.NumberFormat('uk-UA').format(v)} ₴`;
}

function withViewTransition(update) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced && document.startViewTransition) return document.startViewTransition(update);
  update();
  return null;
}

function routeFromHash() {
  const raw = window.location.hash.replace(/^#\/?/, '') || 'home';
  const [path, query = ''] = raw.split('?');
  const [page, param] = path.split('/');
  return { page, param, query };
}

function go(path) {
  withViewTransition(() => {
    window.location.hash = `#/${path}`;
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
}

function useRoute() {
  const [route, setRoute] = useState(routeFromHash);
  useEffect(() => {
    const handler = () => setRoute(routeFromHash());
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);
  return route;
}

function useMotion(dep) {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealNodes = [...document.querySelectorAll('[data-reveal]:not(.gift-option):not(.care-card)')];

    if (reduced || !gsap || !ScrollTrigger) {
      revealNodes.forEach(node => {
        node.style.opacity = '1';
        node.style.transform = 'none';
      });
      return;
    }

    let frame = requestAnimationFrame(() => {
      const ctx = gsap.context(() => {
        gsap.fromTo('.site-header',
          { y: -28, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: .8, ease: 'power3.out', clearProps: 'transform' }
        );

        gsap.fromTo('main',
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: .55, ease: 'power2.out', clearProps: 'transform' }
        );

        // Clean, consistent section entrances. Elements no longer fly in from
        // alternating sides or drift away again while the user keeps scrolling.
        revealNodes.forEach((node) => {
          gsap.fromTo(node,
            { y: 34, autoAlpha: 0 },
            {
              y: 0, autoAlpha: 1, duration: .82, ease: 'power3.out',
              scrollTrigger: {
                trigger: node,
                start: 'top 88%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        });

        // Keep headings stable after their entrance. This avoids the large
        // collection title sliding sideways as the page is scrolled.
        document.querySelectorAll('.section-heading h2, .story-teaser h2, .gift-copy h2, .page-hero h1').forEach((heading) => {
          gsap.fromTo(heading,
            { y: 28, autoAlpha: 0 },
            {
              y: 0, autoAlpha: 1, duration: .82, ease: 'power3.out',
              scrollTrigger: { trigger: heading, start: 'top 89%', toggleActions: 'play none none reverse' },
            }
          );
        });

        // Product/card photography stays anchored inside its frame. Only page
        // hero media gets a very small depth shift; card images no longer float.
        document.querySelectorAll('.page-hero figure img').forEach((img) => {
          gsap.fromTo(img,
            { scale: 1.035 },
            {
              scale: 1,
              ease: 'none',
              scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: 1.1 },
            }
          );
        });

        document.querySelectorAll('.product-card').forEach((card) => {
          if (card.closest('.home-products-track')) return;
          gsap.fromTo(card,
            { y: 32, autoAlpha: 0 },
            {
              y: 0, autoAlpha: 1, duration: .72, ease: 'power3.out',
              scrollTrigger: { trigger: card, start: 'top 91%', toggleActions: 'play none none reverse' },
            }
          );
        });

        const hero = document.querySelector('.home-hero');
        if (hero) {
          const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
          tl.from('.hero-intro', { y: -12, autoAlpha: 0, duration: .5 })
            .from('.hero-copy .kicker', { y: 18, autoAlpha: 0, duration: .5 }, '-=.2')
            .from('.hero-copy h1', { y: 54, autoAlpha: 0, duration: .9 }, '-=.3')
            .from('.hero-copy > p, .hero-actions', { y: 20, autoAlpha: 0, duration: .55, stagger: .08 }, '-=.55')
            .from('.hero-panel', { clipPath: 'inset(100% 0 0 0)', duration: .95, stagger: .1 }, '-=.85')
            .from('.hero-caption', { y: 18, autoAlpha: 0, duration: .5 }, '-=.35');

          gsap.to('.hero-panel--b img', {
            yPercent: 5, ease: 'none',
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1.2 },
          });
        }

        const orbitSection = document.querySelector('.social-diary');
        const orbit = document.querySelector('.social-orbit');
        const orbitCards = gsap.utils.toArray('.social-orbit-card');
        if (orbitSection && orbit) {
          // Clean entrance for the copy, while the images keep the circular
          // scroll motion that makes the Instagram diary feel alive.
          gsap.fromTo('.social-diary-copy > *',
            { y: 24, autoAlpha: 0 },
            {
              y: 0, autoAlpha: 1, duration: .72, stagger: .055, ease: 'power3.out',
              scrollTrigger: { trigger: orbitSection, start: 'top 75%', toggleActions: 'play none none reverse' },
            }
          );
          gsap.fromTo(orbit,
            { rotation: -12, scale: .9, autoAlpha: 0 },
            {
              rotation: 0, scale: 1, autoAlpha: 1, duration: .95, ease: 'power3.out',
              scrollTrigger: { trigger: orbitSection, start: 'top 78%', toggleActions: 'play none none reverse' },
            }
          );
          gsap.fromTo('.social-orbit-center',
            { scale: .86, autoAlpha: 0 },
            {
              scale: 1, autoAlpha: 1, duration: .9, ease: 'back.out(1.25)',
              scrollTrigger: { trigger: orbitSection, start: 'top 78%', toggleActions: 'play none none reverse' },
            }
          );
          gsap.fromTo(orbitCards,
            { scale: .7, autoAlpha: 0 },
            {
              scale: 1, autoAlpha: 1, duration: .72, stagger: .065, ease: 'back.out(1.45)',
              scrollTrigger: { trigger: orbitSection, start: 'top 78%', toggleActions: 'play none none reverse' },
            }
          );

          // One shared orbit around the large centre image. All satellites move
          // along the same large ellipse instead of tracing little circles around
          // their own starting points. The cards counter-rotate so the photos and
          // number labels remain upright while the ring travels around the centre.
          const orbitDuration = window.matchMedia('(max-width: 700px)').matches ? 34 : 42;
          gsap.set(orbit, { transformOrigin: '50% 50%' });

          const orbitLoop = gsap.timeline({ repeat: -1, paused: true });
          orbitLoop.to(orbit, {
            rotation: '+=360',
            duration: orbitDuration,
            ease: 'none',
          }, 0);
          orbitCards.forEach((card) => {
            orbitLoop.to(card, {
              rotation: '-=360',
              duration: orbitDuration,
              ease: 'none',
            }, 0);
          });

          ScrollTrigger.create({
            trigger: orbitSection,
            start: 'top 96%',
            end: 'bottom 4%',
            onEnter: () => orbitLoop.play(),
            onEnterBack: () => orbitLoop.play(),
            onLeave: () => orbitLoop.pause(),
            onLeaveBack: () => orbitLoop.pause(),
          });
        }

        // Story teaser: images appear as a deliberate layered composition, then
        // stay put. No scroll-following drift after the entrance.
        const storyTeaser = document.querySelector('.story-teaser');
        if (storyTeaser) {
          const storyTl = gsap.timeline({
            scrollTrigger: {
              trigger: storyTeaser,
              start: 'top 78%',
              toggleActions: 'play none none reverse',
            }
          });
          storyTl
            .fromTo('.story-one',
              { x: 70, y: 30, rotate: -9, autoAlpha: 0, scale: .94 },
              { x: 0, y: 0, rotate: -4, autoAlpha: 1, scale: 1, duration: .9, ease: 'power3.out' }
            )
            .fromTo('.story-two',
              { x: -58, y: 46, rotate: 10, autoAlpha: 0, scale: .94 },
              { x: 0, y: 0, rotate: 5, autoAlpha: 1, scale: 1, duration: .9, ease: 'power3.out' },
              '-=.62'
            )
            .fromTo('.hand-note',
              { y: 24, rotate: -8, scale: .72, autoAlpha: 0 },
              { y: 0, rotate: 0, scale: 1, autoAlpha: 1, duration: .68, ease: 'back.out(1.45)' },
              '-=.52'
            );
        }

        // Gift cards use the same bottom-up mask language as the approved
        // homepage hero photography, with ScrollTrigger as a reliable fallback.
        gsap.utils.toArray('.gift-options .gift-option').forEach((card) => {
          gsap.fromTo(card,
            { clipPath: 'inset(100% 0 0 0)', y: 34, autoAlpha: 0 },
            {
              clipPath: 'inset(0% 0 0 0)', y: 0, autoAlpha: 1, ease: 'none',
              scrollTrigger: { trigger: card, start: 'top 94%', end: 'top 56%', scrub: .75 },
            }
          );
        });

        // Sticky care stack: each incoming card compresses the previous card,
        // matching the CodeFronts sticky-card handoff while remaining cross-browser.
        const careCards = gsap.utils.toArray('.care-grid .care-card');
        careCards.forEach((card, index) => {
          const next = careCards[index + 1];
          if (!next) return;
          gsap.to(card, {
            scale: .94,
            y: index * -3,
            filter: 'brightness(.9)',
            ease: 'none',
            scrollTrigger: { trigger: next, start: 'top 88%', end: 'top 128px', scrub: .7 },
          });
        });

        // Homepage favourites: vertical wheel/trackpad scrolling becomes a
        // horizontal product journey on desktop. The cards themselves remain
        // stable, so there is no floating image motion inside the frames.
        const homeProductStage = document.querySelector('.home-products-stage');
        const homeProductTrack = document.querySelector('.home-products-track');
        if (homeProductStage && homeProductTrack) {
          const homeCards = gsap.utils.toArray('.home-products-track .product-card');
          gsap.fromTo(homeCards,
            { y: 26, autoAlpha: 0 },
            {
              y: 0, autoAlpha: 1, duration: .66, stagger: .055, ease: 'power3.out',
              scrollTrigger: { trigger: homeProductStage, start: 'top 82%', toggleActions: 'play none none reverse' },
            }
          );

          if (window.matchMedia('(min-width: 901px)').matches) {
            const distance = () => Math.max(0, homeProductTrack.scrollWidth - document.documentElement.clientWidth + 24);
            gsap.to(homeProductTrack, {
              x: () => -distance(),
              ease: 'none',
              force3D: true,
              scrollTrigger: {
                trigger: homeProductStage,
                start: 'top 108px',
                end: () => `+=${Math.max(720, distance() * .84)}`,
                scrub: .78,
                pin: true,
                pinSpacing: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });
          }
        }

        gsap.to('.blob-a', { xPercent: 20, yPercent: -14, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 2 } });
        gsap.to('.blob-b', { xPercent: -18, yPercent: 16, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 2.2 } });

        ScrollTrigger.refresh();
      });
      window.__domivkaGsapContext = ctx;
    });

    return () => {
      cancelAnimationFrame(frame);
      if (window.__domivkaGsapContext) {
        window.__domivkaGsapContext.revert();
        window.__domivkaGsapContext = null;
      }
    };
  }, [dep]);
}

function Brand({ compact = false }) {
  return (
    <button className={`brand ${compact ? 'brand--compact' : ''}`} onClick={() => go('home')} aria-label="DOMIVKA home">
      <img className="brand-logo-image" src="/images/domivka-logo.webp" alt="" aria-hidden="true" />
      <span className="brand-copy">
        <span className="brand-word">DOMIVKA</span>
        {!compact && <small>candles · made with feeling</small>}
      </span>
    </button>
  );
}

function ClayButton({ children, className = '', onClick, type = 'button', disabled = false }) {
  return <button type={type} disabled={disabled} className={`clay-button ${className}`} onClick={onClick}>{children}</button>;
}

function Header({ cartCount, onCart, activePath }) {
  const [open, setOpen] = useState(false);
  const nav = [
    ['shop', 'Каталог'],
    ['gifts', 'Подарунки'],
    ['story', 'Історія'],
    ['care', 'Догляд'],
  ];
  return (
    <header className="site-header">
      <div className="header-inner clay-surface clay-surface--glass">
        <Brand compact />
        <nav className={`header-nav ${open ? 'is-open' : ''}`}>
          {nav.map(([path, label]) => <button key={path} className={activePath===path?'active':''} aria-current={activePath===path?'page':undefined} onClick={() => { go(path); setOpen(false); }}>{label}</button>)}
          <a href={IG} target="_blank" rel="noreferrer">Instagram ↗</a>
        </nav>
        <div className="header-actions">
          <button className="mini-clay" onClick={onCart}>Кошик <b className="cart-count" style={{viewTransitionName:'cart-count'}}>{cartCount}</b></button>
          <button className="menu-toggle" aria-label="Menu" onClick={() => setOpen(v => !v)}><i/><i/></button>
        </div>
      </div>
    </header>
  );
}

function BackgroundLayers() {
  return <div className="ambient" aria-hidden="true"><i className="blob blob-a"/><i className="blob blob-b"/><i className="blob blob-c"/><i className="scribble"/></div>;
}

function HomePage({ addToCart, products }) {
  const heroRef = useRef(null);
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const pointer = e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      el.style.setProperty('--mx', x.toFixed(3));
      el.style.setProperty('--my', y.toFixed(3));
    };
    el.addEventListener('pointermove', pointer);
    return () => el.removeEventListener('pointermove', pointer);
  }, []);
  return (
    <>
      <section className="home-hero" ref={heroRef}>
        <div className="hero-intro"><span>КИЇВ · МАЛІ СЕРІЇ · 2026</span><span>OBJECTS FOR HOME</span></div>
        <div className="hero-copy" data-reveal>
          <span className="kicker"><i/> handmade candle studio</span>
          <h1>Світло,<br/>яке має<br/>форму.</h1>
          <p>Авторські свічки-об’єкти для дому, подарунків і тихих особистих ритуалів.</p>
          <div className="hero-actions"><button className="primary-cta" onClick={() => go('shop')}>Дивитися колекцію <span>↗</span></button><button className="text-cta" onClick={() => go('story')}>Наша історія</button></div>
        </div>
        <div className="hero-gallery" aria-label="DOMIVKA candle collection">
          <figure className="hero-panel hero-panel--a"><img src="/images/pink-carousel-gift.webp" alt="Рожева подарункова композиція DOMIVKA"/></figure>
          <figure className="hero-panel hero-panel--b"><img src="/images/pearl-shell.webp" alt="Перлинна свічка у мушлі"/></figure>
          <figure className="hero-panel hero-panel--c"><img src="/images/meringue-bloom.webp" alt="Скульптурна рожева свічка"/></figure>
          <div className="hero-caption"><b>01</b><span>Не декор.<br/>Ваш маленький настрій.</span></div>
        </div>
        <div className="hero-bottom"><span>ручна робота</span><span>подарункове оформлення</span><span>доставка Україною</span></div>
      </section>

      <section className="section section--collections">
        <div className="section-heading collection-heading">
          <div>
            <span className="kicker"><i/> choose a mood</span>
            <h2>Не просто аромат.<br/><em>Маленький характер.</em></h2>
          </div>
          <p>У DOMIVKA свічка працює ще до того, як ви її запалили: як декор, подарунок і настрій.</p>
        </div>
        <div className="mood-grid">
          {[
            ['Sweet things','теплі, смішні, “їстівні” форми','/images/biscuit-candle.webp','Sweet','#f1bd82'],
            ['From the sea','мушлі, перлини, спокій','/images/shell-collection.webp','Sea','#bad6e7'],
            ['Soft bloom','квіти й кремові хвилі','/images/meringue-bloom.webp','Floral','#efb7cb'],
          ].map((m,i)=><button key={m[0]} className="mood-card clay-surface" style={{'--mood':m[4]}} onClick={() => go(`shop?collection=${m[3]}`)} data-reveal>
            <img src={m[2]} alt=""/><span>0{i+1}</span><div><h3>{m[0]}</h3><p>{m[1]}</p></div><b>↗</b>
          </button>)}
        </div>
      </section>

      <section className="section story-teaser">
        <div className="story-teaser-copy" data-reveal>
          <span className="kicker"><i/> the feeling</span>
          <h2>DOMIVKA — це про <em>“вдома”.</em></h2>
          <p>Назва говорить сама за себе: м’яке світло, дивні милі речі на полицях, коробка з бантом і відчуття, що подарунок вибирали саме для тебе.</p>
          <button className="under-link" onClick={() => go('story')}>читати історію бренду →</button>
        </div>
        <div className="story-teaser-images">
          <figure className="clay-photo story-one"><img src="/images/croissant-heart.webp" alt="Heart croissant candle"/></figure>
          <figure className="clay-photo story-two"><img src="/images/coconut-candle.webp" alt="Coconut candle"/></figure>
          <div className="hand-note clay-sticker">для дому,<br/>який має<br/><b>настрій ♡</b></div>
        </div>
      </section>

      <section className="section bestsellers bestsellers-horizontal">
        <div className="section-heading section-heading--row bestsellers-heading" data-reveal>
          <div><span className="kicker"><i/> little favourites</span><h2>Зараз хочеться <em>ось це.</em></h2></div>
          <ClayButton onClick={() => go('shop')}>Весь каталог ↗</ClayButton>
        </div>
        <div className="home-products-stage">
          <div className="home-products-track">
            {products.slice(0,8).map(p => <ProductCard key={p.id} product={p} addToCart={addToCart}/>)}
            <CatalogJourneyCard />
          </div>
        </div>
      </section>

      <section className="section gift-story">
        <div className="gift-story-copy">
          <span className="kicker"><i/> the art of giving</span>
          <small>04 / ПОДАРУНКОВИЙ РИТУАЛ</small>
          <h2>Обрати не річ.<br/><em>Обрати відчуття.</em></h2>
          <p>Розкажіть нам про людину — ми поєднаємо форму, колір і пакування в один особистий жест.</p>
          <ClayButton onClick={() => go('gifts')}>Створити подарунок <span>↗</span></ClayButton>
        </div>
        <div className="gift-story-frames">
          <figure><img src="/images/pink-carousel-gift.webp" alt="Подарунковий набір DOMIVKA"/><figcaption><b>01</b><span>готова композиція</span></figcaption></figure>
          <figure><img src="/images/donut-candles.webp" alt="Кольорові свічки-пончики"/><figcaption><b>02</b><span>форма з характером</span></figcaption></figure>
          <figure><img src="/images/pearl-shell.webp" alt="Перлинна свічка у мушлі"/><figcaption><b>03</b><span>деталь, яку пам’ятають</span></figcaption></figure>
        </div>
      </section>

      <section className="section journal-section journal-section--backdrop">
        <div className="journal-copy" data-reveal>
          <span className="kicker"><i/> instagram diary</span>
          <h2>Зазирніть у DOMIVKA.<br/><em>Там трохи більше життя.</em></h2>
          <p>Нові форми, пакування, процес і маленькі кадри з майстерні — те, що не завжди потрапляє в каталог.</p>
          <a className="journal-cta" href={IG} target="_blank" rel="noreferrer"><span>@domivka_candles</span><b>Дивитися Instagram ↗</b></a>
        </div>
        <a className="journal-backdrop-link" href={IG} target="_blank" rel="noreferrer" aria-label="Відкрити Instagram DOMIVKA">
          <span>05 / studio diary</span><b>Живі кадри з майстерні ↗</b>
        </a>
      </section>
      <div className="landing-footer-space" aria-hidden="true"/>
    </>
  );
}

function CatalogJourneyCard() {
  return (
    <article className="product-card catalog-journey-card clay-surface">
      <button className="catalog-journey-link" onClick={() => go('shop')} aria-label="Перейти до каталогу DOMIVKA">
        <span className="kicker"><i/> all objects</span>
        <div className="catalog-journey-mark">↗</div>
        <div className="catalog-journey-copy">
          <small>ще більше форм, кольорів і настроїв</small>
          <h3>До<br/>каталогу.</h3>
          <p>Подивитися всю колекцію DOMIVKA</p>
        </div>
        <b>Відкрити каталог <span>→</span></b>
      </button>
    </article>
  );
}

function ProductCard({ product, addToCart }) {
  const photos = productImages(product);
  return (
    <article className="product-card">
      <button className="product-image clay-photo" style={{viewTransitionName:`product-${product.id}`}} onClick={() => go(`product/${product.id}`)}>
        <img className="product-image-primary" src={photos[0]} alt={`${product.name} candle by DOMIVKA`} loading="lazy"/>
        {photos[1] && <img className="product-image-secondary" src={photos[1]} alt={`${product.name} candle — alternate view`} loading="lazy"/>}
        <span className="product-badge clay-pill">{product.badge}</span>
        {photos.length > 1 && <span className="product-photo-count clay-pill">{photos.length} фото</span>}
        <i className="product-open">↗</i>
      </button>
      <div className="product-meta">
        <div><small>{categoryLabel(product)}</small><h3><button onClick={() => go(`product/${product.id}`)}>{product.ukName}</button></h3><p>{product.short}</p></div>
        <strong>{money(product.price)}</strong>
      </div>
      <ClayButton className="product-add" onClick={() => addToCart(product)}>Додати в кошик <span>＋</span></ClayButton>
    </article>
  );
}

function ShopPage({ addToCart, products, categories }) {
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  useEffect(() => {
    const q = new URLSearchParams(window.location.hash.split('?')[1] || '');
    const c = q.get('collection');
    if (c) setFilter(c);
  }, []);
  const collections = useMemo(() => ['All', ...categories], [categories]);
  const list = useMemo(() => products.filter(p => (filter === 'All' || productCategories(p).includes(filter)) && `${p.name} ${p.ukName}`.toLowerCase().includes(query.toLowerCase())), [filter, query, products]);
  return (
    <>
      <PageHero eyebrow="shop / 01" title={<>Виберіть не “товар”.<br/><em>Виберіть настрій.</em></>} copy="Тут зібрані скульптурні, морські, солодкі й подарункові форми DOMIVKA." image="/images/shell-collection.webp" />
      <section className="section shop-section">
        <div className="shop-toolbar clay-surface">
          <div className="filters">{collections.map(c => <button key={c} className={filter===c?'active':''} onClick={() => setFilter(c)}>{c}</button>)}</div>
          <label className="clay-input search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Пошук свічки"/></label>
        </div>
        <div className="shop-count">{String(list.length).padStart(2,'0')} objects to fall in love with</div>
        <div className="product-grid">{list.map(p => <ProductCard key={p.id} product={p} addToCart={addToCart}/>)}</div>
      </section>
    </>
  );
}

function ProductPage({ id, addToCart, products }) {
  const product = products.find(p => p.id === id) || products[0] || DEFAULT_PRODUCTS[0];
  const currentCategories = productCategories(product);
  const related = products.filter(p => p.id !== product.id && productCategories(p).some(c => currentCategories.includes(c))).slice(0,3);
  const photos = productImages(product);
  const [qty, setQty] = useState(1);
  const [photoIndex, setPhotoIndex] = useState(0);
  useEffect(() => setPhotoIndex(0), [product.id]);
  const showPrev = () => setPhotoIndex(i => (i - 1 + photos.length) % photos.length);
  const showNext = () => setPhotoIndex(i => (i + 1) % photos.length);
  return (
    <>
      <section className="product-page section">
        <div className="product-gallery">
          <figure className="product-main-image product-selection-gallery clay-photo" style={{viewTransitionName:`product-${product.id}`}}>
            <img src={photos[photoIndex] || photos[0]} alt={`${product.name} — photo ${photoIndex + 1}`}/>
            {photos.length > 1 && <>
              <button className="gallery-arrow gallery-arrow--prev" type="button" onClick={showPrev} aria-label="Попереднє фото">←</button>
              <button className="gallery-arrow gallery-arrow--next" type="button" onClick={showNext} aria-label="Наступне фото">→</button>
              <span className="gallery-counter">{photoIndex + 1} / {photos.length}</span>
            </>}
          </figure>
          {photos.length > 1 && <div className="product-thumbs" aria-label="Фото товару">{photos.map((src, index) => <button type="button" className={index === photoIndex ? 'active' : ''} key={`${src.slice(0,28)}-${index}`} onClick={() => setPhotoIndex(index)} aria-label={`Фото ${index + 1}`}><img src={src} alt=""/></button>)}</div>}
          <div className="product-mini-note clay-sticker">made<br/>to make<br/><b>home softer</b></div>
        </div>
        <div className="product-info" data-reveal>
          <button className="back-link" onClick={() => go('shop')}>← каталог</button>
          <span className="kicker"><i/> {categoryLabel(product)} · {product.badge}</span>
          <h1>{product.ukName}</h1>
          <p className="latin-name">{product.name}</p>
          <strong className="product-price">{money(product.price)}</strong>
          <p className="product-lead">{product.story}</p>
          <ul className="product-details">{product.details.map(x=><li key={x}><span>♡</span>{x}</li>)}</ul>
          <div className="option-block"><label>Кількість</label><div className="qty-clay"><button onClick={()=>setQty(Math.max(1,qty-1))}>−</button><span>{qty}</span><button onClick={()=>setQty(qty+1)}>＋</button></div></div>
          <ClayButton className="clay-button--berry product-buy" onClick={() => { for(let i=0;i<qty;i++) addToCart(product); }}>Додати · {money(product.price*qty)} <span>↗</span></ClayButton>
          <div className="shipping-note clay-surface"><b>Маленька серія</b><p>Наявність та фінальний колір краще підтвердити перед відправкою — ручні вироби можуть трохи відрізнятися.</p></div>
        </div>
      </section>
      <section className="section related"><div className="section-heading"><span className="kicker"><i/> same mood</span><h2>Може ще <em>одну?</em></h2></div><div className="product-grid">{related.length ? related.map(p=><ProductCard key={p.id} product={p} addToCart={addToCart}/>) : products.filter(p=>p.id!==product.id).slice(0,3).map(p=><ProductCard key={p.id} product={p} addToCart={addToCart}/>)}</div></section>
    </>
  );
}

function GiftsPage() {
  return (
    <>
      <PageHero eyebrow="gifts / 02" title={<>Подарунки, які<br/><em>хочеться залишити собі.</em></>} copy="Колір, форма, настрій, листівка — зберемо маленьку історію під конкретну людину." image="/images/pink-carousel-gift.webp" />
      <section className="section gift-options">
        {[
          ['01','Ready to gift','Готовий набір зі свічкою та оформленням.','/images/pink-carousel-gift.webp'],
          ['02','Sweet box','Грайливі “їстівні” форми: пончики, печиво, круасани.','/images/donut-candles.webp'],
          ['03','Sea mood','Мушлі, перлини, кокос — спокійна літня композиція.','/images/pearl-shell.webp'],
        ].map(x=><article className="gift-option clay-surface" key={x[0]} data-reveal><span>{x[0]}</span><img src={x[3]} alt=""/><div><h3>{x[1]}</h3><p>{x[2]}</p></div></article>)}
      </section>
      <section className="section custom-gift">
        <div data-reveal><span className="kicker"><i/> custom request</span><h2>Є конкретна людина,<br/><em>але немає ідеї?</em></h2><p>Напишіть кілька слів про неї — настрій, кольори, привід, бюджет. Ми перетворимо це на пропозицію подарунку.</p></div>
        <form className="gift-form clay-surface" onSubmit={e=>{e.preventDefault(); const data=Object.fromEntries(new FormData(e.currentTarget)); localStorage.setItem('domivka-custom-gift',JSON.stringify(data)); go('checkout?custom=1');}}>
          <label className="clay-input"><span>Для кого</span><input name="for" required placeholder="мама, подруга, колега…"/></label>
          <label className="clay-input"><span>Привід</span><input name="occasion" placeholder="birthday / thank you / just because"/></label>
          <label className="clay-input"><span>Бюджет</span><select name="budget"><option>до 800 ₴</option><option>800–1500 ₴</option><option>1500+ ₴</option></select></label>
          <label className="clay-input clay-input--textarea"><span>Що вона/він любить?</span><textarea name="note" rows="4" placeholder="рожевий, море, minimal, funny…"/></label>
          <ClayButton className="clay-button--berry" type="submit">Підготувати запит ↗</ClayButton>
        </form>
      </section>
    </>
  );
}

function StoryPage() {
  return (
    <>
      <PageHero eyebrow="story / 03" title={<>Нехай вдома буде<br/><em>трохи дивніше. Трохи тепліше.</em></>} copy="DOMIVKA будує свій характер не навколо “luxury candle”, а навколо живих, тактильних речей, до яких хочеться торкатися." image="/images/biscuit-candle.webp" />
      <section className="section manifesto">
        <div className="manifesto-big" data-reveal>“Свічка може бути<br/>серйозною.<br/><em>А може бути пончиком.</em>”</div>
        <div className="manifesto-copy" data-reveal><p>У бренді працює контраст: акуратне пакування + грайливі форми; кремова база + рожеві, карамельні й морські відтінки; домашність + маленька театральність.</p><p>Саме тому сайт теж не має бути стерильним каталогом. Він поводиться як коробка з маленькими об’єктами: щось підстрибує, щось накладається, щось хочеться “натиснути пальцем”.</p></div>
      </section>
      <section className="section values-grid">
        {[
          ['01','Warm, not beige','Теплий — не означає монотонний. DOMIVKA може бути рожевою, блакитною, карамельною й винною.'],
          ['02','Cute, not childish','Грайливість залишається дорослою завдяки типографіці, композиції та матеріальності.'],
          ['03','Handmade, not rustic','Ручна робота показана через деталі й живі фото, а не через кліше “craft paper everywhere”.'],
          ['04','Giftable by default','Бант, коробка, композиція і маленький сюрприз — частина продуктового досвіду.'],
        ].map(v=><article className="value-card clay-surface" key={v[0]} data-reveal><span>{v[0]}</span><h3>{v[1]}</h3><p>{v[2]}</p></article>)}
      </section>
      <section className="section image-story-grid">
        {[
          ['croissant-heart','01','гра як частина дому'],
          ['crystal-shoes','02','об’єкт, а не просто свічка'],
          ['calla-lily','03','форма, що пам’ятається'],
          ['coconut-candle','04','ритуал без поспіху'],
        ].map(([x,note,label],i)=><figure key={x} className={`clay-photo image-story-${i+1}`}><img src={`/images/${x}.webp`} alt="DOMIVKA brand photography"/><figcaption><b>{note}</b><span>{label}</span></figcaption></figure>)}
      </section>
    </>
  );
}

function CarePage() {
  return (
    <>
      <PageHero eyebrow="care / 04" title={<>Щоб красиво було<br/><em>не лише перші 5 хвилин.</em></>} copy="Короткий гайд: як поводитися зі свічкою, декором і ґнотом, щоб ритуал залишався приємним." image="/images/coconut-candle.webp" />
      <section className="section care-grid">
        {[
          ['01','Перший вогонь','Дайте верхньому шару воску прогрітися рівномірно. Це допомагає уникати глибокого “тунелю”.','pool'],
          ['02','Коротший ґніт','Перед наступним запалюванням приберіть зайву обвуглену частину ґноту. Полум’я буде спокійнішим.','wick'],
          ['03','Без протягів','Не ставте свічку біля відкритого вікна, вентилятора або на нестійку поверхню.','wind'],
          ['04','Скульптурні форми','Декоративні свічки краще ставити на жаростійку тарілку: форма може плавитися нерівномірно — це частина її характеру.','plate'],
          ['05','Не залишайте саму','Ніколи не залишайте запалену свічку без нагляду та тримайте подалі від дітей і тварин.','watch'],
          ['06','Після свічки','Красиву ємність можна очистити й використати як маленьку вазу, підставку або контейнер.','reuse'],
        ].map((c,index)=><article className="care-card clay-surface" style={{'--card-index':index}} key={c[0]} data-reveal>
          <div className="care-card-index"><span>{c[0]}</span><i aria-hidden="true"/></div>
          <div className="care-card-copy"><h3>{c[1]}</h3><p>{c[2]}</p></div>
          <CareIcon type={c[3]} />
        </article>)}
      </section>
      <section className="section material-note"><div className="clay-surface" data-reveal><span className="kicker"><i/> materials</span><h2>Матеріал — це частина історії.</h2><p>Для production-версії біля кожного SKU варто показати точний тип воску, ґніт, аромат і рекомендації саме для цієї форми. У демо ці дані навмисно не вигадані.</p></div></section>
    </>
  );
}

function CareIcon({ type }) {
  const art = {
    pool: <><path d="M30 14c8 10 12 16 12 23a12 12 0 0 1-24 0c0-7 4-13 12-23Z"/><path d="M22 38c3 3 13 3 16 0"/></>,
    wick: <><path d="M31 15v19"/><path d="M31 15c-6 6-7 11 0 15 7-4 6-9 0-15Z"/><path d="M18 41h26M23 48h16"/></>,
    wind: <><path d="M13 25h27c7 0 7-9 1-9-3 0-5 2-5 4"/><path d="M13 34h34c8 0 8 10 1 10-4 0-5-2-5-4"/><path d="M13 43h20"/></>,
    plate: <><path d="M17 40c8 8 22 8 30 0"/><path d="M14 40h36"/><path d="M25 36V22l7-7 7 7v14"/></>,
    watch: <><path d="M11 32s8-12 21-12 21 12 21 12-8 12-21 12S11 32 11 32Z"/><circle cx="32" cy="32" r="5"/><path d="M32 15v-4"/></>,
    reuse: <><path d="M23 27h18l-2 23H25l-2-23Z"/><path d="M28 27v-6h8v6"/><path d="M32 21c0-7 5-10 10-10-1 6-4 10-10 10Z"/></>,
  };
  return <div className="care-card-mark" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{art[type]}</svg></div>;
}

function PageHero({ eyebrow, title, copy, image }) {
  const variant = eyebrow.split('/')[0].trim();
  const actions = {
    shop: ['Перейти до колекції', '.shop-section'],
    gifts: ['Обрати формат подарунка', '.gift-options'],
    story: ['Читати історію', '.manifesto'],
    care: ['Відкрити гайд', '.care-grid'],
  };
  const [actionLabel, actionTarget] = actions[variant] || ['Дивитися далі', `.${variant}-grid`];
  return (
    <section className={`page-hero page-hero--${variant}`}>
      <div className="page-hero-index"><span>DOMIVKA / {variant}</span><b>{eyebrow}</b></div>
      <div className="page-hero-copy" data-reveal><span className="kicker"><i/> {eyebrow}</span><h1>{title}</h1><p>{copy}</p><button className="page-hero-action" onClick={()=>document.querySelector(actionTarget)?.scrollIntoView({behavior:'smooth'})}>{actionLabel} <span>↓</span></button></div>
      <figure className="page-hero-media" data-reveal><img src={image} alt="DOMIVKA candle"/><figcaption><span>handmade in Ukraine</span><b>↘</b></figcaption></figure>
      <div className="page-hero-seal" aria-hidden="true">D</div>
    </section>
  );
}

function CheckoutPage({ cart, subtotal, clearCart }) {
  const [done, setDone] = useState(null);
  const [promoInput, setPromoInput] = useState('');
  const [promo, setPromo] = useState(null);
  const [promoMessage, setPromoMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const custom = new URLSearchParams(window.location.hash.split('?')[1] || '').get('custom') === '1';
  const customData = (() => { try { return JSON.parse(localStorage.getItem('domivka-custom-gift')||'null'); } catch { return null; }})();
  const discount = promo?.type === 'percent' ? Math.round(subtotal * promo.value / 100) : 0;
  const discountedSubtotal = Math.max(0, subtotal - discount);
  const shipping = discountedSubtotal >= 2000 || discountedSubtotal === 0 ? 0 : 120;
  const total = discountedSubtotal + shipping;

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    const found = PROMO_CODES[code];
    if (!found) {
      setPromo(null);
      setPromoMessage('Промокод не знайдено. Перевірте написання.');
      return;
    }
    setPromo({ code, ...found });
    setPromoInput(code);
    setPromoMessage(`Промокод ${code} застосовано · ${found.label}`);
  };

  const makeSummary = (order, customer) => {
    const lines = cart.map(i => `${i.qty}× ${i.ukName} — ${money(i.price*i.qty)}`).join('\n');
    return `DOMIVKA · ${order}\n${lines || 'Custom gift request'}\n${promo?`Промокод: ${promo.code} (${promo.label})\nЗнижка: -${money(discount)}\n`:''}${subtotal?`Разом: ${money(total)}`:''}\nІм’я: ${customer.name}\nТелефон: ${customer.phone}\nМісто: ${customer.city || '-'}\nДоставка / відділення: ${customer.deliveryMethod || '-'}\nКоментар: ${customer.note || '-'}${customData?`\nGift brief: ${JSON.stringify(customData)}`:''}`;
  };
  const submit = async e => {
    e.preventDefault();
    if (submitting) return;
    setSubmitError('');
    setSubmitting(true);
    const customer = Object.fromEntries(new FormData(e.currentTarget).entries());
    const orderNumber = `DMV-${String(Date.now()).slice(-6)}`;
    const payload = { orderNumber, customer, items: cart.map(x=>({id:x.id,name:x.ukName,price:x.price,qty:x.qty})), customGift: customData, promo: promo ? { code: promo.code, label: promo.label, discount } : null, subtotal, discount, shipping, total, status:'new', createdAt:new Date().toISOString() };
    try {
      if (CATALOG_API) {
        const response = await fetch(`${CATALOG_API}/orders`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
        const data = await response.json().catch(()=>({}));
        if (!response.ok) throw new Error(data.message || 'Не вдалося зберегти замовлення.');
      } else {
        const prev = JSON.parse(localStorage.getItem('domivka-orders')||'[]');
        localStorage.setItem('domivka-orders',JSON.stringify([{...payload,openedAt:null,updatedAt:payload.createdAt},...prev]));
      }
      const endpoint = import.meta.env.VITE_ORDER_ENDPOINT;
      if (endpoint) {
        try { await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}); } catch (err) { console.error('Make.com webhook error',err); }
      }
      const summary = makeSummary(orderNumber, customer);
      clearCart();
      setDone({ orderNumber, summary });
    } catch (err) {
      setSubmitError(err.message || 'Не вдалося створити замовлення. Спробуйте ще раз.');
    } finally {
      setSubmitting(false);
    }
  };
  if (done) return <section className="checkout-success section"><div className="success-card clay-surface"><span className="success-heart">♡</span><small>order prepared</small><h1>Дякуємо.<br/><em>Тепер — до деталей.</em></h1><p>Номер замовлення: <b>{done.orderNumber}</b></p><div className="success-actions"><ClayButton className="clay-button--berry" onClick={async()=>{try{await navigator.clipboard.writeText(done.summary);}catch{} window.open(IG,'_blank');}}>Скопіювати замовлення + Instagram ↗</ClayButton><button className="under-link" onClick={()=>go('shop')}>продовжити дивитися</button></div></div></section>;
  return (
    <section className="checkout-page section">
      <div className="checkout-copy"><span className="kicker"><i/> checkout</span><h1>{custom ? <>Розкажіть, кому<br/><em>готуємо подарунок.</em></> : <>Майже вдома.<br/><em>Залишилися деталі.</em></>}</h1><p>Заповніть контакти. Після заявки з вами можна підтвердити наявність, відтінок, доставку та фінальну суму.</p></div>
      <form className="checkout-form clay-surface" onSubmit={submit}>
        <div className="checkout-form-head"><span>Ваші дані</span><b>{cart.reduce((n,x)=>n+x.qty,0)} items</b></div>
        <div className="form-grid">
          <label className="clay-input"><span>Ім’я *</span><input name="name" required placeholder="Ваше ім’я"/></label>
          <label className="clay-input"><span>Телефон *</span><input name="phone" required placeholder="+380…"/></label>
          <label className="clay-input full"><span>Instagram / email</span><input name="contact" placeholder="@username або email"/></label>
          <label className="clay-input"><span>Місто *</span><input name="city" required placeholder="Київ"/></label>
          <label className="clay-input"><span>Спосіб доставки / відділення *</span><input name="deliveryMethod" required placeholder="Нова пошта · відділення №…"/></label>
          <label className="clay-input clay-input--textarea full"><span>Коментар</span><textarea name="note" rows="4" placeholder="Колір, дата, листівка, побажання…"/></label>
        </div>
        {!custom && <>
          <div className="promo-block">
            <div className="promo-row">
              <label className="clay-input promo-input"><span>Промокод</span><input value={promoInput} onChange={e=>{setPromoInput(e.target.value);setPromoMessage('')}} placeholder="Наприклад, DOMIVKA10"/></label>
              <ClayButton className="promo-apply" onClick={applyPromo}>Застосувати</ClayButton>
            </div>
            {promoMessage && <p className={`promo-message ${promo ? 'success' : 'error'}`}>{promoMessage}</p>}
          </div>
          <div className="order-summary"><div>{cart.map(i=><p key={i.id}><span>{i.qty}× {i.ukName}</span><b>{money(i.price*i.qty)}</b></p>)}</div>{promo&&<p className="discount-line"><span>Промокод {promo.code}</span><b>− {money(discount)}</b></p>}<p><span>Доставка</span><b>{shipping ? money(shipping) : '0 ₴'}</b></p><strong><span>Разом</span><b>{money(total)}</b></strong></div>
        </>}
        {submitError&&<p className="checkout-submit-error">{submitError}</p>}
        <ClayButton className="clay-button--berry submit-order" type="submit" disabled={submitting}>{submitting?'Зберігаємо замовлення…':<>Надіслати замовлення <span>↗</span></>}</ClayButton>
        <small className="form-note">Натискаючи кнопку, ви створюєте заявку. Оплата та остаточне підтвердження можуть бути підключені окремим checkout-провайдером.</small>
      </form>
    </section>
  );
}

function CartDrawer({ open, onClose, cart, updateQty, subtotal }) {
  const shipping = subtotal >= 2000 || subtotal === 0 ? 0 : 120;
  return <div className={`cart-shell ${open?'open':''}`}><button className="cart-backdrop" onClick={onClose} aria-label="Close cart"/><aside className="cart-panel clay-surface">
    <div className="cart-head"><div><small>your little collection</small><h2>Кошик ♡</h2></div><button onClick={onClose}>×</button></div>
    <div className="cart-list">{cart.length ? cart.map(i=><article className="cart-item" key={i.id}><img src={primaryImage(i)} alt=""/><div><h3>{i.ukName}</h3><small>{money(i.price)}</small><div className="qty-clay qty-clay--small"><button onClick={()=>updateQty(i.id,-1)}>−</button><span>{i.qty}</span><button onClick={()=>updateQty(i.id,1)}>＋</button></div></div><b>{money(i.price*i.qty)}</b></article>) : <div className="empty"><span>♡</span><h3>Поки порожньо.</h3><p>Додайте щось тепле.</p><button className="under-link" onClick={()=>{onClose();go('shop')}}>до каталогу →</button></div>}</div>
    {cart.length>0 && <div className="cart-bottom"><p><span>Товари</span><b>{money(subtotal)}</b></p><p><span>Орієнтовна доставка</span><b>{shipping?money(shipping):'free'}</b></p><strong><span>Разом</span><b>{money(subtotal+shipping)}</b></strong><ClayButton className="clay-button--berry" onClick={()=>{onClose();go('checkout')}}>Оформити ↗</ClayButton><small>Безкоштовна доставка від 2 000 ₴ · demo rule</small></div>}
  </aside></div>;
}

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const submit = async e => {
    e.preventDefault();
    setError('');
    const result = await onLogin(email.trim(), password);
    if (!result.ok) setError(result.message || 'Невірний email або пароль.');
  };
  return <section className="admin-login section"><form className="admin-login-card clay-surface" onSubmit={submit}><Brand/><span className="kicker"><i/> admin access</span><h1>Керування<br/><em>каталогом.</em></h1><p>Авторизуйтеся, щоб додавати, редагувати або видаляти позиції каталогу.</p><label className="clay-input"><span>Email</span><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@domivka…"/></label><label className="clay-input"><span>Пароль</span><input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••"/></label>{error&&<p className="admin-error">{error}</p>}<ClayButton className="clay-button--berry" type="submit">Увійти ↗</ClayButton><small>Для production підключіть серверний API. Локальний режим зберігає каталог лише у цьому браузері.</small></form></section>;
}

function ProductEditor({ product, categories, onSave, onCancel }) {
  const empty = { id:'', name:'', ukName:'', price:'', image:'', images:[], collection:'', categories:[], badge:'', short:'', story:'', details:[] };
  const initial = product ? normalizeProduct(product) : empty;
  const [form, setForm] = useState({...initial, images:[...productImages(initial)], details:[...(initial.details||[])]});
  const [imageUrl, setImageUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (key, value) => setForm(v => ({...v,[key]:value}));
  const toggleCategory = name => setForm(v => {
    const current = productCategories(v);
    const next = current.includes(name) ? current.filter(x => x !== name) : [...current, name];
    return {...v, categories:next, collection:next[0] || ''};
  });
  const setImages = updater => setForm(v => {
    const next = typeof updater === 'function' ? updater(productImages(v)) : updater;
    const images = [...new Set((next || []).map(x=>String(x||'').trim()).filter(Boolean))];
    return {...v, images, image:images[0] || ''};
  });
  const addImageUrl = () => {
    const url = imageUrl.trim();
    if (!url) return;
    setImages(images => [...images, url]);
    setImageUrl('');
  };
  const handleImages = async e => {
    const files = [...(e.target.files || [])];
    if (!files.length) return;
    const loaded = await Promise.all(files.map(file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    })));
    setImages(images => [...images, ...loaded]);
    e.target.value = '';
  };
  const removeImage = index => setImages(images => images.filter((_,i)=>i!==index));
  const makePrimary = index => setImages(images => {
    const next = [...images];
    const [picked] = next.splice(index,1);
    return [picked,...next];
  });
  const submit = async e => {
    e.preventDefault();
    setBusy(true);
    const images = productImages(form);
    if (!images.length) {
      setBusy(false);
      window.alert('Додайте хоча б одне фото товару.');
      return;
    }
    const selectedCategories = productCategories(form);
    if (!selectedCategories.length) {
      setBusy(false);
      window.alert('Оберіть хоча б одну категорію товару.');
      return;
    }
    const prepared = normalizeProduct({
      ...form,
      image: images[0],
      images,
      categories:selectedCategories,
      collection:selectedCategories[0] || '',
      id: form.id || slugify(form.ukName || form.name),
      details: Array.isArray(form.details) ? form.details : String(form.details||'').split('\n').map(x=>x.trim()).filter(Boolean),
    });
    const result = await onSave(prepared, product?.id || null);
    setBusy(false);
    if (result?.ok !== false) onCancel();
  };
  const photos = productImages(form);
  return <form className="product-editor clay-surface" onSubmit={submit}>
    <div className="editor-head"><div><small>{product ? 'EDIT ITEM' : 'NEW ITEM'}</small><h2>{product ? product.ukName : 'Нова позиція'}</h2></div><button type="button" onClick={onCancel}>×</button></div>
    <div className="editor-section-label">Outer card · каталог</div>
    <div className="editor-grid">
      <label className="clay-input"><span>Назва UA *</span><input required value={form.ukName} onChange={e=>set('ukName',e.target.value)} placeholder="Рожева карусель"/></label>
      <label className="clay-input"><span>Назва EN *</span><input required value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Pink Carousel"/></label>
      <label className="clay-input"><span>Slug / ID</span><input value={form.id} onChange={e=>set('id',slugify(e.target.value))} placeholder="pink-carousel"/></label>
      <label className="clay-input"><span>Ціна ₴ *</span><input required type="number" min="0" value={form.price} onChange={e=>set('price',e.target.value)} placeholder="820"/></label>
      <fieldset className="category-checklist clay-input full"><legend>Категорії * · можна обрати декілька</legend><div className="category-checkbox-grid">{categories.map(name => <label className={`category-check ${productCategories(form).includes(name)?'checked':''}`} key={name}><input type="checkbox" checked={productCategories(form).includes(name)} onChange={()=>toggleCategory(name)}/><span className="category-box">✓</span><b>{name}</b></label>)}</div>{!categories.length&&<small>Спочатку додайте категорію у блоці керування категоріями нижче.</small>}</fieldset>
      <label className="clay-input"><span>Badge</span><input value={form.badge} onChange={e=>set('badge',e.target.value)} placeholder="gift-ready"/></label>
      <label className="clay-input full"><span>Короткий опис · 2 lines *</span><textarea required rows="2" value={form.short} onChange={e=>set('short',e.target.value)} placeholder="Опис, який видно у каталозі"/></label>
    </div>
    <div className="editor-section-label">Фото товару · можна декілька</div>
    <div className="editor-multiphoto">
      <div className="editor-photo-grid">
        {photos.length ? photos.map((src,index)=><figure className={`editor-photo-item clay-photo ${index===0?'is-primary':''}`} key={`${src.slice(0,32)}-${index}`}>
          <img src={src} alt={`preview ${index+1}`}/>
          {index===0 && <span className="primary-photo-label">Головне</span>}
          <div className="editor-photo-actions">
            {index!==0 && <button type="button" onClick={()=>makePrimary(index)}>Зробити головним</button>}
            <button type="button" className="danger" onClick={()=>removeImage(index)}>×</button>
          </div>
        </figure>) : <div className="editor-empty-photos clay-surface">Додайте перше фото ♡</div>}
      </div>
      <div className="editor-media-fields">
        <div className="image-url-row"><label className="clay-input"><span>Image URL / path</span><input value={imageUrl} onChange={e=>setImageUrl(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();addImageUrl()}}} placeholder="/images/candle-02.webp"/></label><button type="button" className="photo-add-url" onClick={addImageUrl}>＋ Додати URL</button></div>
        <label className="file-clay"><span>Завантажити фото · multiple</span><input type="file" accept="image/*" multiple onChange={handleImages}/></label>
        <small>Перше фото використовується в каталозі та кошику. На сторінці товару всі додані фото автоматично відображаються як галерея. Для production краще зберігати файли у storage/CDN; локальне завантаження працює як data URL.</small>
      </div>
    </div>
    <div className="editor-section-label">Inner card · сторінка товару</div>
    <div className="editor-grid">
      <label className="clay-input clay-input--textarea full"><span>Повний опис *</span><textarea required rows="4" value={form.story} onChange={e=>set('story',e.target.value)} placeholder="Історія / опис товару на inner page"/></label>
      <label className="clay-input clay-input--textarea full"><span>Характеристики · одна на рядок</span><textarea rows="5" value={Array.isArray(form.details)?form.details.join('\n'):form.details} onChange={e=>set('details',e.target.value.split('\n'))} placeholder={'ручне оформлення\nподарункова подача\nмаленька серія'}/></label>
    </div>
    <div className="editor-actions"><button type="button" className="under-link" onClick={onCancel}>Скасувати</button><ClayButton className="clay-button--berry" type="submit" disabled={busy}>{busy?'Збереження…':'Зберегти позицію ↗'}</ClayButton></div>
  </form>;
}

function AdminPage({ products, categories, adminAuthed, onLogin, onLogout, onSaveProduct, onDeleteProduct, onResetProducts, onAddCategory, onRenameCategory, onDeleteCategory }) {
  const [tab, setTab] = useState('catalog');
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [notice, setNotice] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState('');
  const [editingCategoryValue, setEditingCategoryValue] = useState('');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const [openOrder, setOpenOrder] = useState('');
  const [orderFilter, setOrderFilter] = useState('all');

  const apiToken = () => localStorage.getItem('domivka-admin-token') || '';
  const loadOrders = async () => {
    if (!adminAuthed) return;
    setOrdersLoading(true);
    setOrdersError('');
    try {
      if (CATALOG_API) {
        const response = await fetch(`${CATALOG_API}/orders`,{headers:{'Authorization':`Bearer ${apiToken()}`}});
        const data = await response.json().catch(()=>[]);
        if (!response.ok) throw new Error(data.message || 'Не вдалося завантажити замовлення.');
        setOrders(Array.isArray(data)?data:[]);
      } else {
        const local = JSON.parse(localStorage.getItem('domivka-orders')||'[]');
        setOrders(Array.isArray(local)?local:[]);
      }
    } catch (err) {
      setOrdersError(err.message || 'Не вдалося завантажити замовлення.');
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(()=>{ if(adminAuthed) loadOrders(); },[adminAuthed]);

  if (!adminAuthed) return <AdminLogin onLogin={onLogin}/>;

  const save = async (product, originalId) => {
    const result = await onSaveProduct(product, originalId);
    setNotice(result.ok === false ? result.message : 'Позицію збережено ♡');
    setTimeout(()=>setNotice(''),1800);
    return result;
  };
  const remove = async product => {
    if (!window.confirm(`Видалити “${product.ukName}”?`)) return;
    const result = await onDeleteProduct(product.id);
    setNotice(result.ok === false ? result.message : 'Позицію видалено.');
    setTimeout(()=>setNotice(''),1800);
  };
  const addCategory = async () => {
    const name = newCategory.trim();
    if (!name) return;
    const result = await onAddCategory(name);
    setNotice(result.ok === false ? result.message : 'Категорію додано ♡');
    if (result.ok !== false) setNewCategory('');
    setTimeout(()=>setNotice(''),1800);
  };
  const saveCategoryName = async oldName => {
    const name = editingCategoryValue.trim();
    if (!name || name === oldName) { setEditingCategory(''); return; }
    const result = await onRenameCategory(oldName, name);
    setNotice(result.ok === false ? result.message : 'Категорію оновлено.');
    if (result.ok !== false) { setEditingCategory(''); setEditingCategoryValue(''); }
    setTimeout(()=>setNotice(''),1800);
  };
  const removeCategory = async name => {
    const used = products.filter(p=>productCategories(p).includes(name)).length;
    if (!window.confirm(used ? `Категорія “${name}” використовується у ${used} товарах. Видалити її та прибрати з цих товарів?` : `Видалити категорію “${name}”?`)) return;
    const result = await onDeleteCategory(name);
    setNotice(result.ok === false ? result.message : 'Категорію видалено.');
    setTimeout(()=>setNotice(''),1800);
  };

  const updateOrderStatus = async (orderNumber, status) => {
    const previous = orders.find(order=>order.orderNumber===orderNumber);
    if (!previous || previous.status === status) return previous;
    try {
      let updated;
      if (CATALOG_API) {
        const response = await fetch(`${CATALOG_API}/orders/${encodeURIComponent(orderNumber)}`,{method:'PUT',headers:{'Content-Type':'application/json','Authorization':`Bearer ${apiToken()}`},body:JSON.stringify({status})});
        const data = await response.json().catch(()=>({}));
        if (!response.ok) throw new Error(data.message || 'Не вдалося змінити статус.');
        updated = data;
      } else {
        updated = {...previous,status,openedAt:previous.openedAt || (status!=='new'?new Date().toISOString():null),updatedAt:new Date().toISOString()};
        const next = orders.map(order=>order.orderNumber===orderNumber?updated:order);
        localStorage.setItem('domivka-orders',JSON.stringify(next));
      }
      setOrders(prev=>prev.map(order=>order.orderNumber===orderNumber?updated:order));
      return updated;
    } catch (err) {
      setNotice(err.message || 'Не вдалося змінити статус.');
      setTimeout(()=>setNotice(''),1800);
      return null;
    }
  };

  const toggleOrder = async order => {
    const closing = openOrder === order.orderNumber;
    setOpenOrder(closing ? '' : order.orderNumber);
    if (!closing && (order.status || 'new') === 'new') await updateOrderStatus(order.orderNumber,'seen');
  };

  const orderCounts = ORDER_STATUSES.reduce((acc,item)=>({...acc,[item.value]:orders.filter(order=>(order.status||'new')===item.value).length}),{});
  const filteredOrders = orderFilter==='all' ? orders : orders.filter(order=>(order.status||'new')===orderFilter);
  const formatDate = value => value ? new Intl.DateTimeFormat('uk-UA',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(value)) : '—';

  return <section className="admin-page section">
    <div className="admin-top"><div><span className="kicker"><i/> DOMIVKA CMS</span><h1>{tab==='catalog'?<>Каталог<br/><em>без коду.</em></>:<>Замовлення<br/><em>під контролем.</em></>}</h1><p>{tab==='catalog'?'Усі поля зовнішньої картки каталогу та внутрішньої сторінки товару редагуються тут.':'Нові заявки з checkout автоматично потрапляють сюди. Відкриття нового замовлення переводить його в “Побачене”.'}</p></div><div className="admin-top-actions">{tab==='catalog'&&<ClayButton className="clay-button--berry" onClick={()=>{setCreating(true);setEditing(null)}}>＋ Додати item</ClayButton>}<button className="under-link" onClick={onLogout}>Вийти</button></div></div>

    <nav className="admin-tabs clay-surface" aria-label="Admin sections">
      <button className={tab==='catalog'?'active':''} onClick={()=>setTab('catalog')}><span>Каталог</span><b>{products.length}</b></button>
      <button className={tab==='orders'?'active':''} onClick={()=>{setTab('orders');loadOrders()}}><span>Замовлення</span><b className={orderCounts.new?'has-new':''}>{orderCounts.new || orders.length}</b></button>
    </nav>

    {tab==='catalog' ? <>
      {(creating||editing)&&<ProductEditor key={editing?.id || 'new-product'} product={editing} categories={categories} onSave={save} onCancel={()=>{setCreating(false);setEditing(null)}}/>}
      <section className="category-manager clay-surface">
        <div className="category-manager-head"><div><small>CATALOG TAXONOMY</small><h2>Категорії</h2><p>Додавайте, перейменовуйте або видаляйте категорії. Один товар може бути одночасно у декількох категоріях.</p></div><span>{categories.length} categories</span></div>
        <div className="category-create-row"><label className="clay-input"><span>Нова категорія</span><input value={newCategory} onChange={e=>setNewCategory(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();addCategory()}}} placeholder="Наприклад: Wedding"/></label><button type="button" onClick={addCategory}>＋ Додати</button></div>
        <div className="category-list">{categories.map(name => <article className="category-admin-item" key={name}>
          {editingCategory===name ? <><input autoFocus value={editingCategoryValue} onChange={e=>setEditingCategoryValue(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')saveCategoryName(name);if(e.key==='Escape')setEditingCategory('')}}/><div className="category-admin-actions"><button onClick={()=>saveCategoryName(name)}>Зберегти</button><button onClick={()=>setEditingCategory('')}>Скасувати</button></div></> : <><div><b>{name}</b><small>{products.filter(p=>productCategories(p).includes(name)).length} товарів</small></div><div className="category-admin-actions"><button onClick={()=>{setEditingCategory(name);setEditingCategoryValue(name)}}>Редагувати</button><button className="danger" onClick={()=>removeCategory(name)}>Видалити</button></div></>}
        </article>)}</div>
      </section>
      <div className="admin-list-head"><span>{products.length} items</span><button className="admin-reset" onClick={()=>{if(window.confirm('Повернути початковий каталог?')) onResetProducts()}}>Reset demo catalogue</button></div>
      <div className="admin-products">{products.map(p=><article className="admin-product clay-surface" key={p.id}><img src={primaryImage(p)} alt=""/><div className="admin-product-copy"><small>{categoryLabel(p)} · {p.badge}</small><h3>{p.ukName}</h3><p>{p.short}</p></div><strong>{money(p.price)}</strong><div className="admin-item-actions"><button onClick={()=>{setEditing(p);setCreating(false);window.scrollTo({top:0,behavior:'smooth'})}}>Редагувати</button><button className="danger" onClick={()=>remove(p)}>Видалити</button></div></article>)}</div>
    </> : <section className="orders-admin">
      <div className="orders-toolbar clay-surface">
        <div className="orders-filter-list"><button className={orderFilter==='all'?'active':''} onClick={()=>setOrderFilter('all')}>Усі <b>{orders.length}</b></button>{ORDER_STATUSES.map(item=><button key={item.value} className={orderFilter===item.value?'active':''} onClick={()=>setOrderFilter(item.value)}>{item.short} <b>{orderCounts[item.value]||0}</b></button>)}</div>
        <button className="orders-refresh" onClick={loadOrders} disabled={ordersLoading}>{ordersLoading?'Оновлення…':'↻ Оновити'}</button>
      </div>
      {ordersError&&<div className="orders-empty clay-surface"><b>Не вдалося завантажити замовлення.</b><p>{ordersError}</p></div>}
      {!ordersError&&!ordersLoading&&!filteredOrders.length&&<div className="orders-empty clay-surface"><span>♡</span><h2>Тут поки тихо.</h2><p>Нові заявки з checkout з’являться тут автоматично.</p></div>}
      <div className="orders-list">{filteredOrders.map(order=>{
        const status=order.status||'new';
        const expanded=openOrder===order.orderNumber;
        const items=Array.isArray(order.items)?order.items:[];
        return <article className={`admin-order clay-surface status-${status} ${expanded?'open':''}`} key={order.orderNumber}>
          <button className="admin-order-summary" onClick={()=>toggleOrder(order)}>
            <span className={`order-status status-${status}`}>{orderStatusLabel(status)}</span>
            <div className="order-main"><small>{order.orderNumber} · {formatDate(order.createdAt)}</small><h3>{order.customer?.name || 'Без імені'}</h3><p>{order.customer?.city || 'Місто не вказано'} · {order.customer?.phone || 'без телефону'}</p></div>
            <div className="order-items-mini"><span>{items.length ? `${items.reduce((n,item)=>n+Number(item.qty||1),0)} товарів` : 'Custom gift'}</span><b>{money(Number(order.total||0))}</b></div>
            <i>{expanded?'−':'+'}</i>
          </button>
          {expanded&&<div className="admin-order-details">
            <div className="order-detail-grid">
              <div><small>КОНТАКТИ</small><p><b>{order.customer?.name || '—'}</b><br/>{order.customer?.phone || '—'}<br/>{order.customer?.contact || '—'}</p></div>
              <div><small>ДОСТАВКА</small><p><b>{order.customer?.city || '—'}</b><br/>{order.customer?.deliveryMethod || '—'}</p></div>
              <div><small>КОМЕНТАР</small><p>{order.customer?.note || 'Без коментаря'}</p></div>
            </div>
            {items.length>0&&<div className="order-products"><small>СКЛАД ЗАМОВЛЕННЯ</small>{items.map((item,index)=><p key={`${item.id}-${index}`}><span>{item.qty}× {item.name}</span><b>{money(Number(item.price||0)*Number(item.qty||1))}</b></p>)}</div>}
            {order.customGift&&<div className="order-gift-brief"><small>CUSTOM GIFT BRIEF</small><pre>{JSON.stringify(order.customGift,null,2)}</pre></div>}
            <div className="order-finance">{order.promo&&<p><span>Промокод {order.promo.code}</span><b>− {money(Number(order.discount||0))}</b></p>}<p><span>Товари</span><b>{money(Number(order.subtotal||0))}</b></p><p><span>Доставка</span><b>{money(Number(order.shipping||0))}</b></p><strong><span>Разом</span><b>{money(Number(order.total||0))}</b></strong></div>
            <div className="order-status-editor"><div><small>СТАТУС ЗАМОВЛЕННЯ</small><p>Зміна зберігається одразу.</p></div><div className="order-status-buttons">{ORDER_STATUSES.map(item=><button key={item.value} className={`${status===item.value?'active':''} status-${item.value}`} onClick={()=>updateOrderStatus(order.orderNumber,item.value)}>{item.short}</button>)}</div></div>
          </div>}
        </article>;
      })}</div>
    </section>}
    {notice&&<div className="toast clay-surface">{notice}</div>}
  </section>;
}

function Footer() {
  return <footer className="site-footer"><div className="footer-top"><Brand/><div><small>SHOP</small><button onClick={()=>go('shop')}>Каталог</button><button onClick={()=>go('gifts')}>Подарунки</button><button onClick={()=>go('care')}>Догляд</button></div><div><small>DOMIVKA</small><button onClick={()=>go('story')}>Історія</button><a href={IG} target="_blank" rel="noreferrer">Instagram ↗</a></div><div className="footer-note clay-surface"><b>Нагадування:</b><p>погані дні теж можна підсвітити красивою свічкою.</p><span>♡</span></div></div><div className="footer-bottom"><span>© 2026 DOMIVKA</span><span>made to feel like home</span><span>UA · handmade candle studio</span><button className="footer-admin" onClick={()=>go('admin')}>Admin</button></div></footer>;
}

function App() {
  const route = useRoute();
  const [cart, setCart] = useState(()=>{try{return JSON.parse(localStorage.getItem('domivka-cart-v2'))||[]}catch{return[]}});
  const [products, setProducts] = useState(()=>{try{const saved=JSON.parse(localStorage.getItem('domivka-products-v1'));return (saved||DEFAULT_PRODUCTS).map(hydrateCatalogueProduct)}catch{return DEFAULT_PRODUCTS.map(hydrateCatalogueProduct)}});
  const [categories, setCategories] = useState(()=>{try{const saved=JSON.parse(localStorage.getItem('domivka-categories-v1'));if(Array.isArray(saved))return saved;const oldProducts=JSON.parse(localStorage.getItem('domivka-products-v1'))||[];return [...new Set([...DEFAULT_CATEGORIES,...oldProducts.flatMap(productCategories)])]}catch{return DEFAULT_CATEGORIES}});
  const [adminAuthed, setAdminAuthed] = useState(()=>localStorage.getItem('domivka-admin-auth') === '1' || Boolean(localStorage.getItem('domivka-admin-token')));
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState('');
  useMotion(`${route.page}/${route.param || ''}`);

  useEffect(()=>localStorage.setItem('domivka-cart-v2',JSON.stringify(cart)),[cart]);
  useEffect(()=>{ if (!CATALOG_API) localStorage.setItem('domivka-products-v1',JSON.stringify(products)); },[products]);
  useEffect(()=>{ if (!CATALOG_API) localStorage.setItem('domivka-categories-v1',JSON.stringify(categories)); },[categories]);
  useEffect(()=>{document.title = route.page==='home' ? 'DOMIVKA — candles that feel like home' : `DOMIVKA — ${route.page}`;},[route.page]);
  useEffect(()=>{
    if (!CATALOG_API) return;
    Promise.all([
      fetch(`${CATALOG_API}/products`).then(r=>r.ok?r.json():Promise.reject()),
      fetch(`${CATALOG_API}/categories`).then(r=>r.ok?r.json():Promise.reject()),
    ]).then(([productData,categoryData])=>{
      if(Array.isArray(productData)) setProducts(productData.map(hydrateCatalogueProduct));
      if(Array.isArray(categoryData)) setCategories(categoryData.map(String).filter(Boolean));
    }).catch(()=>{});
  },[]);

  const apiToken = () => localStorage.getItem('domivka-admin-token') || '';
  const loginAdmin = async (email, password) => {
    if (CATALOG_API) {
      try {
        const r = await fetch(`${CATALOG_API}/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
        const data = await r.json().catch(()=>({}));
        if (!r.ok || !data.token) return {ok:false,message:data.message||'Не вдалося авторизуватися.'};
        localStorage.setItem('domivka-admin-token',data.token); setAdminAuthed(true); return {ok:true};
      } catch { return {ok:false,message:'API недоступний. Перевірте VITE_CATALOG_API_URL.'}; }
    }
    if (email === LOCAL_ADMIN_EMAIL && password === LOCAL_ADMIN_PASSWORD) {
      localStorage.setItem('domivka-admin-auth','1'); setAdminAuthed(true); return {ok:true};
    }
    return {ok:false,message:'Невірний email або пароль.'};
  };
  const logoutAdmin = () => {localStorage.removeItem('domivka-admin-auth');localStorage.removeItem('domivka-admin-token');setAdminAuthed(false);};
  const saveProduct = async (product, originalId) => {
    const item = normalizeProduct(product);
    if (!item.id || !item.ukName || !productImages(item).length || !productCategories(item).length) return {ok:false,message:'Заповніть обов’язкові поля, оберіть категорію та додайте хоча б одне фото.'};
    if (CATALOG_API) {
      try {
        const method = originalId ? 'PUT' : 'POST';
        const url = originalId ? `${CATALOG_API}/products/${encodeURIComponent(originalId)}` : `${CATALOG_API}/products`;
        const r = await fetch(url,{method,headers:{'Content-Type':'application/json','Authorization':`Bearer ${apiToken()}`},body:JSON.stringify(item)});
        const data = await r.json().catch(()=>({}));
        if (!r.ok) return {ok:false,message:data.message||'Не вдалося зберегти.'};
        setProducts(prev=>originalId?prev.map(x=>x.id===originalId?item:x):[item,...prev]); return {ok:true};
      } catch { return {ok:false,message:'Помилка з’єднання з catalog API.'}; }
    }
    setProducts(prev=>{
      if (originalId) return prev.map(x=>x.id===originalId?item:x);
      if (prev.some(x=>x.id===item.id)) return prev;
      return [item,...prev];
    });
    return {ok:true};
  };
  const deleteProduct = async id => {
    if (CATALOG_API) {
      try {
        const r = await fetch(`${CATALOG_API}/products/${encodeURIComponent(id)}`,{method:'DELETE',headers:{'Authorization':`Bearer ${apiToken()}`}});
        const data = await r.json().catch(()=>({}));
        if (!r.ok) return {ok:false,message:data.message||'Не вдалося видалити.'};
      } catch { return {ok:false,message:'Помилка з’єднання з catalog API.'}; }
    }
    setProducts(prev=>prev.filter(x=>x.id!==id));
    setCart(prev=>prev.filter(x=>x.id!==id));
    return {ok:true};
  };
  const addCategory = async name => {
    const value = String(name || '').trim();
    if (!value) return {ok:false,message:'Вкажіть назву категорії.'};
    if (categories.some(x=>x.toLowerCase()===value.toLowerCase())) return {ok:false,message:'Така категорія вже існує.'};
    if (CATALOG_API) {
      try {
        const r=await fetch(`${CATALOG_API}/categories`,{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${apiToken()}`},body:JSON.stringify({name:value})});
        const data=await r.json().catch(()=>({}));
        if(!r.ok)return {ok:false,message:data.message||'Не вдалося додати категорію.'};
      } catch {return {ok:false,message:'Помилка з’єднання з catalog API.'};}
    }
    setCategories(prev=>[...prev,value]);
    return {ok:true};
  };
  const renameCategory = async (oldName,newName) => {
    const value=String(newName||'').trim();
    if(!value)return {ok:false,message:'Назва не може бути порожньою.'};
    if(categories.some(x=>x!==oldName&&x.toLowerCase()===value.toLowerCase()))return {ok:false,message:'Така категорія вже існує.'};
    if(CATALOG_API){
      try{const r=await fetch(`${CATALOG_API}/categories/${encodeURIComponent(oldName)}`,{method:'PUT',headers:{'Content-Type':'application/json','Authorization':`Bearer ${apiToken()}`},body:JSON.stringify({name:value})});const data=await r.json().catch(()=>({}));if(!r.ok)return {ok:false,message:data.message||'Не вдалося оновити категорію.'};}
      catch{return {ok:false,message:'Помилка з’єднання з catalog API.'};}
    }
    setCategories(prev=>prev.map(x=>x===oldName?value:x));
    setProducts(prev=>prev.map(p=>normalizeProduct({...p,categories:productCategories(p).map(x=>x===oldName?value:x),collection:productCategories(p).map(x=>x===oldName?value:x)[0]||''})));
    return {ok:true};
  };
  const deleteCategory = async name => {
    if(CATALOG_API){
      try{const r=await fetch(`${CATALOG_API}/categories/${encodeURIComponent(name)}`,{method:'DELETE',headers:{'Authorization':`Bearer ${apiToken()}`}});const data=await r.json().catch(()=>({}));if(!r.ok)return {ok:false,message:data.message||'Не вдалося видалити категорію.'};}
      catch{return {ok:false,message:'Помилка з’єднання з catalog API.'};}
    }
    setCategories(prev=>prev.filter(x=>x!==name));
    setProducts(prev=>prev.map(p=>{const next=productCategories(p).filter(x=>x!==name);return normalizeProduct({...p,categories:next,collection:next[0]||''})}));
    return {ok:true};
  };
  const resetProducts = () => {setProducts(DEFAULT_PRODUCTS.map(normalizeProduct)); if(!CATALOG_API)localStorage.setItem('domivka-products-v1',JSON.stringify(DEFAULT_PRODUCTS.map(normalizeProduct)));};

  const addToCart = product => {
    withViewTransition(()=>setCart(prev=>{const found=prev.find(x=>x.id===product.id);return found?prev.map(x=>x.id===product.id?{...x,qty:x.qty+1}:x):[...prev,{...product,qty:1}]}));
    setToast(`${product.ukName} — у кошику ♡`); setTimeout(()=>setToast(''),1600);
  };
  const updateQty=(id,d)=>setCart(prev=>prev.map(x=>x.id===id?{...x,qty:x.qty+d}:x).filter(x=>x.qty>0));
  const count=cart.reduce((n,x)=>n+x.qty,0); const subtotal=cart.reduce((s,x)=>s+x.price*x.qty,0);
  let page;
  if(route.page==='shop') page=<ShopPage addToCart={addToCart} products={products} categories={categories}/>;
  else if(route.page==='product') page=<ProductPage id={route.param} addToCart={addToCart} products={products}/>;
  else if(route.page==='gifts') page=<GiftsPage/>;
  else if(route.page==='story') page=<StoryPage/>;
  else if(route.page==='care') page=<CarePage/>;
  else if(route.page==='checkout') page=<CheckoutPage cart={cart} subtotal={subtotal} clearCart={()=>setCart([])}/>;
  else if(route.page==='admin') page=<AdminPage products={products} categories={categories} adminAuthed={adminAuthed} onLogin={loginAdmin} onLogout={logoutAdmin} onSaveProduct={saveProduct} onDeleteProduct={deleteProduct} onResetProducts={resetProducts} onAddCategory={addCategory} onRenameCategory={renameCategory} onDeleteCategory={deleteCategory}/>;
  else page=<HomePage addToCart={addToCart} products={products}/>;
  const isAdmin = route.page === 'admin';
  return <div className={`app ${isAdmin ? 'is-admin' : 'is-public'}`}><BackgroundLayers/>{!isAdmin&&<Header activePath={route.page} cartCount={count} onCart={()=>setCartOpen(true)}/>}<main>{page}</main>{!isAdmin&&<Footer/>}{!isAdmin&&<CartDrawer open={cartOpen} onClose={()=>setCartOpen(false)} cart={cart} updateQty={updateQty} subtotal={subtotal}/>} {toast&&<div className="toast clay-surface">{toast}</div>}</div>;
}


createRoot(document.getElementById('root')).render(<App/>);
