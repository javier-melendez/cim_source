const componentes = [
  { id: "emisor", nombre: "Emisor" },
  { id: "codificacion", nombre: "Codificación" },
  { id: "mensaje", nombre: "Mensaje" },
  { id: "canal", nombre: "Canal o transmisión" },
  { id: "decodificacion", nombre: "Decodificación" },
  { id: "receptor", nombre: "Receptor" },
  { id: "retroalimentacion", nombre: "Retroalimentación" }
];

const niveles = [
  {
    titulo: "Audio entre ruido",
    situacion: "Ana graba una nota de voz con las instrucciones de una tarea mientras está en una cafetería ruidosa. En el audio la fecha de entrega se escucha confusa; Carlos cree haber entendido, pero no confirma.",
    averias: ["canal", "decodificacion", "retroalimentacion"],
    casoComponentes: {
      emisor: "Ana",
      codificacion: "Ana convierte la tarea en una explicación oral",
      mensaje: "Fecha de entrega e instrucciones de la tarea",
      canal: "Nota de voz con partes difíciles de oír",
      decodificacion: "Carlos interpreta una fecha distinta",
      receptor: "Carlos",
      retroalimentacion: "Carlos no confirma lo que entendió",
      ruido: "Ruido físico de la cafetería que se cuela en la grabación"
    },
    reparaciones: [
      { id: "n1-r1", texto: "Reenviar la instrucción por un canal más claro, por ejemplo texto o una nota de voz sin ruido.", destino: "canal" },
      { id: "n1-r2", texto: "Carlos debe revisar la fecha que interpretó antes de actuar con esa información.", destino: "decodificacion" },
      { id: "n1-r3", texto: "Carlos confirma: '¿La entrega es el jueves 12?'.", destino: "retroalimentacion" },
      { id: "n1-r4", texto: "Cambiar el color del cuaderno donde se anotó la tarea.", destino: "distractor" },
      { id: "n1-r5", texto: "Pedir a Ana que hable con palabras más técnicas.", destino: "distractor" }
    ],
    pistas: [
      "El ruido afecta la transmisión, pero el circuito también necesita interpretación cuidadosa y cierre con respuesta.",
      "Repara el canal usado, la decodificación de Carlos y la retroalimentación de confirmación."
    ],
    explicacion: "La comunicación funciona porque el canal ya no arrastra tanto ruido, Carlos revisa el significado recibido y la retroalimentación confirma la fecha.",
    mensajeExito: "El audio llegó limpio y Carlos confirmó la tarea."
  },
  {
    titulo: "Concepto demasiado técnico",
    situacion: "Un profesor explica por primera vez un concepto complejo usando términos especializados que sus estudiantes aún no conocen.",
    averias: ["codificacion", "receptor"],
    casoComponentes: {
      emisor: "Profesor",
      codificacion: "El profesor elige palabras demasiado especializadas",
      mensaje: "Concepto nuevo que debe comprenderse",
      canal: "Explicación oral en el aula",
      decodificacion: "Estudiantes intentan interpretar términos desconocidos",
      receptor: "Audiencia principiante con pocos conocimientos previos",
      retroalimentacion: "Preguntas o señales de comprensión del grupo",
      ruido: "Ruido semántico: las palabras técnicas bloquean el significado"
    },
    reparaciones: [
      { id: "n2-r1", texto: "Traducir el concepto a palabras sencillas y ejemplos cercanos.", destino: "codificacion" },
      { id: "n2-r2", texto: "Tomar en cuenta conocimientos previos, edad y experiencia de la audiencia.", destino: "receptor" },
      { id: "n2-r3", texto: "Subir el volumen sin cambiar las palabras usadas.", destino: "distractor" },
      { id: "n2-r4", texto: "Cambiar el salón aunque todos puedan escuchar.", destino: "distractor" },
      { id: "n2-r5", texto: "Agregar más términos especializados a la diapositiva.", destino: "distractor" }
    ],
    pistas: [
      "El problema no es de volumen ni de medio: es la forma elegida para una audiencia concreta.",
      "Repara la codificación del profesor y la adaptación al receptor como público principiante."
    ],
    explicacion: "El profesor codifica con lenguaje accesible y considera las características del receptor; así reduce el ruido semántico.",
    mensajeExito: "La explicación ahora conecta con el grupo."
  },
  {
    titulo: "Urgencia por correo",
    situacion: "Laura necesita avisarle a Mateo que cambiaron el salón de una reunión en 20 minutos, pero le escribe por correo a una cuenta que Mateo revisa solo al final del día.",
    averias: ["canal"],
    casoComponentes: {
      emisor: "Laura",
      codificacion: "Aviso escrito de forma directa",
      mensaje: "Cambio de salón en 20 minutos",
      canal: "Correo que Mateo revisa tarde",
      decodificacion: "Lectura del correo cuando sea visto",
      receptor: "Mateo",
      retroalimentacion: "Confirmación de recibido",
      ruido: "Ruido temporal: el mensaje puede llegar después de que ya no sirva"
    },
    reparaciones: [
      { id: "n3-r1", texto: "Usar un canal que Mateo revise de inmediato, como llamada o mensaje directo.", destino: "canal" },
      { id: "n3-r2", texto: "Escribir el correo en mayúsculas para que parezca más urgente.", destino: "distractor" },
      { id: "n3-r3", texto: "Enviar el mismo correo varias veces sin cambiar el medio.", destino: "distractor" },
      { id: "n3-r4", texto: "Esperar al día siguiente para preguntar si lo vio.", destino: "distractor" }
    ],
    pistas: [
      "La urgencia exige elegir un medio compatible con los hábitos del receptor.",
      "Solo hay una avería: el dispositivo o canal de transmisión."
    ],
    explicacion: "El canal adecuado conecta la urgencia del mensaje con los hábitos reales del receptor.",
    mensajeExito: "La información viajó por un medio oportuno."
  },
  {
    titulo: "Sí, entendí",
    situacion: "Después de una explicación, un estudiante responde 'sí, entendí' aunque todavía tiene dudas. Quien explicó continúa sin verificar si hubo comprensión real.",
    averias: ["retroalimentacion"],
    casoComponentes: {
      emisor: "Persona que explica",
      codificacion: "Explicación dada al estudiante",
      mensaje: "Contenido que debía comprenderse",
      canal: "Conversación en clase",
      decodificacion: "El estudiante interpreta parcialmente el contenido",
      receptor: "Estudiante",
      retroalimentacion: "Respuesta superficial: 'sí, entendí'",
      ruido: "Dudas ocultas por pena o presión"
    },
    reparaciones: [
      { id: "n4-r1", texto: "Pedir que el estudiante explique con sus propias palabras o responda una pregunta de comprobación.", destino: "retroalimentacion" },
      { id: "n4-r2", texto: "Usar un micrófono más potente.", destino: "distractor" },
      { id: "n4-r3", texto: "Cambiar el color del marcador.", destino: "distractor" },
      { id: "n4-r4", texto: "Hacer que el estudiante copie más rápido.", destino: "distractor" }
    ],
    pistas: [
      "La respuesta existe, pero no permite saber si hubo comprensión real.",
      "Repara la verificación entre receptor y emisor."
    ],
    explicacion: "La retroalimentación deja de ser superficial y permite confirmar si el mensaje fue entendido.",
    mensajeExito: "La duda salió a la luz y el circuito cerró."
  },
  {
    titulo: "Señal confusa",
    situacion: "En la entrada de un laboratorio hay una señal que mezcla advertencias, horarios y excepciones. La instrucción principal queda ambigua y varias personas no saben qué hacer.",
    averias: ["mensaje"],
    casoComponentes: {
      emisor: "Responsable de la señal",
      codificacion: "Texto escrito con varias formulaciones posibles",
      mensaje: "Instrucción principal mezclada con información secundaria",
      canal: "Señal visible en el espacio",
      decodificacion: "Lectores interpretan varias posibilidades",
      receptor: "Personas que necesitan actuar",
      retroalimentacion: "Dudas o preguntas sobre qué hacer",
      ruido: "Ruido informativo: exceso de datos compite con la instrucción clave"
    },
    reparaciones: [
      { id: "n5-r1", texto: "Separar lo esencial, eliminar ambigüedades y dejar una instrucción concreta.", destino: "mensaje" },
      { id: "n5-r2", texto: "Hacer la señal más grande sin cambiar su contenido.", destino: "distractor" },
      { id: "n5-r3", texto: "Poner más colores y más frases para llamar la atención.", destino: "distractor" },
      { id: "n5-r4", texto: "Culpar al receptor por leer lentamente.", destino: "distractor" },
      { id: "n5-r5", texto: "Apagar las luces alrededor de la señal.", destino: "distractor" }
    ],
    pistas: [
      "El problema está dentro de lo que se dice, no principalmente en quién lo dice ni por dónde viaja.",
      "Revisa estructura, claridad y precisión del mensaje."
    ],
    explicacion: "Un mensaje bien estructurado reduce interpretaciones erróneas y permite saber qué acción realizar.",
    mensajeExito: "La señal ahora comunica una instrucción clara."
  },
  {
    titulo: "Expresión con doble sentido",
    situacion: "Durante una conversación, una persona usa una expresión muy común en su región. La otra, que viene de un contexto cultural diferente, la entiende de forma literal y se confunde.",
    averias: ["codificacion", "decodificacion", "retroalimentacion"],
    casoComponentes: {
      emisor: "Persona que usa la expresión regional",
      codificacion: "Expresión cultural con doble sentido",
      mensaje: "Idea expresada con una frase contextual",
      canal: "Conversación entre dos personas",
      decodificacion: "La otra persona interpreta la frase literalmente",
      receptor: "Persona de contexto cultural diferente",
      retroalimentacion: "Falta una pregunta de aclaración",
      ruido: "Ruido cultural: una misma frase activa significados distintos"
    },
    reparaciones: [
      { id: "n6-r1", texto: "Elegir palabras menos locales o explicar el sentido de la expresión.", destino: "codificacion" },
      { id: "n6-r2", texto: "Interpretar la frase considerando el contexto cultural de quien la dijo.", destino: "decodificacion" },
      { id: "n6-r3", texto: "Preguntar: '¿Qué quieres decir con esa expresión?'.", destino: "retroalimentacion" },
      { id: "n6-r4", texto: "Hablar más rápido para no perder tiempo.", destino: "distractor" },
      { id: "n6-r5", texto: "Usar una plataforma distinta aunque ambos se escuchen bien.", destino: "distractor" }
    ],
    pistas: [
      "El significado se construye al formular, interpretar y aclarar.",
      "Repara la elección de palabras, la interpretación y la pregunta de confirmación."
    ],
    explicacion: "La expresión se formula con más contexto, se interpreta culturalmente y se aclara mediante retroalimentación.",
    mensajeExito: "El sentido compartido quedó conectado."
  },
  {
    titulo: "Chat con ironía",
    situacion: "En un chat de trabajo, Nicolás responde 'perfecto...' a una propuesta. Sin tono de voz ni contexto, Valeria interpreta que está de acuerdo, aunque Nicolás estaba siendo irónico.",
    averias: ["codificacion", "decodificacion", "retroalimentacion"],
    casoComponentes: {
      emisor: "Nicolás",
      codificacion: "Ironía escrita con puntos suspensivos",
      mensaje: "Evaluación negativa de la propuesta",
      canal: "Chat de trabajo sin tono de voz",
      decodificacion: "Valeria interpreta acuerdo literal",
      receptor: "Valeria",
      retroalimentacion: "Nadie pregunta si el comentario era aprobación o desacuerdo",
      ruido: "Ruido pragmático: la ironía pierde señales no verbales en texto"
    },
    reparaciones: [
      { id: "n7-r1", texto: "Expresar el desacuerdo de forma directa y respetuosa, sin depender de la ironía.", destino: "codificacion" },
      { id: "n7-r2", texto: "Valeria debe interpretar el mensaje considerando señales de duda y contexto previo.", destino: "decodificacion" },
      { id: "n7-r3", texto: "Preguntar: '¿Lo dices en serio o ves algún problema con la propuesta?'.", destino: "retroalimentacion" },
      { id: "n7-r4", texto: "Cambiar el fondo del chat para que se vea más formal.", destino: "distractor" },
      { id: "n7-r5", texto: "Responder con más puntos suspensivos para conservar el tono.", destino: "distractor" }
    ],
    pistas: [
      "El problema está en un significado implícito que no viaja bien por texto.",
      "Repara la forma de expresar la intención, la interpretación y la aclaración posterior."
    ],
    explicacion: "La comunicación mejora cuando la intención se codifica explícitamente, se interpreta con contexto y se verifica antes de actuar.",
    mensajeExito: "La ironía dejó de bloquear el acuerdo real."
  },
  {
    titulo: "Formulario médico",
    situacion: "Una clínica entrega a pacientes mayores un formulario con letra pequeña, términos administrativos y pasos mezclados. Varias personas firman sin entender qué autorizan.",
    averias: ["mensaje", "receptor", "retroalimentacion"],
    casoComponentes: {
      emisor: "Clínica",
      codificacion: "Lenguaje administrativo escrito",
      mensaje: "Autorizaciones y pasos del procedimiento",
      canal: "Formulario impreso",
      decodificacion: "Pacientes intentan comprender texto denso",
      receptor: "Pacientes mayores con necesidades de claridad y legibilidad",
      retroalimentacion: "No se confirma si entendieron antes de firmar",
      ruido: "Ruido visual y semántico: letra pequeña y términos poco familiares"
    },
    reparaciones: [
      { id: "n8-r1", texto: "Reorganizar el formulario con secciones claras, letra legible y autorización explícita.", destino: "mensaje" },
      { id: "n8-r2", texto: "Adaptar el material a pacientes mayores y a distintos niveles de alfabetización en salud.", destino: "receptor" },
      { id: "n8-r3", texto: "Pedir que el paciente explique qué está autorizando antes de firmar.", destino: "retroalimentacion" },
      { id: "n8-r4", texto: "Entregar más copias del mismo formulario sin explicarlo.", destino: "distractor" },
      { id: "n8-r5", texto: "Usar un sello rojo para que el documento parezca importante.", destino: "distractor" }
    ],
    pistas: [
      "Aquí la dificultad no es solo el papel como medio, sino la claridad y la verificación de comprensión.",
      "Revisa el mensaje, la adaptación al receptor y la retroalimentación antes de la firma."
    ],
    explicacion: "El formulario comunica mejor cuando el contenido es claro, se adapta a quienes lo leen y se verifica la comprensión.",
    mensajeExito: "La autorización ahora puede ser entendida."
  },
  {
    titulo: "Alerta en una app",
    situacion: "Una aplicación bancaria muestra una alerta de seguridad con un ícono rojo, pero el texto dice 'operación procesada'. El usuario no sabe si debe cancelar, llamar al banco o continuar.",
    averias: ["mensaje", "codificacion"],
    casoComponentes: {
      emisor: "Aplicación bancaria",
      codificacion: "Ícono de alarma combinado con texto tranquilizador",
      mensaje: "Estado de una operación de seguridad",
      canal: "Notificación dentro de la app",
      decodificacion: "Usuario recibe señales contradictorias",
      receptor: "Usuario de la aplicación",
      retroalimentacion: "Posible acción del usuario",
      ruido: "Ruido visual: color e ícono contradicen el texto"
    },
    reparaciones: [
      { id: "n9-r1", texto: "Hacer coherentes texto, color e ícono con la gravedad real de la alerta.", destino: "codificacion" },
      { id: "n9-r2", texto: "Redactar un mensaje que indique claramente qué ocurrió y qué acción tomar.", destino: "mensaje" },
      { id: "n9-r3", texto: "Agregar una animación más llamativa sin cambiar el contenido.", destino: "distractor" },
      { id: "n9-r4", texto: "Ocultar el aviso para no preocupar al usuario.", destino: "distractor" },
      { id: "n9-r5", texto: "Enviar la misma alerta cinco veces.", destino: "distractor" }
    ],
    pistas: [
      "El usuario recibe señales contradictorias dentro del mismo aviso.",
      "Repara cómo se representa el aviso y qué dice exactamente."
    ],
    explicacion: "La alerta funciona cuando sus signos visuales y su texto comunican el mismo estado y una acción clara.",
    mensajeExito: "La alerta ya orienta una decisión."
  },
  {
    titulo: "Rumor reenviado",
    situacion: "En un grupo familiar, alguien reenvía una cadena alarmante sin fuente ni fecha. Varias personas la interpretan como noticia actual y empiezan a compartirla.",
    averias: ["emisor", "mensaje", "decodificacion"],
    casoComponentes: {
      emisor: "Familiar que reenvía la cadena",
      codificacion: "Texto alarmante copiado de otro lugar",
      mensaje: "Advertencia sin fuente, fecha ni contexto",
      canal: "Grupo familiar de mensajería",
      decodificacion: "Familiares la interpretan como noticia vigente",
      receptor: "Miembros del grupo familiar",
      retroalimentacion: "Respuestas y reenvíos del grupo",
      ruido: "Ruido informacional: desinformación y ausencia de contexto verificable"
    },
    reparaciones: [
      { id: "n10-r1", texto: "El emisor debe verificar fuente y fecha antes de reenviar.", destino: "emisor" },
      { id: "n10-r2", texto: "Agregar contexto verificable: fuente, fecha y alcance real de la información.", destino: "mensaje" },
      { id: "n10-r3", texto: "Leer críticamente antes de asumir que es una noticia actual.", destino: "decodificacion" },
      { id: "n10-r4", texto: "Reenviar más rápido para que todos se enteren.", destino: "distractor" },
      { id: "n10-r5", texto: "Cambiar el nombre del grupo familiar.", destino: "distractor" }
    ],
    pistas: [
      "La cadena no falla por el volumen ni por el dispositivo: falla por responsabilidad, contenido y lectura crítica.",
      "Repara quién reenvía, qué información contiene el mensaje y cómo se interpreta."
    ],
    explicacion: "La comunicación responsable exige que el emisor verifique, el mensaje incluya contexto y el receptor decodifique críticamente.",
    mensajeExito: "La cadena dejó de circular como falsa certeza."
  },
  {
    titulo: "Instrucción por radio",
    situacion: "En una obra, la supervisora da por radio la orden 'suban la viga al segundo nivel'. La señal se corta justo cuando menciona cuál viga, y el equipo ejecuta la maniobra equivocada.",
    averias: ["canal", "mensaje", "retroalimentacion"],
    casoComponentes: {
      emisor: "Supervisora de obra",
      codificacion: "Orden oral breve por radio",
      mensaje: "Qué viga mover y hacia dónde",
      canal: "Radio con cortes de señal",
      decodificacion: "Equipo completa la orden con supuestos",
      receptor: "Equipo de maniobra",
      retroalimentacion: "No repiten la orden antes de ejecutarla",
      ruido: "Ruido técnico: señal intermitente en zona de construcción"
    },
    reparaciones: [
      { id: "n11-r1", texto: "Usar un canal estable o repetir la orden cuando la radio se corte.", destino: "canal" },
      { id: "n11-r2", texto: "Incluir identificadores precisos: número de viga, ubicación y destino.", destino: "mensaje" },
      { id: "n11-r3", texto: "Aplicar lectura de retorno: el equipo repite la orden antes de actuar.", destino: "retroalimentacion" },
      { id: "n11-r4", texto: "Dar la orden con más prisa para no retrasar la obra.", destino: "distractor" },
      { id: "n11-r5", texto: "Usar una palabra clave secreta sin explicarla.", destino: "distractor" }
    ],
    pistas: [
      "En tareas críticas, el circuito necesita precisión y confirmación, no solo rapidez.",
      "Repara el canal técnico, el contenido de la orden y el retorno antes de actuar."
    ],
    explicacion: "La orden se vuelve segura cuando viaja por un canal estable, contiene datos precisos y se confirma antes de ejecutarse.",
    mensajeExito: "La maniobra ahora sigue la orden correcta."
  },
  {
    titulo: "Campaña para jóvenes",
    situacion: "Una entidad pública publica una campaña sobre ahorro de agua con lenguaje burocrático en un boletín institucional, dirigida a adolescentes que usan redes sociales.",
    averias: ["codificacion", "canal", "receptor"],
    casoComponentes: {
      emisor: "Entidad pública",
      codificacion: "Lenguaje burocrático y distante",
      mensaje: "Hábitos para ahorrar agua",
      canal: "Boletín institucional poco usado por adolescentes",
      decodificacion: "Jóvenes encuentran el mensaje ajeno a su vida diaria",
      receptor: "Adolescentes",
      retroalimentacion: "Comentarios, preguntas o participación",
      ruido: "Ruido de pertinencia: formato y tono no compiten con otros contenidos juveniles"
    },
    reparaciones: [
      { id: "n12-r1", texto: "Usar lenguaje cercano, ejemplos cotidianos y llamados a la acción breves.", destino: "codificacion" },
      { id: "n12-r2", texto: "Publicar en canales donde los adolescentes realmente consumen contenido.", destino: "canal" },
      { id: "n12-r3", texto: "Diseñar el mensaje según intereses, hábitos y contexto de los jóvenes.", destino: "receptor" },
      { id: "n12-r4", texto: "Imprimir el boletín en papel más grueso.", destino: "distractor" },
      { id: "n12-r5", texto: "Usar frases más largas para que suene institucional.", destino: "distractor" }
    ],
    pistas: [
      "El problema combina lenguaje, medio y audiencia.",
      "Repara cómo se habla, dónde se publica y para quién se diseña."
    ],
    explicacion: "La campaña mejora cuando se codifica con lenguaje cercano, usa canales pertinentes y parte del receptor real.",
    mensajeExito: "El mensaje ambiental ahora puede conectar con jóvenes."
  },
  {
    titulo: "Videollamada multicultural",
    situacion: "En una reunión internacional, la gerente dice 'lo revisamos pronto' para no comprometer una fecha. Un equipo lo interpreta como 'mañana' y otro como 'cuando haya tiempo'.",
    averias: ["mensaje", "decodificacion", "retroalimentacion"],
    casoComponentes: {
      emisor: "Gerente de proyecto",
      codificacion: "Expresión diplomática sin fecha",
      mensaje: "Compromiso temporal impreciso",
      canal: "Videollamada internacional",
      decodificacion: "Equipos asignan plazos distintos a 'pronto'",
      receptor: "Equipos de distintos países",
      retroalimentacion: "No se pide una fecha concreta",
      ruido: "Ruido cultural y contextual sobre la urgencia de la palabra 'pronto'"
    },
    reparaciones: [
      { id: "n13-r1", texto: "Convertir 'pronto' en una fecha, hora o criterio verificable.", destino: "mensaje" },
      { id: "n13-r2", texto: "Interpretar el plazo con cautela y no asumir una fecha implícita.", destino: "decodificacion" },
      { id: "n13-r3", texto: "Preguntar y registrar: '¿Cuándo exactamente queda la revisión?'.", destino: "retroalimentacion" },
      { id: "n13-r4", texto: "Apagar las cámaras para ahorrar ancho de banda.", destino: "distractor" },
      { id: "n13-r5", texto: "Traducir solo el saludo de la reunión.", destino: "distractor" }
    ],
    pistas: [
      "El conflicto nace de una palabra temporal imprecisa.",
      "Repara el mensaje, la interpretación del plazo y la confirmación explícita."
    ],
    explicacion: "La coordinación mejora cuando el mensaje define un plazo verificable, se interpreta sin suposiciones y se confirma.",
    mensajeExito: "El equipo ahora comparte el mismo calendario."
  },
  {
    titulo: "Tutorial sin pasos",
    situacion: "Un creador publica un video tutorial de cocina. Muestra el resultado final y habla de ingredientes, pero omite cantidades y tiempos de cocción.",
    averias: ["mensaje", "codificacion"],
    casoComponentes: {
      emisor: "Creador del tutorial",
      codificacion: "Video narrado con demostraciones incompletas",
      mensaje: "Receta con ingredientes, cantidades y tiempos",
      canal: "Video en plataforma digital",
      decodificacion: "Audiencia intenta deducir pasos faltantes",
      receptor: "Personas que quieren cocinar la receta",
      retroalimentacion: "Comentarios con dudas sobre cantidades",
      ruido: "Ruido procedimental: faltan datos para reproducir el proceso"
    },
    reparaciones: [
      { id: "n14-r1", texto: "Añadir cantidades, tiempos y orden de pasos en el contenido.", destino: "mensaje" },
      { id: "n14-r2", texto: "Mostrar cada paso con apoyo visual y explicación sincronizada.", destino: "codificacion" },
      { id: "n14-r3", texto: "Poner música más fuerte durante la preparación.", destino: "distractor" },
      { id: "n14-r4", texto: "Publicar solo una foto del plato terminado.", destino: "distractor" },
      { id: "n14-r5", texto: "Responder con emojis a todas las preguntas.", destino: "distractor" }
    ],
    pistas: [
      "La audiencia ve el resultado, pero no recibe suficiente información para repetirlo.",
      "Repara el contenido de la receta y la forma audiovisual de explicarla."
    ],
    explicacion: "El tutorial comunica mejor cuando el mensaje contiene los datos necesarios y la codificación audiovisual muestra el proceso.",
    mensajeExito: "La receta ahora se puede seguir."
  },
  {
    titulo: "Correo con destinatarios ocultos",
    situacion: "Una coordinadora envía un correo con tareas a todo el equipo, pero no especifica quién debe hacer cada actividad. Todos creen que otra persona se encargará.",
    averias: ["mensaje", "receptor", "retroalimentacion"],
    casoComponentes: {
      emisor: "Coordinadora",
      codificacion: "Correo escrito de manera general",
      mensaje: "Lista de tareas sin responsables definidos",
      canal: "Correo al equipo completo",
      decodificacion: "Cada integrante interpreta que la tarea no le corresponde",
      receptor: "Equipo con roles diferentes",
      retroalimentacion: "Nadie confirma responsabilidades",
      ruido: "Ruido organizacional: difusión de responsabilidad"
    },
    reparaciones: [
      { id: "n15-r1", texto: "Asignar responsable, fecha y resultado esperado para cada tarea.", destino: "mensaje" },
      { id: "n15-r2", texto: "Dirigir cada tarea a la persona o rol que debe ejecutarla.", destino: "receptor" },
      { id: "n15-r3", texto: "Pedir confirmación de aceptación de cada responsable.", destino: "retroalimentacion" },
      { id: "n15-r4", texto: "Copiar a más personas para aumentar la presión.", destino: "distractor" },
      { id: "n15-r5", texto: "Cambiar la fuente del correo a negrita completa.", destino: "distractor" }
    ],
    pistas: [
      "El mensaje llega, pero no distribuye responsabilidades.",
      "Repara la precisión del contenido, el receptor asignado y la confirmación de compromiso."
    ],
    explicacion: "La coordinación funciona cuando el mensaje asigna tareas concretas, llega al receptor responsable y recibe confirmación.",
    mensajeExito: "Cada tarea ya tiene dueño."
  },
  {
    titulo: "Presentación con siglas",
    situacion: "Una investigadora presenta resultados a una comunidad local usando siglas, gráficos técnicos y escalas estadísticas que la audiencia no conoce.",
    averias: ["codificacion", "mensaje", "receptor"],
    casoComponentes: {
      emisor: "Investigadora",
      codificacion: "Siglas y gráficos técnicos",
      mensaje: "Resultados de la investigación",
      canal: "Presentación presencial con diapositivas",
      decodificacion: "La comunidad no logra interpretar escalas ni abreviaturas",
      receptor: "Comunidad local no especializada",
      retroalimentacion: "Preguntas de la audiencia",
      ruido: "Ruido técnico: distancia entre lenguaje experto y experiencia comunitaria"
    },
    reparaciones: [
      { id: "n16-r1", texto: "Traducir siglas y gráficos a explicaciones visuales comprensibles.", destino: "codificacion" },
      { id: "n16-r2", texto: "Priorizar hallazgos clave, implicaciones y ejemplos concretos.", destino: "mensaje" },
      { id: "n16-r3", texto: "Adaptar la presentación a intereses y conocimientos de la comunidad.", destino: "receptor" },
      { id: "n16-r4", texto: "Añadir más tablas con decimales para demostrar rigor.", destino: "distractor" },
      { id: "n16-r5", texto: "Leer las diapositivas más rápido para cubrir todo.", destino: "distractor" }
    ],
    pistas: [
      "El conocimiento experto necesita traducción para una audiencia no especializada.",
      "Repara la codificación, la selección del mensaje y la adaptación al receptor."
    ],
    explicacion: "La presentación comunica cuando convierte datos técnicos en significado útil para la comunidad.",
    mensajeExito: "Los resultados ahora son comprensibles."
  }
];

