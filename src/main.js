import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import './brx.css';

import images from './images.json';
import { CONTACT, FORM_ENDPOINT } from './config.js';

window.__ta = true;

const root = document.documentElement;
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
let reduced = root.classList.contains('rm');
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
  reduced = e.matches;
  root.classList.toggle('rm', e.matches);
});

/* ---------- Entrada ---------- */
const ready = () => root.classList.add('is-ready');
requestAnimationFrame(() => requestAnimationFrame(ready));
setTimeout(ready, 400);

/* ---------- Enlace activo (navegación, menú y pie) ---------- */
const here = location.pathname.replace(/index\.html$/, '');
$$('.nav a, .menu__links a, .footer nav a').forEach((a) => {
  const path = new URL(a.href).pathname;
  const active = path === '/' ? here === '/' : here.startsWith(path);
  if (active) a.setAttribute('aria-current', 'page');
});

/* ---------- Texto de los botones: rodillo al pasar el cursor ---------- */
$$('.btn__label').forEach((label) => {
  if (label.children.length) return;
  const text = label.textContent.trim();
  label.textContent = '';
  const a = document.createElement('span');
  a.textContent = text;
  const b = document.createElement('span');
  b.textContent = text;
  b.setAttribute('aria-hidden', 'true');
  label.append(a, b);
});

/* ---------- Menú móvil ---------- */
const menu = $('[data-menu]');
const openBtn = $('[data-menu-open]');
const closeBtn = $('[data-menu-close]');
function setMenu(open) {
  if (!menu) return;
  menu.classList.toggle('is-open', open);
  openBtn?.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) $('a', menu).focus();
  else openBtn?.focus();
}
openBtn?.addEventListener('click', () => setMenu(true));
closeBtn?.addEventListener('click', () => setMenu(false));
menu?.addEventListener('click', (e) => {
  if (e.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', (e) => {
  if (!menu?.classList.contains('is-open')) return;
  if (e.key === 'Escape') setMenu(false);
  if (e.key === 'Tab') {
    const f = $$('a, button', menu);
    const i = f.indexOf(document.activeElement);
    const next = e.shiftKey ? i - 1 : i + 1;
    if (i === -1 || next < 0 || next >= f.length) {
      e.preventDefault();
      f[(next + f.length) % f.length].focus();
    }
  }
});

/* ---------- Muro de lamas del hero ----------
   Cada lama es un prisma triangular (tres caras, una por imagen) que gira 120°
   cada 5 s, de izquierda a derecha con un pequeño desfase. */
const vane = $('[data-vane]');
if (vane) {
  const sources = $$('[data-vane-src]', vane);
  const STRIP = 72;
  let rotation = 0;
  let timer = null;
  let strips = [];
  let urls = [];

  const srcOf = (img) =>
    new Promise((resolve) => {
      const done = () => resolve(img.currentSrc || img.src);
      if (img.complete && img.naturalWidth) done();
      else img.addEventListener('load', done, { once: true });
    });

  function build() {
    const width = vane.clientWidth;
    const count = Math.ceil(width / STRIP) + 1;
    const apothem = STRIP / (2 * Math.sqrt(3));
    vane.style.setProperty('--apothem', `${apothem}px`);
    vane.style.setProperty('--vw', `${width}px`);
    vane.replaceChildren();
    strips = [];
    for (let i = 0; i < count; i++) {
      const strip = document.createElement('div');
      strip.className = 'vane__strip';
      strip.style.width = `${STRIP}px`;
      const prism = document.createElement('div');
      prism.className = 'vane__prism';
      prism.style.setProperty('--delay', `${i * 0.045}s`);
      prism.style.setProperty('--rot', `${rotation}deg`);
      urls.forEach((url, f) => {
        const face = document.createElement('div');
        face.className = 'vane__face';
        face.style.setProperty('--face', `${f * 120}deg`);
        const img = document.createElement('img');
        img.src = url;
        img.alt = '';
        img.style.setProperty('--offset', `${-i * STRIP}px`);
        face.append(img);
        prism.append(face);
      });
      strip.append(prism);
      vane.append(strip);
      strips.push(prism);
    }
  }

  function turn() {
    rotation -= 120;
    strips.forEach((p) => p.style.setProperty('--rot', `${rotation}deg`));
  }
  function play() {
    if (timer || reduced) return;
    timer = setInterval(turn, 5000);
  }
  function stop() {
    clearInterval(timer);
    timer = null;
  }

  // Las URL se toman de las <img> responsivas (AVIF/WebP según el navegador) una vez cargadas
  Promise.all(sources.map(srcOf)).then((list) => {
    urls = list;
    build();
    new IntersectionObserver(([e]) => (e.isIntersecting ? play() : stop())).observe(vane);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : play()));
  });
  let rw;
  let lastW = window.innerWidth;
  window.addEventListener('resize', () => {
    clearTimeout(rw);
    rw = setTimeout(() => {
      if (!urls.length || window.innerWidth === lastW) return;
      lastW = window.innerWidth;
      build();
    }, 250);
  });
}

