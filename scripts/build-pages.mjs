// Genera servicios/<slug>/index.html a partir de content/servicios.mjs.
// Uso: npm run pages (también se ejecuta antes de dev y build).
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { services } from '../content/servicios.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pad = (n) => String(n).padStart(2, '0');
const attr = (s) => s.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
const plain = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const letters = 'ABCDEFGH';

// Cuerpo del título (en unidades del contenedor) para que la palabra más larga quepa:
// en Archivo condensada en mayúsculas cada carácter ocupa ≈ 0,5 em.
const fit = (name) => {
  const longest = Math.max(...name.split(' ').map((w) => w.length));
  return `${Math.min(30, 100 / (longest * 0.5)).toFixed(1)}cqi`;
};

const summaries = {
  'obra-nueva': 'Construcción completa de viviendas y edificios.',
  reformas: 'Reformas integrales y parciales de viviendas y locales.',
  rehabilitacion: 'Recuperación de viviendas y edificios existentes.',
  'reparacion-y-conservacion': 'Atención al desgaste y a los daños del edificio.',
};

/* ---------- Componentes de sección ---------- */
const blocks = {
  cards: (s) => `
            <ul class="svc-cards" data-stagger>
${s.items
  .map(
    (it, i) => `              <li class="svc-card">
                <span class="mono svc-card__key">${letters[i]}</span>
                <h3 class="svc-card__title">${it.title}</h3>
                <p>${it.text}</p>
              </li>`,
  )
  .join('\n')}
            </ul>`,

  steps: (s) => `
            <ol class="svc-steps">
${s.items
  .map(
    (it, i) => `              <li class="svc-step" data-fade>
                <span class="svc-step__num" aria-hidden="true">${pad(i + 1)}</span>
                <div>
                  <h3 class="svc-step__title">${it.title}</h3>
                  <p>${it.text}</p>
                </div>
              </li>`,
  )
  .join('\n')}
            </ol>`,

  principles: (s) => `
            <ul class="svc-principles" data-stagger>
${s.items
  .map(
    (it) => `              <li>
                <h3 class="svc-principles__title">${it.title}</h3>
                <p>${it.text}</p>
              </li>`,
  )
  .join('\n')}
            </ul>`,

  compare: (s) => `
            <div class="svc-compare" data-stagger>
${s.items
  .map(
    (it) => `              <article class="svc-compare__item">
                <h3 class="svc-compare__title">${it.title}</h3>
                <p>${it.text}</p>
                <p class="mono svc-compare__label">Encaja cuando</p>
                <ul class="svc-compare__fits">
${it.fits.map((f) => `                  <li>${f}</li>`).join('\n')}
                </ul>
                <p class="svc-compare__note"><strong>Ten en cuenta:</strong> ${it.note}</p>
              </article>`,
  )
  .join('\n')}
            </div>`,

  checklist: (s) => `
            <ul class="svc-check${s.columns ? ' svc-check--cols' : ''}" data-stagger>
${s.items.map((it) => `              <li>${it}</li>`).join('\n')}
            </ul>`,

  calendar: (s) => `
            <ol class="svc-calendar" data-stagger>
${s.items
  .map(
    (it) => `              <li>
                <p class="mono svc-calendar__when">${it.when}</p>
                <h3 class="svc-calendar__title">${it.title}</h3>
                <p>${it.text}</p>
              </li>`,
  )
  .join('\n')}
            </ol>`,

  panel: (s) => `
            <div class="svc-panel__grid">
              <figure class="svc-panel__media" data-reveal="clip" data-dir="left">
                <div class="media media--4x5" data-scale>
                  <img data-pic="${s.image}" sizes="(min-width: 960px) 26vw, 100vw" alt="${attr(s.alt)}" loading="lazy" decoding="async" />
                </div>
                <figcaption class="caption">Imagen ilustrativa</figcaption>
              </figure>
              <ul class="svc-panel__list" data-stagger>
${s.items
  .map(
    (it) => `                <li>
                  <h3 class="svc-panel__title">${it.title}</h3>
                  <p>${it.text}</p>
                </li>`,
  )
  .join('\n')}
              </ul>
            </div>`,

  faq: (s) => `
            <div class="faq">
${s.items
  .map(
    (it) => `              <details class="faq__item">
                <summary><span>${it.q}</span><span class="faq__icon" aria-hidden="true"></span></summary>
                <div class="faq__answer"><p>${it.a}</p></div>
              </details>`,
  )
  .join('\n')}
            </div>`,
};

