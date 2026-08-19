import { CONFIG } from "./config.js";
const ARMOR_LIMIT_RATIO = 1.5;
export function canRepair(block, materialKey, integrity) {
    const material = CONFIG.repairs[materialKey];
    if (!block?.game || block.game.kind !== "castleBlock")
        return { ok: false, reason: "Selecciona un bloque del castillo." };
    if (block.game.state === "destroyed")
        return { ok: false, reason: "Ese bloque ya no se puede reparar." };
    if (block.game.hp >= armorLimit(block))
        return { ok: false, reason: "El bloque ya está en su armadura máxima." };
    return { ok: true };
}
export function repairAmount(block, materialKey, integrity) {
    const material = CONFIG.repairs[materialKey];
    if (!material.allowed.includes(block.game.level))
        return Math.min(1, armorLimit(block) - block.game.hp);
    const multiplier = material.multipliers[block.game.level] ?? 1;
    return Math.max(0, Math.min(material.amount * multiplier, armorLimit(block) - block.game.hp));
}
function armorLimit(block) {
    return block.game.maxHp * ARMOR_LIMIT_RATIO;
}
