import '@fontsource-variable/bricolage-grotesque/wdth.css';
import '@fontsource/instrument-serif/latin-400-italic.css';
import './styles.css';

import images from './images.json';
import { CONTACT, FORM_ENDPOINT, HERO_VIDEO } from './config.js';

const root = document.documentElement;
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const reduced = () => root.classList.contains('rm');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
  root.classList.toggle('rm', e.matches);
  setupPin();
});

/* ---------- Enlace activo (navegación, menú y pie) ---------- */
const here = location.pathname.replace(/index\.html$/, '');
$$('.nav a, .menu__nav a, .footer nav a').forEach((a) => {
  if (a.hash) return;
  const path = new URL(a.href).pathname;
  const exact = path === here;
  const section = path !== '/' && here.startsWith(path) && !a.closest('.nav__sub, .menu__sub, .footer nav[aria-labelledby="f-servicios"]');
  if (exact || section) a.setAttribute('aria-current', 'page');
});

/* =====================================================================
   1. TITULARES POR LÍNEAS
   Se parten en líneas reales (según el ancho) conservando las cursivas;
   cada línea sube desde una máscara. Se recalculan al cambiar el ancho.
   ===================================================================== */
const splitTargets = $$('.display-1, .display-2').filter((el) => !el.closest('.hero'));
const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
const openTag = (n) => n.outerHTML.replace(/<\/[^>]+>$/, '');
const closeTag = (n) => `</${n.nodeName.toLowerCase()}>`;
const wrapIn = (html, tags) => tags.reduceRight((acc, t) => openTag(t) + acc + closeTag(t), html);

function tokenize(node, tags, out) {
  node.childNodes.forEach((c) => {
    if (c.nodeType === 3) {
      c.textContent.split(/(\s+)/).forEach((t) => {
        if (!t) return;
        out.push(/^\s+$/.test(t) ? { space: true } : { text: t, tags });
      });
    } else if (c.nodeName === 'BR') {
      out.push({ space: true });
    } else if (c.nodeType === 1) {
      tokenize(c, [...tags, c.cloneNode(false)], out);
    }
  });
  return out;
}

function splitLines(el) {
  if (!el.dataset.orig) el.dataset.orig = el.innerHTML;
  const holder = document.createElement('div');
  holder.innerHTML = el.dataset.orig;
  const words = tokenize(holder, [], []).filter((t) => !t.space);
  el.innerHTML = words.map((w) => wrapIn(`<span class="w">${esc(w.text)}</span>`, w.tags)).join(' ');
  const lines = [];
  let lastTop = null;
  // Se compara el centro vertical de cada palabra con margen de media letra: la cursiva serif y la
  // sans tienen alturas distintas y su borde superior no coincide aunque estén en la misma línea
  const tolerance = parseFloat(getComputedStyle(el).fontSize) * 0.5;
  $$('.w', el).forEach((span, i) => {
    const top = span.offsetTop + span.offsetHeight / 2;
    if (lastTop === null || Math.abs(top - lastTop) > tolerance) lines.push([]);
    lastTop = top;
    lines[lines.length - 1].push(words[i]);
  });
  el.innerHTML = lines
    .map((line, i) => {
      const inner = line.map((w) => wrapIn(esc(w.text), w.tags)).join(' ');
      return `<span class="split-line" style="--i:${i}"><span>${inner}${i < lines.length - 1 ? ' ' : ''}</span></span>`;
    })
    .join('');
  el.dataset.split = '';
}

let splitWidth = 0;
function splitAll() {
  if (window.innerWidth === splitWidth) return;
  splitWidth = window.innerWidth;
  splitTargets.forEach(splitLines);
}

/* =====================================================================
   2. APARICIONES AL ENTRAR EN PANTALLA (una sola vez)
   ===================================================================== */

/* 2a. Animaciones asignadas automáticamente en toda la web (títulos, etiquetas, textos y fotos).
       Se respeta lo que ya tiene su propia animación (hero, titulares por líneas, bloques marcados). */
const OWN_MOTION = '.hero, .menu, .site-header, .vista, .works__preview, .toc';
const ANIMATED = `[data-reveal], [data-stagger], [data-intro], ${OWN_MOTION}`;
const isFree = (el) => !el.closest(ANIMATED);

