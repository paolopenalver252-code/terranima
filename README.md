# CB Terra Anima — web

Web de CB Terra Anima (construcción, reformas, rehabilitación, reparación y conservación en
Lanzarote). HTML + CSS + JavaScript sin frameworks, empaquetado con Vite.

## Comandos

```bash
npm install
npm run dev       # genera páginas y arranca el servidor en http://localhost:5173
npm run build     # genera páginas y hace el build de producción en dist/
npm run preview   # sirve dist/ para comprobar la build
npm run pages     # solo regenera las páginas generadas, sitemap.xml y robots.txt
npm run images    # descarga y regenera las imágenes optimizadas (AVIF + WebP)
node scripts/brand-assets.mjs   # regenera apple-touch-icon.png y og-image.jpg
```

## Páginas

| URL | Origen |
| --- | --- |
| `/` | `index.html` (la sección «Proyectos» se genera en `partials/portfolio.html`) |
| `/estudio/` (Empresa) | `estudio/index.html` |
| `/servicios/` | `servicios/index.html` |
| `/servicios/obra-nueva/`, `/reformas/`, `/rehabilitacion/`, `/reparacion-y-conservacion/` | Generadas desde `content/servicios.mjs` |
| `/proyectos/<slug>/` | Generadas desde `content/proyectos.mjs` (ahora no hay ninguna) |
| `/contacto/` | `contacto/index.html` |
| `/creditos/` | `creditos/index.html` |

## Contenido editable

- **Servicios:** `content/servicios.mjs`. Las preguntas frecuentes generan también el JSON-LD `FAQPage`.
- **Proyectos:** `content/proyectos.mjs`. El archivo documenta los campos de cada obra. Mientras la
  lista `proyectos` esté vacía, la portada muestra `referencias` (imágenes de arquitectura marcadas
  como «referencia visual»). Al añadir el primer proyecto real, la portada pasa a mostrar los proyectos
  y se genera una ficha por obra en `/proyectos/<slug>/`, incluida en el sitemap.
- **Contacto:** `src/config.js` (teléfono, correo, WhatsApp y endpoint del formulario). Los datos se
  muestran solos en el pie y en `/contacto/` en cuanto se rellenan.
- **Vídeo del hero:** `HERO_VIDEO` en `src/config.js`. Ahora usa el reproductor de Vimeo del vídeo
  «Cinematic Construction Process Time-lapse» (CC0, generado con IA), insertado en modo fondo y con
  `dnt=1` (sin cookies de seguimiento). Un archivo propio en `public/video/` (`mp4`, opcional `webm` y
  `poster`) tiene prioridad sobre Vimeo. Empieza en el segundo `start` (23) y cada vuelta del bucle
  vuelve a ese punto. Mientras carga, sin vídeo, con movimiento reducido o con ahorro de datos, el hero
  queda sobre fondo de basalto. El encuadre del archivo propio se ajusta con `--hero-focus`.

No edites a mano los HTML de `servicios/<slug>/`, `proyectos/` ni `partials/portfolio.html`: se sobrescriben.

## Sistema visual

Definido en `:root` de `src/styles.css`:

| Token | Valor | Uso |
| --- | --- | --- |
| `--basalto` / `--basalto-2` / `--ceniza` | `#131412` / `#1c1d1a` / `#2b2c28` | Hero, materiales, contacto, pie y cabeceras interiores |
| `--cal` / `--hueso` / `--arena` | `#efe9df` / `#f7f3ec` / `#e3d9c8` | Superficies claras (la arena solo como fondo de foto mientras carga) |
| `--text` / `--muted` | `#36352f` / `#69655b` | Texto sobre claro |
| `--almagre` / `--almagre-claro` | `#a3472a` / `#d9805c` | Acento (tierra roja volcánica) sobre claro / oscuro: cursivas, botones, foco |
| `--toba` | `#c8b393` | Detalles y cursivas sobre oscuro |
| `--sans` | Bricolage Grotesque (variable, ancho 78 % en titulares) | Titulares, textos, botones y etiquetas |
| `--serif` | Instrument Serif cursiva | Palabras destacadas dentro de los titulares |

Contraste WCAG de los pares de texto: ≥ 4,8:1 (gris secundario sobre cal) y hasta 15,3:1.

Componentes: `.hs` (servicios con scroll horizontal fijado), `.works` (lista de proyectos con vista
previa que sigue al cursor), `.mat` (materiales), `.steps` (proceso con raíl), `.about` (foto con
tarjeta superpuesta), `.split`, `.index`, `.facts`, `.tiles`, `.block`, `.srow`, `.acc`,
`.cta` y `.phead`.

## Imágenes

20 fotografías de Unsplash (Licencia Unsplash), acreditadas en `/creditos/`. **Son ilustrativas y no
son obras de CB Terra Anima**; la web lo indica donde podría confundirse.

- El hero usa dos encuadres de la misma foto: `hero-lz` (horizontal) y `hero-lz-m` (vertical, móviles).
  Se definen en `scripts/images.manifest.json` con `source` (original compartido) y `extract` (recorte).
