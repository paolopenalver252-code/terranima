// Genera servicios/<slug>/index.html a partir de content/servicios.mjs con la maqueta de
// "detalle de proyecto": cabecera con título, entradilla y foto ancha; ficha lateral fija y
// cuerpo de artículo; llamada a la acción y otros servicios.
// Uso: npm run pages (también se ejecuta antes de dev y build).
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { services } from '../content/servicios.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pad = (n) => String(n).padStart(2, '0');
const attr = (s) => s.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
const plain = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const ARROW = '%ARROW%';

const summaries = {
  'obra-nueva': 'Construcción completa de viviendas y edificios, de la cimentación a los acabados.',
  reformas: 'Reformas integrales y parciales de viviendas y locales.',
  rehabilitacion: 'Recuperación de viviendas y edificios existentes.',
  'reparacion-y-conservacion': 'Atención al desgaste y a los daños del edificio.',
};
const tags = {
  'obra-nueva': ['Viviendas', 'Edificios'],
  reformas: ['Integral', 'Parcial'],
  rehabilitacion: ['Existente', 'Tradicional'],
  'reparacion-y-conservacion': ['Reparación', 'Mantenimiento'],
};
// Foto ancha de la cabecera (distinta de la principal para no repetir la del índice).
const wide = {
  'obra-nueva': 'n-encofrado',
  reformas: 'n-salon',
  rehabilitacion: 'n-muro-piedra',
  'reparacion-y-conservacion': 'n-enlucido',
};

/* ---------- Bloques del cuerpo ---------- */
const blocks = {
  cards: (s) => `
                <div class="mini-cards">
${s.items
  .map(
    (it, i) => `                  <article class="mini-card">
                    <span class="label--orange display">${pad(i + 1)}</span>
                    <h3>${it.title}</h3>
                    <p>${it.text}</p>
                  </article>`,
  )
  .join('\n')}
                </div>`,

  steps: (s) => `
                <ol class="rows">
${s.items
  .map(
    (it, i) => `                  <li>
                    <span class="n" aria-hidden="true">${pad(i + 1)}</span>
                    <div><h3>${it.title}</h3><p>${it.text}</p></div>
                  </li>`,
  )
  .join('\n')}
                </ol>`,

  principles: (s) => `
                <div class="mini-cards">
${s.items
  .map(
    (it) => `                  <article class="mini-card">
                    <h3>${it.title}</h3>
                    <p>${it.text}</p>
                  </article>`,
  )
  .join('\n')}
                </div>`,

  compare: (s) => `
                <div class="mini-cards">
${s.items
  .map(
    (it) => `                  <article class="mini-card">
                    <h3>${it.title}</h3>
                    <p>${it.text}</p>
                    <p class="slash">// Encaja cuando</p>
                    <ul class="checks">
${it.fits.map((f) => `                      <li>${f}</li>`).join('\n')}
                    </ul>
                    <p><strong>Ten en cuenta:</strong> ${it.note}</p>
                  </article>`,
  )
  .join('\n')}
                </div>`,

  checklist: (s) => `
                <ul class="checks">
${s.items.map((it) => `                  <li>${it}</li>`).join('\n')}
                </ul>`,

  calendar: (s) => `
                <ol class="rows">
${s.items
  .map(
    (it) => `                  <li>
                    <span class="n n--text" aria-hidden="true">·</span>
                    <div><p class="slash">// ${it.when}</p><h3>${it.title}</h3><p>${it.text}</p></div>
                  </li>`,
  )
  .join('\n')}
                </ol>`,

  panel: (s) => `
                <div class="ctx">
                  <div class="img"><img data-pic="${s.image}" sizes="(max-width: 809px) 100vw, 200px" alt="${attr(s.alt)}" loading="lazy" decoding="async" /></div>
                  <ul>
${s.items
  .map(
    (it) => `                    <li><h3>${it.title}</h3><p>${it.text}</p></li>`,
  )
  .join('\n')}
                  </ul>
                </div>`,

  faq: (s) => `
                <div class="acc acc--compact" data-acc>
${s.items
  .map(
    (it, i) => `                  <div class="acc__item${i === 0 ? ' is-open' : ''}">
                    <h3><button class="acc__q" type="button" aria-expanded="${i === 0}">${it.q}<span class="acc__icon" aria-hidden="true"></span></button></h3>
                    <div class="acc__a"><div><p class="t-body">${it.a}</p></div></div>
                  </div>`,
  )
  .join('\n')}
                </div>`,
};