// Títulos medianos y pequeños: cada palabra sube desde una máscara
const wordTargets = $$(
  '.display-3, .tile__title, .panel__title, .step h3, .numbered h3, .principles h3, .index__name, .mat figcaption strong',
).filter((el) => !el.closest(OWN_MOTION));
wordTargets.forEach((el) => {
  const holder = document.createElement('div');
  holder.innerHTML = el.innerHTML;
  const words = tokenize(holder, [], []).filter((t) => !t.space);
  el.innerHTML = words
    .map((w, i) => `<span class="wd" style="--w:${i}"><span>${wrapIn(esc(w.text), w.tags)}</span></span>`)
    .join(' ');
  el.dataset.words = '';
});

// Etiquetas pequeñas en mayúsculas: se dibujan de izquierda a derecha
$$('.label, .eyebrow, .keyfacts__title, .footer__title, .tile__label, .block__summary > span')
  .filter((el) => !el.closest(OWN_MOTION))
  .forEach((el) => (el.dataset.wipe = ''));

// Listas y grupos: sus elementos aparecen uno detrás de otro
$$('.checks, .numbered, .index, .credits-list, .works__list, .footer__grid, .keyfacts__list, .facts, .principles')
  .filter(isFree)
  .forEach((el) => (el.dataset.stagger = ''));

// Párrafos sueltos y bloques de texto: suben un poco al aparecer
$$('main p, .footer-form__intro > p, .panel__body, .block__summary')
  .filter((el) => isFree(el) && !el.closest('.tile, .acc, figure, .form, li, .about__card, .cta') && !el.matches('.label, .eyebrow'))
  .forEach((el) => (el.dataset.reveal = ''));

// Fotos que estaban quietas: se descubren de abajo arriba
$$('.panel__img, main .ph:not(.reveal-img)')
  .filter((el) => !el.closest(`.phead__media, .mat, .about__media, ${OWN_MOTION}`))
  .forEach((el) => (el.dataset.clip = ''));

$$('[data-stagger]').forEach((g) => [...g.children].forEach((c, i) => c.style.setProperty('--i', i)));
$$('.menu__nav > *').forEach((c, i) => c.style.setProperty('--i', i));

const word = $('.footer__word');
if (word) {
  word.innerHTML = [...word.textContent].map((ch, i) => `<span style="--i:${i}">${ch === ' ' ? ' ' : esc(ch)}</span>`).join('');
}

// En un grupo (data-reveal-group) las fotos entran juntas, cada una con su retraso definido en el CSS
const show = (el) => {
  el.classList.add('is-in');
  const group = el.closest('[data-reveal-group]');
  if (group) $$('.reveal-img', group).forEach((img) => img.classList.add('is-in'));
};
const makeIO = (margin) =>
  new IntersectionObserver(
    (entries, obs) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        show(e.target);
        obs.unobserve(e.target);
      }),
    { rootMargin: `0px 0px ${margin} 0px` },
  );
const io = makeIO('-12%');
// Dentro de las secciones que cambian de fondo, el contenido espera a que el fondo haya cambiado
const ioLate = makeIO('-38%');
function observeReveals() {
  $$('[data-reveal], [data-stagger], .reveal-img, .footer__word, [data-split], [data-words], [data-wipe], [data-clip]').forEach((el) => {
    if (el.classList.contains('is-in')) return;
    (el.closest('[data-bg-shift]') ? ioLate : io).observe(el);
  });
}
// Red de seguridad: tras saltos bruscos (anclas, scroll rápido) nada debe quedarse oculto
let catchUpT;
addEventListener('scroll', () => {
  clearTimeout(catchUpT);
  catchUpT = setTimeout(() => {
    $$('.reveal-img:not(.is-in), [data-reveal]:not(.is-in), [data-stagger]:not(.is-in), [data-split]:not(.is-in), [data-words]:not(.is-in), [data-wipe]:not(.is-in), [data-clip]:not(.is-in)').forEach((el) => {
      if (el.getBoundingClientRect().top < innerHeight) show(el);
    });
  }, 180);
}, { passive: true });

/* =====================================================================
   3. MOVIMIENTO LIGADO AL SCROLL (un único bucle por frame)
   ===================================================================== */
