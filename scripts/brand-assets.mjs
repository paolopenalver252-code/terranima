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
      <stop offset="0" stop-color="#10211b" stop-opacity="0.25"/>
      <stop offset="0.5" stop-color="#10211b" stop-opacity="0.4"/>
      <stop offset="1" stop-color="#10211b" stop-opacity="0.85"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <text x="64" y="420" font-family="Impact, 'Arial Narrow', sans-serif" font-size="20" fill="#fc6214" letter-spacing="1">CONSTRUCCIÓN, REFORMA Y REHABILITACIÓN · LANZAROTE</text>
  <text x="60" y="540" font-family="Impact, 'Arial Narrow', sans-serif" font-size="130" fill="#ffffff">TERRA ANIMA</text>
  <text x="748" y="468" font-family="Impact, 'Arial Narrow', sans-serif" font-size="40" fill="#ffffff">CB</text>
</svg>`);

await sharp(join(root, 'assets-src', 'raw', 'hero-timanfaya.jpg'))
  .resize(W, H, { fit: 'cover', position: 'centre' })
  .composite([{ input: overlay }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(pub('og-image.jpg'));

console.log('✓ apple-touch-icon.png, og-image.jpg');
