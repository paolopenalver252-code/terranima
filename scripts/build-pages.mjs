// Genera, a partir de content/:
// - servicios/<slug>/index.html (content/servicios.mjs);
// - partials/portfolio.html y proyectos/<slug>/index.html (content/proyectos.mjs);
// - public/sitemap.xml y public/robots.txt.
// Uso: npm run pages (también se ejecuta antes de dev y build).
import { mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { services } from '../content/servicios.mjs';
import { proyectos, referencias } from '../content/proyectos.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pad = (n) => String(n).padStart(2, '0');
const attr = (s) => s.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
const plain = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const out = async (path, html) => {
  await mkdir(dirname(join(root, path)), { recursive: true });
  await writeFile(join(root, path), html);
  console.log(`✓ ${path}`);
};

const summaries = {
  'obra-nueva': 'Viviendas y edificios de nueva planta, de la cimentación a los acabados.',
  reformas: 'Reformas integrales y parciales de viviendas y locales.',
  rehabilitacion: 'Recuperación de viviendas y edificios existentes.',
  'reparacion-y-conservacion': 'Humedades, fisuras, filtraciones y cuidado periódico del edificio.',
};
// Foto ancha de la cabecera de cada servicio.
const wide = {
  'obra-nueva': ['seq-4-terminada', 'Vivienda blanca de volúmenes cúbicos con jardín'],
  reformas: ['n-salon', 'Salón contemporáneo con grandes ventanales y sofá gris'],
  rehabilitacion: ['intro-cal-y-piedra', 'Muros encalados y piedra volcánica en una construcción tradicional de Lanzarote'],
  'reparacion-y-conservacion': ['n-lz-fachada-verde', 'Fachada encalada con contraventanas verdes en Lanzarote'],
};

const page = ({ title, description, path, ogTitle, jsonLd = '', body }) => `<!doctype html>
<!-- Generado por scripts/build-pages.mjs a partir de content/. No editar a mano. -->
<html lang="es">
  <head>
    <!-- @include head -->
    <title>${title}</title>
    <meta name="description" content="${attr(description)}" />
    <link rel="canonical" href="%SITE_URL%${path}" />
    <meta property="og:url" content="%SITE_URL%${path}" />
    <meta property="og:title" content="${attr(ogTitle)}" />
    <meta property="og:description" content="${attr(description)}" />${jsonLd}
  </head>

  <body>
    <!-- @include header -->

    <main id="contenido">${body}
    </main>

    <!-- @include footer-form -->
    <!-- @include footer -->
  </body>
</html>
`;

const ld = (obj) => `
    <script type="application/ld+json">
${JSON.stringify({ '@context': 'https://schema.org', ...obj }, null, 2)
  .split('\n')
  .map((l) => `      ${l}`)
  .join('\n')}
    </script>`;

/* =====================================================================
   SERVICIOS
   ===================================================================== */
const tiles = (items, render, cols = 2) => `
              <div class="tiles" data-stagger style="--cols: ${cols}">
${items.map(render).join('\n')}
              </div>`;

const blocks = {
  cards: (s) =>
    tiles(
      s.items,
      (it, i) => `                <article class="tile">
                  <span class="tile__num">${pad(i + 1)}</span>
                  <h3 class="tile__title">${it.title}</h3>
                  <p>${it.text}</p>
                </article>`,
    ),
  principles: (s) =>
    tiles(
      s.items,
      (it) => `                <article class="tile">
                  <h3 class="tile__title">${it.title}</h3>
                  <p>${it.text}</p>
                </article>`,
    ),
  compare: (s) =>
    tiles(
      s.items,
      (it) => `                <article class="tile">
                  <h3 class="tile__title">${it.title}</h3>
                  <p>${it.text}</p>
                  <p class="tile__label">Encaja cuando</p>
                  <ul class="checks">
${it.fits.map((f) => `                    <li>${f}</li>`).join('\n')}
                  </ul>
                  <p class="tile__note"><strong>Ten en cuenta:</strong> ${it.note}</p>
                </article>`,
    ),
  calendar: (s) =>
    tiles(
      s.items,
      (it) => `                <article class="tile">
                  <span class="tile__num">${it.when}</span>
                  <h3 class="tile__title">${it.title}</h3>
                  <p>${it.text}</p>
                </article>`,
      3,
    ),
  steps: (s) => `
              <ol class="numbered">
${s.items.map((it) => `                <li><h3>${it.title}</h3><p>${it.text}</p></li>`).join('\n')}
              </ol>`,
  checklist: (s) => `
              <ul class="checks${s.columns ? ' checks--cols' : ''}">
${s.items.map((it) => `                <li>${it}</li>`).join('\n')}
              </ul>`,
  panel: (s) => `
              <div class="media-row">
                <figure class="media-row__img">
                  <div class="ph reveal-img" style="--ar: 4 / 5"><img data-pic="${s.image}" sizes="(max-width: 899px) 100vw, 30vw" alt="${attr(s.alt)}" loading="lazy" decoding="async" /></div>
                  <figcaption>Imagen ilustrativa.</figcaption>
                </figure>
                <dl class="facts facts--stack">
${s.items.map((it) => `                  <div><dt>${it.title}</dt><dd>${it.text}</dd></div>`).join('\n')}
                </dl>
              </div>`,
  faq: (s) => `
              <div class="acc">
${s.items
  .map(
    (it) => `                <details class="acc__item" name="faq">
                  <summary>${it.q}</summary>
                  <div class="acc__body"><p>${it.a}</p></div>
                </details>`,
  )
  .join('\n')}
              </div>`,
};

const section = (s, i) => `
      <section class="section${i % 2 ? ' section--sand' : ''}" id="${s.id}" aria-labelledby="${s.id}-t">
        <div class="wrap block">
          <header class="block__head" data-reveal>
            <p class="eyebrow">${pad(i + 1)} · ${s.toc}</p>
            <h2 class="display-3" id="${s.id}-t">${s.title}</h2>${
              s.summary ? `\n            <p class="block__summary"><span>En breve</span>${s.summary}</p>` : ''
            }
          </header>
          <div class="block__body">${s.intro ? `\n            <p class="lead">${s.intro}</p>` : ''}${blocks[s.type](s)}${
            s.note ? `\n            <p class="block__note">${s.note}</p>` : ''
          }${
            s.aside
              ? `
            <aside class="tile tile--aside">
              <h3 class="tile__title">${s.aside.title}</h3>
              <p>${s.aside.text}</p>
            </aside>`
              : ''
          }
          </div>
        </div>
      </section>`;

function serviceLd(svc) {
  const url = `%SITE_URL%/servicios/${svc.slug}/`;
  const faq = svc.sections.find((s) => s.type === 'faq');
  const graph = [
    {
      '@type': 'Service',
      '@id': `${url}#servicio`,
      name: svc.name,
      serviceType: svc.serviceType,
      description: svc.metaDescription,
      url,
      areaServed: { '@type': 'Place', name: 'Lanzarote' },
      provider: { '@id': '%SITE_URL%/#empresa' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: '%SITE_URL%/' },
        { '@type': 'ListItem', position: 2, name: 'Servicios', item: '%SITE_URL%/servicios/' },
        { '@type': 'ListItem', position: 3, name: svc.name, item: url },
      ],
    },
  ];
  if (faq) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faq.items.map((it) => ({
        '@type': 'Question',
        name: plain(it.q),
        acceptedAnswer: { '@type': 'Answer', text: plain(it.a) },
      })),
    });
  }
  return ld({ '@graph': graph });
}

