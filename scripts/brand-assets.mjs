// Genera favicon PNG (apple-touch-icon) e imagen Open Graph provisionales.
// Uso: node scripts/brand-assets.mjs  (requiere haber ejecutado antes npm run images)
// El SVG se rasteriza con las fuentes del sistema: Georgia hace de serif editorial.
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
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#131412" stop-opacity="0.94"/>
      <stop offset="0.58" stop-color="#131412" stop-opacity="0.82"/>
      <stop offset="0.86" stop-color="#131412" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <text x="64" y="86" font-family="'Segoe UI', Arial, sans-serif" font-size="15" font-weight="700" fill="#d9805c" letter-spacing="2.5">CB</text>
  <text x="98" y="88" font-family="Georgia, serif" font-size="34" fill="#ffffff">Terra Anima</text>
  <text x="64" y="220" font-family="Georgia, serif" font-size="66" fill="#ffffff">Construir con sentido.</text>
  <text x="64" y="298" font-family="Georgia, serif" font-size="66" font-style="italic" fill="#c8b393">Integrar con el entorno.</text>
  <text x="66" y="352" font-family="'Segoe UI', Arial, sans-serif" font-size="22" fill="#ffffff">Obra nueva, reformas y rehabilitación en Lanzarote</text>
</svg>`);

// Mismo encuadre que la foto principal de la portada (hero-lz en scripts/images.manifest.json)
await sharp(join(root, 'assets-src', 'raw', 'n-lz-casa-volcan.jpg'))
  .extract({ left: 0, top: 1100, width: 2600, height: 1680 })
  .resize(W, H, { fit: 'cover', position: 'top' })
  .composite([{ input: overlay }])
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(pub('og-image.jpg'));

console.log('✓ apple-touch-icon.png, og-image.jpg');
