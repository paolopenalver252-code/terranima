import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, loadEnv } from 'vite';

const root = new URL('.', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

// Entradas del build: index.html raíz, las páginas de primer nivel (estudio, servicios,
// contacto, créditos) y cada carpeta de /servicios con su index.html.
function pages() {
  const entries = { main: resolve(root, 'index.html') };
  for (const name of ['estudio', 'servicios', 'contacto', 'creditos']) {
    const file = resolve(root, name, 'index.html');
    if (existsSync(file)) entries[name] = file;
  }
  const dir = resolve(root, 'servicios');
  if (existsSync(dir)) {
    for (const d of readdirSync(dir, { withFileTypes: true })) {
      const file = resolve(dir, d.name, 'index.html');
      if (d.isDirectory() && existsSync(file)) entries[`servicio-${d.name}`] = file;
    }
  }
  return entries;
}

const ARROW =
  '<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

// 1) <!-- @include nombre clave=valor --> inserta partials/nombre.html sustituyendo {{clave}}.
// 2) %SITE_URL% se sustituye por VITE_SITE_URL (.env) para canonical, Open Graph y JSON-LD;
//    %ARROW% por el icono de flecha de los botones.
// 3) <img data-pic="nombre" sizes="..." alt="..."> se convierte en un <picture> AVIF/WebP
//    responsivo con dimensiones intrínsecas y color de fondo mientras carga (src/images.json).
function htmlTemplates(siteUrl) {
  const loadImages = () => JSON.parse(readFileSync(resolve(root, 'src/images.json'), 'utf8'));

  const include = (html) =>
    html.replace(/<!--\s*@include\s+([\w-]+)([^>]*?)-->/g, (_, name, rawParams) => {
      let partial = readFileSync(resolve(root, 'partials', `${name}.html`), 'utf8');
      for (const [, key, value] of rawParams.matchAll(/(\w+)=("[^"]*"|\S+)/g)) {
        partial = partial.replaceAll(`{{${key}}}`, value.replace(/^"|"$/g, ''));
      }
      return partial;
    });

  const pictures = (html) => {
    const images = loadImages();
    return html.replace(/<img\s+data-pic="([^"]+)"([^>]*)>/g, (_, name, rest) => {
      const img = images[name];
      if (!img) throw new Error(`Imagen desconocida: ${name}`);
      const sizesMatch = rest.match(/\ssizes="([^"]*)"/);
      const sizes = sizesMatch ? sizesMatch[1] : '100vw';
      const attrs = rest.replace(/\ssizes="[^"]*"/, '').trim();
      const srcset = (ext) => img.widths.map((w) => `/img/${name}-${w}.${ext} ${w}w`).join(', ');
      const fallbackW = img.widths[Math.min(1, img.widths.length - 1)];
      const width = 1600;
      const height = Math.round(width / img.ratio);
      return (
        `<picture>` +
        `<source type="image/avif" srcset="${srcset('avif')}" sizes="${sizes}">` +
        `<source type="image/webp" srcset="${srcset('webp')}" sizes="${sizes}">` +
        `<img src="/img/${name}-${fallbackW}.webp" width="${width}" height="${height}" ` +
        `style="--ph:${img.color}" ${attrs}>` +
        `</picture>`
      );
    });
  };

  return {
    name: 'html-templates',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) =>
        pictures(include(html).replaceAll('%SITE_URL%', siteUrl).replaceAll('%ARROW%', ARROW)),
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, root, '');
  const siteUrl = (env.VITE_SITE_URL || '').replace(/\/$/, '');

  return {
    plugins: [htmlTemplates(siteUrl)],
    build: {
      target: 'es2020',
      cssMinify: true,
      rollupOptions: {
        input: pages(),
      },
    },
  };
});