function servicePage(svc) {
  const others = services.filter((o) => o.slug !== svc.slug);
  const contact = `/contacto/?tipo=${encodeURIComponent(svc.select)}`;
  const [wideImg, wideAlt] = wide[svc.slug];
  return page({
    title: svc.metaTitle,
    description: svc.metaDescription,
    path: `/servicios/${svc.slug}/`,
    ogTitle: `${svc.name} ${svc.place} — CB Terra Anima`,
    jsonLd: serviceLd(svc),
    body: `
      <!-- REVISAR CON EL CLIENTE: contenido redactado a partir del objeto social y de información
           general del sector. Ver REVISION.md. -->
      <section class="phead" aria-labelledby="page-title">
        <div class="wrap phead__grid">
          <nav class="crumbs" aria-label="Ruta de navegación">
            <a href="/">Inicio</a><span aria-hidden="true">/</span><a href="/servicios/">Servicios</a><span aria-hidden="true">/</span><span aria-current="page">${svc.name}</span>
          </nav>
          <h1 class="display-1 phead__title" id="page-title">${svc.name} <em>${svc.place}</em></h1>
          <div class="phead__side">
            <p class="lead">${svc.hero.lead}</p>
            <div class="actions">
              <a class="btn btn--dark" href="${contact}">Solicitar valoración</a>
              <a class="link" href="#${svc.sections[0].id}">Ver el detalle</a>
            </div>
          </div>
        </div>
        <figure class="wrap phead__media">
          <div class="ph" style="--ar: 21 / 9"><img data-pic="${wideImg}" sizes="(max-width: 1520px) 100vw, 1440px" alt="${attr(wideAlt)}" fetchpriority="high" decoding="async" /></div>
          <figcaption>Imagen ilustrativa. No es una obra de CB Terra Anima.</figcaption>
        </figure>
        <div class="wrap keyfacts">
          <h2 class="keyfacts__title">En pocas palabras</h2>
          <dl class="keyfacts__list">
${svc.hero.facts.map(([dt, dd]) => `            <div><dt>${dt}</dt><dd>${dd}</dd></div>`).join('\n')}
          </dl>
        </div>
      </section>

      <!-- Índice de la página: queda fijo arriba al hacer scroll y marca el apartado que se está leyendo -->
      <nav class="toc" aria-label="En esta página" data-toc>
        <div class="wrap toc__inner">
          <span class="toc__label">En esta página</span>
          <ol class="toc__list">
${svc.sections.map((s, i) => `            <li><a href="#${s.id}"><span>${pad(i + 1)}</span>${s.toc}</a></li>`).join('\n')}
          </ol>
        </div>
      </nav>
${svc.sections.map(section).join('\n')}

      <!-- @include cta img="hero-timanfaya" title="${attr(svc.cta.title)}" text="${attr(svc.cta.text)}" href="${contact}" button="${attr(svc.cta.button)}" -->

      <section class="section" aria-labelledby="others-title">
        <div class="wrap">
          <p class="eyebrow" data-reveal>Otros servicios</p>
          <h2 class="sr-only" id="others-title">Otros servicios</h2>
          <ol class="index index--compact">
${others
  .map(
    (o) => `            <li class="index__row">
              <a class="index__link" href="/servicios/${o.slug}/">
                <span class="index__num">${o.num}</span>
                <span class="index__name">${o.name}</span>
                <span class="index__desc">${summaries[o.slug]}</span>
                <span class="index__arrow" aria-hidden="true"></span>
              </a>
            </li>`,
  )
  .join('\n')}
          </ol>
        </div>
      </section>`,
  });
}