const header = $('[data-header]');
const hero = $('[data-hero]');
const ghosts = $$('[data-drift]');
const parallax = $$('[data-parallax]');
const shifts = $$('[data-bg-shift]');
const steps = $('[data-steps]');
const hs = $('[data-hscroll]');
const hsTrack = hs && $('[data-hs-track]', hs);
const hsPanels = hs ? $$('.panel:not(.panel--end)', hs) : [];
const hsIndex = hs && $('[data-hs-index]', hs);
const vista = $('[data-vista]');
let hsMax = 0;
let vistaY = null;
let vistaTarget = 0;
let vistaRaf = 0;
let lastY = window.scrollY;
let ticking = false;

const inView = (r, vh, pad = 0) => r.bottom > -pad && r.top < vh + pad;

function setupPin() {
  if (!hs) return;
  const pin = !reduced() && window.innerWidth >= 1024 && finePointer.matches;
  hs.classList.toggle('is-pinned', pin);
  hsTrack.style.removeProperty('--hsx');
  if (!pin) {
    hs.style.removeProperty('--hs-h');
    return;
  }
  hsMax = Math.max(0, hsTrack.scrollWidth - window.innerWidth);
  hs.style.setProperty('--hs-h', `${hsMax + window.innerHeight}px`);
}

function tick() {
  ticking = false;
  const y = window.scrollY;
  const vh = window.innerHeight;
  const motion = !reduced();

  if (motion && hero) {
    const r = hero.getBoundingClientRect();
    if (r.bottom > 0) hero.style.setProperty('--hp', clamp(-r.top / r.height).toFixed(4));
  }

  if (motion) {
    ghosts.forEach((g) => {
      const r = g.getBoundingClientRect();
      if (inView(r, vh, 200)) g.style.setProperty('--drift', ((r.top - vh) * Number(g.dataset.drift)).toFixed(1));
    });
    parallax.forEach((p) => {
      const r = p.getBoundingClientRect();
      if (inView(r, vh, 200)) p.style.setProperty('--py', `${((r.top + r.height / 2 - vh / 2) * Number(p.dataset.parallax)).toFixed(1)}px`);
    });
  }

  if (motion && vista) {
    const r = vista.getBoundingClientRect();
    const near = inView(r, vh, 100);
    vista.classList.toggle('is-near', near);
    if (near) {
      // +100px cuando la banda asoma por abajo, 0 en el centro, -100px cuando sale por arriba
      vistaTarget = 100 - 200 * clamp((vh - r.top) / (vh + r.height));
      if (vistaY === null) vistaY = vistaTarget;
      if (!vistaRaf) vistaRaf = requestAnimationFrame(vistaStep);
    }
  }

  shifts.forEach((s) => {
    const r = s.getBoundingClientRect();
    s.style.setProperty('--bg', motion ? clamp((vh - r.top) / (vh * 0.35)).toFixed(3) : 1);
  });

  if (steps) {
    const r = steps.getBoundingClientRect();
    const line = vh * 0.6;
    steps.style.setProperty('--sp', clamp((line - r.top) / r.height).toFixed(4));
    $$('.step', steps).forEach((s) => s.classList.toggle('is-active', s.getBoundingClientRect().top < line));
  }

  if (hs && hs.classList.contains('is-pinned')) {
    const r = hs.getBoundingClientRect();
    const p = clamp(-r.top / Math.max(1, r.height - vh));
    const x = p * hsMax;
    hsTrack.style.setProperty('--hsx', x.toFixed(1));
    hs.style.setProperty('--hsp', Math.max(0.06, p).toFixed(4));
    const vw = window.innerWidth;
    let active = 0;
    hsPanels.forEach((panel, i) => {
      const left = panel.offsetLeft - x;
      if (left < vw * 0.45) active = i;
      const img = $('img', panel);
      if (img) img.style.setProperty('--px', `${clamp((left + panel.offsetWidth / 2 - vw / 2) / vw, -1, 1) * -6 - 5}%`);
    });
    if (hsIndex) hsIndex.textContent = String(active + 1).padStart(2, '0');
  }

  if (header) {
    const menuOpen = $('[data-menu]')?.classList.contains('is-open');
    const dropOpen = $('.nav__drop.is-open');
    const down = y > lastY && y > vh * 0.5;
    header.classList.toggle('is-hidden', down && !menuOpen && !dropOpen && !header.contains(document.activeElement));
    header.classList.toggle('is-solid', y > 60);
    header.dataset.tone = toneUnder();
  }
  lastY = y;
}

