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

## Iteración 7: rediseño con foco en movimiento (28–29/10/2026)

La iteración 6 se parecía demasiado a la primera demo y se sentía estática. Esta versión cambia la
composición, el color y, sobre todo, el movimiento. La versión 6 queda en una copia comprimida fuera
del repositorio.

### Qué se observó en las referencias (navegador integrado, 1440×900)

| Web | Observado en funcionamiento | Qué se ha tomado como idea (sin copiar) |
| --- | --- | --- |
| MAD Proyect | Elementor con entradas `fadeInLeft/Right/Up` en unos 30 elementos, palabra gigante semitransparente en el hero, carruseles Swiper | Palabra gigante de fondo, pero en contorno y desplazada con el scroll |
| Reformas Abel | Código propio sin librerías: degradados del hero que derivan despacio, cabecera que pasa de transparente a sólida, riel horizontal de proyectos; las secciones **no** tienen animación de entrada | Concentrar el movimiento en pocos momentos fuertes; cabecera que cambia de tono |
| Cosendra | Vídeo en el hero, paneles de servicios recorridos con el scroll, testimonios con fundido de 1 s; sin librerías de animación | Servicios como recorrido horizontal ligado al scroll |

No se ha copiado estructura, textos, fotos, marca ni código.

### Qué fallaba en la iteración 6

- Composición centrada y simétrica en casi todas las secciones, con el mismo ritmo de titular + texto.
- Paleta clara casi uniforme: el verde de acento apenas aparecía.
- Movimiento limitado a fundidos de opacidad y una máscara en las fotos.
- Proyectos y servicios presentados como rejillas estáticas.

### Decisiones

- **Color con intención:** basalto (oscuro volcánico) y cal alternan por secciones; el almagre (tierra
  roja) es el acento sobre claro y el toba sobre oscuro. La sección de proyectos pasa de oscuro a claro
  con el scroll.
- **Tipografía:** Bricolage Grotesque estrecha (78 %) para titulares y texto; Instrument Serif cursiva
  solo para las palabras destacadas. Sustituye a Instrument Serif + Manrope.
- **Portada:** hero oscuro con la foto a la derecha y el texto superpuesto en móvil, manifiesto
  asimétrico, servicios en horizontal, proyectos en lista con vista previa, materiales, proceso con
  raíl, empresa con tarjeta superpuesta, contacto y pie con la marca a gran tamaño.
- **Sistema de movimiento:** documentado en `README.md` (duraciones, curvas, distancias, escalonado y
  comportamiento con movimiento reducido).
- **Favicon, `theme-color` e imagen Open Graph** pasados a basalto y almagre.

### Pendiente de validar con el cliente (nuevo)

- [ ] Los textos de la sección «Materiales» (cal, piedra volcánica, picón) y de «El terreno / El clima /
  El paisaje» son información general de Lanzarote, no técnicas propias de la empresa.
- [ ] El proceso en cuatro pasos sigue siendo **orientativo** y así se indica en la web.
- [ ] Los proyectos siguen siendo **referencias visuales** rotuladas como tales; no hay obras propias.

### Verificaciones realizadas