const estado = {
  nivel: 0,
  asignaciones: {},
  tarjetaSeleccionada: null,
  intentosNivel: 0,
  intentosTotales: 0,
  pistasUsadas: 0,
  puntajeTotal: 0,
  nivelesCompletados: 0,
  nivelesPuntuados: [],
  nivelResuelto: false,
  sonido: false
};

const $ = (selector) => document.querySelector(selector);
const modulosEl = $("#modulos");
const tarjetasEl = $("#tarjetas");
const mensajeEl = $("#mensaje-diagnostico");
const cajaEl = $(".caja-fusibles");
const bombillaEl = $("#bombilla");
const chispaEl = $("#chispa");

function iniciar() {
  cargarPreferencias();
  enlazarEventos();
  renderizarNivel();
}

function cargarPreferencias() {
  const guardado = JSON.parse(localStorage.getItem("electricistasProgreso") || "{}");
  estado.nivel = Number.isInteger(guardado.nivel) ? Math.min(guardado.nivel, niveles.length - 1) : 0;
  estado.puntajeTotal = guardado.puntajeTotal || 0;
  estado.nivelesCompletados = guardado.nivelesCompletados || 0;
  estado.intentosTotales = guardado.intentosTotales || 0;
  estado.nivelesPuntuados = Array.isArray(guardado.nivelesPuntuados) ? guardado.nivelesPuntuados : [];
  estado.sonido = localStorage.getItem("electricistasSonido") === "true";
  actualizarBotonSonido();
}