// Vídeo de fondo del hero: solo con movimiento permitido y sin ahorro de datos. Empieza (y vuelve a
// empezar en cada vuelta del bucle) en HERO_VIDEO.start y se funde sobre el fondo de basalto cuando ya
// avanza desde ese punto, para que no se vean los primeros segundos.
const heroVideo = $('[data-hero-video]');
const start = Number(HERO_VIDEO.start) || 0;
const showVideo = () => {
  if (hero.classList.contains('has-video')) return;
  hero.classList.add('has-video');
};
const videoAllowed = hero && !reduced() && !navigator.connection?.saveData;
const ownVideo = HERO_VIDEO.mp4 || HERO_VIDEO.webm;
if (heroVideo && ownVideo && videoAllowed) {
  heroVideo.muted = true;
  heroVideo.loop = !start;
  if (HERO_VIDEO.poster) heroVideo.poster = HERO_VIDEO.poster;
  [
    ['webm', 'video/webm'],
    ['mp4', 'video/mp4'],
  ].forEach(([key, type]) => {
    if (!HERO_VIDEO[key]) return;
    const source = document.createElement('source');
    source.src = HERO_VIDEO[key];
    source.type = type;
    heroVideo.append(source);
  });
  heroVideo.addEventListener('loadedmetadata', () => (heroVideo.currentTime = start));
  heroVideo.addEventListener('timeupdate', () => {
    if (heroVideo.currentTime >= start - 0.5) showVideo();
  });
  heroVideo.addEventListener('ended', () => {
    heroVideo.currentTime = start;
    heroVideo.play().catch(() => {});
  });
  heroVideo.load();
  // Fuera de pantalla se pausa; al volver sigue donde estaba, sin reiniciar
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) heroVideo.play().catch(() => {});
    else heroVideo.pause();
  }).observe(hero);
} else if (heroVideo && HERO_VIDEO.vimeo && videoAllowed) {
  // Reproductor de Vimeo en modo fondo, controlado con su API de mensajes (sin librerías)
  const url = new URL(HERO_VIDEO.vimeo);
  Object.entries({ background: 1, autoplay: 1, loop: start ? 0 : 1, muted: 1, autopause: 0, dnt: 1 }).forEach(([k, v]) =>
    url.searchParams.set(k, v),
  );
  if (start) url.hash = `t=${start}s`;
  const frame = document.createElement('iframe');
  frame.className = 'hero__video hero__video--embed';
  frame.src = url.href;
  frame.title = 'Vídeo de fondo';
  frame.tabIndex = -1;
  frame.allow = 'autoplay; fullscreen; picture-in-picture';
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  heroVideo.replaceWith(frame);
  const send = (method, value) =>
    frame.contentWindow?.postMessage(JSON.stringify(value === undefined ? { method } : { method, value }), url.origin);
  const restart = () => {
    send('setCurrentTime', start);
    send('play');
  };
  window.addEventListener('message', (e) => {
    if (e.origin !== url.origin || e.source !== frame.contentWindow) return;
    let data;
    try {
      data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
    } catch {
      return;
    }
    if (data.event === 'ready') {
      // El reproductor responde con los nombres de su API antigua (playProgress, finish) o nueva
      ['timeupdate', 'playProgress', 'ended', 'finish'].forEach((name) => send('addEventListener', name));
      if (start) send('setCurrentTime', start);
    }
    if (data.event === 'ended' || data.event === 'finish') restart();
    if (data.event === 'timeupdate' || data.event === 'playProgress') {
      const seconds = Number(data.data?.seconds) || 0;
      // Si el reproductor vuelve al principio por su cuenta, salta de nuevo al punto de inicio
      if (seconds < start - 1) restart();
      else showVideo();
    }
  });
  new IntersectionObserver(([entry]) => send(entry.isIntersecting ? 'play' : 'pause')).observe(hero);
}