| Comprobación | Resultado |
| --- | --- |
| `npm run build` | Sin errores; 9 páginas; JS 5,5 KB y CSS 9,7 KB comprimidos |
| Marcadores sin sustituir, referencias a webs de referencia o versiones anteriores, secretos en `dist/` | Ninguno |
| Un `h1` por página, IDs únicos, `alt` en todas las imágenes, enlaces y `srcset` existentes, anclas, JSON-LD válido | Sí, en las 9 páginas |
| Desbordamiento horizontal y elementos recortados | Ninguno en 9 páginas × 8 anchos (320, 375, 390, 430, 768, 1024, 1440, 1920 px). Corregido el dato del proyecto que desbordaba 2 px a 320 px |
| Contraste de los colores del sistema | ≥ 4,81:1 en los pares de texto (el gris secundario sobre arena, 4,16:1, no se usa: la arena solo es fondo de foto) |
| Hero (escritorio y móvil) | La secuencia de entrada se ve completa; los enlaces responden desde el principio |
| Servicios fijados (1440×900) | El scroll vertical desplaza los cuatro paneles con contador y barra; ningún panel se sale de la pantalla; con el teclado, el foco en el cuarto panel lo trae a la vista. En móvil, fila deslizable nativa |
| Cambio de fondo y tono de la cabecera | El fondo de proyectos pasa de basalto a claro; la cabecera cambia de tono sobre cada fondo |
| Proyectos con cursor | La fila activa se desplaza, las demás se atenúan y la vista previa muestra la foto correcta |
| Materiales, proceso, empresa, contacto, pie | Revisados al hacer scroll en escritorio y a 375 px |
| Menú móvil (375 px) | Abre, foco en «Cerrar», bloquea el scroll, Escape cierra y devuelve el foco |
| Submenú de servicios | Se abre con el botón; Escape lo cierra y devuelve el foco |
| Formulario | Errores en línea en los cinco campos obligatorios, foco en el primero, sin envío simulado |
| Movimiento reducido (`?motion=reduce`) | Sin fijado ni transformaciones; todo visible salvo la vista previa del cursor, que es decorativa |
| Consola (servidor de desarrollo) | Sin errores |

Defectos encontrados al recorrer la web y corregidos: nombres de la cabecera ilegibles sobre el cielo
del hero, titular del hero invadiendo la foto, paneles de servicios más altos que la pantalla, vista
previa de proyectos tapando los títulos, etiqueta del hero en móvil tapada por el titular, foto de
«La empresa» que podía quedarse oculta tras un salto brusco de scroll, pie de foto tapado por la
tarjeta en móvil y dato de proyecto desbordando a 320 px.

**No comprobado:** Safari/iOS, Firefox, dispositivos táctiles reales (el deslizamiento de servicios se
ha probado por código, no con el dedo), lectores de pantalla, `prefers-reduced-motion` desde el
sistema operativo (sí con `?motion=reduce`) y rendimiento medido con herramientas de perfilado (sí se
ha limitado a `transform`, `opacity` y `clip-path` y a un único bucle de scroll).

## Iteración 6: rediseño premium editorial (28/10/2026)

Nueva dirección propia a partir de seis referencias (Cosendra, Alibaz, Reformas Abel, MAD Proyect,
Llull Sastre y Edificam, revisadas en el navegador). Las secciones de la iteración 5 describen la
versión anterior, de la que hay copia fuera del repositorio.

### Decisiones

- **Paleta mineral:** cal y arena para las superficies, basalto para los contrastes y el verde de la
  carpintería tradicional de Lanzarote como acento puntual.
- **Tipografía:** Instrument Serif (titulares) + Manrope (resto), ambas OFL y alojadas en el proyecto.
- **Hero:** casa encalada al pie de un volcán (Lanzarote real), con el titular «Construir con sentido.
  Integrar con el entorno.» sobre el cielo. La entradilla y los botones van en una banda bajo la foto
  para no tapar nunca la arquitectura. Encuadre vertical propio en móvil.
- **Portfolio:** composición editorial asimétrica alimentada por `content/proyectos.mjs`. **No hay
  obras de la empresa**: se muestran cuatro referencias visuales rotuladas como tales y un texto que lo
  explica. La plantilla de ficha de proyecto está lista y se ha probado con una entrada temporal (luego
  retirada).

### Pendiente de validar con el cliente (nuevo)

- [ ] Titular del hero y su entradilla.
- [ ] Sección «Forma de trabajar» (cuatro pasos) y la frase de «La empresa» sobre explicar cada obra con
  un presupuesto que se entienda: describen una forma de trabajar **provisional**.
- [ ] Marca: el logotipo («CB» + «Terra Anima» en serif) y el favicon («TA») son provisionales.
- [ ] **Fotografía propia de obras:** es lo que más mejoraría la web. Con dos o tres obras documentadas
  el portfolio pasa a mostrar proyectos reales sin tocar la maqueta.

### Verificaciones realizadas (build de producción y servidor de desarrollo, Chromium integrado)

