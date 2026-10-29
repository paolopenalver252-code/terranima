// Portfolio. `npm run pages` (incluido en dev y build) genera a partir de este archivo:
// - partials/portfolio.html, la sección «Proyectos» de la portada;
// - proyectos/<slug>/index.html, una ficha por proyecto.
//
// Mientras `proyectos` esté vacío, la portada muestra `referencias`: imágenes de arquitectura
// marcadas como referencia visual, que NO son obras de CB Terra Anima.
// En cuanto se añada el primer proyecto real, la portada pasa a mostrar los proyectos.

/**
 * Proyecto real de CB Terra Anima. Solo con datos y fotografías confirmados por la empresa.
 * Las fotos se añaden a scripts/images.manifest.json (o como archivo propio en assets-src/raw)
 * y se ejecuta `npm run images`.
 *
 * {
 *   slug: 'casa-en-teguise',              // URL: /proyectos/casa-en-teguise/
 *   name: 'Casa en Teguise',              // nombre del proyecto
 *   type: 'Rehabilitación',               // Obra nueva | Reforma | Rehabilitación | Reparación y conservación
 *   place: 'Teguise, Lanzarote',          // municipio o zona (sin dirección exacta)
 *   year: '2026',                         // opcional
 *   cover: 'nombre-imagen',               // imagen principal (clave de src/images.json)
 *   alt: 'Descripción de la imagen principal',
 *   gallery: [['nombre-imagen', 'texto alternativo'], ...],
 *   summary: 'Una frase para la portada.',
 *   body: ['Párrafo 1', 'Párrafo 2'],     // contexto breve de la obra
 *   facts: [['Superficie', '120 m²'], ['Duración', '6 meses']], // opcional, solo datos reales
 *   credit: 'Fotografía: …',              // opcional
 * }
 */
export const proyectos = [];

// Referencias visuales (ilustrativas) para la portada mientras no haya proyectos publicados.
export const referencias = [
  {
    img: 'srv-obra-nueva',
    alt: 'Vivienda contemporánea de hormigón con escalera de acceso y jardín',
    type: 'Obra nueva',
    title: 'Volúmenes de hormigón y jardín',
    href: '/servicios/obra-nueva/',
  },
  {
    img: 'mat-escalera-canaria',
    alt: 'Edificio blanco con contraventanas verdes y escalera exterior',
    type: 'Rehabilitación',
    title: 'Arquitectura tradicional de la isla',
    href: '/servicios/rehabilitacion/',
  },
  {
    img: 'n-salon',
    alt: 'Salón contemporáneo con grandes ventanales y sofá gris',
    type: 'Reforma',
    title: 'Interiores abiertos a la luz',
    href: '/servicios/reformas/',
  },
  {
    img: 'n-hormigon-patio',
    alt: 'Patio interior de hormigón visto con vegetación',
    type: 'Obra nueva',
    title: 'Patios y materiales a la vista',
    href: '/servicios/obra-nueva/',
  },
];