// La deriva de la ventana fotográfica sigue al scroll con un ligero retardo
function vistaStep() {
  vistaRaf = 0;
  vistaY += (vistaTarget - vistaY) * 0.16;
  if (Math.abs(vistaTarget - vistaY) < 0.1) vistaY = vistaTarget;
  else vistaRaf = requestAnimationFrame(vistaStep);
  vista.style.setProperty('--vy', `${vistaY.toFixed(2)}px`);
}

// Tono de la sección que queda bajo la cabecera (claro u oscuro)
function toneUnder() {
  const h = header.offsetHeight;
  const el = document.elementsFromPoint(window.innerWidth / 2, h / 2).find((e) => !header.contains(e) && !e.closest('.works__preview'));
  const zone = el?.closest('[data-theme], .phead, .footer, .section--dark');
  if (!zone) return 'light';
  if (zone.hasAttribute('data-bg-shift')) return Number(getComputedStyle(zone).getPropertyValue('--bg') || 1) < 0.5 ? 'dark' : 'light';
  if (zone.dataset.theme) return zone.dataset.theme;
  return 'dark';
}

const requestTick = () => {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(tick);
  }
};
window.addEventListener('scroll', requestTick, { passive: true });
window.addEventListener('resize', () => {
  setupPin();
  splitAll();
  requestTick();
});

// Con el carril fijado, el foco por teclado lleva el scroll hasta el panel enfocado
hs?.addEventListener('focusin', (e) => {
  if (!hs.classList.contains('is-pinned')) return;
  const panel = e.target.closest('.panel');
  if (!panel) return;
  const pad = parseFloat(getComputedStyle(hsTrack).paddingLeft) || 0;
  const p = clamp((panel.offsetLeft - pad) / Math.max(1, hsMax));
  const top = hs.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: top + p * (hs.offsetHeight - window.innerHeight), behavior: 'instant' });
});

/* =====================================================================
   4. PROYECTOS: vista previa que sigue al cursor
   ===================================================================== */
const works = $('[data-works]');
const preview = $('[data-works-preview]');
if (works && preview) {
  const shots = $$('[data-shot]', preview);
  let tx = 0;
  let ty = 0;
  let x = 0;
  let y = 0;
  let running = false;
  const loop = () => {
    x += (tx - x) * 0.14;
    y += (ty - y) * 0.14;
    const w = preview.offsetWidth;
    const hgt = preview.offsetHeight;
    preview.style.setProperty('--wx', `${(x - w / 2).toFixed(1)}px`);
    preview.style.setProperty('--wy', `${(y - hgt / 2).toFixed(1)}px`);
    preview.style.setProperty('--wr', `${clamp((tx - x) * 0.04, -5, 5).toFixed(2)}deg`);
    if (running) requestAnimationFrame(loop);
  };
  works.addEventListener('pointermove', (e) => {
    if (!finePointer.matches || e.pointerType !== 'mouse') return;
    tx = e.clientX + (e.clientX > window.innerWidth * 0.6 ? -240 : 240);
    ty = e.clientY;
    if (!running) {
      x = tx;
      y = ty;
      running = true;
      requestAnimationFrame(loop);
    }
  });
  $$('.work', works).forEach((item) =>
    item.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse') return;
      const i = Number(item.dataset.work);
      shots.forEach((s, n) => s.classList.toggle('is-active', n === i));
      preview.classList.add('is-on');
    }),
  );
  works.addEventListener('pointerleave', () => {
    preview.classList.remove('is-on');
    setTimeout(() => {
      if (!preview.classList.contains('is-on')) running = false;
    }, 600);
  });
}

/* =====================================================================
   5. NAVEGACIÓN: submenú y menú móvil
   ===================================================================== */
$$('[data-drop]').forEach((drop) => {
  const btn = $('.nav__drop-btn', drop);
  const set = (open) => {
    drop.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
  };
  btn.addEventListener('click', () => set(!drop.classList.contains('is-open')));
  drop.addEventListener('mouseenter', () => btn.setAttribute('aria-expanded', 'true'));
  drop.addEventListener('mouseleave', () => set(false));
  drop.addEventListener('focusout', (e) => {
    if (!drop.contains(e.relatedTarget)) set(false);
  });
  drop.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      set(false);
      btn.focus();
    }
  });
});

