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