function guardarProgreso() {
  localStorage.setItem("electricistasProgreso", JSON.stringify({
    nivel: estado.nivel,
    puntajeTotal: estado.puntajeTotal,
    nivelesCompletados: estado.nivelesCompletados,
    intentosTotales: estado.intentosTotales,
    nivelesPuntuados: estado.nivelesPuntuados
  }));
}

function enlazarEventos() {
  $("#boton-probar").addEventListener("click", probarCircuito);
  $("#boton-pista").addEventListener("click", mostrarPista);
  $("#boton-reiniciar").addEventListener("click", reiniciarNivel);
  $("#boton-anterior").addEventListener("click", nivelAnterior);
  $("#boton-siguiente").addEventListener("click", siguienteNivel);
  $("#boton-volver").addEventListener("click", volverAJugar);
  $("#boton-borrar").addEventListener("click", borrarProgreso);
  $("#boton-sonido").addEventListener("click", alternarSonido);
}

function renderizarNivel() {
  const nivel = niveles[estado.nivel];
  estado.asignaciones = {};
  estado.tarjetaSeleccionada = null;
  estado.intentosNivel = 0;
  estado.pistasUsadas = 0;
  estado.nivelResuelto = false;
  cajaEl.classList.remove("activa");
  bombillaEl.className = "bombilla apagada";
  $("#boton-siguiente").disabled = estado.nivel >= estado.nivelesCompletados;
  $("#boton-anterior").disabled = estado.nivel === 0;
  $("#titulo-nivel").textContent = nivel.titulo;
  $("#texto-situacion").textContent = nivel.situacion;
  $("#texto-ruido").textContent = `Interferencia externa: ${nivel.casoComponentes?.ruido || "Sin interferencia destacada."}`;
  $("#ruido-circuito").textContent = nivel.casoComponentes?.ruido || "Interferencia externa";
  mensajeEl.textContent = "Detecta las averías del circuito y asigna solo las reparaciones necesarias.";
  renderizarModulos();
  renderizarTarjetas();
  actualizarIndicadores();
}

