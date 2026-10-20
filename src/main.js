import '@fontsource-variable/archivo/wdth.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import './styles.css';
import './pages.css';

import images from './images.json';
import { CONTACT, FORM_ENDPOINT } from './config.js';

window.__ta = true;

const root = document.documentElement;
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// La clase .rm la decide el script del <head> (preferencia del sistema o ?motion=reduce).
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let reducedMotion = root.classList.contains('rm');
motionQuery.addEventListener('change', (e) => {
  reducedMotion = e.matches;
  root.classList.toggle('rm', e.matches);
  requestTick();
});

// Modo ligero: sin escalas/parallax ligados al scroll en equipos modestos o con ahorro de datos.
const lite =
  navigator.connection?.saveData === true ||
  (navigator.deviceMemory && navigator.deviceMemory <= 2) ||
  (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2);
if (lite) root.classList.add('is-lite');

/* ---------- Entrada ---------- */
const ready = () => root.classList.add('is-ready');
requestAnimationFrame(() => requestAnimationFrame(ready));
setTimeout(ready, 400); // respaldo si rAF se retrasa (pestaña en segundo plano)

/* ---------- Cabecera ---------- */
const header = $('[data-header]');
const hero = $('[data-hero]');
let lastY = window.scrollY;

function updateHeader(y) {
  // Transparente sobre el cielo del hero; sólida cuando la cortina lo ha cubierto.
  const solidFrom = hero ? hero.offsetHeight - header.offsetHeight : 24;
  header.classList.toggle('is-solid', y > solidFrom || document.body.classList.contains('menu-open'));
  if (document.body.classList.contains('menu-open')) return;
  if (y > solidFrom + 200 && y > lastY + 4) header.classList.add('is-hidden');
  else if (y < lastY - 4 || y <= solidFrom) header.classList.remove('is-hidden');
  lastY = y;
}
header.addEventListener('focusin', () => header.classList.remove('is-hidden'));

/* ---------- Menú móvil ---------- */
const menu = $('[data-menu]');
const toggle = $('[data-menu-toggle]');
const toggleLabel = $('[data-menu-label]');

function setMenu(open, viaPointer = false) {
  menu.hidden = !open;
  toggle.setAttribute('aria-expanded', String(open));
  toggleLabel.textContent = open ? 'Cerrar menú' : 'Abrir menú';
  document.body.classList.toggle('menu-open', open);
  header.classList.remove('is-hidden');
  updateHeader(window.scrollY);
  // Con teclado se muestra el anillo de foco; con dedo o ratón, no.
  if (open) $('a', menu).focus({ focusVisible: !viaPointer });
}

toggle.addEventListener('click', (e) => setMenu(menu.hidden, e.detail > 0));
menu.addEventListener('click', (e) => {
  if (e.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', (e) => {
  if (menu.hidden) return;
  if (e.key === 'Escape') {
    setMenu(false);
    toggle.focus();
  }
  if (e.key === 'Tab') {
    const focusables = [toggle, ...$$('a', menu)];
    const i = focusables.indexOf(document.activeElement);
    const next = e.shiftKey ? i - 1 : i + 1;
    if (i === -1 || next < 0 || next >= focusables.length) {
      e.preventDefault();
      focusables[(next + focusables.length) % focusables.length].focus();
    }
  }
});
window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => {
  if (e.matches && !menu.hidden) setMenu(false);
});

/* ---------- Enlace activo en la navegación ---------- */
// Se calcula en el bucle de scroll: el hero es sticky y nunca deja de intersectar,
// así que un IntersectionObserver no sabría cuándo volver a «ninguno».
// Solo cuentan los enlaces que apuntan a una sección de la página actual (/#estudio en la
// portada, #contacto en cualquier página). En las páginas de servicio queda marcado «Servicios».
const navLinks = $$('.nav__link');
const navTargets = navLinks.map((a) => {
  const url = new URL(a.href);
  return url.pathname === location.pathname && url.hash
    ? document.getElementById(url.hash.slice(1))
    : null;
});
const isServicePage = document.body.classList.contains('page-service');
let currentNav;
function updateNav(vh) {
  let current = null;
  navTargets.forEach((target, i) => {
    if (target && target.getBoundingClientRect().top <= vh * 0.5) current = i;
  });
  if (current === currentNav) return;
  currentNav = current;
  navLinks.forEach((a, i) => {
    const active =
      i === current || (current === null && isServicePage && a.dataset.nav === 'servicios');
    a.setAttribute('aria-current', String(active));
  });
}