/* =====================================================================
   PORTFOLIO
   ===================================================================== */
// Cada fila: índice, título grande, tipo y miniatura. En escritorio con ratón la miniatura se oculta y
// una vista previa sigue al cursor (src/main.js); en pantallas táctiles la miniatura se ve en la fila.
const row = ({ href, img, alt, type, meta, title }, i) => `            <li class="work" data-work="${i}">
              <a class="work__link" href="${href}">
                <span class="work__num">${pad(i + 1)}</span>
                <span class="work__title">${title}</span>
                <span class="work__meta"><span>${type}</span><span>${meta}</span></span>
                <span class="work__arrow" aria-hidden="true"></span>
                <span class="work__thumb ph"><img data-pic="${img}" sizes="(max-width: 899px) 100vw, 30vw" alt="${attr(alt)}" loading="lazy" decoding="async" /></span>
              </a>
            </li>`;

const items = () =>
  proyectos.length
    ? proyectos.map((p) => ({ href: `/proyectos/${p.slug}/`, img: p.cover, alt: p.alt, type: p.type, meta: p.place, title: p.name }))
    : referencias.map((r) => ({ href: r.href, img: r.img, alt: r.alt, type: r.type, meta: 'Referencia visual', title: r.title }));

const portfolio = () => {
  const list = items();
  return `<!-- Generado por scripts/build-pages.mjs a partir de content/proyectos.mjs. No editar a mano. -->
      <section class="works" id="proyectos" data-theme="light" data-bg-shift aria-labelledby="proyectos-title">
        <div class="wrap">
          <div class="works__head">
            <div>
              <p class="label" data-reveal>Proyectos</p>
              <h2 class="display-2" id="proyectos-title">${proyectos.length ? 'Obras en <em>Lanzarote</em>' : 'Arquitectura que pertenece <em>a la isla</em>'}</h2>
            </div>
            <p class="works__note" data-reveal>${
              proyectos.length
                ? 'Una selección de obras de CB Terra Anima. Cada ficha recoge el lugar, el tipo de intervención y las fotografías del resultado.'
                : 'Las obras de CB Terra Anima se publicarán aquí, cada una con su ficha y fotografía propia. Mientras tanto, estas imágenes muestran la arquitectura y el tipo de intervención con los que trabajamos: son <strong>referencias visuales</strong>, no proyectos de la empresa.'
            }</p>
          </div>
          <ol class="works__list" data-works>
${list.map(row).join('\n')}
          </ol>
          <div class="works__preview" data-works-preview aria-hidden="true">
${list.map((it, i) => `            <div class="works__shot" data-shot="${i}"><img data-pic="${it.img}" sizes="30vw" alt="" loading="lazy" decoding="async" /></div>`).join('\n')}
          </div>
        </div>
      </section>
`;
};