function renderizarModulos() {
  const nivel = niveles[estado.nivel];
  modulosEl.innerHTML = "";
  componentes.forEach((componente) => {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "modulo";
    boton.dataset.componente = componente.id;
    boton.setAttribute("aria-label", `Fusible ${componente.nombre}`);
    const detalleCaso = nivel.casoComponentes?.[componente.id] || "Revisa este punto de la comunicación";
    boton.innerHTML = `<span class="nombre">${componente.nombre}</span><span class="asignada">${detalleCaso}</span>`;
    if (nivel.averias.includes(componente.id)) boton.classList.add("averiado");
    boton.addEventListener("dragover", permitirSoltar);
    boton.addEventListener("drop", soltarTarjeta);
    boton.addEventListener("click", () => asignarSeleccionada(componente.id));
    modulosEl.appendChild(boton);
  });
}

function renderizarTarjetas() {
  tarjetasEl.innerHTML = "";
  mezclar(niveles[estado.nivel].reparaciones).forEach((reparacion) => {
    const tarjeta = document.createElement("button");
    tarjeta.type = "button";
    tarjeta.className = "tarjeta";
    tarjeta.draggable = true;
    tarjeta.dataset.reparacion = reparacion.id;
    tarjeta.textContent = reparacion.texto;
    tarjeta.addEventListener("dragstart", (evento) => {
      evento.dataTransfer.setData("text/plain", reparacion.id);
    });
    tarjeta.addEventListener("click", () => seleccionarTarjeta(reparacion.id));
    tarjetasEl.appendChild(tarjeta);
  });
}

