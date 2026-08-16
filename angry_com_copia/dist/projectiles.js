import { CONFIG } from "./config.js";
const { Bodies, Body, Constraint, Composite, Vector } = Matter;
const TRAJECTORY_DOTS = 10;
const TRAJECTORY_TIME_STEP = 0.12;
const TRAJECTORY_BOUNDS_PADDING = 8;
const TRAJECTORY_OFFSET_Y = -20;
const PROJECTILE_TEXTURES = {
    rumor: "./sprites/proyectil_rumor.png",
    badExperience: "./sprites/proyectil_mala_experiencia.png",
    socialCrisis: "./sprites/proyectil_crisis_redes.png",
    mediaInvestigation: "./sprites/proyectil_investigacion.png",
    environmentalScandal: "./sprites/proyectil_escandalo_ambiental.png"
};
const PROJECTILE_TEXTURE_SIZE = 100;
const PROJECTILE_VISUAL_DIAMETER = 42;
export function createProjectile(type, anchor) {
    const cfg = CONFIG.projectiles[type];
    const body = Bodies.circle(anchor.x, anchor.y, cfg.radius, {
        density: cfg.density,
        frictionAir: 0.012,
        restitution: 0.28,
        render: {
            fillStyle: cfg.color,
            sprite: {
                texture: PROJECTILE_TEXTURES[type],
                xScale: PROJECTILE_VISUAL_DIAMETER / PROJECTILE_TEXTURE_SIZE,
                yScale: PROJECTILE_VISUAL_DIAMETER / PROJECTILE_TEXTURE_SIZE
            }
        }
    });
    body.game = { kind: "projectile", type, launched: false, exploded: false };
    return body;
}
export function attachProjectile(world, projectile, anchor) {
    const sling = Constraint.create({
        pointA: anchor,
        bodyB: projectile,
        stiffness: CONFIG.slingshot.stiffness,
        damping: 0.02,
        render: { visible: false }
    });
    Composite.add(world, [projectile, sling]);
    return sling;
}
export function clampProjectileToRadius(projectile, anchor) {
    const delta = Vector.sub(projectile.position, anchor);
    const distance = Vector.magnitude(delta);
    if (distance <= CONFIG.slingshot.maxPull)
        return;
    const limited = Vector.add(anchor, Vector.mult(Vector.normalise(delta), CONFIG.slingshot.maxPull));
    Body.setPosition(projectile, limited);
    Body.setVelocity(projectile, { x: 0, y: 0 });
}
export function launchVelocity(projectile, anchor, type) {
    const cfg = CONFIG.projectiles[type];
    const pull = Vector.sub(anchor, projectile.position);
    const raw = Vector.mult(pull, 0.135 * CONFIG.slingshot.powerScale * cfg.force);
    const speed = Vector.magnitude(raw);
    if (speed <= CONFIG.slingshot.velocityLimit)
        return raw;
    return Vector.mult(Vector.normalise(raw), CONFIG.slingshot.velocityLimit);
}
export function launchVelocityFromAngle(angleDegrees, power, type) {
    const cfg = CONFIG.projectiles[type];
    const radians = angleDegrees * Math.PI / 180;
    const strength = Math.min(CONFIG.slingshot.velocityLimit, CONFIG.slingshot.velocityLimit * Math.max(0.1, Math.min(1, power)) * cfg.force);
    return {
        x: Math.cos(radians) * strength,
        y: Math.sin(radians) * strength
    };
}
export function drawProjectileSymbol(context, body) {
    if (body.render.sprite?.texture)
        return;
    const cfg = CONFIG.projectiles[body.game.type];
    context.save();
    context.translate(body.position.x, body.position.y);
    context.rotate(body.angle);
    context.fillStyle = "#fff7e2";
    context.font = `900 ${Math.max(14, cfg.radius)}px Arial`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(cfg.symbol, 0, 1);
    context.restore();
}
export function drawTrajectory(context, projectile, anchor, type, velocity = launchVelocity(projectile, anchor, type), startPosition = projectile.position) {
    const width = context.canvas.clientWidth;
    const height = context.canvas.clientHeight;
    context.save();
    context.fillStyle = "rgba(55,39,25,.55)";
    for (let i = 1; i <= TRAJECTORY_DOTS; i += 1) {
        const t = i * TRAJECTORY_TIME_STEP;
        const x = startPosition.x + velocity.x * 58 * t;
        const y = startPosition.y + TRAJECTORY_OFFSET_Y + velocity.y * 58 * t + 0.5 * CONFIG.gravity * 980 * t * t * 0.08;
        if (x < TRAJECTORY_BOUNDS_PADDING || x > width - TRAJECTORY_BOUNDS_PADDING || y < TRAJECTORY_BOUNDS_PADDING || y > height - TRAJECTORY_BOUNDS_PADDING)
            break;
        context.beginPath();
        context.arc(x, y, Math.max(2, 5 - i * 0.2), 0, Math.PI * 2);
        context.fill();
    }
    context.restore();
}
//# sourceMappingURL=projectiles.js.map
