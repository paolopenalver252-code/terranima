// Genera favicon PNG (apple-touch-icon) e imagen Open Graph provisionales.
// Uso: node scripts/brand-assets.mjs  (requiere haber ejecutado antes npm run images)
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = (f) => join(root, 'public', f);

await sharp(pub('favicon.svg')).resize(180, 180).png().toFile(pub('apple-touch-icon.png'));

const W = 1200;
const H = 630;
const overlay = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#14130f" stop-opacity="0.05"/>
      <stop offset="0.45" stop-color="#14130f" stop-opacity="0.2"/>
      <stop offset="1" stop-color="#14130f" stop-opacity="0.75"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect x="64" y="372" width="54" height="54" fill="none" stroke="#f3f0e9" stroke-width="3"/>
  <text x="91" y="407" text-anchor="middle" font-family="Consolas, monospace" font-size="20" font-weight="700" fill="#f3f0e9">CB</text>
  <text x="64" y="520" font-family="'Arial Narrow', Arial, sans-serif" font-size="96" font-weight="700" fill="#f3f0e9" letter-spacing="2">TERRA ANIMA</text>
  <text x="66" y="568" font-family="Consolas, monospace" font-size="22" fill="#f3f0e9" letter-spacing="3">CONSTRUCCIÓN · REFORMA · REHABILITACIÓN — LANZAROTE</text>
</svg>`);

await sharp(join(root, 'assets-src', 'raw', 'hero-timanfaya.jpg'))
  .resize(W, H, { fit: 'cover', position: 'centre' })
  .composite([{ input: overlay }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(pub('og-image.jpg'));

console.log('✓ apple-touch-icon.png, og-image.jpg');