/* ---------- Titulares por líneas reales ---------- */
// Se separan las palabras, se agrupan según su posición y cada línea queda dentro
// de una máscara. Se recalcula al cambiar el ancho para que los cortes sigan siendo reales.
function splitLines(el) {
  const text = el.dataset.text || (el.dataset.text = el.textContent.trim().replace(/\s+/g, ' '));
  el.textContent = '';
  const words = text.split(' ').map((word) => {
    const span = document.createElement('span');
    span.textContent = word;
    span.style.display = 'inline-block';
    el.append(span, ' ');
    return span;
  });
  const lines = [];
  words.forEach((w) => {
    const top = Math.round(w.offsetTop);
    const last = lines[lines.length - 1];
    if (last && Math.abs(last.top - top) < 4) last.words.push(w.textContent);
    else lines.push({ top, words: [w.textContent] });
  });
  el.textContent = '';
  lines.forEach((line, i) => {
    const outer = document.createElement('span');
    outer.className = 'ln';
    const inner = document.createElement('span');
    inner.className = 'ln__in';
    inner.style.setProperty('--i', i);
    inner.textContent = line.words.join(' ');
    // El espacio final mantiene separadas las palabras para los lectores de pantalla.
    outer.append(inner, ' ');
    el.append(outer);
  });
}

const lineEls = $$('[data-lines]');
const charEls = $$('[data-chars]');
charEls.forEach((el) => {
  const text = el.textContent.trim();
  el.setAttribute('aria-label', text);
  el.textContent = '';
  [...text].forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'ch';
    span.textContent = ch;
    span.style.setProperty('--i', i);
    el.append(span);
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      revealObserver.unobserve(entry.target);
    });
  },
  { rootMargin: '0px 0px -10% 0px' },
);

function observeReveals() {
  [...lineEls, ...charEls, ...$$('[data-fade], [data-stagger], [data-reveal]')].forEach((el) =>
    revealObserver.observe(el),
  );
  $$('[data-stagger]').forEach((group) =>
    [...group.children].forEach((child, i) => child.style.setProperty('--i', i)),
  );
}

// Esperar a las fuentes para medir las líneas con la tipografía definitiva
// (como mucho 1,5 s: si tardan más, se mide con la tipografía de reserva).
Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]).then(() => {
  lineEls.forEach(splitLines);
  observeReveals();
});
let lastWidth = window.innerWidth;
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    lineEls.forEach(splitLines);
  }, 200);
});

/* ---------- Texto que se rellena con el scroll ---------- */
const statement = $('[data-scrub]');
const words = [];
if (statement) {
  const text = statement.textContent.trim().replace(/\s+/g, ' ');
  statement.textContent = '';
  text.split(' ').forEach((word, i, arr) => {
    const span = document.createElement('span');
    span.className = 'w';
    span.textContent = word;
    statement.append(span, i < arr.length - 1 ? ' ' : '');
    words.push(span);
  });
}

/* ---------- Servicios: fila activa ---------- */
const serviceList = $('[data-services]');
const services = $$('[data-service]');
const previewFrame = $('[data-preview-frame]');
const previews = $$('[data-preview]');
const previewNum = $('[data-preview-num]');
let activeService = -1;
let hoverLock = false;

function setService(index) {
  if (index === activeService) return;
  const prev = activeService;
  activeService = index;
  services.forEach((s, i) => s.classList.toggle('is-active', i === index));
  serviceList.classList.add('has-active');
  if (!previewFrame) return;
  // La nueva imagen entra desde abajo al avanzar y desde arriba al retroceder
  previewFrame.dataset.dir = prev > index ? 'up' : 'down';
  previews.forEach((p, i) => {
    p.classList.toggle('is-prev', i === prev);
    p.classList.toggle('is-active', i === index);
  });
  previewNum.textContent = String(index + 1).padStart(2, '0');
}

if (services.length) {
  setService(0);
  // Precarga de las vistas previas (solo visibles en escritorio)
  new IntersectionObserver(
    (entries, obs) => {
      if (!entries[0].isIntersecting) return;
      previews.forEach((p) => ($('img', p).loading = 'eager'));
      obs.disconnect();
    },
    { rootMargin: '600px 0px' },
  ).observe($('.services__preview'));

  // Al hacer scroll, la fila que cruza la franja central pasa a estar activa
  const serviceObserver = new IntersectionObserver(
    (entries) => {
      if (hoverLock) return;
      entries.forEach((entry) => {
        if (entry.isIntersecting) setService(Number(entry.target.dataset.service));
      });
    },
    { rootMargin: '-42% 0px -42% 0px' },
  );
  services.forEach((s) => {
    serviceObserver.observe(s);
    // Ratón: al pasar por encima. Teclado: al enfocar el enlace. En táctil la activa el scroll,
    // y tocar la fila abre la página del servicio (toda la fila es el enlace).
    s.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse') return;
      hoverLock = true;
      setService(Number(s.dataset.service));
    });
    s.addEventListener('focusin', () => setService(Number(s.dataset.service)));
  });
  serviceList.addEventListener('pointerleave', () => (hoverLock = false));
}