const section = (s, i) => `
              <section class="block" id="${s.id}" aria-labelledby="${s.id}-t" data-appear>
                <p class="label">[${pad(i + 1)} · ${s.toc}]</p>
                <h2 id="${s.id}-t">${s.title}</h2>${s.intro ? `\n                <p>${s.intro}</p>` : ''}${blocks[s.type](s)}${
                  s.note ? `\n                <p class="pull">${s.note}</p>` : ''
                }${
                  s.aside
                    ? `
                <aside class="mini-card">
                  <p class="slash">// ${s.aside.title}</p>
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
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2)
    .split('\n')
    .map((l) => `      ${l}`)
    .join('\n');
}

/* ---------- Página ---------- */
function page(svc) {
  const next = services[(services.indexOf(svc) + 1) % services.length];
  const contact = `/contacto/?tipo=${encodeURIComponent(svc.select)}`;
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

  <body class="page-inner page-service">
    <!-- @include menu -->

    <main id="contenido">
      <!-- REVISAR CON EL CLIENTE: contenido redactado a partir del objeto social y de información
           general del sector. Ver REVISION.md. -->
      <section class="phero" aria-labelledby="page-title">
        <div class="container">
          <!-- @include header logo="logo--small" -->
          <div class="phero__content">
            <div>
              <nav class="crumbs label label--orange" aria-label="Ruta de navegación">
                <a href="/servicios/">Servicios</a> <span aria-hidden="true">/</span> <span aria-current="page">Servicio ${svc.num}</span>
              </nav>
              <h1 class="phero__title chars" id="page-title">${svc.name}</h1>
            </div>
            <div class="phero__lead-row" data-appear>
              <p class="phero__lead">${svc.hero.lead}</p>
              <ul class="tags tags--light">${tags[svc.slug].map((t) => `<li class="tag">${t}</li>`).join('')}</ul>
            </div>
            <figure class="phero__fig" data-appear="scale">
              <div class="img phero__photo phero__photo--tall"><img data-pic="${wide[svc.slug]}" sizes="(max-width: 1440px) 100vw, 1245px" alt="" fetchpriority="high" decoding="async" /></div>
              <figcaption class="caption">Imagen ilustrativa. No es una obra de CB Terra Anima.</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container project">
          <aside class="project__details" aria-label="Ficha del servicio">
            <dl class="work__details">
${svc.hero.facts.map(([dt, dd]) => `              <div><dt class="slash">// ${dt}</dt><dd>${dd}</dd></div>`).join('\n')}
              <div><dt class="slash">// Zona</dt><dd>Lanzarote</dd></div>
            </dl>
            <nav class="toc" aria-label="En esta página">
              <p class="slash">// En esta página</p>
              <ol>
${svc.sections.map((s, i) => `                <li><a href="#${s.id}"><span>${pad(i + 1)}</span>${s.toc}</a></li>`).join('\n')}
              </ol>
            </nav>
            <a class="btn" href="${contact}"><span class="btn__label">Solicitar valoración</span>${ARROW}</a>
          </aside>

          <div class="project__story">
            <figure class="project__lead-img" data-appear>
              <div class="img"><img data-pic="${svc.hero.image}" sizes="(max-width: 1199px) 100vw, 704px" alt="${attr(svc.hero.alt)}" loading="lazy" decoding="async" /></div>
              <figcaption class="caption">Imagen ilustrativa.</figcaption>
            </figure>
${svc.sections.map(section).join('\n')}

              <section class="svc-cta" aria-labelledby="cta-title" data-appear>
                <p class="label label--orange">Siguiente paso</p>
                <h2 id="cta-title">${svc.cta.title}</h2>
                <p class="t-body">${svc.cta.text}</p>
                <a class="btn" href="${contact}"><span class="btn__label">${svc.cta.button}</span>${ARROW}</a>
              </section>
          </div>
        </div>
      </section>

      <nav class="next section section--top-line" aria-labelledby="next-title">
        <div class="container">
          <p class="label label--orange">[Siguiente servicio]</p>
          <h2 class="t-section next__title" id="next-title"><a href="/servicios/${next.slug}/">${next.name}</a></h2>
          <p class="t-body-l next__desc">${summaries[next.slug]}</p>
          <a class="link-arrow" href="/servicios/"><span class="btn__label">Ver todos los servicios</span>${ARROW}</a>
        </div>
      </nav>
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
const urls = ['/', '/estudio/', '/servicios/', ...services.map((s) => `/servicios/${s.slug}/`), '/contacto/', '/creditos/'];
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