const section = (s, i) => `
          <section class="svc-sec svc-sec--${s.type}" id="${s.id}" aria-labelledby="${s.id}-t">
            <p class="label"><span class="label__num">${pad(i + 1)}</span> ${s.toc}</p>
            <h2 class="svc-sec__title" id="${s.id}-t" data-lines>${s.title}</h2>${
              s.intro ? `\n            <p class="svc-sec__intro" data-fade>${s.intro}</p>` : ''
            }${blocks[s.type](s)}${s.note ? `\n            <p class="svc-sec__note" data-fade>${s.note}</p>` : ''}${
              s.aside
                ? `
            <aside class="svc-aside" data-fade>
              <p class="mono svc-aside__title">${s.aside.title}</p>
              <p>${s.aside.text}</p>
            </aside>`
                : ''
            }
          </section>`;

/* ---------- Datos estructurados ---------- */
function jsonLd(svc) {
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
      provider: {
        '@type': 'GeneralContractor',
        '@id': '%SITE_URL%/#empresa',
        name: 'CB Terra Anima',
        url: '%SITE_URL%/',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Arrecife',
          addressRegion: 'Las Palmas',
          postalCode: '35500',
          addressCountry: 'ES',
        },
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: '%SITE_URL%/' },
        { '@type': 'ListItem', position: 2, name: 'Servicios', item: '%SITE_URL%/#servicios' },
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
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2)
    .split('\n')
    .map((l) => `      ${l}`)
    .join('\n');
}