| Comprobación | Resultado |
| --- | --- |
| `npm run build` | Sin errores; 9 páginas |
| Marcadores sin sustituir, referencias a webs de referencia o versiones anteriores, secretos en `dist/` | Ninguno |
| Consola, errores de JavaScript y red (9 páginas) | Sin errores; ninguna petición fallida; solo se descargan los subconjuntos latinos de las fuentes |
| Un `h1` por página, IDs únicos, sin saltos de encabezado, `alt`, `width`/`height` en todas las imágenes, etiquetas en todos los campos, JSON-LD válido, canonical y Open Graph | Sí, en las 9 páginas |
| Enlaces internos y anclas | 31 URL distintas, todas 200, anclas existentes |
| Desbordamiento horizontal y elementos recortados | Ninguno en 9 páginas × 10 anchos (320, 360, 375, 390, 430, 768, 1024, 1280, 1440, 1920 px) |
| Texto al 200 % (tamaño de letra del navegador) | Sin desbordamientos en 5 páginas a 375 y 1280 px |
| Contraste de los colores del sistema | ≥ 4,66:1 en todos los pares medidos |
| Contraste del texto del hero sobre la foto (medido en píxeles, percentil 5) | ≥ 13,8:1 en escritorio y móvil |
| Hero: titular libre de la casa | Comprobado a 1920×1080, 1440×900, 1366×768, 1024×768, 768×1024 y en móvil de 320 a 430 px |
| Formulario | Errores en línea, foco en el primero, tipo preseleccionado, aviso de que no se envía |
| Menú móvil | Abre, foco en «Cerrar», tabulación dentro del menú, Escape cierra y devuelve el foco, bloquea el scroll |
| Submenú de servicios | Se abre con el botón; Escape lo cierra y devuelve el foco |
| Movimiento reducido (`?motion=reduce`) | Los 22 elementos animados de la portada se ven completos |
| Fichas de proyecto | Generación y build probados con un proyecto temporal |

**No comprobado:** Safari/iOS, Firefox, dispositivos táctiles reales, lectores de pantalla reales y
`prefers-reduced-motion` desde el sistema operativo (sí con `?motion=reduce`).

## Iteración 5: rediseño con Armalutx como referencia (27/10/2026)

Rediseño completo con una dirección luminosa y editorial. Referencia estudiada: armalutx.com (portada,
página de servicio, quiénes somos y contacto, en escritorio y a 375 px). La versión anterior (Brixzon)
queda en la rama `version-brixzon`; las secciones de la iteración 4 describen esa versión.

### Qué se ha tomado de la referencia y qué no

| De la referencia | Adaptación |
| --- | --- |
| Estructura: hero a pantalla completa con texto centrado → presentación a dos columnas con lista desplegable de servicios y carrusel ancho → bloques de servicio con lista y foto → «por qué elegirnos» con mosaico → bloque editorial → artículos → preguntas frecuentes → banda final con foto → pie de cuatro columnas | Misma secuencia con contenido de CB Terra Anima |
| Una sola familia (Poppins), titulares de peso 400, cuerpo 300, titulares con línea vertical de acento, botones en píldora | Igual |
| Fondos carbón escalonados y acento dorado | **Invertido a claro** (marfil, arena, piedra) por petición del cliente; el oscuro se reserva para la banda de contacto y el pie. Acento en tierra volcánica en lugar de dorado |
| Páginas interiores: H1 con línea, foto ancha, apartados con titular y texto + imagen o tarjetas con borde | Igual |
| Logotipo, textos, fotos, botón de WhatsApp, selector de idioma | **No** se han copiado ni reproducido |

### Fotografía

- 21 fotos en uso (antes 38). Se han retirado las de obra en curso (ferralla, encofrados, obra grande…) porque no encajan con la nueva dirección.
- Nuevas: **hero-villa** (John Fornander, villa blanca con piedra y piscina) y **n-salon-calido** (Puscas Adryan, salón luminoso). Ninguna es de Lanzarote ni obra de la empresa; se indica «Imagen ilustrativa» donde podrían confundirse.
- [ ] Sustituir por fotografía propia en cuanto exista, empezando por el hero y los bloques de obra nueva y reformas.

### Pendiente de validar con el cliente (nuevo)