/* ---------- Títulos letra a letra ---------- */
$$('.chars').forEach((el) => {
  const text = el.textContent.trim().replace(/\s+/g, ' ');
  el.setAttribute('aria-label', text);
  el.textContent = '';
  let i = 0;
  text.split(' ').forEach((word, w, arr) => {
    const wrap = document.createElement('span');
    wrap.style.display = 'inline-block';
    wrap.setAttribute('aria-hidden', 'true');
    [...word].forEach((ch) => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.textContent = ch;
      s.style.setProperty('--i', i++);
      wrap.append(s);
    });
    el.append(wrap);
    if (w < arr.length - 1) el.append(' ');
  });
});

/* ---------- Apariciones al entrar en pantalla ---------- */
const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    }),
  { rootMargin: '0px 0px -12% 0px' },
);
$$('[data-appear], .chars').forEach((el) => io.observe(el));

/* ---------- Párrafo que se rellena con el scroll ---------- */
const scrub = $('[data-scrub]');
const words = [];
if (scrub) {
  const text = scrub.textContent.trim().replace(/\s+/g, ' ');
  scrub.textContent = '';
  text.split(' ').forEach((word, i, arr) => {
    const s = document.createElement('span');
    s.className = 'w';
    s.textContent = word;
    scrub.append(s, i < arr.length - 1 ? ' ' : '');
    words.push(s);
  });
}
let ticking = false;
function onScroll() {
  ticking = false;
  if (!words.length) return;
  const vh = window.innerHeight;
  const r = scrub.getBoundingClientRect();
  if (r.bottom < 0 || r.top > vh) return;
  const p = reduced ? 1 : clamp((vh * 0.85 - r.top) / (r.height + vh * 0.25));
  const lit = Math.round(p * words.length);
  words.forEach((w, i) => w.classList.toggle('is-lit', i < lit));
}
window.addEventListener(
  'scroll',
  () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  },
  { passive: true },
);
onScroll();

/* ---------- Servicios: acordeón (cursor, toque o foco) ---------- */
const svcs = $$('[data-svc]');
function openSvc(target) {
  svcs.forEach((s) => s.classList.toggle('is-open', s === target));
}
svcs.forEach((s) => {
  s.addEventListener('pointerenter', (e) => {
    if (e.pointerType === 'mouse') openSvc(s);
  });
  s.addEventListener('click', (e) => {
    if (!e.target.closest('a')) openSvc(s);
  });
  s.addEventListener('focusin', () => openSvc(s));
});

/* ---------- Proceso: tarjeta activa ---------- */
$$('[data-steps]').forEach((list) => {
  const steps = $$('.step', list);
  steps.forEach((step) =>
    step.addEventListener('pointerenter', () =>
      steps.forEach((s) => s.classList.toggle('is-active', s === step)),
    ),
  );
});

/* ---------- Especialidades: lista, tarjeta y foto ---------- */
const exp = $('[data-exp]');
if (exp) {
  const items = $$('[data-exp-item]', exp);
  const panels = $$('[data-exp-panel]', exp);
  const photos = $$('[data-exp-photo]', exp);
  const set = (i) => {
    items.forEach((it, k) => {
      it.classList.toggle('is-active', k === i);
      it.setAttribute('aria-selected', String(k === i));
    });
    panels.forEach((p, k) => p.classList.toggle('is-active', k === i));
    photos.forEach((p, k) => p.classList.toggle('is-active', k === i));
  };
  items.forEach((it, i) => {
    it.addEventListener('pointerenter', (e) => e.pointerType === 'mouse' && set(i));
    it.addEventListener('click', () => set(i));
    it.addEventListener('focus', () => set(i));
  });
}

/* ---------- Carrusel "Construir en Lanzarote" ---------- */
const carousel = $('[data-carousel]');
if (carousel) {
  const slides = $$('[data-slide]', carousel);
  const quotes = $$('[data-quote]', carousel);
  const factA = $('[data-fact-a]', carousel);
  const factB = $('[data-fact-b]', carousel);
  const n = slides.length;
  let current = 0;
  const render = () => {
    slides.forEach((s, i) => {
      const d = (i - current + n) % n;
      s.dataset.pos = d === 0 ? '2' : d === 1 ? '1' : d === 2 ? '0' : d === n - 1 ? '3' : '-1';
    });
    quotes.forEach((q, i) => q.classList.toggle('is-active', i === current));
    factA.textContent = quotes[current].dataset.a;
    factB.textContent = quotes[current].dataset.b;
  };
  $('[data-next]', carousel).addEventListener('click', () => {
    current = (current + 1) % n;
    render();
  });
  $('[data-prev]', carousel).addEventListener('click', () => {
    current = (current - 1 + n) % n;
    render();
  });
  render();
}

