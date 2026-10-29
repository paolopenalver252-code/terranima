// Datos de contacto y envío del formulario.
// Todos vacíos a propósito: NO se han podido verificar teléfono, correo ni WhatsApp.
// Rellenar solo con datos confirmados por el cliente; la web los mostrará automáticamente.
export const CONTACT = {
  phone: '', // ej. '+34 600 000 000'
  email: '', // ej. 'info@dominio.es'
  whatsapp: '', // número en formato internacional sin espacios, ej. '34600000000'
};

// Endpoint que recibe el formulario por POST (Formspree, Getform, función serverless…).
// Mientras esté vacío, el formulario valida en cliente y avisa de que NO se ha enviado nada.
export const FORM_ENDPOINT = '';

// Vídeo de fondo del hero (material provisional para la demo, no es obra de la empresa).
// Dos opciones; si hay archivo propio, tiene prioridad sobre Vimeo:
// - Archivo: copiarlo a public/video/ y poner aquí su ruta, p. ej. '/video/hero.mp4'.
// - Vimeo: URL del reproductor (la del código de inserción). Se inserta en modo fondo, sin sonido,
//   sin controles y sin cookies de seguimiento (dnt).
// Sin vídeo, con movimiento reducido o con ahorro de datos, el hero muestra la foto de portada.
export const HERO_VIDEO = {
  mp4: '',
  webm: '', // opcional, más ligero
  poster: '', // opcional: un fotograma del propio vídeo para mostrar mientras carga
  start: 23, // segundo en el que empieza el vídeo (y vuelve a empezar en cada vuelta del bucle)
  // «Cinematic Construction Process Time-lapse», Amitayush Priyadarshi, licencia CC0 (generado con IA)
  vimeo: 'https://player.vimeo.com/video/1118306244?h=4189e26bb2',
};