/* ---------- Página ---------- */
function page(svc) {
  const others = services.filter((o) => o.slug !== svc.slug);
  const first = svc.sections[0].id;
  return `<!doctype html>
<!-- Generado por scripts/build-pages.mjs a partir de content/servicios.mjs. No editar a mano. -->
<html lang="es">
  <head>
    <!-- @include head -->
    <title>${svc.metaTitle}</title>
    <meta name="description" content="${attr(svc.metaDescription)}" />
    <link rel="canonical" href="%SITE_URL%/servicios/${svc.slug}/" />
    <meta property="og:url" content="%SITE_URL%/servicios/${svc.slug}/" />
    <meta property="og:title" content="${attr(`${svc.name} ${svc.place} — CB Terra Anima`)}" />
    <meta property="og:description" content="${attr(svc.metaDescription)}" />
    <script type="application/ld+json">
${jsonLd(svc)}
    </script>
  </head>

  <body class="page-service" data-service-type="${attr(svc.select)}">
    <!-- @include header -->

    <main id="contenido">
      <!-- REVISAR CON EL CLIENTE: contenido redactado a partir del objeto social y de información
           general del sector. Ver REVISION.md. -->
      <section class="svc-hero" id="top" aria-labelledby="svc-title">
        <div class="container svc-hero__grid">
          <div class="svc-hero__text">
            <nav class="crumbs mono" aria-label="Ruta de navegación" data-intro>
              <ol>
                <li><a href="/">Inicio</a></li>
                <li><a href="/#servicios">Servicios</a></li>
                <li aria-current="page">${svc.name}</li>
              </ol>
            </nav>
            <h1 class="svc-hero__title" id="svc-title" style="--fit: ${fit(svc.name)}">
              <span class="line"><span>${svc.name}</span></span>
              <span class="svc-hero__place" data-intro>${svc.place}</span>
            </h1>
            <p class="svc-hero__lead" data-intro>${svc.hero.lead}</p>
            <div class="svc-hero__ctas" data-intro>
              <a class="btn btn--primary" href="#contacto">
                <span class="btn__label">Solicitar valoración</span>
                <span class="btn__arrow" aria-hidden="true">→</span>
              </a>
              <a class="link-arrow" href="#${first}">Ver el detalle <span aria-hidden="true">↓</span></a>
            </div>
            <dl class="svc-hero__facts" data-intro>
${svc.hero.facts
  .map(
    ([dt, dd]) => `              <div>
                <dt>${dt}</dt>
                <dd>${dd}</dd>
              </div>`,
  )
  .join('\n')}
            </dl>
          </div>
          <figure class="svc-hero__media" data-reveal="clip" data-dir="up">
            <div class="media media--4x5" data-scale>
              <img data-pic="${svc.hero.image}" sizes="(min-width: 960px) 40vw, 100vw" alt="${attr(svc.hero.alt)}" fetchpriority="high" decoding="async" />
            </div>
            <figcaption class="caption">Imagen ilustrativa · No es una obra de CB Terra Anima</figcaption>
          </figure>
        </div>
      </section>

      <div class="svc-body">
        <div class="container svc-body__grid">
          <aside class="svc-toc" aria-labelledby="toc-title">
            <p class="mono svc-toc__title" id="toc-title">En esta página</p>
            <ol class="svc-toc__list">
${svc.sections.map((s, i) => `              <li><a href="#${s.id}" data-toc><span class="mono">${pad(i + 1)}</span>${s.toc}</a></li>`).join('\n')}
            </ol>
            <a class="btn btn--primary btn--sm svc-toc__cta" href="#contacto">
              <span class="btn__label">Solicitar valoración</span>
            </a>
          </aside>

          <div class="svc-content">${svc.sections.map(section).join('\n')}
          </div>
        </div>
      </div>

      <section class="svc-cta" aria-labelledby="cta-title">
        <div class="container svc-cta__inner">
          <h2 class="svc-cta__title" id="cta-title" data-lines>${svc.cta.title}</h2>
          <div class="svc-cta__body">
            <p data-fade>${svc.cta.text}</p>
            <a class="btn btn--light" href="#contacto" data-fade>
              <span class="btn__label">${svc.cta.button}</span>
              <span class="btn__arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      <nav class="svc-others" aria-labelledby="others-title">
        <div class="container">
          <p class="label" id="others-title"><span class="label__num">+</span> Otros servicios</p>
          <ul class="svc-others__list">
${others
  .map(
    (o) => `            <li>
              <a href="/servicios/${o.slug}/">
                <span class="svc-others__num">${o.num}.</span>
                <span class="svc-others__name">${o.name}</span>
                <span class="svc-others__desc">${summaries[o.slug]}</span>
                <span class="svc-others__arrow" aria-hidden="true">→</span>
              </a>
            </li>`,
  )
  .join('\n')}
          </ul>
        </div>
      </nav>

      <!-- @include contact num=${pad(svc.sections.length + 1)} -->
    </main>

    <!-- @include footer -->
  </body>
</html>
`;
}

for (const svc of services) {
  const out = join(root, 'servicios', svc.slug, 'index.html');
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, page(svc));
  console.log(`✓ servicios/${svc.slug}/`);
}

/* ---------- sitemap.xml y robots.txt ---------- */
const site = (process.env.VITE_SITE_URL || (await readEnvSite())).replace(/\/$/, '');
const urls = ['/', ...services.map((s) => `/servicios/${s.slug}/`)];
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
  const { readFile } = await import('node:fs/promises');
  try {
    const env = await readFile(join(root, '.env'), 'utf8');
    return env.match(/^VITE_SITE_URL=(.*)$/m)?.[1].trim() ?? '';
  } catch {
    return '';
  }
}
