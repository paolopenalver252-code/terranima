// Descarga las fotografías del manifiesto (CDN de Unsplash) y genera
// versiones AVIF + WebP en varios anchos dentro de public/img.
// Uso: npm run images   (las descargas se cachean en assets-src/raw)
// "quality" opcional por imagen en el manifiesto (texturas muy detalladas toleran menos calidad).
import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const rawDir = join(root, 'assets-src', 'raw');
const outDir = join(root, 'public', 'img');
const { images } = JSON.parse(await readFile(join(root, 'scripts', 'images.manifest.json'), 'utf8'));

await mkdir(rawDir, { recursive: true });
await mkdir(outDir, { recursive: true });

const exists = (p) => access(p).then(() => true, () => false);

async function download(url, name, attempts = 4) {
  for (let i = 1; ; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (err) {
      if (i >= attempts) throw new Error(`${name}: ${err.message}`);
      await new Promise((r) => setTimeout(r, 1500 * i));
    }
  }
}
const meta = {};

// "source" reutiliza el original de otra entrada y "extract" ({ left, top, width, height } en
// píxeles del original) recorta un encuadre distinto, p. ej. horizontal y vertical del hero.
for (const img of images) {
  const rawPath = join(rawDir, `${img.source ?? img.name}.jpg`);
  if (!(await exists(rawPath))) {
    const url = `https://images.unsplash.com/photo-${img.id}?fm=jpg&q=90&w=2600`;
    await writeFile(rawPath, await download(url, img.name));
  }

  const load = () => (img.extract ? sharp(rawPath).extract(img.extract) : sharp(rawPath));
  const { width, height } = img.extract ?? (await sharp(rawPath).metadata());
  const { dominant } = await load().stats();

  for (const w of img.widths) {
    const target = Math.min(w, width);
    const base = join(outDir, `${img.name}-${w}`);
    await load().resize({ width: target }).avif({ quality: img.quality ?? 52, effort: 5 }).toFile(`${base}.avif`);
    await load().resize({ width: target }).webp({ quality: img.quality ? img.quality + 22 : 74 }).toFile(`${base}.webp`);
  }

  meta[img.name] = {
    widths: img.widths,
    ratio: +(width / height).toFixed(4),
    color: `rgb(${dominant.r} ${dominant.g} ${dominant.b})`,
    author: img.author,
    page: img.page,
  };
  console.log(`✓ ${img.name} (${width}×${height})`);
}

await writeFile(join(root, 'src', 'images.json'), JSON.stringify(meta, null, 2));
console.log(`\n${images.length} imágenes → public/img`);
