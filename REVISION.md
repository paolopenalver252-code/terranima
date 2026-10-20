# Revisión antes de enseñar la demo al cliente

Documento interno. Separa lo que está verificado de lo que es provisional.

## Datos verificados

Fuente: [Iberinform, ficha de 2-SB TERRAMANIMA SL](https://www.iberinform.es/empresa/11285058/2-sb-terramanima)
y publicación en BORME del 09/01/2026 (consultadas el 20/10/2026).

| Dato | Valor | Dónde aparece en la web |
| --- | --- | --- |
| Denominación social | 2-SB TERRAMANIMA S.L. | Footer y JSON-LD |
| CIF | B24903155 | Footer y JSON-LD |
| Domicilio social | C/ Panamá, 12 · 35500 Arrecife (Las Palmas) | Solo «Arrecife, Lanzarote» en la web; código postal en JSON-LD |
| CNAE | 4101 · Construcción de edificios residenciales | Ficha del estudio («Construcción de edificios») |
| Objeto social | Construcción completa, reparación y conservación de edificaciones residenciales y no residenciales (CNAE 4101 y 4102): ejecución de obras, reforma, rehabilitación… (texto truncado en la fuente) | Servicios y ficha |
| Inicio de operaciones | 24/11/2025 | No se muestra |
| Forma jurídica | Sociedad Limitada unipersonal | No se muestra |

Nombre comercial: el encargo indica **CB Terra Anima**. No aparece en la ficha mercantil, que solo
recoge la denominación fiscal.

## Pendiente de validar con el cliente

- [ ] **Nombre comercial y logotipo.** El logotipo es tipográfico y provisional (recuadro «CB» + «TERRA ANIMA»).
- [ ] **Titular del hero** «Tierra con alma.» y la nota «Terra anima: del latín, “tierra” y “alma”». La etimología es correcta, pero el cliente debe confirmar que le gusta la lectura del nombre. También hay que validar la entradilla («Construcción, reforma y rehabilitación de viviendas y edificios en Lanzarote»).
- [ ] **Texto del estudio** (sección 01). Es una redacción prudente basada en el objeto social. Incluye el bloque «Construir en Lanzarote / Obra nueva, reforma y cuidado de lo construido» y su párrafo.
- [ ] **Descripciones de servicios** en la portada: textos, «Encaja si…» y etiquetas (Viviendas, Integral, Arquitectura tradicional…).
- [ ] **Páginas de servicio** (`content/servicios.mjs`). Ver el apartado «Iteración 3» más abajo.
- [ ] **Etapas del proceso** (Escuchar, Planificar, Construir, Entregar). Son genéricas y no incluyen plazos ni garantías.
- [ ] **Teléfono, correo y WhatsApp.** No se han encontrado datos públicos verificables. Rellenar en `src/config.js`.
- [ ] **Endpoint del formulario** (`FORM_ENDPOINT` en `src/config.js`).
- [ ] **Textos legales.** Faltan aviso legal, política de privacidad y, si se añade analítica, política de cookies. La casilla de consentimiento del formulario aún no enlaza a ninguna política.
- [ ] **Dominio definitivo.** `canonical`, `og:image`, JSON-LD y `sitemap.xml` usan ya URLs absolutas a partir de `VITE_SITE_URL` (`.env`), que ahora apunta a `https://terranima-mu.vercel.app`. Hay que cambiarlo al dominio definitivo y volver a desplegar.
- [ ] **Fotografía propia de obras.** Ninguna imagen actual es un trabajo de la empresa. Si hay obras reales, convendría añadir una sección de proyectos con datos confirmados.

## Iteración 2: verificaciones realizadas (20/10/2026)

Comprobado en el navegador integrado (Chromium) con el servidor de desarrollo y con la build de producción (`npm run build` + `npm run preview`).

| Comprobación | Resultado |
| --- | --- |
| `npm run build` | Sin errores ni avisos (JS 4,7 KB y CSS 7,7 KB comprimidos) |
| Consola (build de producción, pestaña limpia) | Sin mensajes |
| Peticiones de red | Todas 200 |
| Desbordamiento horizontal | Ninguno a 1440, 1280, 768, 390 y 320 px |
| Hero antes del scroll | 1440×900, 1280×720, 768×1024, 390×844 y 320×640 |
| Hero durante el scroll | La cortina del estudio sube, la foto escala y se oscurece y el titular se desplaza y se desvanece |
| Contraste del texto del hero sobre la foto | Medido sobre capturas reales con el texto oculto (percentil 97 del fondo). Escritorio: titular 5,6:1, bloque lateral 5,5:1 (3,5:1 en el tono atenuado; texto grande, mínimo 3:1), pie 10,4:1 y etiqueta 8,5:1. Móvil, 320 px y tablet: titular ≥ 7:1 |
| Servicios en escritorio | Se activan con el scroll y al pasar el cursor; la imagen entra desde abajo o desde arriba según la dirección |
| Servicios en móvil | Se activan con el scroll y al tocar una fila (no dependen del hover) |
| Proceso | Las cuatro fases se recorren y los títulos entran y salen por máscara; corregido el corte de «PLANIFICAR» |
| Movimiento reducido (`?motion=reduce`) | El hero aparece completo sin animar, el texto del estudio sale entero, las imágenes no tienen recortes ni escalas y el proceso cambia de imagen sin animar mostrando solo la fase activa |
| Teclado | Orden: salto al contenido → marca → navegación → CTA de cabecera → CTA del hero → «Descubrir el estudio» → «Ver servicios»; foco visible, también sobre la foto |
| Menú móvil | Se abre, se cierra con Escape y el foco vuelve al botón (comprobado en la iteración 1; la lógica no ha cambiado) |

### No verificado en un dispositivo real

- **`prefers-reduced-motion` activado desde el sistema operativo.** El navegador integrado no puede simularlo. El script del `<head>` aplica la misma clase `.rm` que `?motion=reduce`, y esa ruta sí se ha probado.
- **Modo ligero** (ahorro de datos o equipos con ≤ 2 núcleos o ≤ 2 GB). Solo revisado en código: desactiva la escala y el parallax ligados al scroll.
- **Fallo de JavaScript.** Solo revisado en código: si `main.js` no carga, el temporizador del `<head>` retira la clase `js` a los 3 s y todo el contenido queda visible.
- **Safari / iOS y Firefox.** No probados. `svh`, `cqi`, `clip-path: inset()` y `scale`/`translate` funcionan en las versiones actuales, pero conviene una pasada en un iPhone real.

## Iteración 3: contenido de servicios (20/10/2026)

### Qué se ha investigado

- **Fuentes públicas:** búsquedas por «Terramanima», «Terra Anima», CIF y objeto social, más directorios mercantiles. Solo aparece la información registral ya recogida arriba; no hay web, redes, proyectos ni contacto públicos. El objeto social publicado en el BORME está truncado en la propia publicación («…reforma, rehabilitación, a.»), así que no se puede saber qué más actividades incluye.
- **Proyecto:** no contiene documentos ni textos de la empresa más allá de lo ya publicado en la web.

### Cómo se ha redactado

| Tipo de afirmación | Criterio | Ejemplos |
| --- | --- | --- |
| Hechos de la empresa | Solo lo que figura en el registro | Edificación residencial y no residencial; obra nueva, reforma, rehabilitación, reparación y conservación; sede en Arrecife |
| Información general del sector | Presentada como general, nunca como especialidad | La obra nueva requiere proyecto técnico y licencia; obras menores con comunicación previa o licencia; ayudas públicas a la rehabilitación; deber legal de conservación |
| Contexto de Lanzarote | Hechos generales de la isla, no técnicas propias | Suelo volcánico variable, ambiente salino, sol y viento, cubiertas planas, casa tradicional encalada, planeamiento insular |
| Forma de trabajar | **Redacción provisional**, coherente con el proceso ya publicado en la portada | Visita y toma de datos, presupuesto por partidas, seguimiento por fases, explicar y acordar los imprevistos antes de ejecutarlos |

No se mencionan oficios, materiales, técnicas, plazos, precios, garantías, equipo ni proyectos.

### Pendiente de validar con el cliente

- [ ] **Procesos de trabajo de cada servicio** (fases de reforma, diagnóstico de rehabilitación, «Cómo lo abordamos» de reparación). Hay que confirmar que coinciden con su forma real de trabajar, sobre todo:
  - si hace una visita antes de presupuestar;
  - si presupuesta por partidas;
  - si explica y acuerda los imprevistos antes de ejecutarlos;
  - si da indicaciones de mantenimiento después de una reparación.
- [ ] **Alcance real de cada servicio.** Las fases de obra nueva describen una construcción completa en general, y la página aclara que el alcance se define en el presupuesto. Conviene preguntar:
  - qué oficios ejecuta directamente y cuáles subcontrata (instalaciones, carpinterías…);
  - si coordina o tramita licencias, o si trabaja con arquitectos de confianza.
- [ ] **Reparaciones pequeñas y mantenimiento periódico.** No se dice si atiende reparaciones puntuales pequeñas ni si ofrece contratos de mantenimiento a comunidades. Si lo hace, merece una mención explícita.
- [ ] **Zona de trabajo.** La web dice «en Lanzarote» y el JSON-LD declara `areaServed: Lanzarote`. Hay que confirmar si trabaja en toda la isla (y si también en Fuerteventura o La Graciosa).
- [ ] **Locales comerciales.** La página de reformas responde que sí reforma locales, con base en el objeto social (edificación no residencial). Conviene confirmarlo en la práctica.
- [ ] **Imágenes de servicio.** Siguen siendo ilustrativas. La página de rehabilitación y la de reformas ganarían mucho con obras propias.

### Verificaciones realizadas

| Comprobación | Resultado |
| --- | --- |
| `npm run build` (incluye `npm run pages`) | Sin errores; 5 páginas en `dist/` |
| Marcadores sin sustituir (`%SITE_URL%`, `{{…}}`, `@include`, `data-pic`) | Ninguno en `dist/` |
| JSON-LD | Válido en las 5 páginas: `GeneralContractor` (portada); `Service`, `BreadcrumbList` y `FAQPage` en cada servicio |
| Encabezados | Un `h1` por página; `h2` por apartado; sin IDs duplicados |
| Enlaces internos | Las 5 URL devuelven 200; ninguna ancla rota; las anclas `/#…` existen en la portada |
| Consola (build de producción) | Sin mensajes en las 5 páginas |
| Formulario en página de servicio | Errores en línea si se envía vacío; tipo de obra preseleccionado; aviso de que no se ha enviado |
| Submenú «Servicios» | Se abre con el cursor y con el foco del teclado |
| Índice lateral | Marca el apartado activo al hacer scroll |
| Desbordamiento horizontal | Ninguno a 1440, 390 y 320 px en las 5 páginas (corregido el botón de la banda final, que desbordaba a 390 px) |
| Movimiento reducido (`?motion=reduce`) en página de servicio | Titulares, tarjetas e imágenes visibles sin transformaciones ni recortes |

## Deliberadamente omitido

Años de experiencia, número de obras, clientes, testimonios, premios, certificaciones, plazos,
garantías y ubicaciones de proyectos: no hay ninguna fuente que los confirme.
