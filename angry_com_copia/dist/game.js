import { CONFIG } from "./config.js";
import { applyDamage, calculateIntegrity, createCastle, drawBlockLabel } from "./castle.js";
import { attachProjectile, createProjectile, drawProjectileSymbol, drawTrajectory, launchVelocityFromAngle } from "./projectiles.js";
import { canRepair, repairAmount } from "./repairs.js";
const { Engine, Render, Runner, Bodies, Body, Composite, Events, Query, Vector } = Matter;
const AIM_STEP = 3;
const MIN_AIM_ANGLE = -50;
const MAX_AIM_ANGLE = 0;
const MIN_LAUNCH_POWER = 0.25;
const MAX_LAUNCH_POWER = 1;
const CHARGE_DURATION_MS = 1700;
const ATTACKS_PER_TURN = 1;
const DEFENSE_PLAYER_INDEX = 1;
const DEFENSE_MOVES_PER_TURN = 5;
const COLLAPSED_LEVEL_ATTACK_BONUS = 150;
const FALL_DAMAGE_COOLDOWN_MS = 700;
const INITIAL_FALL_DAMAGE_GRACE_MS = 1400;
const FALL_DAMAGE_SPEED = 1.2;
const CANNON_BARREL = new Image();
const CANNON_BASE = new Image();
CANNON_BARREL.src = "./sprites/canon_tubo.png";
CANNON_BASE.src = "./sprites/canon_base_triangular.png";
// Ajustes visuales del canon.
// Unidades: pixeles del canvas. X positivo mueve a la derecha; Y positivo mueve hacia abajo.
// IMPORTANTE:
// - El "pivote" es el punto fijo donde rota el tubo del canon.
// - La "base" es solo el carrito/soporte de madera; se dibuja encima del tubo.
// - El "tubo" rota desde el pivote; sus offsets son relativos a ese pivote.
// - CANNON_BARREL_LENGTH es la boca logica: de ahi arrancan la guia y los puntos de trayectoria.
// - El proyectil aparece cerca de la linea del tubo, a CANNON_BARREL_LENGTH - CANNON_PROJECTILE_SETBACK.
const CANNON_BARREL_LENGTH = 68;
// Cuanto se mete el proyectil hacia atras desde la boca. Mas alto = proyectil menos salido.
const CANNON_PROJECTILE_SETBACK = 40;
// Ajuste fino vertical del proyectil. Negativo = mas arriba; positivo = mas abajo.
const CANNON_PROJECTILE_OFFSET_Y = -25;
// Tamano visual de la base de madera.
const CANNON_BASE_WIDTH = 126;
const CANNON_BASE_HEIGHT = 104;
// Posicion de la base respecto al pivote del tubo. Mas alto en X = base mas a la derecha.
const CANNON_BASE_OFFSET_X = -62;
// Posicion vertical de la base respecto al pivote. Mas alto en Y = base mas abajo.
const CANNON_BASE_OFFSET_Y = -25;
// Tamano visual del tubo del canon.
const CANNON_BARREL_WIDTH = 142;
const CANNON_BARREL_HEIGHT = 76;
// Posicion del tubo respecto al pivote. Mas alto en X = tubo mas adelante/derecha.
const CANNON_BARREL_OFFSET_X = -75;
// Posicion vertical del tubo respecto al pivote. Mas alto en Y = tubo mas abajo.
const CANNON_BARREL_OFFSET_Y = -60;
// Ajuste de apoyo contra el suelo. Mas alto = todo el canon baja/se hunde en el pasto.
const CANNON_BASE_GROUND_SINK = 6;
const state = {
    mode: "start",
    interaction: "repair",
    turnMode: "defense",
    attacksUsed: 0,
    defenseMovesUsed: 0,
    selectedProjectile: "rumor",
    selectedRepair: null,
    projectileCounts: {},
    repairCounts: {},
    activeProjectile: null,
    sling: null,
    aimAngle: -22,
    launchPower: MIN_LAUNCH_POWER,
    charging: false,
    chargeSource: null,
    chargeStart: 0,
    chargeFrame: null,
    blocks: [],
    lastCollision: new Map(),
    lastFallDamage: new Map(),
    fallDamageEnabledAt: 0,
    activePlayer: DEFENSE_PLAYER_INDEX,
    playerTimes: [CONFIG.turnSeconds, CONFIG.turnSeconds],
    finalDefense: false,
    timerId: null,
    flightTimer: null,
    damageReceived: 0,
    damageRecovered: 0,
    muted: false,
    audio: null
};
const els = {
    host: document.querySelector("#canvas-host"),
    floating: document.querySelector("#floating-layer"),
    stage: document.querySelector(".stage"),
    playerTimers: [document.querySelector("#timer-player-1"), document.querySelector("#timer-player-2")],
    playerClocks: [document.querySelector("#clock-player-1"), document.querySelector("#clock-player-2")],
    damageReceived: document.querySelector("#damage-received"),
    damageRecovered: document.querySelector("#damage-recovered"),
    projectileButtons: document.querySelector("#projectile-buttons"),
    repairButtons: document.querySelector("#repair-buttons"),
    message: document.querySelector("#message"),
    startScreen: document.querySelector("#start-screen"),
    resultScreen: document.querySelector("#result-screen"),
    resultTitle: document.querySelector("#result-title"),
    resultStats: document.querySelector("#result-stats"),
    resultReflection: document.querySelector("#result-reflection"),
    startIntro: document.querySelector("#start-intro"),
    howToButton: document.querySelector("#how-to-button"),
    howToPanel: document.querySelector("#how-to-panel"),
    howToSlides: document.querySelectorAll("[data-how-to-slide]"),
    howToPrev: document.querySelector("#how-to-prev"),
    howToNext: document.querySelector("#how-to-next"),
    howToCount: document.querySelector("#how-to-count"),
    angleValue: document.querySelector("#angle-value"),
    angleUpButton: document.querySelector("#angle-up-button"),
    angleDownButton: document.querySelector("#angle-down-button"),
    launchButton: document.querySelector("#launch-button"),
    powerFill: document.querySelector("#power-fill"),
    turnModeLabel: document.querySelector("#turn-mode-label"),
    turnActions: document.querySelector("#turn-actions"),
    attackPanel: document.querySelector("#attack-panel"),
    launcherPanel: document.querySelector("#launcher-panel"),
    defensePanel: document.querySelector("#defense-panel")
};
let engine;
let render;
let runner;
let ground;
let leftWall;
let rightWall;
let ceiling;
let floorY = 0;
let howToIndex = 0;
boot();
function boot() {
    resetCounts();
    engine = Engine.create();
    engine.gravity.y = CONFIG.gravity;
    engine.timing.timeScale = CONFIG.timeScale;
    render = Render.create({
        element: els.host,
        engine,
        options: {
            width: els.host.clientWidth,
            height: els.host.clientHeight,
            wireframes: false,
            background: "transparent",
            pixelRatio: window.devicePixelRatio || 1
        }
    });
    runner = Runner.create();
    Render.run(render);
    Runner.run(runner, engine);
    setupWorld();
    setupUi();
    setupEvents();
    updateUi();
}
function setupWorld() {
    Composite.clear(engine.world, false);
    state.activeProjectile = null;
    state.sling = null;
    state.lastFallDamage.clear();
    state.fallDamageEnabledAt = performance.now() + INITIAL_FALL_DAMAGE_GRACE_MS;
    const size = canvasSize();
    addBoundaries(size);
    const castle = createCastle(engine.world, size);
    state.blocks = castle.blocks;
    loadNextProjectile();
}
function addBoundaries(size) {
    const groundDepth = Math.max(220, size.height * 0.42);
    const wallDepth = Math.max(120, size.width * 0.12);
    floorY = size.height * 0.84;
    ground = Bodies.rectangle(size.width / 2, floorY + groundDepth / 2, size.width + wallDepth * 2, groundDepth, {
        isStatic: true,
        friction: 0.9,
        restitution: 0.05,
        slop: 0,
        render: { visible: false }
    });
    leftWall = Bodies.rectangle(-wallDepth / 2, size.height / 2, wallDepth, size.height * 2, { isStatic: true, render: { visible: false } });
    rightWall = Bodies.rectangle(size.width + wallDepth / 2, size.height / 2, wallDepth, size.height * 2, { isStatic: true, render: { visible: false } });
    ceiling = Bodies.rectangle(size.width / 2, -60, size.width + wallDepth * 2, 80, { isStatic: true, render: { visible: false } });
    Composite.add(engine.world, [ground, leftWall, rightWall, ceiling]);
}
function setupUi() {
    document.querySelector("#start-button").addEventListener("click", startGame);
    els.howToButton.addEventListener("click", toggleHowTo);
    els.howToPrev.addEventListener("click", () => changeHowToSlide(-1));
    els.howToNext.addEventListener("click", () => changeHowToSlide(1));
    document.querySelector("#reset-button").addEventListener("click", resetGame);
    document.querySelector("#play-again-button").addEventListener("click", resetGame);
    document.querySelector("#sound-toggle").addEventListener("click", toggleSound);
    els.angleUpButton.addEventListener("click", () => changeAimAngle(-AIM_STEP));
    els.angleDownButton.addEventListener("click", () => changeAimAngle(AIM_STEP));
    els.launchButton.addEventListener("pointerdown", startLaunchCharge);
    els.launchButton.addEventListener("pointerup", releaseLaunchCharge);
    els.launchButton.addEventListener("pointercancel", cancelLaunchCharge);
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", cancelLaunchCharge);
    renderToolbars();
}
function setupEvents() {
    Events.on(engine, "beforeUpdate", () => {
        if (state.activeProjectile && !state.activeProjectile.game.launched) {
            positionProjectileAtLauncher();
        }
    });
    Events.on(engine, "afterUpdate", keepProjectilesAboveFloor);
    Events.on(engine, "collisionStart", handleCollisions);
    Events.on(render, "afterRender", drawOverlay);
    render.canvas.addEventListener("click", handleRepairClick);
}
function toggleHowTo() {
    const isHidden = els.howToPanel.classList.toggle("hidden");
    els.startIntro.classList.toggle("hidden", !isHidden);
    els.howToButton.setAttribute("aria-expanded", String(!isHidden));
    els.howToButton.textContent = isHidden ? "Cómo jugar" : "Volver";
    if (!isHidden)
        renderHowToSlide();
}
function changeHowToSlide(direction) {
    const total = els.howToSlides.length;
    howToIndex = (howToIndex + direction + total) % total;
    renderHowToSlide();
}
function renderHowToSlide() {
    const total = els.howToSlides.length;
    els.howToSlides.forEach((slide, index) => {
        slide.classList.toggle("active", index === howToIndex);
    });
    els.howToCount.textContent = `${howToIndex + 1} / ${total}`;
}
function startGame() {
    state.mode = "playing";
    els.startScreen.classList.add("hidden");
    configureTurnForActivePlayer();
    renderToolbars();
    state.timerId = window.setInterval(tickTimer, 1000);
    message(turnMessage("Preparación: refuerza el castillo antes de la crisis."));
    updateUi();
}
function resetGame() {
    window.clearInterval(state.timerId);
    window.clearTimeout(state.flightTimer);
    cancelLaunchCharge();
    resetCounts();
    state.mode = "start";
    state.interaction = "repair";
    state.turnMode = "defense";
    state.attacksUsed = 0;
    state.defenseMovesUsed = 0;
    state.selectedRepair = null;
    state.aimAngle = -22;
    state.launchPower = MIN_LAUNCH_POWER;
    state.activePlayer = DEFENSE_PLAYER_INDEX;
    state.playerTimes = [CONFIG.turnSeconds, CONFIG.turnSeconds];
    state.finalDefense = false;
    state.damageReceived = 0;
    state.damageRecovered = 0;
    state.lastCollision.clear();
    state.lastFallDamage.clear();
    els.resultScreen.classList.add("hidden");
    els.startScreen.classList.remove("hidden");
    setupWorld();
    renderToolbars();
    updateUi();
    message("");
}
function tickTimer() {
    if (state.mode !== "playing")
        return;
    state.playerTimes[state.activePlayer] -= 1;
    const integrity = calculateIntegrity(state.blocks);
    if (integrity.identity <= 0)
        deteriorate(["image", "reputation"]);
    if (integrity.image <= 0)
        deteriorate(["reputation"]);
    updateUi();
    if (state.playerTimes[state.activePlayer] <= 0)
        finishByDamageBalance("Tiempo agotado.");
}
function finishWithWinner(playerIndex, reason = "") {
    state.mode = "finished";
    window.clearInterval(state.timerId);
    window.clearTimeout(state.flightTimer);
    cancelLaunchCharge();
    const integrity = calculateIntegrity(state.blocks);
    const collapsedLevelCount = countCollapsedLevels(integrity);
    const attackBonus = collapsedLevelCount * COLLAPSED_LEVEL_ATTACK_BONUS;
    els.resultTitle.textContent = playerIndex === 0 ? "Gana el ataque" : "Gana la defensa";
    els.resultStats.innerHTML = [
        ...Object.entries(integrity).map(([key, value]) => `<div>${labelLevel(key)}: <strong>${value}%</strong></div>`),
        `<div>Daño recibido: <strong>${Math.round(state.damageReceived)}</strong></div>`,
        attackBonus ? `<div>Bonus ataque crítico: <strong>+${attackBonus}</strong></div>` : "",
        `<div>Daño recuperado: <strong>${Math.round(state.damageRecovered)}</strong></div>`
    ].filter(Boolean).join("");
    els.resultReflection.textContent = reason;
    els.resultScreen.classList.remove("hidden");
    playTone(playerIndex === 0 ? 220 : 420, 0.22);
}
function finishByDamageBalance(reason = "") {
    if (isCastleDestroyed()) {
        finishWithWinner(0, "El castillo quedó completamente destruido.");
        return;
    }
    const integrity = calculateIntegrity(state.blocks);
    const attackBonus = countCollapsedLevels(integrity) * COLLAPSED_LEVEL_ATTACK_BONUS;
    const received = Math.round(state.damageReceived + attackBonus);
    const recovered = Math.round(state.damageRecovered);
    if (received > recovered) {
        finishWithWinner(0, `${reason} El puntaje de ataque (${received}) superó el daño recuperado (${recovered}).`);
        return;
    }
    finishWithWinner(1, `${reason} El daño recuperado (${recovered}) igualó o superó el puntaje de ataque (${received}).`);
}
function launchProjectile() {
    if (!state.activeProjectile || !state.sling)
        return;
    if (!canLaunch())
        return;
    const velocity = aimVelocity(currentLaunchPower());
    Composite.remove(engine.world, state.sling);
    Body.setVelocity(state.activeProjectile, velocity);
    state.activeProjectile.game.launched = true;
    state.launchPower = MIN_LAUNCH_POWER;
    state.sling = null;
    state.projectileCounts[state.activeProjectile.game.type] -= 1;
    state.flightTimer = window.setTimeout(completeAttackTurn, CONFIG.slingshot.flightTimeoutMs);
    state.attacksUsed += 1;
    playTone(360, 0.08);
    message("Tiro usado. El turno cambiará cuando termine el movimiento.");
    renderToolbars();
    updateUi();
}
function loadNextProjectile() {
    window.clearTimeout(state.flightTimer);
    if (state.activeProjectile)
        Composite.remove(engine.world, state.activeProjectile);
    state.activeProjectile = null;
    state.sling = null;
    if (state.mode === "finished" || state.turnMode !== "attack")
        return;
    const available = Object.keys(CONFIG.projectiles).find((key) => state.projectileCounts[key] > 0);
    if (!available) {
        message("No quedan proyectiles. Usa reparaciones o reinicia.");
        updateUi();
        return;
    }
    if (state.projectileCounts[state.selectedProjectile] <= 0)
        state.selectedProjectile = available;
    const projectile = createProjectile(state.selectedProjectile, anchorPoint());
    Body.setPosition(projectile, anchorPoint());
    state.sling = attachProjectile(engine.world, projectile, anchorPoint());
    state.activeProjectile = projectile;
    updateUi();
}
function completeAttackTurn() {
    window.clearTimeout(state.flightTimer);
    if (state.activeProjectile)
        Composite.remove(engine.world, state.activeProjectile);
    state.activeProjectile = null;
    state.sling = null;
    if (state.mode !== "playing")
        return;
    if (isCastleDestroyed()) {
        finishWithWinner(0, "El castillo quedó completamente destruido.");
        return;
    }
    if (!hasProjectilesLeft()) {
        finishByDamageBalance("No quedan proyectiles.");
        return;
    }
    switchTurn("Ataque completado.");
}
function handleKeyDown(event) {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey)
        return;
    if (event.target instanceof Element && event.target.closest("button"))
        return;
    const key = event.key.toLowerCase();
    const handled = ["arrowup", "arrowdown", " ", "enter"].includes(key);
    if (!handled)
        return;
    if (key === "enter" && state.mode === "start") {
        event.preventDefault();
        startGame();
        return;
    }
    if (state.mode !== "playing" || state.turnMode !== "attack")
        return;
    if (!state.activeProjectile || state.activeProjectile.game.launched)
        return;
    event.preventDefault();
    if (key === " ") {
        if (event.repeat)
            return;
        startKeyboardLaunchCharge(event);
        return;
    }
    const step = event.shiftKey ? AIM_STEP * 2 : AIM_STEP;
    if (key === "arrowup")
        changeAimAngle(-step);
    if (key === "arrowdown")
        changeAimAngle(step);
}
function handleKeyUp(event) {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey)
        return;
    if (event.key !== " ")
        return;
    if (state.chargeSource !== "keyboard")
        return;
    event.preventDefault();
    releaseKeyboardLaunchCharge();
}
function positionProjectileAtLauncher() {
    if (state.interaction !== "attack" || !state.activeProjectile || state.activeProjectile.game.launched)
        return;
    Body.setPosition(state.activeProjectile, anchorPoint());
    Body.setVelocity(state.activeProjectile, { x: 0, y: 0 });
}
function keepProjectilesAboveFloor() {
    Composite.allBodies(engine.world).forEach((body) => {
        if (body.game?.kind !== "projectile")
            return;
        const radius = body.circleRadius || CONFIG.projectiles[body.game.type].radius;
        const lowestPoint = Math.max(body.position.y + radius, body.bounds.max.y);
        if (lowestPoint <= floorY)
            return;
        Body.setPosition(body, { x: body.position.x, y: body.position.y - (lowestPoint - floorY) });
        Body.setVelocity(body, {
            x: body.velocity.x * 0.72,
            y: body.velocity.y > 0 ? -body.velocity.y * 0.22 : body.velocity.y
        });
    });
}
function handleCollisions(event) {
    event.pairs.forEach((pair) => {
        const bodies = [pair.bodyA, pair.bodyB];
        const projectile = bodies.find((body) => body.game?.kind === "projectile");
        const block = bodies.find((body) => body.game?.kind === "castleBlock");
        if (projectile && block)
            damageBlockFromProjectile(projectile, block, pair);
        const fallingBlock = bodies.find((body) => body.game?.kind === "castleBlock" && body.game.state !== "destroyed" && body.speed > FALL_DAMAGE_SPEED);
        const other = bodies.find((body) => body !== fallingBlock);
        if (fallingBlock && other && (!other.game || other.game.kind === "castleBlock")) {
            damageFallingBlock(fallingBlock);
        }
    });
}
function damageFallingBlock(block) {
    const now = performance.now();
    if (now < state.fallDamageEnabledAt)
        return;
    if ((state.lastFallDamage.get(block.id) || 0) + FALL_DAMAGE_COOLDOWN_MS > now)
        return;
    state.lastFallDamage.set(block.id, now);
    const fallDamage = block.speed > 4 ? 2 : 1;
    const dealt = applyDamage(block, fallDamage);
    recordBlockDamage(block, dealt);
    if (dealt > 0)
        floatingText(block.position, `-${Math.round(dealt)}`, "damage", "colateral");
}
function damageBlockFromProjectile(projectile, block, pair) {
    const key = [projectile.id, block.id].sort().join(":");
    const now = performance.now();
    if ((state.lastCollision.get(key) || 0) + CONFIG.collisionCooldownMs > now)
        return;
    state.lastCollision.set(key, now);
    if (projectile.game.hitBlockIds.includes(block.game.id))
        return;
    const hitIndex = projectile.game.hitBlockIds.length;
    const hitFalloff = CONFIG.projectileHitFalloff[hitIndex] ?? 0;
    projectile.game.hitBlockIds.push(block.game.id);
    if (hitFalloff <= 0)
        return;
    const cfg = CONFIG.projectiles[projectile.game.type];
    const directDamage = Math.min(CONFIG.maxImpactDamage, cfg.baseDamage * cfg.multipliers[block.game.level] * CONFIG.damageScale);
    const damage = directDamage * hitFalloff;
    const dealt = applyDamage(block, damage);
    recordBlockDamage(block, dealt);
    if (dealt > 0) {
        floatingText(block.position, `-${Math.round(dealt)}`, "damage", damageEffectivenessText(dealt, block.game.maxHp));
        if (dealt > 18)
            shake();
        playTone(120 + dealt * 4, 0.06);
    }
    if (cfg.explosionRadius && !projectile.game.exploded)
        explode(projectile, cfg);
    if (block.game.state === "destroyed")
        spawnFragments(block.position, block.render.fillStyle);
    updateUi();
}
function explode(projectile, cfg) {
    projectile.game.exploded = true;
    state.blocks.forEach((block) => {
        const distance = Vector.magnitude(Vector.sub(block.position, projectile.position));
        if (distance > cfg.explosionRadius)
            return;
        const falloff = 1 - distance / cfg.explosionRadius;
        const damage = cfg.explosionDamage * falloff * (cfg.multipliers[block.game.level] ?? 1);
        const dealt = applyDamage(block, damage);
        recordBlockDamage(block, dealt);
        if (dealt > 1)
            floatingText(block.position, `-${Math.round(dealt)}`, "damage", damageEffectivenessText(dealt, block.game.maxHp));
    });
    flash(projectile.position, cfg.explosionRadius);
    shake();
    playTone(80, 0.18);
}
function handleRepairClick(event) {
    if (state.mode !== "playing" || state.turnMode !== "defense" || state.interaction !== "repair" || !state.selectedRepair)
        return;
    if (state.defenseMovesUsed >= DEFENSE_MOVES_PER_TURN) {
        message(`Ya usaste los ${DEFENSE_MOVES_PER_TURN} movimientos de defensa.`);
        return;
    }
    const rect = render.canvas.getBoundingClientRect();
    const point = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    const [block] = Query.point(state.blocks, point);
    const integrity = calculateIntegrity(state.blocks);
    const check = canRepair(block, state.selectedRepair, integrity);
    if (!check.ok) {
        message(check.reason);
        return;
    }
    const amount = repairAmount(block, state.selectedRepair, integrity);
    block.game.hp += amount;
    recordRecovery(amount);
    block.game.state = block.game.hp >= block.game.maxHp ? "active" : "damaged";
    block.render.opacity = 1;
    floatingText(block.position, `+${Math.round(amount)}`, "repair", repairEffectivenessText(amount, block.game.maxHp));
    state.repairCounts[state.selectedRepair] -= 1;
    state.defenseMovesUsed += 1;
    if (state.repairCounts[state.selectedRepair] <= 0) {
        state.selectedRepair = firstAvailableValidRepair();
    }
    playTone(520, 0.08);
    renderToolbars();
    updateUi();
    if (!hasValidDefenseMove()) {
        completeDefenseTurn(defenseBlockedReason());
        return;
    }
    if (state.defenseMovesUsed >= DEFENSE_MOVES_PER_TURN) {
        completeDefenseTurn("Defensa completa.");
        return;
    }
    message(`Movimiento de defensa ${state.defenseMovesUsed} de ${DEFENSE_MOVES_PER_TURN}.`);
}
function renderToolbars() {
    els.projectileButtons.innerHTML = Object.entries(CONFIG.projectiles).map(([key, cfg]) => (`<button class="tool-button ${state.selectedProjectile === key ? "selected" : ""}" data-projectile="${key}" ${state.projectileCounts[key] <= 0 || state.turnMode !== "attack" || state.attacksUsed >= ATTACKS_PER_TURN ? "disabled" : ""}>${cfg.label}<span>${state.projectileCounts[key]} restantes</span></button>`)).join("");
    els.repairButtons.innerHTML = Object.entries(CONFIG.repairs).map(([key, cfg]) => (`<button class="tool-button ${state.selectedRepair === key ? "selected" : ""}" data-repair="${key}" ${state.repairCounts[key] <= 0 || state.turnMode !== "defense" || state.defenseMovesUsed >= DEFENSE_MOVES_PER_TURN ? "disabled" : ""}>${cfg.label}<span>${state.repairCounts[key]} restantes</span></button>`)).join("");
    // Use event delegation to avoid attaching many handlers on each re-render
    els.projectileButtons.onclick = (e) => {
        const button = e.target.closest('[data-projectile]');
        if (!button)
            return;
        selectProjectile(button.dataset.projectile);
    };
    els.repairButtons.onclick = (e) => {
        const button = e.target.closest('[data-repair]');
        if (!button)
            return;
        selectRepair(button.dataset.repair);
    };
}
function selectProjectile(key) {
    if (state.turnMode !== "attack" || state.attacksUsed >= ATTACKS_PER_TURN)
        return;
    if (state.projectileCounts[key] <= 0)
        return;
    state.selectedProjectile = key;
    message(projectileSummary(key));
    if (state.activeProjectile && !state.activeProjectile.game.launched)
        loadNextProjectile();
    renderToolbars();
    updateUi();
}
function selectRepair(key) {
    if (state.turnMode !== "defense" || state.defenseMovesUsed >= DEFENSE_MOVES_PER_TURN)
        return;
    if (state.repairCounts[key] <= 0)
        return;
    state.selectedRepair = key;
    message(repairSummary(key));
    renderToolbars();
}
function projectileSummary(key) {
    const cfg = CONFIG.projectiles[key];
    return `${cfg.label}: ${cfg.description}`;
}
function repairSummary(key) {
    const cfg = CONFIG.repairs[key];
    return `${cfg.label}: ${cfg.description}`;
}
function unloadLauncher() {
    if (state.sling)
        Composite.remove(engine.world, state.sling);
    if (state.activeProjectile && !state.activeProjectile.game.launched)
        Composite.remove(engine.world, state.activeProjectile);
    state.sling = null;
    state.activeProjectile = null;
}
function drawOverlay() {
    const ctx = render.context;
    drawSlingshot(ctx);
    state.blocks.forEach(drawHpBar);
    state.blocks.forEach((block) => drawBlockLabel(ctx, block));
    Composite.allBodies(engine.world).filter((body) => body.game?.kind === "projectile").forEach((body) => drawProjectileSymbol(ctx, body));
    if (state.activeProjectile && !state.activeProjectile.game.launched && state.interaction === "attack") {
        drawTrajectory(ctx, state.activeProjectile, anchorPoint(), state.activeProjectile.game.type, aimVelocity(currentLaunchPower()), cannonMuzzlePoint());
    }
}
function drawAimGuide(ctx) {
    const anchor = cannonMuzzlePoint();
    const radians = state.aimAngle * Math.PI / 180;
    const length = 76 + currentLaunchPower() * 58;
    ctx.save();
    ctx.strokeStyle = "rgba(90,50,31,.72)";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(anchor.x, anchor.y);
    ctx.lineTo(anchor.x + Math.cos(radians) * length, anchor.y + Math.sin(radians) * length);
    ctx.stroke();
    ctx.restore();
}
function drawSlingshot(ctx) {
    const pivot = cannonPivotPoint();
    const radians = state.aimAngle * Math.PI / 180;
    ctx.save();
    ctx.translate(pivot.x, pivot.y);
    ctx.rotate(radians);
    if (CANNON_BARREL.complete && CANNON_BARREL.naturalWidth) {
        ctx.drawImage(CANNON_BARREL, CANNON_BARREL_OFFSET_X, CANNON_BARREL_OFFSET_Y, CANNON_BARREL_WIDTH, CANNON_BARREL_HEIGHT);
    }
    else {
        ctx.strokeStyle = "#303943";
        ctx.lineWidth = 24;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(-8, 0);
        ctx.lineTo(CANNON_BARREL_LENGTH, 0);
        ctx.stroke();
    }
    ctx.restore();
    ctx.save();
    if (CANNON_BASE.complete && CANNON_BASE.naturalWidth) {
        ctx.drawImage(CANNON_BASE, pivot.x + CANNON_BASE_OFFSET_X, pivot.y + CANNON_BASE_OFFSET_Y, CANNON_BASE_WIDTH, CANNON_BASE_HEIGHT);
    }
    else {
        ctx.fillStyle = "#9b632d";
        ctx.fillRect(pivot.x + CANNON_BASE_OFFSET_X + 8, pivot.y + CANNON_BASE_OFFSET_Y + 38, CANNON_BASE_WIDTH - 16, 22);
    }
    ctx.restore();
}
function drawHpBar(block) {
    if (block.game.state === "destroyed")
        return;
    const ctx = render.context;
    const ratio = Math.max(0, block.game.hp / block.game.maxHp);
    const width = CONFIG.castle.block.width - 16;
    const height = 6;
    const x = -width / 2;
    const y = CONFIG.castle.block.height / 2 - height - 6;
    const healthRatio = Math.min(1, ratio);
    const armorRatio = Math.max(0, Math.min(0.5, ratio - 1)) / 0.5;
    ctx.save();
    ctx.translate(block.position.x, block.position.y);
    ctx.rotate(block.angle);
    ctx.fillStyle = "rgba(34,26,20,.55)";
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = hpBarColor(ratio);
    ctx.fillRect(x, y, width * healthRatio, height);
    if (armorRatio > 0) {
        ctx.fillStyle = armorBarColor(armorRatio);
        ctx.fillRect(x, y - height - 2, width * armorRatio, height);
        ctx.strokeStyle = "rgba(255,249,237,.72)";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y - height - 2, width, height);
    }
    ctx.strokeStyle = "rgba(255,249,237,.72)";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);
    ctx.restore();
}
function hpBarColor(ratio) {
    if (ratio >= 0.9)
        return "#2fbf68";
    if (ratio >= 0.72)
        return "#73c950";
    if (ratio >= 0.55)
        return "#b9c943";
    if (ratio >= 0.38)
        return "#d59d2f";
    if (ratio >= 0.2)
        return "#d8612f";
    return "#b93030";
}
function armorBarColor(ratio) {
    if (ratio >= 0.75)
        return "#1f7fe5";
    if (ratio >= 0.35)
        return "#35a7ee";
    return "#73d4ff";
}
function deteriorate(levels) {
    levels.forEach((level) => {
        state.blocks.filter((block) => block.game.level === level && block.game.state !== "destroyed").forEach((block) => {
            const dealt = applyDamage(block, CONFIG.deteriorationPerSecond);
            recordBlockDamage(block, dealt);
        });
    });
}
function recordBlockDamage(block, dealt) {
    if (dealt <= 0)
        return;
    const previousHp = block.game.hp + dealt;
    const previousBaseHp = Math.min(previousHp, block.game.maxHp);
    const currentBaseHp = Math.min(block.game.hp, block.game.maxHp);
    recordDamage(previousBaseHp - currentBaseHp);
}
function recordDamage(amount) {
    if (amount > 0)
        state.damageReceived += amount;
}
function recordRecovery(amount) {
    if (amount > 0)
        state.damageRecovered += amount;
}
function damageEffectivenessText(amount, maxHp) {
    const ratio = maxHp ? amount / maxHp : 0;
    if (ratio >= 0.35)
        return "Es muy eficaz";
    if (ratio >= 0.22)
        return "Hace bastante daño";
    if (ratio > 0.12)
        return "Hace daño";
    return "Parece que no tiene efecto";
}
function repairEffectivenessText(amount, maxHp) {
    const ratio = maxHp ? amount / maxHp : 0;
    if (ratio >= 0.35)
        return "Es muy eficaz";
    if (ratio >= 0.22)
        return "Muy bien jugado";
    if (ratio > 0.12)
        return "Bien jugado";
    return "Parece que no causa efecto";
}
function updateUi() {
    const integrity = calculateIntegrity(state.blocks);
    els.playerTimers.forEach((timer, index) => {
        timer.textContent = formatTime(state.playerTimes[index]);
    });
    els.playerClocks.forEach((clock, index) => {
        clock.classList.toggle("active", index === state.activePlayer);
    });
    els.damageReceived.textContent = Math.round(state.damageReceived);
    els.damageRecovered.textContent = Math.round(state.damageRecovered);
    els.angleValue.textContent = `${Math.abs(Math.round(state.aimAngle))}°`;
    els.powerFill.style.width = `${Math.round(currentLaunchPower() * 100)}%`;
    els.launchButton.classList.toggle("charging", state.charging);
    els.launchButton.disabled = !canLaunch();
    els.angleUpButton.disabled = !canLaunch();
    els.angleDownButton.disabled = !canLaunch();
    els.turnModeLabel.textContent = state.turnMode === "attack" ? "Ataque" : "Defensa";
    els.attackPanel.classList.toggle("hidden", state.turnMode !== "attack");
    els.launcherPanel.classList.toggle("hidden", state.turnMode !== "attack");
    els.defensePanel.classList.toggle("hidden", state.turnMode !== "defense");
    els.turnActions.textContent = turnActionsText();
    setMeter("identity", integrity.identity);
    setMeter("image", integrity.image);
    setMeter("reputation", integrity.reputation);
}
function changeAimAngle(delta) {
    state.aimAngle = Math.max(MIN_AIM_ANGLE, Math.min(MAX_AIM_ANGLE, state.aimAngle + delta));
    updateUi();
}
function startLaunchCharge(event) {
    if (!canLaunch())
        return;
    if (state.charging)
        return;
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    beginLaunchCharge("pointer");
}
function startKeyboardLaunchCharge(event) {
    if (!canLaunch())
        return;
    if (state.charging)
        return;
    event.preventDefault();
    beginLaunchCharge("keyboard");
}
function beginLaunchCharge(source) {
    state.charging = true;
    state.chargeSource = source;
    state.chargeStart = performance.now();
    state.launchPower = MIN_LAUNCH_POWER;
    updateCharge();
}
function updateCharge() {
    if (!state.charging)
        return;
    const elapsed = performance.now() - state.chargeStart;
    const ratio = Math.min(1, elapsed / CHARGE_DURATION_MS);
    state.launchPower = MIN_LAUNCH_POWER + (MAX_LAUNCH_POWER - MIN_LAUNCH_POWER) * ratio;
    updateUi();
    state.chargeFrame = window.requestAnimationFrame(updateCharge);
}
function releaseLaunchCharge(event) {
    if (!state.charging || state.chargeSource !== "pointer")
        return;
    event.preventDefault();
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    releaseChargedProjectile();
}
function releaseKeyboardLaunchCharge() {
    if (!state.charging || state.chargeSource !== "keyboard")
        return;
    releaseChargedProjectile();
}
function releaseChargedProjectile() {
    stopLaunchCharge();
    launchProjectile();
}
function cancelLaunchCharge() {
    stopLaunchCharge();
    state.launchPower = MIN_LAUNCH_POWER;
    updateUi();
}
function stopLaunchCharge() {
    state.charging = false;
    state.chargeSource = null;
    if (state.chargeFrame)
        window.cancelAnimationFrame(state.chargeFrame);
    state.chargeFrame = null;
}
function currentLaunchPower() {
    return state.launchPower;
}
function aimVelocity(power) {
    return launchVelocityFromAngle(state.aimAngle, power, state.activeProjectile.game.type);
}
function switchTurn(text) {
    resetTurnActions();
    state.activePlayer = state.activePlayer === 0 ? 1 : 0;
    const turnText = configureTurnForActivePlayer() || text;
    if (state.mode === "finished")
        return;
    renderToolbars();
    updateUi();
    message(turnMessage(turnText));
}
function configureTurnForActivePlayer() {
    state.turnMode = state.activePlayer === 0 ? "attack" : "defense";
    state.interaction = state.turnMode === "attack" ? "attack" : "repair";
    state.launchPower = MIN_LAUNCH_POWER;
    if (state.turnMode === "attack") {
        state.selectedRepair = null;
        if (!hasProjectilesLeft()) {
            finishByDamageBalance("No quedan proyectiles.");
            return "";
        }
        if (!state.activeProjectile || state.activeProjectile.game.launched)
            loadNextProjectile();
        return;
    }
    unloadLauncher();
    if (isCastleDestroyed()) {
        finishWithWinner(0, "El castillo quedó completamente destruido.");
        return "";
    }
    state.selectedRepair = firstAvailableValidRepair();
    if (!state.selectedRepair) {
        completeDefenseTurn(defenseBlockedReason());
        return "";
    }
    return "";
}
function completeDefenseTurn(text) {
    if (state.finalDefense) {
        finishByDamageBalance(text);
        return;
    }
    switchTurn(text);
}
function resetTurnActions() {
    state.attacksUsed = 0;
    state.defenseMovesUsed = 0;
    cancelLaunchCharge();
}
function canLaunch() {
    return state.mode === "playing"
        && state.turnMode === "attack"
        && state.interaction === "attack"
        && state.attacksUsed < ATTACKS_PER_TURN
        && hasValidAttackMove()
        && !!state.sling;
}
function hasValidAttackMove() {
    return hasProjectilesLeft() && state.activeProjectile && !state.activeProjectile.game.launched;
}
function firstAvailableValidRepair() {
    const integrity = calculateIntegrity(state.blocks);
    return Object.keys(CONFIG.repairs).find((key) => (state.repairCounts[key] > 0 && state.blocks.some((block) => canRepair(block, key, integrity).ok))) || null;
}
function hasValidDefenseMove() {
    return !isCastleDestroyed() && !!firstAvailableValidRepair();
}
function hasProjectilesLeft() {
    return Object.values(state.projectileCounts).some((count) => count > 0);
}
function isCastleDestroyed() {
    return Object.values(calculateIntegrity(state.blocks)).every((value) => value <= 0);
}
function countCollapsedLevels(integrity) {
    return Object.values(integrity).filter((value) => value <= 0).length;
}
function isCastleFullIntegrity() {
    return Object.values(calculateIntegrity(state.blocks)).every((value) => value >= 100);
}
function defenseBlockedReason() {
    return "No tienes más reparaciones válidas.";
}
function turnActionsText() {
    if (state.turnMode === "attack") {
        const remaining = Math.max(0, ATTACKS_PER_TURN - state.attacksUsed);
        return `${remaining} tiro disponible`;
    }
    const remaining = Math.max(0, DEFENSE_MOVES_PER_TURN - state.defenseMovesUsed);
    return `${remaining} movimientos de defensa`;
}
function turnMessage(text) {
    return `${text} Juega ${playerLabel(state.activePlayer)}.`;
}
function playerLabel(index) {
    return `Jugador ${index + 1}`;
}
function formatTime(seconds) {
    const safeSeconds = Math.max(0, seconds);
    const minutes = Math.floor(safeSeconds / 60);
    const remainder = safeSeconds % 60;
    return `${minutes}:${String(remainder).padStart(2, "0")}`;
}
function setMeter(key, value) {
    document.querySelector(`#meter-${key}`).value = value;
    document.querySelector(`#value-${key}`).textContent = `${value}%`;
}
function resetCounts() {
    state.projectileCounts = Object.fromEntries(Object.entries(CONFIG.projectiles).map(([key, cfg]) => [key, cfg.count]));
    state.repairCounts = Object.fromEntries(Object.entries(CONFIG.repairs).map(([key, cfg]) => [key, cfg.count]));
}
function anchorPoint() {
    const point = cannonPointAtDistance(CANNON_BARREL_LENGTH - CANNON_PROJECTILE_SETBACK);
    return { x: point.x, y: point.y + CANNON_PROJECTILE_OFFSET_Y };
}
function cannonMuzzlePoint() {
    return cannonPointAtDistance(CANNON_BARREL_LENGTH);
}
function cannonPointAtDistance(distance) {
    const pivot = cannonPivotPoint();
    const radians = state.aimAngle * Math.PI / 180;
    return {
        x: pivot.x + Math.cos(radians) * distance,
        y: pivot.y + Math.sin(radians) * distance
    };
}
function cannonPivotPoint() {
    const size = canvasSize();
    return {
        x: size.width * CONFIG.slingshot.anchorRatio.x,
        y: floorY - CANNON_BASE_OFFSET_Y - CANNON_BASE_HEIGHT + CANNON_BASE_GROUND_SINK
    };
}
function canvasSize() {
    return { width: els.host.clientWidth, height: els.host.clientHeight };
}
function resizeCanvas() {
    const size = canvasSize();
    render.canvas.width = size.width * (window.devicePixelRatio || 1);
    render.canvas.height = size.height * (window.devicePixelRatio || 1);
    render.canvas.style.width = `${size.width}px`;
    render.canvas.style.height = `${size.height}px`;
    render.options.width = size.width;
    render.options.height = size.height;
    Composite.remove(engine.world, [ground, leftWall, rightWall, ceiling]);
    addBoundaries(size);
}
function floatingText(position, text, type = "damage", note = "") {
    const node = document.createElement("span");
    node.className = `float-text ${type}`;
    node.innerHTML = note ? `<b>${text}</b><small>${note}</small>` : text;
    node.style.left = `${position.x}px`;
    node.style.top = `${position.y}px`;
    els.floating.append(node);
    window.setTimeout(() => node.remove(), 1700);
}
function spawnFragments(position, color) {
    for (let i = 0; i < 5; i += 1) {
        const piece = Bodies.rectangle(position.x + Math.random() * 26 - 13, position.y + Math.random() * 18 - 9, 12, 8, {
            density: 0.001,
            frictionAir: 0.02,
            render: { fillStyle: color }
        });
        Body.setVelocity(piece, { x: Math.random() * 5 - 2.5, y: -Math.random() * 4 });
        Composite.add(engine.world, piece);
        window.setTimeout(() => Composite.remove(engine.world, piece), 2800);
    }
}
function flash(position, radius) {
    const node = document.createElement("span");
    node.style.cssText = `position:absolute;left:${position.x - radius}px;top:${position.y - radius}px;width:${radius * 2}px;height:${radius * 2}px;border-radius:50%;background:radial-gradient(circle,rgba(255,237,155,.75),rgba(184,65,45,.1) 62%,transparent 70%);animation:floatUp .45s ease-out forwards;`;
    els.floating.append(node);
    window.setTimeout(() => node.remove(), 480);
}
function shake() {
    els.stage.classList.remove("shake");
    void els.stage.offsetWidth;
    els.stage.classList.add("shake");
}
function message(text) {
    els.message.textContent = text;
}
function toggleSound(event) {
    state.muted = !state.muted;
    event.currentTarget.setAttribute("aria-pressed", String(state.muted));
    event.currentTarget.textContent = state.muted ? "Silencio" : "Sonido";
}
function playTone(freq, duration) {
    if (state.muted)
        return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass)
        return;
    state.audio ??= new AudioContextClass();
    const osc = state.audio.createOscillator();
    const gain = state.audio.createGain();
    osc.frequency.value = freq;
    osc.type = "triangle";
    gain.gain.value = 0.035;
    osc.connect(gain).connect(state.audio.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, state.audio.currentTime + duration);
    osc.stop(state.audio.currentTime + duration);
}
function labelLevel(key) {
    return CONFIG.castle.levels[key].label;
}
function reflection(integrity, weakest) {
    if (integrity.identity <= 20)
        return "Sin una identidad sólida, la imagen y la reputación pierden su soporte.";
    if (integrity.image <= 25)
        return "La percepción pública debilitada dejó expuesta la reputación.";
    if (integrity.reputation >= 70)
        return "Una estructura coherente permitió resistir la crisis.";
    if (integrity.reputation <= 25 && integrity.identity >= 65)
        return "La reputación puede dañarse rápidamente, pero una identidad sólida facilita su recuperación.";
    return `El nivel más afectado fue ${labelLevel(weakest)}: la comunicación integrada exige sostener la estructura completa.`;
}