/* ---------- Bucle de scroll ---------- */
const sequence = $('[data-sequence]');
const frames = sequence ? $$('.frame', sequence) : [];
const steps = sequence ? $$('[data-step]', sequence) : [];
const ticks = sequence ? $$('[data-tick]', sequence) : [];
const seqCount = $('[data-seq-count]');
const scaleEls = $$('[data-scale]');
const parallaxEls = $$('[data-parallax]');
let ticking = false;
let activeStep = 0;

function updateHero(vh) {
  if (!hero) return;
  if (reducedMotion) return hero.style.setProperty('--hp', 0);
  const p = clamp(window.scrollY / (hero.offsetHeight || vh));
  hero.style.setProperty('--hp', p.toFixed(4));
}

function updateStatement(vh) {
  if (!words.length) return;
  const r = statement.getBoundingClientRect();
  if (r.bottom < 0 || r.top > vh) return;
  const p = reducedMotion ? 1 : clamp((vh * 0.88 - r.top) / (r.height + vh * 0.3));
  const lit = Math.round(p * words.length);
  words.forEach((w, i) => w.classList.toggle('is-lit', i < lit));
}

function updateSequence(vh) {
  if (!sequence) return;
  const r = sequence.getBoundingClientRect();
  if (r.bottom < -vh || r.top > vh * 2) return;
  const p = clamp(-r.top / (r.height - vh));
  const n = frames.length;
  const seg = 0.84 / (n - 1);
  let count = 0;

  frames.forEach((frame, k) => {
    if (k === 0) return;
    // Cada imagen se abre desde un detalle central hasta ocupar toda la escena
    const local = clamp((p - (0.08 + (k - 1) * seg)) / (seg - 0.06));
    const value = reducedMotion ? (local > 0.5 ? 1 : 0) : easeInOut(local);
    frame.style.setProperty('--k', value.toFixed(4));
    if (local > 0.5) count = k;
  });

  ticks.forEach((tick, i) => {
    const t = i === 0 ? clamp(p / (0.08 + seg * 0.5)) : clamp((p - (0.08 + (i - 0.5) * seg)) / seg);
    tick.style.setProperty('--t', t.toFixed(3));
  });

  if (count !== activeStep) {
    steps.forEach((s, i) => {
      s.classList.toggle('is-active', i === count);
      s.classList.toggle('is-past', i < count);
    });
    activeStep = count;
    seqCount.textContent = String(count + 1).padStart(2, '0');
  }
}

function updateImages(vh) {
  if (reducedMotion || lite) return;
  scaleEls.forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > vh) return;
    // 1,1 al asomar por abajo → 1 cuando el centro llega a mitad de pantalla
    const p = clamp((vh - r.top) / (vh / 2 + r.height / 2));
    $('img', el).style.scale = (1.1 - 0.1 * p).toFixed(4);
  });
  parallaxEls.forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > vh) return;
    const progress = (r.top + r.height / 2 - vh / 2) / vh;
    $('img', el).style.translate = `0 ${clamp(progress * -8, -5, 5).toFixed(2)}%`;
  });
}

// Índice de las páginas de servicio: marca el apartado que se está leyendo
const tocLinks = $$('[data-toc]');
const tocTargets = tocLinks.map((a) => document.getElementById(a.hash.slice(1)));
let currentToc;
function updateToc(vh) {
  if (!tocLinks.length) return;
  let current = -1;
  tocTargets.forEach((t, i) => {
    if (t && t.getBoundingClientRect().top <= vh * 0.35) current = i;
  });
  if (current === currentToc) return;
  currentToc = current;
  tocLinks.forEach((a, i) => a.setAttribute('aria-current', String(i === current)));
}

function update() {
  ticking = false;
  const vh = window.innerHeight;
  updateHeader(window.scrollY);
  updateNav(vh);
  updateToc(vh);
  updateHero(vh);
  updateStatement(vh);
  updateSequence(vh);
  updateImages(vh);
}
function requestTick() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(update);
  }
}
window.addEventListener('scroll', requestTick, { passive: true });
window.addEventListener('resize', requestTick);
update();