const menu = $('[data-menu]');
const openBtn = $('[data-menu-open]');
const closeBtn = $('[data-menu-close]');
function setMenu(open) {
  if (!menu) return;
  menu.classList.toggle('is-open', open);
  openBtn?.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) closeBtn?.focus();
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

/* =====================================================================
   6. CONTACTO, FORMULARIO Y CRÉDITOS
   ===================================================================== */
const extra = [];
if (CONTACT.phone) extra.push(['Teléfono', CONTACT.phone, `tel:${CONTACT.phone.replace(/\s/g, '')}`]);
if (CONTACT.email) extra.push(['Correo', CONTACT.email, `mailto:${CONTACT.email}`]);
if (CONTACT.whatsapp) extra.push(['WhatsApp', 'Escribir por WhatsApp', `https://wa.me/${CONTACT.whatsapp}`]);
const footerContact = $('[data-footer-contact]');
const detailsList = $('[data-details]');
extra.forEach(([label, text, href]) => {
  const link = () => Object.assign(document.createElement('a'), { href, textContent: text });
  if (footerContact) {
    const li = document.createElement('li');
    li.append(link());
    footerContact.insertBefore(li, footerContact.lastElementChild);
  }
  if (detailsList) {
    const div = document.createElement('div');
    const dt = Object.assign(document.createElement('dt'), { textContent: label });
    const dd = document.createElement('dd');
    dd.append(link());
    div.append(dt, dd);
    detailsList.append(div);
  }
});

// Puede haber dos formularios en la página (el de /contacto/ o el del pie): cada uno va por su cuenta
const tipo = new URLSearchParams(location.search).get('tipo');
$$('[data-form]').forEach((form) => {
  const statusBox = $('[data-form-status]', form);
  const submitBtn = $('[data-submit]', form);
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
  const status = (title, text) => {
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
      status(
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
      status('Solicitud enviada.', ' Gracias por escribirnos; nos pondremos en contacto contigo.');
    } catch {
      status('No se ha podido enviar.', ' Ha ocurrido un error de conexión. Inténtalo de nuevo en unos minutos.');
    } finally {
      submitBtn.disabled = false;
    }
  });
});

// Índice de las páginas de servicio: marca el apartado que se está leyendo
const toc = $('[data-toc]');
if (toc) {
  const links = $$('a', toc);
  const list = $('.toc__list', toc);
  const mark = (id) =>
    links.forEach((a) => {
      const on = a.hash === `#${id}`;
      if (on) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
      // En móvil el índice se desliza en horizontal: se lleva el enlace activo a la vista
      if (on && list.scrollWidth > list.clientWidth) list.scrollTo({ left: a.offsetLeft - 16, behavior: 'smooth' });
    });
  const tocIO = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && mark(e.target.id)),
    { rootMargin: '-40% 0px -55% 0px' },
  );
  links.forEach((a) => {
    const target = document.getElementById(a.hash.slice(1));
    if (target) tocIO.observe(target);
  });
}

const credits = $('[data-credits]');
if (credits) {
  const seen = new Set();
  Object.values(images).forEach(({ author, page }) => {
    if (seen.has(page)) return;
    seen.add(page);
    const li = document.createElement('li');
    const a = Object.assign(document.createElement('a'), { href: page, target: '_blank', rel: 'noopener', textContent: author });
    li.append(a, document.createTextNode(' / Unsplash'));
    credits.append(li);
  });
}

$$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

/* =====================================================================
   7. ARRANQUE
   Los titulares se parten cuando la fuente está lista (para medir bien las
   líneas); la entrada del hero empieza en el primer frame.
   ===================================================================== */
setupPin();
tick();
const fontsReady = Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))]);
fontsReady.then(() => {
  splitAll();
  observeReveals();
  setupPin();
  requestTick();
});
const ready = () => {
  if (root.classList.contains('is-ready')) return;
  root.classList.add('is-ready');
  setTimeout(() => root.classList.add('is-settled'), 1600);
};
requestAnimationFrame(() => requestAnimationFrame(ready));
setTimeout(ready, 700); // por si el navegador no pinta frames (pestaña en segundo plano, capturas)
// Al final: si algo falla antes, el <head> retira la clase .js y todo queda visible
window.__ta = true;
