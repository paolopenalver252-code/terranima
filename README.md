# CB Terra Anima — demo web

Landing de una sola página para CB Terra Anima (construcción, reforma, rehabilitación y
conservación en Lanzarote). HTML + CSS + JavaScript sin frameworks, empaquetado con Vite.

## Comandos

```bash
npm install
npm run dev       # servidor de desarrollo en http://localhost:5173
npm run build     # build de producción en dist/
npm run preview   # sirve dist/ para comprobar la build
npm run images    # descarga y regenera las imágenes optimizadas (AVIF + WebP)
node scripts/brand-assets.mjs   # regenera apple-touch-icon.png y og-image.jpg
```

## Estructura

| Ruta | Contenido |
| --- | --- |
| `index.html` | Todo el marcado y el contenido de la página |
| `src/styles.css` | Sistema visual (tokens, tipografía, secciones, animaciones, `prefers-reduced-motion`) |
| `src/main.js` | Interacciones: entrada del hero, cabecera, menú móvil, reveals, secuencia del proceso, formulario |
| `src/config.js` | **Teléfono, correo, WhatsApp y endpoint del formulario** (vacíos hasta que se confirmen) |
| `src/images.json` | Generado por `npm run images`: anchos, proporción, color dominante y créditos |
| `scripts/images.manifest.json` | Fotografías seleccionadas, autor y enlace a Unsplash |
| `vite.config.js` | Plugin que convierte `<img data-pic="nombre">` en `<picture>` AVIF/WebP responsivo |
| `public/` | Imágenes optimizadas, favicon e imagen Open Graph |

## Imágenes

Las 16 fotografías proceden de Unsplash (Licencia Unsplash: uso comercial gratuito, sin
atribución obligatoria; aun así se acreditan en el footer). **Son ilustrativas y no son obras de
CB Terra Anima**: la web lo indica en la sección de materialidad, en el proceso, en la vista
previa de servicios y en los créditos del footer.

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

**Movimiento reducido:** el script del `<head>` añade la clase `rm` si el sistema lo pide. Para
revisarlo sin cambiar el sistema operativo, abre la página con `?motion=reduce`.

## Formulario

Sin backend conectado, el formulario valida en el cliente y muestra un aviso explícito de que la
solicitud **no se ha enviado**. Para activarlo:

1. Crear el endpoint (Formspree, Getform, Netlify Forms o una función serverless que reciba
   `multipart/form-data` por POST y responda 2xx).
2. Poner su URL en `FORM_ENDPOINT` dentro de `src/config.js`.
3. Redactar y enlazar la política de privacidad (ver `REVISION.md`).

## Fuentes

Archivo (variable, con eje de anchura) e IBM Plex Mono, servidas desde el propio proyecto con
`@fontsource` (sin peticiones a Google Fonts).