function mezclar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function seleccionarTarjeta(id) {
  const tarjeta = obtenerTarjeta(id);
  if (!tarjeta || tarjeta.classList.contains("usada") || estado.nivelResuelto) return;
  estado.tarjetaSeleccionada = estado.tarjetaSeleccionada === id ? null : id;
  document.querySelectorAll(".tarjeta").forEach((el) => el.classList.toggle("seleccionada", el.dataset.reparacion === estado.tarjetaSeleccionada));
}

function permitirSoltar(evento) {
  evento.preventDefault();
}

function soltarTarjeta(evento) {
  evento.preventDefault();
  const id = evento.dataTransfer.getData("text/plain");
  asignarReparacion(id, evento.currentTarget.dataset.componente);
}

function asignarSeleccionada(componenteId) {
  if (!estado.tarjetaSeleccionada) return;
  asignarReparacion(estado.tarjetaSeleccionada, componenteId);
}

function asignarReparacion(reparacionId, componenteId) {
  if (estado.nivelResuelto) return;
  const tarjeta = obtenerTarjeta(reparacionId);
  if (!tarjeta || tarjeta.classList.contains("usada")) return;

  liberarComponente(componenteId);
  estado.asignaciones[componenteId] = reparacionId;
  tarjeta.classList.add("usada");
  tarjeta.classList.remove("seleccionada");
  tarjeta.draggable = false;
  estado.tarjetaSeleccionada = null;

  const modulo = obtenerModulo(componenteId);
  modulo.querySelector(".asignada").textContent = tarjeta.textContent;
  modulo.classList.add("reparado");
  mensajeEl.textContent = `Reparación asignada a ${nombreComponente(componenteId)}. Pulsa Probar circuito cuando termines.`;
}

