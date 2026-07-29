(() => {
  "use strict";

  // Datos de los casos
  const relationWeights = {
    needAudience: 0.2,
    needMessage: 0.2,
    audienceMessage: 0.2,
    audienceMedia: 0.15,
    messageMedia: 0.15,
    needMedia: 0.1
  };

  const relationLabels = {
    needAudience: "Necesidad del público ↔ Público",
    needMessage: "Necesidad del público ↔ Mensaje",
    needMedia: "Necesidad del público ↔ Medio",
    audienceMessage: "Público ↔ Mensaje",
    audienceMedia: "Público ↔ Medio",
    messageMedia: "Mensaje ↔ Medio"
  };

  const maxScoreByCase = new Map();

  const knobConfig = [
    { key: "needs", stateKey: "need", title: "Necesidad del público", icon: "◎" },
    { key: "audiences", stateKey: "audience", title: "Público objetivo", icon: "◌" },
    { key: "messages", stateKey: "message", title: "Mensaje", icon: "✦" },
    { key: "media", stateKey: "medium", title: "Medio", icon: "▣" }
  ];

  const cases = [
    {
      id: "alimentacion-universitaria",
      title: "Alimentación universitaria",
      context: "Una empresa local lanzará un servicio de almuerzos saludables y económicos cerca de varias universidades.",
      problem: "El servicio necesita diferenciarse en un entorno saturado de restaurantes rápidos y opciones informales de bajo precio.",
      objective: "Lograr prueba del servicio y registros durante el primer mes.",
      difficulty: "Inicial",
      options: {
        needs: [
          opt("ahorrar-dinero", "Ahorrar dinero", "Busca reducir el costo de alimentación diaria.", ["precio", "economia", "accesibilidad"]),
          opt("comer-saludable", "Comer saludable", "Prioriza nutrición, bienestar y mejores hábitos.", ["salud", "bienestar", "nutricion"]),
          opt("ahorrar-tiempo", "Ahorrar tiempo", "Necesita resolver el almuerzo de forma rápida y práctica.", ["practicidad", "rapidez", "rutina"]),
          opt("comunidad", "Sentirse parte de una comunidad", "Valora compartir experiencias y pertenecer a un grupo.", ["comunidad", "social", "experiencia"]),
          opt("estatus", "Proyectar estatus", "Busca señales de exclusividad, distinción y reconocimiento.", ["estatus", "exclusividad", "aspiracional"])
        ],
        audiences: [
          opt("estudiantes-presupuesto", "Estudiantes con presupuesto limitado", "Universitarios que comparan precio, cercanía y conveniencia.", ["precio", "economia", "universidad", "joven"]),
          opt("profesionales-casa", "Profesionales jóvenes desde casa", "Trabajan remoto y buscan opciones prácticas durante la jornada.", ["practicidad", "joven", "rutina"]),
          opt("padres", "Padres con hijos pequeños", "Toman decisiones familiares condicionadas por tiempo y confianza.", ["familia", "confianza", "tiempo"]),
          opt("ejecutivos", "Ejecutivos de altos ingresos", "Valoran servicio premium, diferenciación y ahorro de tiempo.", ["estatus", "exclusividad", "tiempo"]),
          opt("deportistas", "Deportistas de alto rendimiento", "Buscan nutrición específica para objetivos físicos.", ["salud", "nutricion", "rendimiento"])
        ],
        messages: [
          opt("bien-sin-dinero", "Almuerza bien sin quedarte sin dinero", "Promete equilibrio entre buena comida y precio accesible.", ["precio", "economia", "salud"]),
          opt("nutricion-practica", "Nutrición práctica para días ocupados", "Conecta bienestar con conveniencia cotidiana.", ["salud", "practicidad", "rutina"]),
          opt("gastronomia-exclusiva", "Una experiencia gastronómica exclusiva", "Enfatiza estatus y sofisticación.", ["estatus", "exclusividad", "experiencia"]),
          opt("comparte-conecta", "Comparte, conecta y descubre nuevos sabores", "Convoca desde la experiencia social y comunitaria.", ["comunidad", "social", "experiencia"]),
          opt("rendimiento-plato", "El máximo rendimiento comienza en tu plato", "Asocia alimentación con desempeño físico.", ["salud", "nutricion", "rendimiento"])
        ],
        media: [
          opt("videos-cortos", "Videos cortos en TikTok e Instagram", "Formato visual y rápido para públicos jóvenes.", ["joven", "social", "rapidez"]),
          opt("muestras-campus", "Activaciones y muestras en el campus", "Permite prueba directa cerca del momento de decisión.", ["universidad", "experiencia", "accesibilidad"]),
          opt("revistas-empresariales", "Anuncios en revistas empresariales", "Canal formal orientado a perfiles corporativos.", ["estatus", "corporativo"]),
          opt("correo-corporativo", "Correo electrónico corporativo", "Canal funcional para trabajadores y organizaciones.", ["corporativo", "rutina"]),
          opt("patrocinios-deportivos", "Patrocinios de competencias deportivas", "Asocia la marca con rendimiento, salud y disciplina.", ["rendimiento", "salud", "experiencia"])
        ]
      },
      compatibility: {
        needAudience: scores("ahorrar-dinero|estudiantes-presupuesto:95,comer-saludable|deportistas:88,ahorrar-tiempo|profesionales-casa:82,comunidad|estudiantes-presupuesto:76,estatus|ejecutivos:92"),
        needMessage: scores("ahorrar-dinero|bien-sin-dinero:98,comer-saludable|nutricion-practica:90,ahorrar-tiempo|nutricion-practica:84,comunidad|comparte-conecta:94,estatus|gastronomia-exclusiva:95"),
        needMedia: scores("ahorrar-dinero|muestras-campus:86,comer-saludable|patrocinios-deportivos:78,ahorrar-tiempo|videos-cortos:76,comunidad|muestras-campus:88,estatus|revistas-empresariales:82"),
        audienceMessage: scores("estudiantes-presupuesto|bien-sin-dinero:96,deportistas|rendimiento-plato:92,ejecutivos|gastronomia-exclusiva:90,profesionales-casa|nutricion-practica:84,estudiantes-presupuesto|comparte-conecta:78"),
        audienceMedia: scores("estudiantes-presupuesto|muestras-campus:98,estudiantes-presupuesto|videos-cortos:88,profesionales-casa|correo-corporativo:78,ejecutivos|revistas-empresariales:84,deportistas|patrocinios-deportivos:92"),
        messageMedia: scores("bien-sin-dinero|muestras-campus:94,nutricion-practica|videos-cortos:82,gastronomia-exclusiva|revistas-empresariales:84,comparte-conecta|videos-cortos:86,rendimiento-plato|patrocinios-deportivos:96")
      }
    },
    makeCase("movilidad-sostenible", "Movilidad sostenible", "Una entidad municipal quiere aumentar el uso de la bicicleta para trayectos cortos.", "Muchos ciudadanos perciben la bicicleta como incómoda, insegura o poco compatible con sus rutinas.", "Cambiar percepciones y motivar al menos dos recorridos semanales en bicicleta.", "Intermedio", {
      needs: [["llegar-rapido", "Llegar rápido", "Busca reducir tiempos en trayectos cortos.", ["rapidez", "rutina"]], ["sentirse-seguro", "Sentirse seguro", "Necesita confianza en rutas, normas y condiciones.", ["seguridad", "confianza"]], ["ahorrar-transporte", "Ahorrar en transporte", "Quiere disminuir gasto semanal de movilidad.", ["precio", "economia"]], ["cuidar-ambiente", "Cuidar el ambiente", "Quiere que su movilidad reduzca impacto ambiental.", ["sostenibilidad", "ambiente"]], ["mejorar-salud", "Mejorar salud", "Valora movimiento diario y bienestar físico.", ["salud", "bienestar"]]],
      audiences: [["universitarios-urbanos", "Universitarios urbanos", "Se mueven entre campus, vivienda y zonas comerciales.", ["joven", "rutina", "precio"]], ["trabajadores-centro", "Trabajadores del centro", "Realizan desplazamientos cortos en horas pico.", ["rutina", "rapidez"]], ["familias-barrio", "Familias de barrio", "Evalúan seguridad y convivencia local.", ["familia", "seguridad", "confianza"]], ["ambientalistas", "Ciudadanos ambientalistas", "Están motivados por consumo responsable.", ["sostenibilidad", "ambiente", "comunidad"]], ["personas-sedentarias", "Personas sedentarias", "Quieren iniciar actividad física moderada.", ["salud", "bienestar"]]],
      messages: [["mas-rapido-bici", "En distancias cortas, la bici gana tiempo", "Reformula la bicicleta como solución eficiente.", ["rapidez", "rutina"]], ["rutas-seguras", "Rutas seguras para pedalear con confianza", "Reduce barreras de riesgo percibido.", ["seguridad", "confianza"]], ["menos-gasto", "Menos gasto, más ciudad para ti", "Une ahorro con apropiación urbana.", ["precio", "economia", "comunidad"]], ["cero-emisiones", "Cada recorrido cuenta para respirar mejor", "Apela al impacto ambiental acumulado.", ["sostenibilidad", "ambiente"]], ["salud-dos-ruedas", "Activa tu salud en dos ruedas", "Asocia la movilidad con bienestar cotidiano.", ["salud", "bienestar"]]],
      media: [["mapas-app", "Mapa interactivo de rutas", "Ayuda a planear trayectos y reducir incertidumbre.", ["seguridad", "rutina", "confianza"]], ["retos-redes", "Retos semanales en redes sociales", "Moviliza participación visible y hábitos repetidos.", ["joven", "comunidad", "bienestar"]], ["senalizacion-calle", "Señalización en ciclorrutas", "Interviene justo en el espacio de desplazamiento.", ["seguridad", "rapidez", "rutina"]], ["talleres-barriales", "Talleres en barrios", "Permite aprendizaje local y conversación comunitaria.", ["familia", "confianza", "comunidad"]], ["alianzas-empresas", "Alianzas con empresas", "Facilita incentivos para trabajadores.", ["rutina", "corporativo", "economia"]]]
    }),
    makeCase("educacion-financiera", "Educación financiera", "Una entidad financiera lanzará una herramienta gratuita para ayudar a jóvenes adultos a organizar sus gastos mensuales.", "El público reconoce que necesita organizarse, pero abandona rápido las herramientas que percibe como complejas o moralizantes.", "Conseguir que los usuarios prueben la herramienta y mantengan el hábito de registrar sus gastos.", "Avanzado", {
      needs: [["control-gastos", "Controlar gastos", "Quiere saber a dónde se va el dinero cada mes.", ["control", "claridad"]], ["evitar-deudas", "Evitar deudas", "Busca anticipar compromisos y reducir estrés financiero.", ["seguridad", "confianza"]], ["ahorrar-metas", "Ahorrar para metas", "Necesita conectar gastos diarios con proyectos personales.", ["aspiracional", "metas"]], ["simplicidad", "Hacerlo simple", "Rechaza procesos largos y tecnicismos.", ["practicidad", "rapidez"]], ["independencia", "Sentirse independiente", "Quiere tomar decisiones propias con más autonomía.", ["autonomia", "joven"]]],
      audiences: [["primer-empleo", "Jóvenes en primer empleo", "Empiezan a gestionar salario, obligaciones y ocio.", ["joven", "control", "metas"]], ["freelancers", "Freelancers con ingresos variables", "Necesitan visibilidad de entradas y salidas irregulares.", ["control", "seguridad", "rutina"]], ["estudiantes-trabajan", "Estudiantes que trabajan", "Combinan presupuesto limitado con metas de corto plazo.", ["joven", "precio", "metas"]], ["parejas-jovenes", "Parejas jóvenes", "Organizan gastos compartidos y decisiones de convivencia.", ["confianza", "metas"]], ["usuarios-bancarizados", "Usuarios bancarizados digitales", "Ya usan apps financieras y esperan experiencia fluida.", ["digital", "practicidad"]]],
      messages: [["ve-tu-dinero", "Ve claro tu dinero en cinco minutos", "Promete claridad rápida y accionable.", ["control", "claridad", "rapidez"]], ["menos-sustos", "Menos sustos al final del mes", "Conecta registro con tranquilidad financiera.", ["seguridad", "confianza"]], ["metas-posibles", "Tus metas empiezan con cada gasto registrado", "Vincula hábito financiero con aspiraciones personales.", ["aspiracional", "metas"]], ["sin-enredos", "Organiza tus gastos sin enredos", "Reduce fricción percibida y lenguaje técnico.", ["practicidad", "simplicidad"]], ["decide-tu", "Decide tú, no tu saldo", "Apela a autonomía y control personal.", ["autonomia", "control", "joven"]]],
      media: [["historias-instagram", "Historias interactivas en Instagram", "Permite demostraciones breves y participación inmediata.", ["joven", "digital", "rapidez"]], ["tutorial-app", "Tutorial dentro de la app", "Guía el primer uso en el momento exacto.", ["practicidad", "digital", "confianza"]], ["podcast-finanzas", "Podcast de finanzas personales", "Canal reflexivo para profundizar hábitos.", ["claridad", "confianza"]], ["webinars", "Webinars con expertos", "Construye credibilidad y respuesta a dudas.", ["confianza", "seguridad"]], ["alianzas-universidades", "Alianzas con universidades", "Acerca la herramienta a jóvenes en contexto educativo.", ["joven", "metas", "comunidad"]]]
    }),
    makeCase("salud-preventiva", "Salud preventiva", "Una red de clínicas quiere aumentar la asistencia a chequeos preventivos entre personas que no consultan hasta sentirse enfermas.", "La prevención se percibe como costosa, innecesaria o difícil de encajar en la agenda laboral y familiar.", "Incrementar reservas de chequeos generales durante una campaña de seis semanas.", "Intermedio", {
      needs: [["detectar-a-tiempo", "Detectar a tiempo", "Busca reducir incertidumbre y anticipar riesgos de salud.", ["prevencion", "seguridad", "confianza"]], ["ahorrar-costos-medicos", "Evitar gastos mayores", "Quiere prevenir tratamientos costosos por diagnósticos tardíos.", ["economia", "seguridad"]], ["cuidar-familia", "Cuidar a la familia", "Entiende la salud como responsabilidad compartida en casa.", ["familia", "cuidado", "confianza"]], ["resolver-rapido", "Resolver rápido", "Necesita citas simples, cercanas y compatibles con su rutina.", ["practicidad", "rapidez", "rutina"]], ["sentirse-activo", "Mantenerse activo", "Quiere sostener bienestar, energía y autonomía diaria.", ["bienestar", "autonomia", "salud"]]],
      audiences: [["trabajadores-ocupados", "Trabajadores con agenda apretada", "Postergan consultas por tiempo y trámites.", ["rutina", "rapidez", "practicidad"]], ["padres-cuidadores", "Padres y cuidadores", "Priorizan salud familiar y decisiones confiables.", ["familia", "cuidado", "confianza"]], ["adultos-45", "Adultos de 45 años o más", "Empiezan a reconocer riesgos acumulados y controles necesarios.", ["prevencion", "seguridad", "salud"]], ["independientes", "Trabajadores independientes", "Evalúan costo, flexibilidad y continuidad de ingresos.", ["economia", "autonomia", "rutina"]], ["usuarios-gimnasio", "Usuarios de gimnasios", "Ya invierten en bienestar y monitorean desempeño físico.", ["bienestar", "salud", "autonomia"]]],
      messages: [["consulta-hoy", "Un chequeo hoy puede evitar una urgencia mañana", "Conecta acción preventiva con reducción de riesgo.", ["prevencion", "seguridad"]], ["salud-sin-vueltas", "Chequeos claros, rápidos y sin vueltas", "Reduce fricción percibida para reservar y asistir.", ["practicidad", "rapidez"]], ["tranquilidad-casa", "Más tranquilidad para quienes cuentan contigo", "Apela al cuidado familiar y la confianza.", ["familia", "cuidado", "confianza"]], ["prevenir-cuesta-menos", "Prevenir cuesta menos que aplazar", "Enmarca la consulta como decisión económica inteligente.", ["economia", "prevencion"]], ["energia-dia-dia", "Cuida la energía que necesitas cada día", "Relaciona salud preventiva con bienestar cotidiano.", ["bienestar", "salud", "rutina"]]],
      media: [["recordatorios-whatsapp", "Recordatorios por WhatsApp", "Canal directo para agendar con baja fricción.", ["rapidez", "practicidad", "confianza"]], ["alianzas-empresas-salud", "Alianzas con empresas", "Lleva la reserva al contexto laboral.", ["rutina", "practicidad", "seguridad"]], ["charlas-colegios", "Charlas en colegios y jardines", "Alcanza a cuidadores desde espacios familiares.", ["familia", "cuidado", "comunidad"]], ["calculadora-riesgo", "Calculadora digital de riesgo", "Hace visible la prevención con datos personales.", ["prevencion", "digital", "seguridad"]], ["activaciones-gimnasios", "Activaciones en gimnasios", "Conecta chequeos con hábitos de bienestar.", ["bienestar", "salud", "experiencia"]]]
    }),
    makeCase("cultura-local", "Cultura local", "Un teatro independiente estrenará una temporada de obras contemporáneas con artistas emergentes de la ciudad.", "El público potencial asocia el teatro con planes costosos, formales o lejanos frente a otras opciones de entretenimiento.", "Aumentar la venta anticipada y atraer asistentes nuevos a las primeras funciones.", "Inicial", {
      needs: [["plan-diferente", "Vivir un plan diferente", "Busca salir de la rutina con una experiencia memorable.", ["experiencia", "novedad", "entretenimiento"]], ["apoyar-artistas", "Apoyar artistas locales", "Quiere que su consumo cultural tenga impacto cercano.", ["comunidad", "local", "proposito"]], ["salir-amigos", "Salir con amigos", "Valora planes sociales fáciles de coordinar.", ["social", "joven", "experiencia"]], ["precio-accesible", "Pagar un precio accesible", "Compara el costo con cine, bares y conciertos.", ["precio", "accesibilidad"]], ["sentirse-culto", "Sentirse conectado con la cultura", "Busca conversación, criterio y descubrimiento cultural.", ["cultura", "aspiracional", "novedad"]]],
      audiences: [["jovenes-creativos", "Jóvenes creativos", "Siguen propuestas artísticas y comparten hallazgos culturales.", ["joven", "cultura", "novedad"]], ["parejas-plan", "Parejas que buscan plan", "Quieren una salida distinta con buena relación costo-experiencia.", ["experiencia", "precio", "social"]], ["vecinos-sector", "Vecinos del sector", "Pueden asistir si perciben cercanía y pertenencia local.", ["local", "comunidad", "accesibilidad"]], ["empresas-bienestar", "Equipos de empresas", "Buscan actividades de integración fuera de la oficina.", ["corporativo", "social", "experiencia"]], ["publico-teatral", "Público teatral habitual", "Valora curaduría, dramaturgia y conversación cultural.", ["cultura", "aspiracional"]]],
      messages: [["noche-distinta", "Una noche distinta empieza en la sala", "Invita desde la experiencia y la novedad.", ["experiencia", "novedad"]], ["escena-local", "La escena local también se llena contigo", "Conecta asistencia con apoyo a artistas cercanos.", ["local", "comunidad", "proposito"]], ["trae-tu-grupo", "Trae tu grupo y cambia el plan de siempre", "Facilita la decisión social.", ["social", "joven", "experiencia"]], ["teatro-al-alcance", "Teatro al alcance de tu semana", "Reduce la barrera de precio y disponibilidad.", ["precio", "accesibilidad"]], ["conversa-otra-ciudad", "Sal con una historia para conversar", "Apela a descubrimiento y capital cultural.", ["cultura", "aspiracional", "novedad"]]],
      media: [["reels-ensayo", "Reels de ensayos y backstage", "Muestra energía creativa en formato social.", ["joven", "novedad", "digital"]], ["afiches-barrio", "Afiches en cafés y librerías", "Aprovecha puntos de encuentro locales.", ["local", "comunidad", "cultura"]], ["preventas-grupo", "Preventas para grupos", "Incentiva coordinación social con precio claro.", ["social", "precio", "accesibilidad"]], ["boletin-cultural", "Boletín cultural por correo", "Llega a públicos que buscan agenda curada.", ["cultura", "aspiracional"]], ["alianzas-empresas-cultura", "Alianzas con áreas de bienestar", "Convierte la función en actividad de equipo.", ["corporativo", "experiencia", "social"]]]
    }),
    makeCase("reciclaje-residencial", "Reciclaje residencial", "Una empresa de aseo implementará una nueva ruta de recolección selectiva en conjuntos residenciales.", "Aunque muchos vecinos dicen apoyar el reciclaje, separan mal los residuos o no recuerdan los días de recolección.", "Mejorar la separación en origen y aumentar la participación semanal de los hogares.", "Avanzado", {
      needs: [["hacerlo-facil", "Hacerlo fácil", "Necesita instrucciones claras que reduzcan errores cotidianos.", ["claridad", "practicidad"]], ["evitar-sanciones", "Evitar sanciones o reclamos", "Responde a normas internas y presión de administración.", ["norma", "seguridad"]], ["cuidar-entorno", "Cuidar el entorno", "Quiere reducir residuos y contaminación cercana.", ["sostenibilidad", "ambiente", "comunidad"]], ["orden-hogar", "Mantener orden en casa", "Busca separar sin ocupar demasiado espacio ni tiempo.", ["hogar", "rutina", "practicidad"]], ["dar-ejemplo", "Dar buen ejemplo", "Valora enseñar hábitos responsables a otros miembros del hogar.", ["familia", "educacion", "proposito"]]],
      audiences: [["administradores", "Administradores de conjuntos", "Pueden coordinar reglas, avisos y seguimiento.", ["norma", "comunidad", "seguridad"]], ["familias-apartamento", "Familias en apartamento", "Gestionan residuos con poco espacio y rutinas compartidas.", ["familia", "hogar", "rutina"]], ["residentes-jovenes", "Residentes jóvenes", "Prefieren recordatorios digitales y acciones simples.", ["joven", "digital", "practicidad"]], ["personal-servicios", "Personal de servicios generales", "Detecta errores de separación y opera puntos de acopio.", ["rutina", "claridad", "comunidad"]], ["vecinos-ambientales", "Vecinos líderes ambientales", "Motivan cambios colectivos y seguimiento voluntario.", ["sostenibilidad", "ambiente", "proposito"]]],
      messages: [["separa-en-dos", "Separa en dos pasos y listo", "Simplifica la conducta esperada.", ["claridad", "practicidad"]], ["dia-correcto", "El día correcto evita residuos rechazados", "Une norma, calendario y resultado visible.", ["norma", "seguridad", "rutina"]], ["menos-basura", "Menos basura para tu conjunto", "Relaciona acción individual con beneficio común.", ["sostenibilidad", "comunidad", "ambiente"]], ["cocina-ordenada", "Reciclar también cabe en tu cocina", "Reduce objeciones de espacio y orden doméstico.", ["hogar", "practicidad"]], ["ejemplo-casa", "El hábito que otros aprenden en casa", "Apela a educación y ejemplo familiar.", ["familia", "educacion", "proposito"]]],
      media: [["stickers-canecas", "Stickers en canecas y shuts", "Da instrucciones justo en el punto de decisión.", ["claridad", "rutina", "practicidad"]], ["whatsapp-conjunto", "Mensajes en WhatsApp del conjunto", "Refuerza días y reglas en canales vecinales.", ["digital", "comunidad", "rutina"]], ["cartel-ascensor", "Carteles en ascensores", "Usa tiempos de espera para recordar acciones.", ["hogar", "rutina", "claridad"]], ["reunion-administracion", "Reunión con administración", "Alinea normas, sanciones y responsabilidades.", ["norma", "seguridad", "comunidad"]], ["reto-por-torres", "Reto por torres o bloques", "Convierte la participación en logro colectivo.", ["sostenibilidad", "comunidad", "proposito"]]]
    })
  ];

  // Estado de la aplicación
  const storageKey = "sintonia-cim-progress";
  const state = {
    caseIndex: 0,
    round: 1,
    selections: { need: 0, audience: 0, message: 0, medium: 0 },
    history: [],
    evaluated: null,
    discussionMode: false,
    scoreRevealed: false
  };

  // Referencias al DOM
  const dom = {
    caseTitle: document.querySelector("#caseTitle"),
    caseContext: document.querySelector("#caseContext"),
    caseProblem: document.querySelector("#caseProblem"),
    caseObjective: document.querySelector("#caseObjective"),
    roundBadge: document.querySelector("#roundBadge"),
    difficultyBadge: document.querySelector("#difficultyBadge"),
    knobGrid: document.querySelector("#knobGrid"),
    evaluateButton: document.querySelector("#evaluateButton"),
    resetButton: document.querySelector("#resetButton"),
    newCaseButton: document.querySelector("#newCaseButton"),
    clearProgressButton: document.querySelector("#clearProgressButton"),
    discussionMode: document.querySelector("#discussionMode"),
    revealScoreButton: document.querySelector("#revealScoreButton"),
    scoreValue: document.querySelector("#scoreValue"),
    scoreLabel: document.querySelector("#scoreLabel"),
    progressFill: document.querySelector("#progressFill"),
    currentRoundScore: document.querySelector("#currentRoundScore"),
    bestScore: document.querySelector("#bestScore"),
    averageScore: document.querySelector("#averageScore"),
    feedbackPanel: document.querySelector("#feedbackPanel"),
    historyBody: document.querySelector("#historyBody"),
    helpButton: document.querySelector("#helpButton"),
    helpModal: document.querySelector("#helpModal"),
    closeHelpButton: document.querySelector("#closeHelpButton")
  };

  function opt(id, label, description, tags) {
    return { id, label, description, tags };
  }

  function scores(source) {
    return source.split(",").reduce((map, item) => {
      const [pair, value] = item.split(":");
      map[pair] = Number(value);
      return map;
    }, {});
  }

  function makeCase(id, title, context, problem, objective, difficulty, rawOptions) {
    const options = Object.fromEntries(Object.entries(rawOptions).map(([key, values]) => [key, values.map((item) => opt(...item))]));
    return { id, title, context, problem, objective, difficulty, options, compatibility: buildTagCompatibility(options) };
  }

  function buildTagCompatibility(options) {
    const relations = {
      needAudience: [options.needs, options.audiences],
      needMessage: [options.needs, options.messages],
      needMedia: [options.needs, options.media],
      audienceMessage: [options.audiences, options.messages],
      audienceMedia: [options.audiences, options.media],
      messageMedia: [options.messages, options.media]
    };
    const compatibility = {};
    Object.entries(relations).forEach(([key, [left, right]]) => {
      compatibility[key] = {};
      left.forEach((a) => right.forEach((b) => {
        const overlap = a.tags.filter((tag) => b.tags.includes(tag)).length;
        if (overlap >= 2) compatibility[key][`${a.id}|${b.id}`] = 92;
        if (overlap === 1) compatibility[key][`${a.id}|${b.id}`] = 76;
      }));
    });
    return compatibility;
  }

  function randomSelections(currentCase) {
    return {
      need: randomIndex(currentCase.options.needs.length),
      audience: randomIndex(currentCase.options.audiences.length),
      message: randomIndex(currentCase.options.messages.length),
      medium: randomIndex(currentCase.options.media.length)
    };
  }

  function randomIndex(total) {
    return Math.floor(Math.random() * total);
  }

  // Renderizado
  function render() {
    const currentCase = cases[state.caseIndex];
    dom.caseTitle.textContent = currentCase.title;
    dom.caseContext.textContent = currentCase.context;
    dom.caseProblem.textContent = currentCase.problem;
    dom.caseObjective.textContent = currentCase.objective;
    dom.roundBadge.textContent = `Ronda ${state.round}`;
    dom.difficultyBadge.textContent = currentCase.difficulty;
    dom.discussionMode.checked = state.discussionMode;
    renderKnobs(currentCase);
    renderResult();
    renderStats();
    renderHistory();
  }

  function renderKnobs(currentCase) {
    dom.knobGrid.textContent = "";
    knobConfig.forEach((config) => {
      const options = currentCase.options[config.key];
      const index = state.selections[config.stateKey];
      const option = options[index];
      const card = document.createElement("article");
      card.className = "knob-card";
      card.dataset.knob = config.stateKey;

      const title = element("div", "knob-title");
      const heading = document.createElement("h3");
      heading.textContent = config.title;
      const icon = element("span", "knob-icon", config.icon);
      icon.setAttribute("aria-hidden", "true");
      title.append(heading, icon);

      const dial = element("div", "dial");
      dial.tabIndex = 0;
      dial.setAttribute("role", "slider");
      dial.setAttribute("aria-label", config.title);
      dial.setAttribute("aria-valuemin", "1");
      dial.setAttribute("aria-valuemax", String(options.length));
      dial.setAttribute("aria-valuenow", String(index + 1));
      dial.setAttribute("aria-valuetext", option.label);
      dial.style.transform = `rotate(${angleFor(index, options.length)}deg)`;
      dial.append(element("span", "dial-center"));

      const value = element("p", "value-label", option.label);
      const description = element("p", "option-description", option.description);
      const actions = element("div", "knob-actions");
      const prev = button("‹", "step-button", `Anterior en ${config.title}`);
      const next = button("›", "step-button", `Siguiente en ${config.title}`);
      const count = element("span", "option-count", `${index + 1} de ${options.length}`);
      actions.append(prev, count, next);

      prev.addEventListener("click", () => changeSelection(config, -1));
      next.addEventListener("click", () => changeSelection(config, 1));
      dial.addEventListener("focus", () => card.classList.add("is-active"));
      dial.addEventListener("blur", () => card.classList.remove("is-active"));
      dial.addEventListener("keydown", (event) => handleDialKey(event, config));
      dial.addEventListener("pointerdown", (event) => startPointerSelection(event, dial, config, options.length));

      card.append(title, dial, value, actions, description);
      dom.knobGrid.append(card);
    });
  }

  function renderResult() {
    const shouldHideScore = state.discussionMode && state.evaluated && !state.scoreRevealed;
    if (!state.evaluated) {
      dom.scoreValue.textContent = "--";
      dom.scoreLabel.textContent = "Sin evaluar";
      dom.progressFill.style.width = "0%";
      dom.revealScoreButton.classList.add("hidden");
      setFeedbackEmpty();
      return;
    }
    dom.scoreValue.textContent = shouldHideScore ? "??" : String(state.evaluated.total);
    dom.scoreLabel.textContent = shouldHideScore ? "Discusión abierta" : state.evaluated.label;
    dom.progressFill.style.width = shouldHideScore ? "0%" : `${state.evaluated.total}%`;
    dom.revealScoreButton.classList.toggle("hidden", !shouldHideScore);
    renderFeedback(state.evaluated);
  }

  function renderFeedback(result) {
    dom.feedbackPanel.textContent = "";
    const grid = element("div", "feedback-grid");
    [
      ["Lo que está bien alineado", generateStrength(result)],
      ["Tensiones o contradicciones", detectContradictions(result)],
      ["Pregunta para discutir", formulateQuestion(result)],
      ["Sugerencia de ajuste", suggestAdjustment(result)]
    ].forEach(([title, text]) => grid.append(feedbackCard(title, text)));
    const relationsTitle = document.createElement("h3");
    relationsTitle.textContent = "Relaciones analizadas";
    const relations = element("div", "relations-grid");
    Object.entries(result.relations).forEach(([key, score]) => {
      const card = element("div", "relation-card");
      const title = document.createElement("h3");
      title.textContent = relationLabels[key];
      const text = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = qualitative(score);
      text.append(strong, ` · ${score}/100`);
      card.append(title, text);
      relations.append(card);
    });
    dom.feedbackPanel.append(grid, relationsTitle, relations);
  }

  function renderStats() {
    const scoresList = state.history.map((item) => item.score);
    const best = scoresList.length ? Math.max(...scoresList) : null;
    const average = scoresList.length ? Math.round(scoresList.reduce((sum, value) => sum + value, 0) / scoresList.length) : null;
    dom.currentRoundScore.textContent = state.evaluated ? state.evaluated.total : "--";
    dom.bestScore.textContent = best === null ? "--" : best;
    dom.averageScore.textContent = average === null ? "--" : average;
  }

  function renderHistory() {
    dom.historyBody.textContent = "";
    if (!state.history.length) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 4;
      cell.textContent = "Aún no hay rondas evaluadas.";
      row.append(cell);
      dom.historyBody.append(row);
      return;
    }
    state.history.slice(-8).reverse().forEach((item) => {
      const row = document.createElement("tr");
      [item.round, item.caseTitle, item.score, item.label].forEach((value) => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.append(cell);
      });
      dom.historyBody.append(row);
    });
  }

  // Controles de las perillas
  function changeSelection(config, direction) {
    const options = cases[state.caseIndex].options[config.key];
    const current = state.selections[config.stateKey];
    state.selections[config.stateKey] = (current + direction + options.length) % options.length;
    state.evaluated = null;
    state.scoreRevealed = false;
    render();
    saveProgress();
  }

  function setSelectionFromAngle(config, angle, total) {
    const normalized = (angle + 360) % 360;
    const step = 360 / total;
    state.selections[config.stateKey] = Math.round(normalized / step) % total;
    state.evaluated = null;
    state.scoreRevealed = false;
    render();
    saveProgress();
  }

  function handleDialKey(event, config) {
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      changeSelection(config, 1);
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      changeSelection(config, -1);
    }
  }

  function startPointerSelection(event, dial, config, total) {
    event.preventDefault();
    const update = (pointerEvent) => {
      const rect = dial.getBoundingClientRect();
      const x = pointerEvent.clientX - rect.left - rect.width / 2;
      const y = pointerEvent.clientY - rect.top - rect.height / 2;
      const degrees = Math.atan2(y, x) * 180 / Math.PI + 90;
      setSelectionFromAngle(config, degrees, total);
    };
    const stop = () => {
      window.removeEventListener("pointermove", update);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
    update(event);
    window.addEventListener("pointermove", update);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
  }

  function angleFor(index, total) {
    return Math.round(index * (360 / total));
  }

  // Sistema de puntuación
  function evaluateCurrentRound() {
    const result = calculateTotal(cases[state.caseIndex], getSelectedOptions());
    state.evaluated = result;
    state.scoreRevealed = !state.discussionMode;
    state.history.push({ round: state.round, caseTitle: cases[state.caseIndex].title, score: result.total, label: result.label });
    render();
    saveProgress();
  }

  function getSelectedOptions() {
    const currentCase = cases[state.caseIndex];
    return {
      need: currentCase.options.needs[state.selections.need],
      audience: currentCase.options.audiences[state.selections.audience],
      message: currentCase.options.messages[state.selections.message],
      medium: currentCase.options.media[state.selections.medium]
    };
  }

  function calculateTotal(currentCase, selected) {
    const relations = {
      needAudience: calculatePairCompatibility(currentCase, "needAudience", selected.need, selected.audience),
      needMessage: calculatePairCompatibility(currentCase, "needMessage", selected.need, selected.message),
      needMedia: calculatePairCompatibility(currentCase, "needMedia", selected.need, selected.medium),
      audienceMessage: calculatePairCompatibility(currentCase, "audienceMessage", selected.audience, selected.message),
      audienceMedia: calculatePairCompatibility(currentCase, "audienceMedia", selected.audience, selected.medium),
      messageMedia: calculatePairCompatibility(currentCase, "messageMedia", selected.message, selected.medium)
    };
    const rawTotal = calculateWeightedScore(relations);
    const total = normalizeScore(currentCase, rawTotal);
    return { total, label: integrationLabel(total), relations, selected };
  }

  function calculateWeightedScore(relations) {
    return Object.entries(relations).reduce((sum, [key, value]) => sum + value * relationWeights[key], 0);
  }

  function normalizeScore(currentCase, rawTotal) {
    const maxScore = getMaxRawScore(currentCase);
    if (maxScore <= 0) return 0;
    return Math.min(100, Math.round(rawTotal / maxScore * 100));
  }

  function getMaxRawScore(currentCase) {
    if (maxScoreByCase.has(currentCase.id)) return maxScoreByCase.get(currentCase.id);
    let maxScore = 0;
    currentCase.options.needs.forEach((need) => {
      currentCase.options.audiences.forEach((audience) => {
        currentCase.options.messages.forEach((message) => {
          currentCase.options.media.forEach((medium) => {
            const relations = {
              needAudience: calculatePairCompatibility(currentCase, "needAudience", need, audience),
              needMessage: calculatePairCompatibility(currentCase, "needMessage", need, message),
              needMedia: calculatePairCompatibility(currentCase, "needMedia", need, medium),
              audienceMessage: calculatePairCompatibility(currentCase, "audienceMessage", audience, message),
              audienceMedia: calculatePairCompatibility(currentCase, "audienceMedia", audience, medium),
              messageMedia: calculatePairCompatibility(currentCase, "messageMedia", message, medium)
            };
            maxScore = Math.max(maxScore, calculateWeightedScore(relations));
          });
        });
      });
    });
    maxScoreByCase.set(currentCase.id, maxScore);
    return maxScore;
  }

  function calculatePairCompatibility(currentCase, relation, left, right) {
    const direct = currentCase.compatibility[relation]?.[`${left.id}|${right.id}`];
    if (typeof direct === "number") return direct;
    const overlap = left.tags.filter((tag) => right.tags.includes(tag)).length;
    const union = new Set([...left.tags, ...right.tags]).size || 1;
    const tagScore = Math.round((overlap / union) * 100);
    // Si una pareja no está definida en la matriz del caso, se estima con etiquetas semánticas compartidas.
    return Math.max(18, Math.min(72, 28 + tagScore));
  }

  function integrationLabel(score) {
    if (score <= 24) return "Desarticulada";
    if (score <= 49) return "Integración débil";
    if (score <= 69) return "Parcialmente integrada";
    if (score <= 84) return "Bien integrada";
    return "Altamente integrada";
  }

  function qualitative(score) {
    if (score >= 70) return "Alta coherencia";
    if (score >= 45) return "Coherencia media";
    return "Baja coherencia";
  }

  // Retroalimentación
  function generateStrength(result) {
    const bestKey = sortedRelations(result).at(-1)[0];
    const s = result.selected;
    const names = pairNames(bestKey, s);
    return `La relación más sólida es ${relationLabels[bestKey].toLowerCase()}: “${names[0]}” conversa bien con “${names[1]}”. Esa conexión ayuda a que la campaña tenga una promesa reconocible para el contexto del caso.`;
  }

  function detectContradictions(result) {
    const worstKey = sortedRelations(result)[0][0];
    const s = result.selected;
    const names = pairNames(worstKey, s);
    return `La tensión principal aparece en ${relationLabels[worstKey].toLowerCase()}. Elegiste “${names[0]}”, pero también “${names[1]}”; esa pareja puede exigir una justificación adicional para que no se perciba como una decisión desconectada.`;
  }

  function formulateQuestion(result) {
    const s = result.selected;
    return `Antes de mirar solo el puntaje, ¿cómo defenderías que “${s.message.label}” llega de forma creíble a “${s.audience.label}” mediante “${s.medium.label}” y responde a “${s.need.label}”?`;
  }

  function suggestAdjustment(result) {
    const worstKey = sortedRelations(result)[0][0];
    const guidance = {
      needAudience: "Revisa si la necesidad elegida realmente surge con fuerza en el público objetivo.",
      needMessage: "Explora si el mensaje expresa la necesidad del público con palabras que ese grupo pueda reconocer.",
      needMedia: "Piensa si el medio elegido aparece en el momento y lugar donde la necesidad del público se vuelve visible.",
      audienceMessage: "Ajusta el tono del mensaje para que dialogue mejor con las motivaciones del público.",
      audienceMedia: "Considera si el canal permite encontrar al público en su contexto cotidiano.",
      messageMedia: "Evalúa si el formato del medio puede sostener la promesa que plantea el mensaje."
    };
    return `${guidance[worstKey]} No cambia toda la estrategia: prueba mover una sola perilla y compara cómo se reordenan las relaciones.`;
  }

  function sortedRelations(result) {
    return Object.entries(result.relations).sort((a, b) => a[1] - b[1]);
  }

  function pairNames(key, selected) {
    const pairs = {
      needAudience: [selected.need.label, selected.audience.label],
      needMessage: [selected.need.label, selected.message.label],
      needMedia: [selected.need.label, selected.medium.label],
      audienceMessage: [selected.audience.label, selected.message.label],
      audienceMedia: [selected.audience.label, selected.medium.label],
      messageMedia: [selected.message.label, selected.medium.label]
    };
    return pairs[key];
  }

  // Historial y localStorage
  function saveProgress() {
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        caseIndex: state.caseIndex,
        round: state.round,
        selections: state.selections,
        history: state.history,
        discussionMode: state.discussionMode
      }));
    } catch (error) {
      console.warn("No se pudo guardar el progreso local.", error);
    }
  }

  function loadProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (!saved) return false;
      state.caseIndex = Number.isInteger(saved.caseIndex) ? saved.caseIndex % cases.length : 0;
      state.round = Number.isInteger(saved.round) ? saved.round : 1;
      state.selections = { ...state.selections, ...saved.selections };
      state.history = Array.isArray(saved.history) ? saved.history : [];
      state.discussionMode = Boolean(saved.discussionMode);
      return true;
    } catch (error) {
      console.warn("No se pudo cargar el progreso local.", error);
      return false;
    }
  }

  function clearProgress() {
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.warn("No se pudo borrar el progreso local.", error);
    }
    state.caseIndex = 0;
    state.round = 1;
    state.selections = randomSelections(cases[state.caseIndex]);
    state.history = [];
    state.evaluated = null;
    state.scoreRevealed = false;
    render();
  }

  // Modal y accesibilidad
  function openHelp() {
    dom.helpModal.classList.remove("hidden");
    dom.closeHelpButton.focus();
  }

  function closeHelp() {
    dom.helpModal.classList.add("hidden");
    dom.helpButton.focus();
  }

  function resetSelections() {
    state.selections = randomSelections(cases[state.caseIndex]);
    state.evaluated = null;
    state.scoreRevealed = false;
    render();
    saveProgress();
  }

  function nextCase() {
    state.caseIndex = (state.caseIndex + 1) % cases.length;
    state.round += 1;
    state.selections = randomSelections(cases[state.caseIndex]);
    state.evaluated = null;
    state.scoreRevealed = false;
    render();
    saveProgress();
  }

  function revealScore() {
    state.scoreRevealed = true;
    render();
    saveProgress();
  }

  function setFeedbackEmpty() {
    dom.feedbackPanel.textContent = "";
    dom.feedbackPanel.append(element("p", "empty-state", "Evalúa la combinación para ver la retroalimentación pedagógica."));
  }

  function feedbackCard(titleText, bodyText) {
    const card = element("article", "feedback-card");
    const title = document.createElement("h3");
    title.textContent = titleText;
    const body = document.createElement("p");
    body.textContent = bodyText;
    card.append(title, body);
    return card;
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function button(text, className, label) {
    const node = element("button", className, text);
    node.type = "button";
    node.setAttribute("aria-label", label);
    return node;
  }

  // Inicialización
  function init() {
    const hasSavedProgress = loadProgress();
    if (!hasSavedProgress) {
      state.selections = randomSelections(cases[state.caseIndex]);
    }
    dom.evaluateButton.addEventListener("click", evaluateCurrentRound);
    dom.resetButton.addEventListener("click", resetSelections);
    dom.newCaseButton.addEventListener("click", nextCase);
    dom.clearProgressButton.addEventListener("click", clearProgress);
    dom.revealScoreButton.addEventListener("click", revealScore);
    dom.discussionMode.addEventListener("change", (event) => {
      state.discussionMode = event.target.checked;
      state.scoreRevealed = !state.discussionMode && Boolean(state.evaluated);
      render();
      saveProgress();
    });
    dom.helpButton.addEventListener("click", openHelp);
    dom.closeHelpButton.addEventListener("click", closeHelp);
    dom.helpModal.addEventListener("click", (event) => {
      if (event.target === dom.helpModal) closeHelp();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !dom.helpModal.classList.contains("hidden")) closeHelp();
    });
    render();
  }

  init();
})();