- [ ] Titular del hero «Construimos y reformamos tu casa en Lanzarote» y su entradilla.
- [ ] Bloque «¿Por qué elegir CB Terra Anima?»: los tres primeros puntos son hechos registrales; «Presupuestos por partidas» y «Cambios acordados antes de ejecutarlos» describen una forma de trabajar **provisional**.
- [ ] Marca: el logotipo (cono volcánico + «TERRA ANIMA / CONSTRUCCIÓN · LANZAROTE») es provisional.

### Verificaciones realizadas (build de producción y servidor de desarrollo, Chromium integrado)

| Comprobación | Resultado |
| --- | --- |
| `npm run build` | Sin errores; 9 páginas |
| Marcadores sin sustituir, referencias a Armalutx o a la plantilla anterior, secretos en `dist/` | Ninguno |
| Consola y red (9 páginas) | Sin mensajes; todas las peticiones 200/304 |
| Un `h1` por página, IDs únicos, sin saltos de nivel en los encabezados, `alt` en todas las imágenes, JSON-LD válido | Sí |
| Enlaces internos y anclas | 30 URL distintas, todas 200, anclas existentes |
| Desbordamiento horizontal y elementos recortados | Ninguno en 9 páginas × 8 anchos (320–1440 px) |
| Contraste (texto, acento, gris, pie, errores, texto de ejemplo) | ≥ 4,6:1 en todos los pares medidos |
| Formulario | Errores en línea, foco en el primero, tipo preseleccionado, aviso de que no se envía |
| Menú móvil | Abre, bloquea el scroll, cierra con Escape y devuelve el foco |
| Submenú de servicios | Se abre con el botón y con el cursor; Escape lo cierra y devuelve el foco (corregido: antes quedaba abierto) |
| Cabecera | Transparente sobre el hero, sólida al hacer scroll; sólida desde el inicio en las páginas interiores |
| Movimiento reducido (`?motion=reduce`) | Los 20 bloques con aparición se ven completos y sin desplazamiento |

**No comprobado:** Safari/iOS, Firefox, dispositivos táctiles reales y `prefers-reduced-motion` activado desde el sistema operativo (sí con `?motion=reduce`). El contraste del texto del hero sobre la foto se ha revisado a ojo en capturas, no medido.

## Iteración 4: reconstrucción con la maqueta de Brixzon (26/10/2026)

