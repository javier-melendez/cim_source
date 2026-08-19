export const CONFIG = {
  turnSeconds: 180,
  gravity: 0.72,
  timeScale: 0.68,
  damageScale: 0.58,
  maxImpactDamage: 95,
  projectileHitFalloff: [1, 0.8, 0.48, 0.16, 0.016],
  collisionCooldownMs: 260,
  deteriorationPerSecond: 2.2,
  slingshot: {
    anchorRatio: { x: 0.17, y: 0.67 },
    maxPull: 145,
    powerScale: 1.725,
    stiffness: 0.045,
    velocityLimit: 27.36,
    flightTimeoutMs: 6000
  },
  castle: {
    originRatio: { x: 0.72, y: 0.68 },
    block: { width: 82, height: 42 },
    levels: {
      identity: { label: "IDENTIDAD", count: 5, hp: 70, density: 0.0048, color: "#74513a", damaged: "#9a6c4b" },
      image: { label: "IMAGEN", count: 8, hp: 49, density: 0.0028, color: "#8f8f86", damaged: "#b09f8b" },
      reputation: { label: "REPUTACIÓN", count: 4, hp: 35, density: 0.0019, color: "#b9b9c5", damaged: "#d2b38b" }
    }
  },
  projectiles: {
    rumor: {
      label: "Falsos diferenciales", symbol: "?", count: 1, radius: 24, density: 0.0035, baseDamage: 52, color: "#6b60b8",
      force: 1, multipliers: { identity: 0.55, image: 1.45, reputation: 0.35 },
      description: "Comunica atributos comunes como si fueran ventajas únicas. Daña sobre todo el posicionamiento y empuja la decisión hacia precio."
    },
    badExperience: {
      label: "Comoditización", symbol: "!", count: 1, radius: 24, density: 0.0035, baseDamage: 68, color: "#c27b31",
      force: 1, multipliers: { identity: 0.35, image: 1.65, reputation: 0.55 },
      description: "Vuelve a la marca reemplazable y genérica. Es fuerte contra imagen/posicionamiento, pero débil contra reputación acumulada."
    },
    socialCrisis: {
      label: "Escándalo reputacional", symbol: "#", count: 2, radius: 24, density: 0.0035, baseDamage: 92, color: "#b53658",
      force: 1, explosionRadius: 115, explosionDamage: 20, multipliers: { identity: 0.65, image: 1.2, reputation: 1.75 },
      description: "Ataque con información negativa, real o sacada de contexto. Es un arma fuerte contra reputación y requiere precisión."
    },
    mediaInvestigation: {
      label: "Brecha decir-hacer", symbol: "P", count: 2, radius: 24, density: 0.0035, baseDamage: 105, color: "#d6a93d",
      force: 1, multipliers: { identity: 1.3, image: 0.95, reputation: 1.55 },
      description: "Desfase entre discurso público y conducta real. Golpea reputación e identidad porque contradice lo que el actor dice ser."
    },
    environmentalScandal: {
      label: "Búmeran de marca", symbol: "E", count: 3, radius: 24, density: 0.0035, baseDamage: 118, color: "#315f38",
      force: 1, explosionRadius: 150, explosionDamage: 32, multipliers: { identity: 0.9, image: 1.7, reputation: 1.25 },
      description: "La promesa brillante de la marca se usa en su contra al revelar prácticas ocultas. Es devastador contra imagen."
    }
  },
  repairs: {
    pressRelease: {
      label: "Variabilidad de codificación", count: 8, amount: 38, allowed: ["image"], multipliers: { image: 1.2 },
      description: "Repite el mensaje central con medios y ejecuciones distintas. Cura notoriedad e imagen, no una crisis reputacional."
    },
    publicApology: {
      label: "Disculpa completa", count: 5, amount: 50, allowed: ["identity", "image", "reputation"], multipliers: { identity: 0.4, image: 0.6, reputation: 1.5 },
      description: "Reconoce la falta, asume responsabilidad y ofrece reparación. Cura con fuerza la reputación si se percibe sincera."
    },
    transparencyReport: {
      label: "Diálogo simétrico", count: 6, amount: 54, allowed: ["identity", "image", "reputation"], multipliers: { identity: 1.1, image: 0.8, reputation: 1.35 },
      description: "Escucha, negocia y modifica conducta. Repara legitimidad y confianza mejor que una respuesta puramente persuasiva."
    },
    internalCorrection: {
      label: "Auditoría RSC", count: 5, amount: 60, allowed: ["identity", "image", "reputation"], multipliers: { identity: 1.35, image: 0.45, reputation: 1.05 },
      description: "Revisa prácticas éticas y sociales para alinear lo que se es, se hace y se comunica. Cura identidad y reputación."
    },
    advertisingCampaign: {
      label: "Marca-experiencia", count: 6, amount: 50, allowed: ["identity", "image", "reputation"], multipliers: { identity: 0.7, image: 1.15, reputation: 1.1 },
      description: "Repara desde experiencias consistentes en cada contacto. Fortalece imagen y reputación de forma acumulada."
    },
    donation: {
      label: "Educación del consumidor", count: 4, amount: 45, allowed: ["identity", "image", "reputation"], multipliers: { identity: 0.75, image: 1.25, reputation: 0.45 },
      description: "Enseña al público a valorar atributos técnicos o simbólicos. Protege posicionamiento y reduce la guerra de precios."
    },
    communityAction: {
      label: "Auditoría de diferenciales", count: 4, amount: 40, allowed: ["identity", "image"], multipliers: { identity: 0.8, image: 1.2 },
      description: "Comprueba que el diferencial sea único, valorado y comunicable. Previene promesas débiles y errores de posicionamiento."
    }
  },
  victory: { resistant: 70, vulnerable: 40, severe: 1 }
};
