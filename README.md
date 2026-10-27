# CB Terra Anima — web

Web de CB Terra Anima (construcción, reformas, rehabilitación, reparación y conservación en
Lanzarote). HTML + CSS + JavaScript sin frameworks, empaquetado con Vite.

La maqueta reproduce la estructura, las proporciones y las animaciones de la plantilla de Framer
«Brixzon», reconstruidas con código propio. **Brixzon es una plantilla de pago:** antes de publicar
la web con este diseño conviene comprar su licencia en el marketplace de Framer (ver `REVISION.md`).
No se ha copiado código, texto ni imagen de la plantilla.

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

| URL | Origen | Página equivalente de la plantilla |
| --- | --- | --- |
| `/` | `index.html` | Home |
| `/estudio/` | `estudio/index.html` | About |
| `/servicios/` | `servicios/index.html` | Services |
| `/servicios/obra-nueva/`, `/reformas/`, `/rehabilitacion/`, `/reparacion-y-conservacion/` | Generadas desde `content/servicios.mjs` | Work detail |
| `/contacto/` | `contacto/index.html` | Contact |
| `/creditos/` | `creditos/index.html` | — (autoría de las fotos) |

**Para cambiar el texto de un servicio, edita `content/servicios.mjs`** (no los HTML de
`servicios/<slug>/`, que se sobrescriben). Las preguntas frecuentes generan también el JSON-LD
`FAQPage`, así que el texto visible y los datos estructurados no se desincronizan.

## Estructura

| Ruta | Contenido |
| --- | --- |
| `partials/` | Fragmentos compartidos: `head`, `header`, `menu` (menú móvil), `process`, `carousel`, `stats`, `faq`, `illustration`, `footer` |
| `content/servicios.mjs` | Contenido de las cuatro páginas de servicio |
| `scripts/build-pages.mjs` | Genera las páginas de servicio, `public/sitemap.xml` y `public/robots.txt` |
| `src/brx.css` | Sistema visual completo: tokens, tipografía, secciones, páginas interiores, animaciones y movimiento reducido |
| `src/main.js` | Interacciones: muro de lamas del hero, menú móvil, títulos letra a letra, apariciones, acordeones, pestañas, carrusel, formulario |
| `src/config.js` | **Teléfono, correo, WhatsApp y endpoint del formulario** (vacíos hasta que se confirmen) |
| `src/images.json` | Generado por `npm run images`: anchos, proporción, color dominante y créditos |
| `scripts/images.manifest.json` | Fotografías seleccionadas (38), autor y enlace a Unsplash |
| `vite.config.js` | Build multipágina, `<!-- @include nombre clave="valor" -->`, `%SITE_URL%`, `%ARROW%` e `<img data-pic>` → `<picture>` AVIF/WebP |
| `.env` | `VITE_SITE_URL`: URL pública para canonical, Open Graph, JSON-LD y sitemap. **Cambiar al tener dominio definitivo.** |

## Imágenes

Las 38 fotografías proceden de Unsplash (Licencia Unsplash: uso comercial gratuito, sin
atribución obligatoria; aun así se acreditan en `/creditos/`). **Son ilustrativas y no son obras
de CB Terra Anima**: la web lo indica en las fotos que podrían confundirse con una obra.

Para sustituirlas por fotografía propia: añade el archivo a `assets-src/raw/<nombre>.jpg`, actualiza
el autor en `scripts/images.manifest.json` y ejecuta `npm run images`.

## Movimiento

| Elemento | Comportamiento |
| --- | --- |
| Hero (`[data-vane]`) | Muro de lamas: tiras verticales de 72 px que son prismas triangulares con una foto en cada cara; giran 120° cada 5 s, escalonadas de izquierda a derecha. Se detiene fuera de pantalla y con la pestaña oculta. |
| `.chars` | Títulos de sección: letra a letra con desenfoque y opacidad. |
| `data-appear` (`up`, `left`, `right`, `scale`) | Bloques que entran al aparecer en pantalla. |
| `data-scrub` | El párrafo del estudio se rellena palabra a palabra con el scroll. |
| Servicios, proceso, expertise | Fila abierta al pasar el cursor (y al tocar o con el foco), tarjeta activa, pestañas con foto. |
| Carrusel «Construir en Lanzarote» | La miniatura crece a imagen principal y la cita cambia con fundido. |
| Botones | Rodillo del texto y flecha que avanza al pasar el cursor. |

**Movimiento reducido:** el script del `<head>` añade la clase `rm` si el sistema lo pide; todo queda
visible y sin desplazamientos. Para revisarlo sin cambiar el sistema operativo, añade `?motion=reduce`.

## Formulario

Está en `/contacto/`; desde las páginas de servicio se llega con el tipo de obra preseleccionado
(`/contacto/?tipo=Reforma`). Sin backend conectado, valida en el cliente y muestra un aviso explícito
de que la solicitud **no se ha enviado**. Para activarlo:

1. Crear el endpoint (Formspree, Getform, Netlify Forms o una función serverless que reciba
   `multipart/form-data` por POST y responda 2xx).
2. Poner su URL en `FORM_ENDPOINT` dentro de `src/config.js`.
3. Redactar y enlazar la política de privacidad (ver `REVISION.md`).

## Fuentes

- **Tanker** (Indian Type Foundry), la tipografía de titulares de la plantilla. Se carga desde la API
  de Fontshare, porque su licencia (ITF Free Font License) no deja claro el autoalojamiento.
- **Inter** (SIL OFL), servida desde el proyecto con `@fontsource/inter`.
