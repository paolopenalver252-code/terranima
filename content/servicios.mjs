// Contenido de las páginas de servicio. `npm run pages` (incluido en dev y build) genera
// servicios/<slug>/index.html a partir de este archivo.
//
// Criterio editorial (ver REVISION.md):
// - Hechos de la empresa: solo los confirmados en el registro mercantil (actividad de
//   construcción completa, reforma, rehabilitación, reparación y conservación de edificaciones
//   residenciales y no residenciales; sede en Arrecife).
// - Contexto de Lanzarote y normativa: información general, presentada como tal, nunca como
//   especialidad de la empresa.
// - Procesos de trabajo: redacción provisional, pendiente de validar con el cliente.
// Se admite HTML en línea (enlaces, <strong>) en los textos.

export const services = [
  /* ================================================================ OBRA NUEVA */
  {
    slug: 'obra-nueva',
    num: '01',
    name: 'Obra nueva',
    place: 'en Lanzarote',
    select: 'Obra nueva',
    metaTitle: 'Obra nueva en Lanzarote: construcción de viviendas y edificios | CB Terra Anima',
    metaDescription:
      'Construcción de obra nueva en Lanzarote: viviendas y edificios residenciales y no residenciales, de la cimentación a los acabados, con planificación por fases. Solicita una valoración.',
    serviceType: 'Construcción de obra nueva',
    hero: {
      image: 'srv-obra-nueva',
      alt: 'Vivienda contemporánea de hormigón con escalera de acceso y jardín',
      lead:
        'Levantar un edificio desde cero es el encargo más completo de la construcción: reúne terreno, proyecto, estructura, instalaciones y acabados en una misma obra. Construimos viviendas y edificaciones residenciales y no residenciales en Lanzarote, con la planificación y la coordinación de los trabajos como base de todo lo demás.',
      facts: [
        ['Para', 'Viviendas y edificios, residenciales o no'],
        ['Alcance', 'Construcción completa, de la cimentación a los acabados'],
        ['Punto de partida', 'Proyecto técnico y licencia municipal'],
      ],
    },
    sections: [
      {
        id: 'cuando',
        toc: 'Cuándo encaja',
        title: 'Para quién es una obra nueva',
        type: 'cards',
        items: [
          {
            title: 'Tienes una parcela y quieres construir tu vivienda',
            text: 'El punto de partida más habitual: un solar, una idea de casa y la necesidad de convertirla en un edificio terminado.',
          },
          {
            title: 'Tienes el proyecto y buscas quién lo ejecute',
            text: 'Si ya trabajas con un arquitecto y el proyecto técnico está redactado, el siguiente paso es estudiar su ejecución y preparar el presupuesto de obra.',
          },
          {
            title: 'Necesitas un edificio para una actividad',
            text: 'Además de viviendas, la actividad de la empresa incluye edificaciones no residenciales, como locales o edificios destinados a un uso profesional.',
          },
          {
            title: 'Aún estás valorando si construir',
            text: 'Si todavía estás estudiando el terreno o el alcance, también es buen momento para hablar: entender la obra pronto ayuda a decidir con más información.',
          },
        ],
      },
      {
        id: 'fases',
        toc: 'Fases de la obra',
        title: 'Qué abarca una construcción completa',
        intro:
          'Una obra nueva recorre una secuencia que no admite atajos: cada fase se apoya en la anterior. Este es, a grandes rasgos, el recorrido de un edificio de nueva planta. El alcance concreto de cada encargo se define en el presupuesto, a partir del proyecto.',
        type: 'steps',
        items: [
          {
            title: 'Terreno y replanteo',
            text: 'Se prepara la parcela y se marca sobre el terreno la posición exacta del edificio, tal como la define el proyecto.',
          },
          {
            title: 'Cimentación y estructura',
            text: 'La base de todo lo que viene después. Cómo se resuelve lo determina el proyecto a partir del estudio del terreno.',
          },
          {
            title: 'Cerramientos y cubierta',
            text: 'Fachadas, muros y cubierta cierran el edificio y lo protegen del sol, del viento y de la humedad.',
          },
          {
            title: 'Instalaciones',
            text: 'Agua, saneamiento, electricidad y el resto de redes previstas en el proyecto, que conviene dejar resueltas antes de cerrar paredes y techos.',
          },
          {
            title: 'Acabados',
            text: 'Revestimientos, pavimentos, carpinterías y pintura: la parte del edificio que se ve y se usa a diario.',
          },
          {
            title: 'Revisión y entrega',
            text: 'Repaso del conjunto, corrección de detalles y entrega de la obra terminada.',
          },
        ],
      },
      {
        id: 'planificacion',
        toc: 'Planificación',
        title: 'Planificar es la mitad de la obra',
        intro:
          'La mayoría de los problemas de una obra —retrasos, sobrecostes, trabajos que hay que deshacer— se originan antes de empezar, cuando algo no se ha definido o no se ha coordinado. Por eso la planificación no es un trámite: es parte del trabajo.',
        type: 'principles',
        items: [
          {
            title: 'Partidas y calidades',
            text: 'Qué se va a construir y con qué materiales, desglosado por partidas, para que el presupuesto se pueda leer y comparar.',
          },
          {
            title: 'Orden de los trabajos',
            text: 'Qué va antes y qué después, y cómo encajan los distintos oficios para que ninguno tenga que esperar ni deshacer el trabajo de otro.',
          },
          {
            title: 'Seguimiento por fases',
            text: 'Puntos de revisión a lo largo de la obra para comprobar que lo ejecutado corresponde a lo previsto antes de seguir avanzando.',
          },
          {
            title: 'Cambios e imprevistos',
            text: 'Cómo se comunican y se valoran los cambios que surjan durante la obra, siempre antes de ejecutarlos.',
          },
        ],
        note: 'Una obra bien planificada te permite saber en cada momento en qué fase está, qué viene después y por qué.',
      },
      {
        id: 'lanzarote',
        toc: 'Construir en Lanzarote',
        title: 'Construir en Lanzarote',
        intro:
          'Cada parcela de la isla tiene sus propias condiciones, y conviene tenerlas en cuenta desde el principio del proyecto.',
        type: 'panel',
        image: 'mat-la-geria',
        alt: 'Viñedo sobre picón volcánico con muros de piedra seca',
        items: [
          {
            title: 'El terreno',
            text: 'El suelo volcánico es muy variable: picón, coladas de lava y rellenos pueden convivir a poca distancia. El estudio geotécnico del proyecto indica cómo debe resolverse la cimentación.',
          },
          {
            title: 'El clima',
            text: 'Sol intenso, viento casi constante y, cerca de la costa, ambiente salino. Son factores que influyen en la elección de materiales, protecciones y acabados exteriores.',
          },
          {
            title: 'El paisaje y la normativa',
            text: 'Lanzarote cuida especialmente la integración de la arquitectura en el paisaje. El planeamiento insular y las ordenanzas municipales pueden regular la altura, los volúmenes o los colores de fachada y carpintería.',
          },
        ],
      },
      {
        id: 'antes',
        toc: 'Antes de empezar',
        title: 'Qué conviene tener claro antes de empezar',
        type: 'checklist',
        items: [
          '<strong>La situación urbanística de la parcela:</strong> si es edificable y qué permite construir el planeamiento.',
          '<strong>El proyecto técnico:</strong> además de ser necesario para la licencia, es lo que permite presupuestar con precisión.',
          '<strong>La licencia de obra,</strong> que concede el ayuntamiento del municipio donde está la parcela.',
          '<strong>Un presupuesto realista,</strong> con un margen razonable para imprevistos.',
          '<strong>Los plazos:</strong> los trámites previos también forman parte del calendario.',
        ],
      },
      {
        id: 'preguntas',
        toc: 'Preguntas frecuentes',
        title: 'Preguntas frecuentes sobre obra nueva',
        type: 'faq',
        items: [
          {
            q: '¿Necesito un proyecto de arquitectura para construir una casa?',
            a: 'Sí. Una edificación de nueva planta necesita un proyecto técnico redactado por un técnico competente —en el caso de una vivienda, un arquitecto— y la licencia municipal correspondiente. Si todavía no lo tienes, cuéntanos en qué punto estás.',
          },
          {
            q: '¿Cuánto cuesta construir una vivienda en Lanzarote?',
            a: 'Depende de la superficie, del terreno, del proyecto y de las calidades elegidas, así que no es posible dar una cifra fiable sin estudiar el caso. Con el proyecto, o al menos con una descripción detallada, se puede preparar una valoración por partidas.',
          },
          {
            q: '¿Cuánto tiempo lleva una obra nueva?',
            a: 'Varía con el tamaño y la complejidad del edificio, el terreno y los trámites previos. El calendario se plantea por fases al planificar la obra, para que sepas qué se hace en cada momento.',
          },
          {
            q: '¿Construís también edificios que no son viviendas?',
            a: 'Sí. La actividad de CB Terra Anima comprende tanto edificaciones residenciales como no residenciales.',
          },
          {
            q: '¿Puedo pedir presupuesto si aún no tengo la licencia?',
            a: 'Sí. Con el proyecto técnico se puede estudiar la obra y preparar una valoración antes de que la licencia esté concedida; de hecho, conviene hacerlo para planificar con tiempo.',
          },
        ],
      },
    ],
    cta: {
      title: '¿Tienes una parcela o un proyecto en marcha?',
      text: 'Cuéntanos dónde está, qué quieres construir y en qué fase se encuentra. Con esa información estudiamos el caso y te planteamos los siguientes pasos.',
      button: 'Solicitar valoración de obra nueva',
    },
  },

  /* ================================================================ REFORMAS */
  {
    slug: 'reformas',
    num: '02',
    name: 'Reformas',
    place: 'en Lanzarote',
    select: 'Reforma',
    metaTitle: 'Reformas en Lanzarote: reformas integrales y parciales de viviendas y locales | CB Terra Anima',
    metaDescription:
      'Reformas integrales y parciales de viviendas y locales en Lanzarote. Estudiamos el inmueble antes de presupuestar y ordenamos la obra por fases. Cuéntanos qué quieres cambiar.',
    serviceType: 'Reforma de viviendas y locales',
    hero: {
      image: 'srv-reforma',
      alt: 'Estancia vacía y luminosa con un gran ventanal, lista para reformar',
      lead:
        'Una reforma transforma un espacio que ya existe para que funcione mejor: otra distribución, instalaciones al día, acabados renovados. Puede abarcar toda la vivienda o el local, o centrarse en una parte. En los dos casos, lo que marca la diferencia es estudiar bien el inmueble antes de empezar y ordenar los trabajos con criterio.',
      facts: [
        ['Para', 'Viviendas y locales'],
        ['Tipos', 'Reforma integral o parcial'],
        ['Punto de partida', 'Visita y estudio del inmueble'],
      ],
    },
    sections: [
      {
        id: 'tipos',
        toc: 'Integral o parcial',
        title: 'Dos maneras de reformar',
        type: 'compare',
        items: [
          {
            title: 'Reforma integral',
            text: 'Se actúa sobre todo el inmueble a la vez: distribución, instalaciones y acabados.',
            fits: [
              'La vivienda o el local se han quedado anticuados en su conjunto.',
              'Quieres cambiar la forma de usar el espacio.',
              'Las instalaciones están al final de su vida útil.',
            ],
            note: 'Normalmente obliga a dejar libre el inmueble durante la obra y suele requerir más trámites.',
          },
          {
            title: 'Reforma parcial',
            text: 'Se interviene en una zona o un elemento concreto: una estancia como la cocina o un baño, una planta o la carpintería exterior.',
            fits: [
              'El problema o la necesidad están localizados.',
              'Prefieres repartir la inversión en el tiempo.',
              'Necesitas seguir usando el resto del inmueble.',
            ],
            note: 'Conviene revisar cómo afecta al resto: instalaciones compartidas o acabados que deben enlazar con lo existente.',
          },
        ],
        note: 'No siempre está claro cuál conviene. A veces una reforma parcial bien planteada resuelve el problema; otras, sumar varias pequeñas acaba costando más que una integral. Estudiar el inmueble ayuda a decidir.',
      },
      {
        id: 'estudio',
        toc: 'Estudiar el inmueble',
        title: 'Antes de presupuestar, entender el inmueble',
        intro:
          'Las reformas se complican sobre todo por lo que no se ve. Revisar el estado real del inmueble antes de cerrar el alcance evita buena parte de las sorpresas.',
        type: 'cards',
        items: [
          {
            title: 'Qué quieres conseguir',
            text: 'Cómo vives o trabajas en el espacio, qué falla, qué sobra y qué echas en falta. La reforma tiene que responder a eso.',
          },
          {
            title: 'El estado de lo existente',
            text: 'Instalaciones antiguas, humedades, el estado de suelos, techos y carpinterías. Lo que aparezca aquí condiciona el alcance y el presupuesto.',
          },
          {
            title: 'Lo que se puede tocar y lo que no',
            text: 'Muros de carga, elementos comunes en edificios de viviendas o la propia fachada tienen limitaciones que hay que conocer antes de proyectar cambios.',
          },
          {
            title: 'Los vecinos y la comunidad',
            text: 'En edificios de viviendas, la obra afecta a zonas comunes, horarios y, a veces, a elementos compartidos. Conviene preverlo y comunicarlo antes de empezar.',
          },
        ],
      },
      {
        id: 'fases',
        toc: 'Cómo se ordena',
        title: 'Cómo se ordena una reforma',
        intro:
          'El orden de los trabajos importa tanto como su calidad: hacer las cosas en la secuencia correcta evita deshacer lo que ya está terminado.',
        type: 'steps',
        items: [
          {
            title: 'Visita y toma de datos',
            text: 'Medimos, revisamos el estado del inmueble y escuchamos qué quieres cambiar.',
          },
          {
            title: 'Alcance y presupuesto',
            text: 'Definimos qué se hace, con qué materiales y en qué orden, en un presupuesto por partidas.',
          },
          {
            title: 'Preparación',
            text: 'Protección de lo que se conserva y retirada de lo que se va a sustituir.',
          },
          {
            title: 'Lo que queda oculto',
            text: 'Primero las redes, la tabiquería y los soportes: una vez cerrados, ya no es posible acceder a ellos sin deshacer trabajo.',
          },
          {
            title: 'Acabados',
            text: 'Revestimientos, pavimentos, carpinterías y pintura, cuando todo lo anterior está terminado y revisado.',
          },
          {
            title: 'Revisión y entrega',
            text: 'Repaso final contigo, limpieza y entrega del espacio.',
          },
        ],
      },
      {
        id: 'lanzarote',
        toc: 'Reformar en Lanzarote',
        title: 'Reformar en Lanzarote',
        intro: 'Las viviendas y locales de la isla tienen sus particularidades, y una reforma es buen momento para atenderlas.',
        type: 'panel',
        image: 'mat-volumen-blanco',
        alt: 'Volúmenes blancos de una vivienda contra el cielo azul',
        items: [
          {
            title: 'Edificios de distintas épocas',
            text: 'Conviven casas tradicionales con muros de piedra y edificios de bloque de las últimas décadas. Cada sistema constructivo condiciona qué se puede cambiar y cómo.',
          },
          {
            title: 'Ambiente marino',
            text: 'En inmuebles cercanos a la costa, el salitre acelera el deterioro de carpinterías, elementos metálicos e instalaciones exteriores. La reforma es una ocasión para revisarlos.',
          },
          {
            title: 'Luz y ventilación',
            text: 'El sol y el viento de la isla son un recurso: una nueva distribución puede aprovechar mejor la orientación, la ventilación cruzada y la sombra.',
          },
        ],
      },
      {
        id: 'preguntas',
        toc: 'Preguntas frecuentes',
        title: 'Preguntas frecuentes sobre reformas',
        type: 'faq',
        items: [
          {
            q: '¿Puedo seguir viviendo en casa durante la reforma?',
            a: 'En una reforma parcial, a veces sí, organizando la obra por zonas. En una integral, lo habitual es dejar la vivienda libre mientras duran los trabajos. Depende del alcance, y es algo que conviene decidir al planificar la obra.',
          },
          {
            q: '¿Necesito licencia para reformar mi vivienda?',
            a: 'Depende del alcance y del municipio. Las obras menores suelen tramitarse con una comunicación previa o una licencia de obra menor; si se modifica de forma importante la distribución, la estructura o la fachada, lo habitual es necesitar licencia de obra y proyecto técnico. Conviene confirmarlo con el ayuntamiento antes de empezar.',
          },
          {
            q: '¿Qué pasa si aparece un imprevisto durante la obra?',
            a: 'Al abrir paredes o suelos puede aparecer algo que no se veía, como una instalación en mal estado. Lo razonable es explicarlo, valorarlo y acordarlo antes de seguir, para que no se ejecute nada sin que lo sepas.',
          },
          {
            q: '¿Reformáis locales comerciales?',
            a: 'Sí. La reforma de espacios no residenciales, como locales, forma parte de la actividad de la empresa. En estos casos hay que tener en cuenta, además, los requisitos propios de la actividad que se vaya a desarrollar.',
          },
          {
            q: 'Reforma integral o por partes: ¿qué sale más a cuenta?',
            a: 'No hay una respuesta única. Una integral concentra molestias y trámites en una sola obra; hacerlo por partes reparte la inversión, pero puede obligar a rehacer trabajos. La decisión es más fácil con el estado del inmueble delante.',
          },
        ],
      },
    ],
    cta: {
      title: '¿Qué te gustaría cambiar?',
      text: 'Cuéntanos cómo es el inmueble, qué parte quieres reformar y qué esperas conseguir. Con eso podemos preparar una primera valoración y concretar la visita.',
      button: 'Solicitar valoración de reforma',
    },
  },

  /* ================================================================ REHABILITACIÓN */
  {
    slug: 'rehabilitacion',
    num: '03',
    name: 'Rehabilitación',
    place: 'de edificios en Lanzarote',
    select: 'Rehabilitación',
    metaTitle: 'Rehabilitación de viviendas y edificios en Lanzarote | CB Terra Anima',
    metaDescription:
      'Rehabilitación de viviendas y edificios existentes en Lanzarote: evaluación del estado, intervención sobre cubiertas, fachadas, estructura e instalaciones, y respeto por la arquitectura tradicional.',
    serviceType: 'Rehabilitación de edificios',
    hero: {
      image: 'srv-rehabilitacion',
      alt: 'Casa tradicional encalada con puerta y ventana verdes en Lanzarote',
      lead:
        'Rehabilitar es devolver a un edificio existente las condiciones para seguir usándose con seguridad durante muchos años más. A diferencia de la reforma, que cambia cómo se usa un espacio, la rehabilitación actúa sobre el propio edificio: su cubierta, sus fachadas, su estructura, sus instalaciones. Y cuando la construcción tiene valor tradicional, busca mejorarla sin borrar lo que la hace reconocible.',
      facts: [
        ['Para', 'Viviendas y edificios existentes'],
        ['Objetivo', 'Seguridad, habitabilidad y durabilidad'],
        ['Punto de partida', 'Evaluación del estado del edificio'],
      ],
    },
    sections: [
      {
        id: 'cuando',
        toc: 'Cuándo plantearla',
        title: 'Cuándo plantear una rehabilitación',
        type: 'cards',
        items: [
          {
            title: 'El deterioro ya no es puntual',
            text: 'Filtraciones en la cubierta, fachadas degradadas, carpinterías que no protegen, instalaciones obsoletas: cuando los problemas se suman, toca mirar el edificio en conjunto.',
          },
          {
            title: 'Una casa tradicional que recuperar',
            text: 'Viviendas antiguas que se quieren volver a habitar adaptándolas a las necesidades actuales, sin perder su carácter.',
          },
          {
            title: 'Un edificio que lleva tiempo sin uso',
            text: 'Inmuebles cerrados durante años que necesitan ponerse al día antes de volver a utilizarse.',
          },
          {
            title: 'Daños que se repiten',
            text: 'Si se repara una y otra vez lo mismo, suele ser señal de que hay que atender la causa y no solo el síntoma.',
          },
        ],
        aside: {
          title: '¿Reforma o rehabilitación?',
          text: 'La reforma cambia el uso y la distribución de un espacio; la rehabilitación recupera el estado del edificio. Muchas obras combinan las dos. Si lo que buscas es sobre todo redistribuir o renovar, consulta <a href="/servicios/reformas/">reformas</a>.',
        },
      },
      {
        id: 'evaluar',
        toc: 'Evaluar antes de intervenir',
        title: 'Primero, el diagnóstico',
        intro:
          'En un edificio existente, decidir qué hacer exige saber qué le pasa y por qué. Una buena evaluación distingue lo urgente de lo que puede esperar y evita invertir en arreglos que no atacan el origen del problema.',
        type: 'steps',
        items: [
          {
            title: 'Inspección',
            text: 'Recorrido por la cubierta, las fachadas, la estructura visible, las carpinterías y las instalaciones para conocer el estado general del edificio.',
          },
          {
            title: 'Causas',
            text: 'Identificar por qué aparecen los daños: agua, movimientos, materiales incompatibles, falta de mantenimiento…',
          },
          {
            title: 'Prioridades',
            text: 'Ordenar las actuaciones según su urgencia y su efecto sobre el resto del edificio.',
          },
          {
            title: 'Técnico, cuando corresponde',
            text: 'Si hay daños en la estructura o el edificio está protegido, la intervención requiere un técnico competente que redacte el proyecto y dirija la obra.',
          },
        ],
      },
      {
        id: 'elementos',
        toc: 'Sobre qué se actúa',
        title: 'Los elementos de un edificio',
        intro: 'Una rehabilitación puede abarcar uno o varios de estos elementos. El alcance concreto se define tras la evaluación.',
        type: 'cards',
        items: [
          {
            title: 'Cubierta',
            text: 'La primera defensa frente al agua. En la isla abundan las cubiertas planas, donde el estado de la impermeabilización y de los desagües es decisivo.',
          },
          {
            title: 'Fachadas y muros',
            text: 'Protegen del sol, del viento y de la humedad. Fisuras, desconchados o revestimientos sueltos indican que han empezado a perder esa función.',
          },
          {
            title: 'Estructura',
            text: 'Muros de carga, forjados, vigas y pilares. Cualquier daño en ellos requiere una valoración técnica antes de intervenir.',
          },
          {
            title: 'Carpinterías',
            text: 'Ventanas, puertas y contraventanas. Cuando no cierran bien, dejan pasar agua, aire y polvo.',
          },
          {
            title: 'Instalaciones',
            text: 'Agua, saneamiento y electricidad envejecen con el edificio. En una rehabilitación conviene comprobar si siguen siendo adecuadas y seguras.',
          },
        ],
      },
      {
        id: 'criterio',
        toc: 'Mejorar sin borrar',
        title: 'Mejorar sin borrar',
        intro:
          'Rehabilitar bien es encontrar el equilibrio entre tres cosas: que el edificio funcione como se necesita hoy, que dure, y que conserve lo que tiene valor.',
        type: 'principles',
        items: [
          {
            title: 'Conservar lo que funciona',
            text: 'Un muro sano, una carpintería recuperable o una cubierta que solo necesita mantenimiento no tienen por qué sustituirse.',
          },
          {
            title: 'Sustituir con criterio',
            text: 'Lo que ya no cumple su función se cambia pensando en cómo se va a comportar con el paso del tiempo.',
          },
          {
            title: 'Compatibilidad',
            text: 'Los materiales nuevos tienen que convivir con los existentes: una solución adecuada para un edificio reciente puede no serlo para uno tradicional.',
          },
        ],
      },
      {
        id: 'lanzarote',
        toc: 'Rehabilitar en Lanzarote',
        title: 'Rehabilitar en Lanzarote',
        intro: 'La arquitectura de la isla tiene una identidad muy reconocible, y rehabilitarla exige conocerla.',
        type: 'panel',
        image: 'mat-escalera-canaria',
        alt: 'Edificio blanco con contraventanas verdes y escalera exterior',
        items: [
          {
            title: 'Arquitectura tradicional',
            text: 'Muros gruesos de piedra, paramentos encalados, cubiertas planas y carpintería de madera pintada definen la casa tradicional lanzaroteña. Entender cómo funciona es el punto de partida para intervenir en ella.',
          },
          {
            title: 'Edificios protegidos',
            text: 'Si el inmueble está catalogado o forma parte de un conjunto histórico, la intervención está más regulada y conviene consultar sus condiciones antes de proyectar.',
          },
          {
            title: 'Un clima exigente',
            text: 'El sol, el viento y la cercanía del mar desgastan especialmente fachadas, carpinterías y elementos metálicos. La rehabilitación es la ocasión de protegerlos para los próximos años.',
          },
        ],
      },
      {
        id: 'preguntas',
        toc: 'Preguntas frecuentes',
        title: 'Preguntas frecuentes sobre rehabilitación',
        type: 'faq',
        items: [
          {
            q: '¿Qué diferencia hay entre reformar y rehabilitar?',
            a: 'La reforma cambia cómo se usa un espacio: su distribución, sus instalaciones o sus acabados. La rehabilitación recupera el estado del edificio actuando sobre sus elementos constructivos. En la práctica, muchas obras combinan las dos.',
          },
          {
            q: '¿Se puede rehabilitar un edificio por fases?',
            a: 'En muchos casos, sí: se empieza por lo urgente —normalmente lo que afecta a la seguridad o a la entrada de agua— y se planifica el resto. La evaluación inicial sirve precisamente para ordenar esas fases.',
          },
          {
            q: '¿Hay ayudas para rehabilitar una vivienda?',
            a: 'Existen programas públicos de ayudas a la rehabilitación —estatales, autonómicos y, en ocasiones, municipales— cuyas condiciones cambian con cada convocatoria. Conviene consultarlos antes de empezar, porque algunos exigen presentar la solicitud antes del inicio de la obra.',
          },
          {
            q: '¿Se puede mantener el carácter de una casa tradicional?',
            a: 'Es uno de los objetivos de una buena rehabilitación: identificar qué elementos dan carácter a la casa y conservarlos o recuperarlos, mientras se mejora lo necesario para vivir en ella hoy. Hasta dónde se puede llegar depende del estado de cada elemento.',
          },
        ],
      },
    ],
    cta: {
      title: '¿Tienes un edificio que recuperar?',
      text: 'Cuéntanos qué tipo de edificio es, su antigüedad aproximada y qué problemas observas. Con esa información planteamos cómo evaluarlo.',
      button: 'Solicitar valoración de rehabilitación',
    },
  },

  /* ================================================================ REPARACIÓN Y CONSERVACIÓN */
  {
    slug: 'reparacion-y-conservacion',
    num: '04',
    name: 'Reparación y conservación',
    place: 'de edificios en Lanzarote',
    select: 'Reparación y conservación',
    metaTitle: 'Reparación y conservación de edificios en Lanzarote | CB Terra Anima',
    metaDescription:
      'Reparación y conservación de viviendas, locales y edificios en Lanzarote: diagnóstico de la causa, reparación de daños y mantenimiento para que los problemas no crezcan.',
    serviceType: 'Reparación y conservación de edificios',
    hero: {
      image: 'srv-conservacion',
      alt: 'Detalle de un muro encalado con un hueco en sombra',
      lead:
        'Un edificio que se revisa y se repara a tiempo dura más y da menos problemas. La conservación consiste en atender el desgaste antes de que se convierta en un daño; la reparación, en resolver los daños cuando aparecen, empezando siempre por entender su causa.',
      facts: [
        ['Para', 'Viviendas, locales y edificios'],
        ['Enfoque', 'Entender la causa antes de reparar'],
        ['Objetivo', 'Mantener el edificio en buen estado'],
      ],
    },
    sections: [
      {
        id: 'valor',
        toc: 'Por qué conservar',
        title: 'Lo que cuesta no hacer nada',
        intro:
          'Aplazar una reparación casi nunca la abarata. El mantenimiento tiene poco brillo, pero es lo que permite que un edificio llegue en buen estado a sus próximas décadas.',
        type: 'principles',
        items: [
          {
            title: 'Los daños crecen',
            text: 'Una pequeña filtración acaba afectando al revestimiento, al aislamiento y, con el tiempo, a la estructura. Cuanto antes se atiende, menor es la intervención.',
          },
          {
            title: 'La seguridad',
            text: 'Revestimientos sueltos, barandillas oxidadas o cornisas dañadas pueden convertirse en un riesgo para quien vive en el edificio o pasa junto a él.',
          },
          {
            title: 'Una obligación del propietario',
            text: 'La normativa obliga a mantener los edificios en condiciones de seguridad, salubridad y ornato. Conservar es también cumplir con ese deber.',
          },
        ],
      },
      {
        id: 'senales',
        toc: 'Señales de alerta',
        title: 'Señales que conviene revisar',
        type: 'checklist',
        columns: true,
        items: [
          'Fisuras o grietas nuevas, o que crecen con el tiempo.',
          'Manchas de humedad, moho o pintura que se abomba.',
          'Revestimientos que suenan huecos o se desprenden.',
          'Óxido en barandillas, rejas o armaduras que asoman en el hormigón.',
          'Filtraciones en los techos después de llover.',
          'Carpinterías que no cierran bien o dejan pasar agua y aire.',
        ],
        note: 'Ninguna de estas señales indica por sí sola la gravedad del problema, pero todas merecen una revisión antes de que avancen.',
      },
      {
        id: 'proceso',
        toc: 'Cómo lo abordamos',
        title: 'Primero la causa, después la reparación',
        intro:
          'Reparar el síntoma sin resolver su origen suele significar volver a reparar al cabo de un tiempo. Por eso el trabajo empieza antes de coger la herramienta.',
        type: 'steps',
        items: [
          {
            title: 'Revisión',
            text: 'Vemos el daño y su entorno: dónde está, desde cuándo aparece y cómo ha evolucionado.',
          },
          {
            title: 'Diagnóstico',
            text: 'Buscamos el origen del problema. Si afecta a la estructura, es necesaria la valoración de un técnico competente.',
          },
          {
            title: 'Propuesta',
            text: 'Te explicamos qué conviene hacer, qué es urgente y qué puede planificarse más adelante, con su presupuesto.',
          },
          {
            title: 'Reparación',
            text: 'Ejecución de los trabajos acordados y comprobación del resultado.',
          },
          {
            title: 'Qué vigilar después',
            text: 'Indicaciones sencillas para detectar a tiempo si el problema vuelve a aparecer.',
          },
        ],
      },
      {
        id: 'lanzarote',
        toc: 'El desgaste en Lanzarote',
        title: 'El desgaste en Lanzarote',
        intro: 'El clima de la isla es amable para vivir, pero exigente con los edificios.',
        type: 'panel',
        image: 'mat-cal-y-cactus',
        alt: 'Cactus sobre un muro encalado',
        items: [
          {
            title: 'Salitre',
            text: 'Cerca del mar, la sal en el ambiente acelera la corrosión de los elementos metálicos y de las armaduras del hormigón.',
          },
          {
            title: 'Sol y viento',
            text: 'La radiación y el viento cargado de polvo y arena envejecen pinturas, sellados y revestimientos exteriores.',
          },
          {
            title: 'Lluvias escasas pero intensas',
            text: 'Llueve poco, pero cuando lo hace, cubiertas planas y desagües se ponen a prueba. Un mantenimiento descuidado se nota en el primer episodio de lluvia.',
          },
        ],
      },
      {
        id: 'calendario',
        toc: 'Qué revisar y cuándo',
        title: 'Qué revisar y cuándo',
        type: 'calendar',
        items: [
          {
            title: 'Antes de las lluvias',
            when: 'Otoño',
            text: 'Cubierta y desagües despejados; juntas y sellados de la azotea en buen estado.',
          },
          {
            title: 'Una vez al año',
            when: 'Revisión general',
            text: 'Fachadas, barandillas y elementos metálicos; carpinterías exteriores y sus sellados.',
          },
          {
            title: 'Cuando ocurra algo',
            when: 'Sin esperar',
            text: 'Después de una tormenta, un golpe o una fuga, revisa cuanto antes la zona afectada.',
          },
        ],
        note: 'Es una guía orientativa: la frecuencia adecuada depende de la antigüedad, la exposición y el estado de cada edificio.',
      },
      {
        id: 'preguntas',
        toc: 'Preguntas frecuentes',
        title: 'Preguntas frecuentes sobre reparación y conservación',
        type: 'faq',
        items: [
          {
            q: '¿Una grieta es siempre un problema estructural?',
            a: 'No todas las fisuras indican un problema en la estructura, pero conviene revisarlas, sobre todo si son nuevas, crecen o atraviesan el muro. Si hay dudas sobre la estructura, debe valorarlas un técnico competente.',
          },
          {
            q: '¿Cuándo es mejor reparar y cuándo rehabilitar?',
            a: 'Si el daño es puntual, una reparación suele bastar. Si los problemas se repiten o afectan a varios elementos a la vez, quizá convenga plantear una <a href="/servicios/rehabilitacion/">rehabilitación</a> del edificio.',
          },
          {
            q: '¿Qué información necesitáis para valorar una reparación?',
            a: 'Dónde está el inmueble, qué daño observas, desde cuándo y si ha cambiado con el tiempo. Si tienes fotos, indícalo en el mensaje: ayudan a hacerse una primera idea antes de la visita.',
          },
          {
            q: '¿Cada cuánto conviene revisar un edificio?',
            a: 'Como referencia, una revisión general al año y otra de la cubierta antes de la temporada de lluvias. En edificios antiguos o muy expuestos al mar, conviene hacerlo con más frecuencia.',
          },
        ],
      },
    ],
    cta: {
      title: '¿Has notado algún daño?',
      text: 'Descríbelo, indica dónde está y desde cuándo lo observas. A partir de ahí te diremos cómo valorarlo.',
      button: 'Solicitar valoración de reparación',
    },
  },
];
