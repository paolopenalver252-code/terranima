# CB Terra Anima — web

Web de CB Terra Anima (construcción, reformas, rehabilitación, reparación y conservación en
Lanzarote): una portada y una página por servicio. HTML + CSS + JavaScript sin frameworks,
empaquetado con Vite.

## Comandos

```bash
npm install
npm run dev       # genera las páginas de servicio y arranca el servidor en http://localhost:5173
npm run build     # genera las páginas de servicio y hace el build de producción en dist/
npm run preview   # sirve dist/ para comprobar la build
npm run pages     # solo regenera servicios/*/index.html, sitemap.xml y robots.txt
npm run images    # descarga y regenera las imágenes optimizadas (AVIF + WebP)
node scripts/brand-assets.mjs   # regenera apple-touch-icon.png y og-image.jpg
```

## Páginas

| URL | Origen |
| --- | --- |
| `/` | `index.html` |
| `/servicios/obra-nueva/` | Generada desde `content/servicios.mjs` |
| `/servicios/reformas/` | Generada desde `content/servicios.mjs` |
| `/servicios/rehabilitacion/` | Generada desde `content/servicios.mjs` |
| `/servicios/reparacion-y-conservacion/` | Generada desde `content/servicios.mjs` |

**Para cambiar el texto de un servicio, edita `content/servicios.mjs`** (no los HTML de
`servicios/`, que se sobrescriben). Cada servicio define su cabecera, sus apartados (tarjetas,
fases, principios, comparativa, lista de comprobación, panel de Lanzarote, calendario o preguntas
frecuentes) y su llamada a la acción. Las preguntas frecuentes generan también el JSON-LD
`FAQPage`, así que el texto visible y los datos estructurados nunca se desincronizan.

## Estructura

| Ruta | Contenido |
| --- | --- |
| `index.html` | Portada |
| `content/servicios.mjs` | Contenido de las cuatro páginas de servicio |
| `scripts/build-pages.mjs` | Genera las páginas de servicio, `public/sitemap.xml` y `public/robots.txt` |
| `partials/` | Fragmentos compartidos: `head`, `header` (con submenú y menú móvil), `contact` y `footer` |
| `.env` | `VITE_SITE_URL`: URL pública, usada en canonical, Open Graph, JSON-LD y sitemap. **Cambiar al tener dominio definitivo.** |
| `src/styles.css` | Sistema visual (tokens, tipografía, secciones, animaciones, movimiento reducido) |
| `src/pages.css` | Submenú, filas de servicio enlazadas y componentes de las páginas de servicio |
| `src/main.js` | Interacciones: hero, cabecera, menús, apariciones, secuencia del proceso, índice lateral, formulario |
| `src/config.js` | **Teléfono, correo, WhatsApp y endpoint del formulario** (vacíos hasta que se confirmen) |
| `src/images.json` | Generado por `npm run images`: anchos, proporción, color dominante y créditos |
| `scripts/images.manifest.json` | Fotografías seleccionadas, autor y enlace a Unsplash |
| `vite.config.js` | Build multipágina e inclusión de fragmentos (`<!-- @include nombre clave=valor -->`), `%SITE_URL%` e `<img data-pic>` → `<picture>` AVIF/WebP |
| `public/` | Imágenes optimizadas, favicon, imagen Open Graph, `sitemap.xml` y `robots.txt` |

## Imágenes

Las 16 fotografías proceden de Unsplash (Licencia Unsplash: uso comercial gratuito, sin
atribución obligatoria; aun así se acreditan en el footer). **Son ilustrativas y no son obras de
CB Terra Anima**: la web lo indica junto a cada una que podría confundirse con una obra y en los
créditos del footer.

Para sustituirlas por fotografía propia: añade el archivo a `assets-src/raw/<nombre>.jpg`, actualiza
el autor en `scripts/images.manifest.json` y ejecuta `npm run images`. El script solo descarga
las imágenes que no existen en `assets-src/raw/`.

## Movimiento

Sistema único, sin librerías, controlado desde `src/main.js` y `src/styles.css`:

| Atributo / elemento | Comportamiento |
| --- | --- |
| Hero (`.hero`, `sticky`) | Entrada: la foto se abre desde un marco central y las líneas del titular suben tras una máscara. Al hacer scroll, la sección del estudio sube por encima como una cortina mientras la foto escala y se oscurece. |
| `data-lines` | Titulares: se separan en líneas reales (se recalculan al cambiar el ancho) que emergen de una máscara. |
| `data-reveal="clip"` + `data-dir="up\|left\|right\|center"` | Imágenes: recorte que se abre en la dirección indicada. |
| `data-scale` / `data-parallax` | Escala sutil (1,1 → 1) y desplazamiento ligados al scroll. |
| `data-fade` / `data-stagger` | Textos secundarios: fundido corto, escalonado en grupos. |
| `data-scrub` | El texto del estudio se rellena palabra a palabra con el scroll. |
| `data-chars` | El wordmark del footer sube letra a letra. |
| `data-toc` | Índice lateral de las páginas de servicio: marca el apartado que se está leyendo. |

**Movimiento reducido:** el script del `<head>` añade la clase `rm` si el sistema lo pide. Para
revisarlo sin cambiar el sistema operativo, abre la página con `?motion=reduce`.

## Formulario

El mismo formulario aparece en todas las páginas; en las de servicio, el tipo de obra llega
preseleccionado (`data-service-type` en `<body>`). Sin backend conectado, valida en el cliente y
muestra un aviso explícito de que la solicitud **no se ha enviado**. Para activarlo:

1. Crear el endpoint (Formspree, Getform, Netlify Forms o una función serverless que reciba
   `multipart/form-data` por POST y responda 2xx).
2. Poner su URL en `FORM_ENDPOINT` dentro de `src/config.js`.
3. Redactar y enlazar la política de privacidad (ver `REVISION.md`).

## Fuentes

Archivo (variable, con eje de anchura) e IBM Plex Mono, servidas desde el propio proyecto con
`@fontsource` (sin peticiones a Google Fonts).