function liberarComponente(componenteId) {
  const previa = estado.asignaciones[componenteId];
  if (!previa) return;
  const tarjetaPrevia = obtenerTarjeta(previa);
  if (tarjetaPrevia) {
    tarjetaPrevia.classList.remove("usada");
    tarjetaPrevia.draggable = true;
  }
  delete estado.asignaciones[componenteId];
  restaurarDetalleModulo(componenteId);
}

function restaurarDetalleModulo(componenteId) {
  const nivel = niveles[estado.nivel];
  const modulo = obtenerModulo(componenteId);
  if (!modulo) return;
  modulo.querySelector(".asignada").textContent = nivel.casoComponentes?.[componenteId] || "Revisa este punto de la comunicación";
  modulo.classList.remove("reparado", "activo");
}

function probarCircuito() {
  if (estado.nivelResuelto) return;
  const resultado = evaluar();
  estado.intentosTotales += 1;
  if (resultado.correcto) {
    completarNivel();
  } else {
    estado.intentosNivel += 1;
    const puntaje = calcularPuntajeNivel();
    bombillaEl.className = "bombilla parpadeo";
    activarChispa();
    reproducirSonido("error");
    mensajeEl.textContent = `El circuito todavía falla. Faltan ${resultado.faltantes} avería(s) por reparar correctamente. Pista: ${pistaActual()}`;
    setTimeout(() => { bombillaEl.className = "bombilla apagada"; }, 1100);
    $("#puntaje-nivel").textContent = puntaje;
  }
  actualizarIndicadores();
}