La web se ha rehecho siguiendo la estructura, las medidas y las animaciones de la plantilla de
Framer «Brixzon» (https://brixzon.framer.website/), con código propio y contenido de CB Terra Anima.
Las secciones anteriores de este documento que hablan del hero «Tierra con alma», del submenú o del
índice lateral describen la versión anterior.

### Licencias que hay que resolver antes de publicar

- [ ] **Plantilla Brixzon.** Es una plantilla de pago del marketplace de Framer. No se ha copiado su
  código, sus textos ni sus imágenes, pero la composición es deliberadamente casi idéntica. Lo prudente
  es **comprar la licencia** (o pedir permiso al autor) antes de publicar con este diseño.
- [ ] **Tipografía Tanker** (Indian Type Foundry, ITF Free Font License). Se sirve desde la API de
  Fontshare, que es el uso que la licencia permite sin dudas; no se ha autoalojado.

### Equivalencias de contenido (para no inventar datos)

| Sección de la plantilla | En esta web | Motivo |
| --- | --- | --- |
| Featured works (proyectos) | «Referencias»: paisaje y arquitectura de Lanzarote, marcadas como imágenes ilustrativas | No hay obras propias confirmadas |
| Feedback from clients (testimonios) | «Construir en Lanzarote»: datos generales de terreno, clima, paisaje, tradición y mantenimiento | No hay testimonios |
| Stats (años, proyectos, clientes…) | 04 líneas de servicio · 02 ámbitos · 2025 inicio de actividad · 29°N sede en Arrecife | Solo datos comprobables |
| News & insights | «Guías prácticas»: enlazan a apartados de las páginas de servicio | No hay artículos; no se han creado páginas de noticia para no duplicar contenido |
| Timeline (cuatro hitos) | Tres hitos: inicio de operaciones (24/11/2025), publicación en el BORME (09/01/2026) y «Hoy» | Solo hay dos fechas verificadas |
| Team (equipo) | «Áreas de trabajo»: las cuatro líneas de servicio | No hay datos del equipo |
| Founder (firma) | Razón social, CIF y sede | No hay datos del fundador |
| Offices (tres oficinas) | «Para valorar tu obra»: qué datos ayudan a presupuestar | Solo hay una sede confirmada y no hay dirección pública para mostrar |
| Why clients stay with us (precio cerrado, garantía de diez años…) | «Cómo trabajamos contigo»: visita, presupuesto por partidas, cambios acordados | Sin garantías ni promesas; **redacción provisional** |
| Teléfono, correo y redes en pie y contacto | Solo sede, razón social, CIF y formulario | No hay datos públicos; se añaden solos al rellenar `src/config.js` |

### Pendiente de validar con el cliente (nuevo)

- [ ] Textos de la página **Estudio**: enfoque, los cuatro principios y el titular «Construir con alma en Lanzarote».
- [ ] Textos de **Cómo trabajamos contigo** (servicios) y de las fases del **proceso** (portada).
- [ ] Contenido de **Expertise** (tipos de intervención y sus dos fases) y de **Construir en Lanzarote**.
- [ ] Logotipo: sigue siendo tipográfico y provisional («TERRA ANIMA» + «CB» volado).

### Verificaciones realizadas (servidor de desarrollo y build de producción, Chromium integrado)

| Comprobación | Resultado |
| --- | --- |
| `npm run build` | Sin errores; 9 páginas en `dist/` |
| Marcadores sin sustituir y menciones a la plantilla en `dist/` | Ninguno |
| Claves, tokens o secretos en `dist/` | Ninguno |
| Errores de JavaScript (9 páginas, build de producción) | Ninguno |
| Un `h1` por página, IDs únicos, JSON-LD válido | Sí (portada y 4 servicios con JSON-LD) |
| Enlaces internos | 16 URL distintas: todas 200, anclas existentes |
| Desbordamiento horizontal y elementos recortados | Ninguno en las 9 páginas a 320, 375, 390, 768, 810, 885, 1024, 1200 y 1440 px |
| Formulario | Errores en línea al enviar vacío, foco en el primer error, tipo preseleccionado con `?tipo=`, aviso de que no se envía |
| Menú móvil | Abre, cierra con Escape, devuelve el foco y bloquea el scroll |
| Muro de lamas | 21 lamas a 1440 px; gira 120° cada 5 s |
| Movimiento reducido (`?motion=reduce`, portada) | Los 142 elementos animados se ven completos y sin transformar; el muro de lamas no se construye y queda la foto fija |
| Consola y red (build de producción, 9 páginas) | Sin mensajes; todas las peticiones 200/304 |
| Comparación con la plantilla a 1440 px (posiciones medidas) | Portada: hero (texto en x 614, 721 px de ancho; botones en y 844), títulos de sección y alturas de proceso, expertise, testimonio, noticias, FAQ y pie dentro de ±10–76 px. Estudio, servicios, contacto y detalle: título en y 177 (181 en la plantilla), columnas de detalle 469/704 px como en la plantilla |

### Diferencias conocidas con la plantilla

- **Servicios (portada):** cuatro filas en lugar de seis, porque la empresa tiene cuatro líneas de servicio; la sección mide ~390 px menos.
- **Logotipo:** «Terra Anima» es más largo que el nombre de la plantilla; en móvil y tablet el tamaño se reduce para que quepa con el menú (61 px a 390 px en lugar de 72 px).
- **Detalle de servicio:** la entradilla es más larga que la de la plantilla, así que la foto de cabecera baja unos 115 px.
- **Cronología:** tres hitos en lugar de cuatro.
- **Animaciones finas** (curvas exactas, retardos de Framer, hover de cada tarjeta): reproducidas a partir de lo observado, no extraídas del código de la plantilla. No se han comparado fotograma a fotograma.
- **No comprobado:** Safari/iOS, Firefox, `prefers-reduced-motion` desde el sistema (sí con `?motion=reduce`) y dispositivos táctiles reales.

## Deliberadamente omitido

Años de experiencia, número de obras, clientes, testimonios, premios, certificaciones, plazos,
garantías y ubicaciones de proyectos: no hay ninguna fuente que los confirme.