- Para sustituir una foto por una propia: guarda el original en `assets-src/raw/<nombre>.jpg`, actualiza
  el autor en el manifiesto y ejecuta `npm run images`. Manteniendo el nombre no hay que tocar el HTML.
- `<img data-pic="nombre">` genera un `<picture>` AVIF/WebP con `srcset`; `data-pic-mobile="otro"`
  añade un encuadre alternativo para móviles en vertical.

## Movimiento

Sin librerías: `src/main.js` usa dos IntersectionObserver para las entradas y un único bucle
`requestAnimationFrame` que escribe variables CSS durante el scroll. Solo se animan `transform`,
`opacity` y `clip-path`.

| Token | Valor |
| --- | --- |
| Duraciones | `--d-xs` 0,18 s (estados), `--d-s` 0,45 s (hover), `--d-m` 0,9 s (entradas), `--d-l` 1,3 s (fotos) |
| Curvas | `--e-out` `cubic-bezier(.16,1,.3,1)` para entradas; `--e-io` `cubic-bezier(.65,0,.35,1)` para cortinas |
| Distancia | `--rise` 1,75rem; escalonado de 0,08 s por línea o elemento |

- **Hero:** vídeo (o foto de portada) a pantalla completa con velo oscuro y contenido centrado. La
  imagen se asienta desde una escala mayor; etiqueta, titular, entradilla y botones aparecen escalonados
  con un desplazamiento corto, una sola vez. Los enlaces funcionan desde el primer momento. Al bajar, el
  texto se desvanece y la imagen se desplaza más despacio. El vídeo se pausa fuera de pantalla y sigue
  donde estaba al volver.
- **Titulares:** se dividen en líneas reales (se recalculan al cambiar el ancho) y suben desde una máscara.
- **Animaciones automáticas** (`main.js`, apartado 2a): los títulos medianos y pequeños
  (`.display-3`, títulos de tarjetas, pasos y servicios) entran palabra a palabra; las etiquetas en
  mayúsculas se dibujan con un barrido; párrafos y listas suben al aparecer, las listas elemento a
  elemento; y las fotos que estaban quietas se descubren de abajo arriba. Duración 1–1,2 s.
- **Fotos:** `.reveal-img` se descubre desde abajo, izquierda o derecha mientras la imagen pasa de
  escala 1,22 a 1.
- **Servicios:** en escritorio (≥ 1024 px, ratón) la sección se fija y el scroll vertical desplaza los
  paneles en horizontal, con contador y barra de progreso; con el teclado, el foco lleva al panel. En
  móvil y tableta es una fila deslizable nativa.
- **Fondo:** la sección de proyectos pasa de basalto a claro al entrar (`[data-bg-shift]`); la cabecera
  cambia de tono según el fondo que tiene debajo.
- **Proyectos:** al pasar el cursor, la fila activa se desplaza, las demás se atenúan y una vista previa
  sigue al ratón con inercia e inclinación según la velocidad. En táctil se ven miniaturas.
- **Ventana fotográfica** (tras los proyectos): la foto queda fija a la pantalla y una banda de una
  pantalla + 15vh la va descubriendo al subir; durante esos 15vh de scroll la foto ocupa la pantalla
  entera. Mientras tanto deriva de +100 a −100 px con un ligero retardo. Usa `position: fixed`
  dentro de un `clip-path: inset(0)` en lugar de `background-attachment: fixed`, que no funciona en
  iOS. Con
  movimiento reducido es una foto estática de 640 px.
- **Materiales y proceso:** parallax moderado en las fotos; un raíl se rellena con el scroll y activa
  cada paso.
- **Componentes:** botones con relleno que sube, enlaces con subrayado que se retira, submenú y menú
  móvil con cortina y enlaces escalonados, acordeón animado y campos con subrayado de foco.

Con `prefers-reduced-motion` (o `?motion=reduce` para revisarlo) no hay fijado, parallax ni
transformaciones y todo aparece directamente. Si `main.js` no carga, el `<head>` retira la clase `js`
a los 3 s y el contenido queda visible. Tras un salto brusco de scroll, todo lo que ya está en pantalla
se muestra aunque el observador no haya llegado a dispararse.

## Formulario

En `/contacto/` y, en el resto de páginas, justo encima del pie (`partials/footer-form.html`, con
sus propios IDs; no se incluye en `/contacto/` para no duplicarlo). Desde los servicios se llega con el tipo de obra preseleccionado
(`/contacto/?tipo=Reforma`). Sin backend conectado valida en el cliente y avisa de que la solicitud
**no se ha enviado**. Para activarlo:

1. Crear el endpoint (Formspree, Getform, Netlify Forms o una función serverless que reciba
   `multipart/form-data` por POST y responda 2xx).
2. Poner su URL en `FORM_ENDPOINT` dentro de `src/config.js`.
3. Redactar y enlazar la política de privacidad (ver `REVISION.md`).

## Versiones anteriores

La versión basada en la plantilla Brixzon está en la rama `version-brixzon`. Las versiones «Armalutx»
y «editorial» (iteraciones 5 y 6) no están en el repositorio; hay copias comprimidas fuera de él.