function evaluar() {
  const nivel = niveles[estado.nivel];
  const correctas = nivel.averias.filter((componenteId) => {
    const reparacion = nivel.reparaciones.find((item) => item.id === estado.asignaciones[componenteId]);
    return reparacion && reparacion.destino === componenteId;
  }).length;
  const extrasIncorrectas = Object.keys(estado.asignaciones).filter((componenteId) => !nivel.averias.includes(componenteId)).length;
  return {
    correcto: correctas === nivel.averias.length && extrasIncorrectas === 0 && Object.keys(estado.asignaciones).length === nivel.averias.length,
    faltantes: Math.max(nivel.averias.length - correctas + extrasIncorrectas, 1)
  };
}

function completarNivel() {
  estado.nivelResuelto = true;
  cajaEl.classList.add("activa");
  animarModulos();
  bombillaEl.className = "bombilla encendida";
  const puntaje = calcularPuntajeNivel();
  if (!estado.nivelesPuntuados.includes(estado.nivel)) {
    estado.puntajeTotal += puntaje;
    estado.nivelesPuntuados.push(estado.nivel);
  }
  estado.nivelesCompletados = Math.max(estado.nivelesCompletados, estado.nivel + 1);
  mensajeEl.textContent = `${niveles[estado.nivel].mensajeExito} ${niveles[estado.nivel].explicacion}`;
  $("#boton-siguiente").disabled = false;
  reproducirSonido("exito");
  guardarProgreso();
  actualizarIndicadores();
}