function projectPage(p) {
  return page({
    title: `${p.name} — Proyecto de CB Terra Anima en ${p.place}`,
    description: p.summary,
    path: `/proyectos/${p.slug}/`,
    ogTitle: `${p.name} — CB Terra Anima`,
    body: `
      <section class="phead" aria-labelledby="page-title">
        <div class="wrap phead__grid">
          <nav class="crumbs" aria-label="Ruta de navegación">
            <a href="/">Inicio</a><span aria-hidden="true">/</span><a href="/#proyectos">Proyectos</a><span aria-hidden="true">/</span><span aria-current="page">${p.name}</span>
          </nav>
          <h1 class="display-1 phead__title" id="page-title">${p.name}</h1>
          <div class="phead__side">
            <p class="eyebrow">${p.type} · ${p.place}${p.year ? ` · ${p.year}` : ''}</p>
            <p class="lead">${p.summary}</p>
          </div>
        </div>
        <figure class="wrap phead__media">
          <div class="ph" style="--ar: 16 / 9"><img data-pic="${p.cover}" sizes="(max-width: 1520px) 100vw, 1440px" alt="${attr(p.alt)}" fetchpriority="high" decoding="async" /></div>
        </figure>
      </section>

      <section class="section">
        <div class="wrap block">
          <header class="block__head">
            <p class="eyebrow">La obra</p>
            <dl class="facts facts--stack">
              <div><dt>Tipo</dt><dd>${p.type}</dd></div>
              <div><dt>Lugar</dt><dd>${p.place}</dd></div>
${(p.facts ?? []).map(([dt, dd]) => `              <div><dt>${dt}</dt><dd>${dd}</dd></div>`).join('\n')}
            </dl>
          </header>
          <div class="block__body">
${p.body.map((t) => `            <p class="lead">${t}</p>`).join('\n')}
          </div>
        </div>
        <div class="wrap gallery">
${(p.gallery ?? [])
  .map(
    ([img, alt]) => `          <figure class="ph reveal-img"><img data-pic="${img}" sizes="(max-width: 899px) 100vw, 50vw" alt="${attr(alt)}" loading="lazy" decoding="async" /></figure>`,
  )
  .join('\n')}
        </div>${p.credit ? `\n        <p class="wrap gallery__credit">${p.credit}</p>` : ''}
      </section>

      <!-- @include cta img="hero-timanfaya" title="¿Tienes un proyecto parecido?" text="Cuéntanos qué quieres construir, reformar o rehabilitar y dónde está el inmueble." href="/contacto/" button="Cuéntanos tu proyecto" -->`,
  });
}

/* =====================================================================
   ESCRITURA
   ===================================================================== */
for (const svc of services) await out(`servicios/${svc.slug}/index.html`, servicePage(svc));

await out('partials/portfolio.html', portfolio());
await rm(join(root, 'proyectos'), { recursive: true, force: true });
for (const p of proyectos) await out(`proyectos/${p.slug}/index.html`, projectPage(p));

const site = (process.env.VITE_SITE_URL || (await readEnvSite())).replace(/\/$/, '');
const urls = [
  '/',
  '/estudio/',
  '/servicios/',
  ...services.map((s) => `/servicios/${s.slug}/`),
  ...proyectos.map((p) => `/proyectos/${p.slug}/`),
  '/contacto/',
  '/creditos/',
];
const today = new Date().toISOString().slice(0, 10);
await writeFile(
  join(root, 'public', 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${site}${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`,
);
await writeFile(join(root, 'public', 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`);
console.log('✓ public/sitemap.xml, public/robots.txt');

async function readEnvSite() {
  try {
    const env = await readFile(join(root, '.env'), 'utf8');
    return env.match(/^VITE_SITE_URL=(.*)$/m)?.[1].trim() ?? '';
  } catch {
    return '';
  }
}