/* ---------- Datos de contacto (solo si están confirmados en config.js) ---------- */
const details = $('[data-contact-details]');
const addDetail = (label, text, href) => {
  const li = document.createElement('li');
  li.innerHTML = `<span class="mono">${label}</span>`;
  const a = document.createElement('a');
  a.href = href;
  a.textContent = text;
  if (href.startsWith('http')) {
    a.target = '_blank';
    a.rel = 'noopener';
  }
  li.append(a);
  details.append(li);
};
if (CONTACT.phone) addDetail('Teléfono', CONTACT.phone, `tel:${CONTACT.phone.replace(/\s/g, '')}`);
if (CONTACT.email) addDetail('Correo', CONTACT.email, `mailto:${CONTACT.email}`);
if (CONTACT.whatsapp) addDetail('WhatsApp', 'Escribir por WhatsApp', `https://wa.me/${CONTACT.whatsapp}`);

/* ---------- Formulario ---------- */
const form = $('[data-form]');
const statusBox = $('[data-form-status]');
const submitBtn = $('[data-submit]');
let attempted = false;

// En las páginas de servicio, el tipo de obra llega preseleccionado
const serviceType = document.body.dataset.serviceType;
const typeSelect = form && form.elements.tipo;
if (serviceType && typeSelect) typeSelect.value = serviceType;

const rules = {
  nombre: (v) => (v.trim().length < 2 ? 'Indica tu nombre.' : ''),
  email: (v) => {
    if (!v.trim()) return 'Indica tu correo electrónico.';
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
      ? ''
      : 'Revisa el formato del correo (por ejemplo, nombre@dominio.es).';
  },
  telefono: (v) =>
    v.trim() && !/^\+?[\d\s().-]{9,}$/.test(v.trim()) ? 'Revisa el número de teléfono.' : '',
  tipo: (v) => (v ? '' : 'Selecciona el tipo de obra.'),
  mensaje: (v) => {
    const n = v.trim().length;
    if (!n) return 'Cuéntanos brevemente tu proyecto.';
    return n < 20 ? `Añade algo más de detalle (mínimo 20 caracteres; llevas ${n}).` : '';
  },
  consent: (_, el) => (el.checked ? '' : 'Necesitamos tu consentimiento para poder responderte.'),
};

function validateField(el) {
  const rule = rules[el.name];
  if (!rule) return true;
  const message = rule(el.value, el);
  el.setAttribute('aria-invalid', String(Boolean(message)));
  $(`[data-error-for="${el.name}"]`, form).textContent = message;
  return !message;
}

form.addEventListener('input', (e) => {
  if (attempted || e.target.getAttribute('aria-invalid') === 'true') validateField(e.target);
});
form.addEventListener('focusout', (e) => {
  if (attempted && e.target.name) validateField(e.target);
});

function showStatus(title, text, tone = 'info') {
  statusBox.dataset.tone = tone;
  statusBox.innerHTML = '';
  const strong = document.createElement('strong');
  strong.textContent = title;
  statusBox.append(strong, document.createTextNode(text));
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  attempted = true;
  statusBox.textContent = '';
  const fields = $$('input, select, textarea', form);
  const invalid = fields.filter((el) => !validateField(el));
  if (invalid.length) {
    invalid[0].focus();
    return;
  }

  if (!FORM_ENDPOINT) {
    // Sin backend conectado: no afirmamos que se haya enviado nada.
    showStatus(
      'Formulario en modo demostración.',
      ' Los datos son correctos, pero este formulario todavía no está conectado: tu solicitud no se ha enviado.',
    );
    return;
  }

  submitBtn.setAttribute('aria-busy', 'true');
  submitBtn.disabled = true;
  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(String(res.status));
    form.reset();
    if (serviceType && typeSelect) typeSelect.value = serviceType;
    attempted = false;
    showStatus('Solicitud enviada.', ' Gracias por escribirnos; nos pondremos en contacto contigo.', 'success');
  } catch {
    showStatus(
      'No se ha podido enviar.',
      ' Ha ocurrido un error de conexión. Inténtalo de nuevo en unos minutos.',
      'error',
    );
  } finally {
    submitBtn.removeAttribute('aria-busy');
    submitBtn.disabled = false;
  }
});

/* ---------- Créditos fotográficos ---------- */
const creditsList = $('[data-credits]');
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
  creditsList.append(li);
});

$$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