function animarModulos() {
  document.querySelectorAll(".modulo").forEach((modulo, indice) => {
    setTimeout(() => modulo.classList.add("activo"), indice * 150);
  });
}

function mostrarPista() {
  const nivel = niveles[estado.nivel];
  if (estado.nivelResuelto) {
    mensajeEl.textContent = nivel.explicacion;
    return;
  }
  estado.pistasUsadas = Math.min(estado.pistasUsadas + 1, nivel.pistas.length);
  mensajeEl.textContent = nivel.pistas[estado.pistasUsadas - 1];
  actualizarIndicadores();
}

function pistaActual() {
  const nivel = niveles[estado.nivel];
  return nivel.pistas[Math.min(estado.pistasUsadas, nivel.pistas.length - 1)];
}

function reiniciarNivel() {
  renderizarNivel();
}

function nivelAnterior() {
  if (estado.nivel === 0) return;
  estado.nivel -= 1;
  guardarProgreso();
  renderizarNivel();
}

function siguienteNivel() {
  if (estado.nivel < niveles.length - 1) {
    estado.nivel += 1;
    guardarProgreso();
    renderizarNivel();
  } else {
    mostrarFinal();
  }
}

function mostrarFinal() {
  guardarProgreso();
  $("#resumen-final").textContent = `Completaste ${niveles.length} niveles con ${estado.puntajeTotal} puntos y ${estado.intentosTotales} intento(s) registrados.`;
  $("#pantalla-final").classList.remove("oculta");
  $("#boton-volver").focus();
}

function volverAJugar() {
  estado.nivel = 0;
  estado.puntajeTotal = 0;
  estado.nivelesCompletados = 0;
  estado.intentosTotales = 0;
  estado.nivelesPuntuados = [];
  guardarProgreso();
  $("#pantalla-final").classList.add("oculta");
  renderizarNivel();
}

function borrarProgreso() {
  localStorage.removeItem("electricistasProgreso");
  estado.nivel = 0;
  estado.puntajeTotal = 0;
  estado.nivelesCompletados = 0;
  estado.intentosTotales = 0;
  estado.nivelesPuntuados = [];
  renderizarNivel();
}

function alternarSonido() {
  estado.sonido = !estado.sonido;
  localStorage.setItem("electricistasSonido", String(estado.sonido));
  actualizarBotonSonido();
  if (estado.sonido) reproducirSonido("exito");
}

function actualizarBotonSonido() {
  const boton = $("#boton-sonido");
  boton.setAttribute("aria-pressed", String(estado.sonido));
  boton.textContent = estado.sonido ? "Silenciar" : "Sonido";
}

function calcularPuntajeNivel() {
  return Math.max(0, 100 - (estado.intentosNivel * 15) - (estado.pistasUsadas * 7));
}

function actualizarIndicadores() {
  $("#nivel-actual").textContent = `${estado.nivel + 1}/${niveles.length}`;
  $("#puntaje-nivel").textContent = calcularPuntajeNivel();
  $("#puntaje-total").textContent = estado.puntajeTotal;
  $("#intentos").textContent = estado.intentosNivel;
}

function activarChispa() {
  chispaEl.classList.remove("activa");
  void chispaEl.offsetWidth;
  chispaEl.classList.add("activa");
}

function obtenerTarjeta(id) {
  return document.querySelector(`[data-reparacion="${id}"]`);
}

function obtenerModulo(id) {
  return document.querySelector(`[data-componente="${id}"]`);
}

function nombreComponente(id) {
  return componentes.find((componente) => componente.id === id)?.nombre || id;
}

function reproducirSonido(tipo) {
  if (!estado.sonido) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const contexto = new AudioContext();
  const oscilador = contexto.createOscillator();
  const ganancia = contexto.createGain();
  oscilador.type = tipo === "exito" ? "sine" : "sawtooth";
  oscilador.frequency.value = tipo === "exito" ? 660 : 140;
  ganancia.gain.setValueAtTime(0.08, contexto.currentTime);
  ganancia.gain.exponentialRampToValueAtTime(0.001, contexto.currentTime + 0.22);
  oscilador.connect(ganancia);
  ganancia.connect(contexto.destination);
  oscilador.start();
  oscilador.stop(contexto.currentTime + 0.24);
}

document.addEventListener("DOMContentLoaded", iniciar);