/* ---------- Preguntas frecuentes ---------- */
$$('[data-acc]').forEach((acc) => {
  const items = $$('.acc__item', acc);
  items.forEach((item) => {
    const btn = $('.acc__q', item);
    btn.addEventListener('click', () => {
      const open = !item.classList.contains('is-open');
      items.forEach((it) => {
        const isThis = it === item && open;
        it.classList.toggle('is-open', isThis);
        $('.acc__q', it).setAttribute('aria-expanded', String(isThis));
      });
    });
  });
});

/* ---------- Datos de contacto (solo si están confirmados en config.js) ---------- */
function addContact(list, label, text, href) {
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = href;
  a.textContent = text;
  li.append(a);
  list.append(li);
}
const footerContact = $('[data-footer-contact]');
const detailsList = $('[data-details]');
const extra = [];
if (CONTACT.phone) extra.push(['Teléfono', CONTACT.phone, `tel:${CONTACT.phone.replace(/\s/g, '')}`]);
if (CONTACT.email) extra.push(['Correo', CONTACT.email, `mailto:${CONTACT.email}`]);
if (CONTACT.whatsapp) extra.push(['WhatsApp', 'Escribir por WhatsApp', `https://wa.me/${CONTACT.whatsapp}`]);
extra.forEach(([label, text, href]) => {
  if (footerContact) addContact(footerContact, label, text, href);
  if (detailsList) {
    const div = document.createElement('div');
    div.innerHTML = `<dt class="slash">// ${label}</dt>`;
    const dd = document.createElement('dd');
    const a = document.createElement('a');
    a.href = href;
    a.textContent = text;
    dd.append(a);
    div.append(dd);
    detailsList.append(div);
  }
});

/* ---------- Formulario ---------- */
const form = $('[data-form]');
if (form) {
  const statusBox = $('[data-form-status]');
  const submitBtn = $('[data-submit]');
  const tipo = new URLSearchParams(location.search).get('tipo');
  if (tipo && form.elements.tipo) form.elements.tipo.value = tipo;
  let attempted = false;
  const rules = {
    nombre: (v) => (v.trim().length < 2 ? 'Indica tu nombre.' : ''),
    email: (v) =>
      !v.trim()
        ? 'Indica tu correo electrónico.'
        : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
          ? ''
          : 'Revisa el formato del correo (por ejemplo, nombre@dominio.es).',
    telefono: (v) => (v.trim() && !/^\+?[\d\s().-]{9,}$/.test(v.trim()) ? 'Revisa el número de teléfono.' : ''),
    tipo: (v) => (v ? '' : 'Selecciona el tipo de obra.'),
    mensaje: (v) => {
      const n = v.trim().length;
      if (!n) return 'Cuéntanos brevemente tu proyecto.';
      return n < 20 ? `Añade algo más de detalle (mínimo 20 caracteres; llevas ${n}).` : '';
    },
    consent: (_, el) => (el.checked ? '' : 'Necesitamos tu consentimiento para poder responderte.'),
  };
  const validate = (el) => {
    const rule = rules[el.name];
    if (!rule) return true;
    const msg = rule(el.value, el);
    el.setAttribute('aria-invalid', String(Boolean(msg)));
    $(`[data-error-for="${el.name}"]`, form).textContent = msg;
    return !msg;
  };
  form.addEventListener('input', (e) => {
    if (attempted || e.target.getAttribute('aria-invalid') === 'true') validate(e.target);
  });
  const show = (title, text) => {
    statusBox.innerHTML = '';
    const s = document.createElement('strong');
    s.textContent = title;
    statusBox.append(s, document.createTextNode(text));
  };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    attempted = true;
    statusBox.textContent = '';
    const invalid = $$('input, select, textarea', form).filter((el) => !validate(el));
    if (invalid.length) {
      invalid[0].focus();
      return;
    }
    if (!FORM_ENDPOINT) {
      // Sin backend conectado: no afirmamos que se haya enviado nada.
      show(
        'Formulario en modo demostración.',
        ' Los datos son correctos, pero este formulario todavía no está conectado: tu solicitud no se ha enviado.',
      );
      return;
    }
    submitBtn.disabled = true;
    try {
      const res = await fetch(FORM_ENDPOINT, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      attempted = false;
      show('Solicitud enviada.', ' Gracias por escribirnos; nos pondremos en contacto contigo.');
    } catch {
      show('No se ha podido enviar.', ' Ha ocurrido un error de conexión. Inténtalo de nuevo en unos minutos.');
    } finally {
      submitBtn.disabled = false;
    }
  });
}

/* ---------- Créditos de imágenes ---------- */
const credits = $('[data-credits]');
if (credits) {
  const seen = new Set();
  Object.values(images).forEach(({ author, page }) => {
    if (seen.has(page)) return;
    seen.add(page);
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = page;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = author;
    li.append(a, document.createTextNode(' / Unsplash'));
    credits.append(li);
  });
}

$$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
