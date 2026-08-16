export const CONFIG = {
    turnSeconds: 180,
    gravity: 0.72,
    timeScale: 0.68,
    damageScale: 0.58,
    maxImpactDamage: 95,
    collisionCooldownMs: 260,
    deteriorationPerSecond: 2.2,
    slingshot: {
        anchorRatio: { x: 0.17, y: 0.67 },
        maxPull: 145,
        powerScale: 1.5,
        stiffness: 0.045,
        velocityLimit: 25,
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
            label: "Rumor", symbol: "?", count: 1, radius: 15, density: 0.002, baseDamage: 45, color: "#6b60b8",
            force: 1.16, multipliers: { identity: 0.6, image: 1.1, reputation: 1.45 },
            description: "Version no verificada que circula con rapidez y obliga a responder antes de que se vuelva creíble."
        },
        badExperience: {
            label: "Mala experiencia", symbol: "!", count: 1, radius: 21, density: 0.0032, baseDamage: 70, color: "#c27b31",
            force: 1, multipliers: { identity: 0.8, image: 1.55, reputation: 1.05 },
            description: "Cliente afectado o servicio fallido que expone una brecha entre la promesa y la experiencia real."
        },
        socialCrisis: {
            label: "Crisis en redes", symbol: "#", count: 2, radius: 22, density: 0.003, baseDamage: 90, color: "#b53658",
            force: 0.98, explosionRadius: 115, explosionDamage: 20, multipliers: { identity: 0.55, image: 1.35, reputation: 1.65 },
            description: "Conversación viral negativa que concentra atención pública y acelera la presión sobre la organización."
        },
        mediaInvestigation: {
            label: "Investigación periodística", symbol: "P", count: 2, radius: 24, density: 0.004, baseDamage: 115, color: "#d6a93d",
            force: 0.94, multipliers: { identity: 1.35, image: 1.1, reputation: 1.45 },
            description: "Hallazgo documentado por medios que pone a prueba la consistencia entre discurso, evidencia y decisiones."
        },
        environmentalScandal: {
            label: "Escándalo ambiental", symbol: "E", count: 3, radius: 30, density: 0.006, baseDamage: 135, color: "#315f38",
            force: 0.84, explosionRadius: 150, explosionDamage: 34, multipliers: { identity: 1.8, image: 1, reputation: 1.25 },
            description: "Crisis ética o ambiental que cuestiona prácticas de fondo y exige una respuesta verificable."
        }
    },
    repairs: {
        pressRelease: {
            label: "Comunicado de prensa", count: 9, amount: 42, allowed: ["image", "reputation"], multipliers: { image: 1.25 },
            description: "Ordena la información disponible, fija postura pública y reduce incertidumbre."
        },
        publicApology: {
            label: "Disculpa pública", count: 6, amount: 50, allowed: ["image", "reputation"], multipliers: { reputation: 1.25 },
            description: "Reconoce el daño, asume responsabilidad y abre una ruta de reparación."
        },
        transparencyReport: {
            label: "Informe de transparencia", count: 7, amount: 58, allowed: ["identity", "image", "reputation"], multipliers: { identity: 1.35 },
            description: "Entrega evidencia, datos y criterios para que la respuesta pueda ser verificada."
        },
        internalCorrection: {
            label: "Corrección interna", count: 6, amount: 65, allowed: ["identity", "image"], multipliers: { identity: 1.45, image: 1.1 },
            description: "Cambia procesos, responsables o protocolos para corregir el origen del problema."
        },
        advertisingCampaign: {
            label: "Publicidad", count: 6, amount: 46, allowed: ["image", "reputation"], multipliers: { image: 1.45, reputation: 0.85 },
            description: "Refuerza mensajes positivos y busca recuperar atención favorable."
        },
        donation: {
            label: "Donación", count: 4, amount: 40, allowed: ["image", "reputation"], multipliers: { image: 0.65, reputation: 1.6 },
            description: "Gesto social visible que intenta demostrar compromiso con una causa o comunidad."
        },
        communityAction: {
            label: "Acción comunitaria", count: 4, amount: 56, allowed: ["identity", "reputation"], multipliers: { identity: 1.2, reputation: 1.25 },
            description: "Trabajo directo con grupos afectados para reconstruir confianza desde acciones concretas."
        }
    },
    victory: { resistant: 70, vulnerable: 40, severe: 1 }
};
//# sourceMappingURL=config.js.map
