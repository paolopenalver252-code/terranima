import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';

// Expande <img data-pic="nombre" sizes="..." alt="..."> en un <picture>
// con fuentes AVIF/WebP responsivas, dimensiones intrínsecas y color de fondo
// mientras carga. Los datos salen de src/images.json (npm run images).
function responsivePictures() {
  const load = () => JSON.parse(readFileSync(new URL('./src/images.json', import.meta.url), 'utf8'));

  return {
    name: 'responsive-pictures',
    transformIndexHtml(html) {
      const images = load();
      return html.replace(/<img\s+data-pic="([^"]+)"([^>]*)>/g, (_, name, rest) => {
        const img = images[name];
        if (!img) throw new Error(`Imagen desconocida en index.html: ${name}`);

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
    },
  };
}

export default defineConfig({
  plugins: [responsivePictures()],
  build: {
    target: 'es2020',
    cssMinify: true,
  },
});
