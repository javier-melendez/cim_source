import { CONFIG } from "./config.js";

const { Bodies, Composite } = Matter;

const BLOCK_TEXTURES = {
  identity: "./sprites/bloque_castillo_azul.png",
  image: "./sprites/bloque_castillo_gris.png",
  reputation: "./sprites/bloque_castillo_morado.png"
};

export function createCastle(world, size) {
  const blocks = [];
  const bw = CONFIG.castle.block.width;
  const bh = CONFIG.castle.block.height;
  const baseX = size.width * CONFIG.castle.originRatio.x;
  const groundY = size.height * 0.84;
  const baseY = groundY - bh / 2;
  const rowGap = 4;
  const rows = [
    { level: "identity", count: 5, offset: 0 },
    { level: "identity", count: 5, offset: 0 },
    { level: "image", count: 4, offset: -bw / 2 },
    { level: "image", count: 4, offset: bw / 2 },
    { level: "image", count: 4, offset: -bw / 2 },
    { level: "image", count: 4, offset: bw / 2 },
    { level: "reputation", count: 2, offset: 0 },
    { level: "reputation", count: 2, offset: 0 },
    { level: "reputation", count: 2, offset: 0 }
  ];

  rows.forEach((row, index) => {
    addRow(row.level, row.count, baseX, baseY - (bh + rowGap) * index, row.offset);
  });

  Composite.add(world, blocks);
  return { blocks };

  function addRow(level, count, centerX, y, offset) {
    const cfg = CONFIG.castle.levels[level];
    const start = centerX - ((count - 1) * bw) / 2 + offset;
    for (let i = 0; i < count; i += 1) {
      const block = Bodies.rectangle(start + i * bw, y, bw, bh, {
        density: cfg.density,
        friction: 0.7,
        restitution: 0.08,
        render: {
          fillStyle: cfg.color,
          sprite: { texture: BLOCK_TEXTURES[level], xScale: 1, yScale: 1 }
        }
      });
      block.game = {
        kind: "castleBlock",
        id: `${level}-${blocks.length + 1}`,
        level,
        maxHp: cfg.hp,
        hp: cfg.hp,
        original: { x: block.position.x, y: block.position.y, angle: 0 },
        state: "active"
      };
      blocks.push(block);
    }
  }
}

export function drawBlockLabel(context, block) {
  if (block.game.state === "destroyed") return;
  const text = CONFIG.castle.levels[block.game.level].label;
  const width = CONFIG.castle.block.width - 10;
  const maxFontSize = 11;
  const minFontSize = 6;
  let fontSize = maxFontSize;

  context.save();
  context.translate(block.position.x, block.position.y);
  context.rotate(block.angle);
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.lineWidth = 3;
  do {
    context.font = `900 ${fontSize}px Arial`;
    if (context.measureText(text).width <= width || fontSize <= minFontSize) break;
    fontSize -= 1;
  } while (fontSize >= minFontSize);
  context.strokeStyle = "rgba(255,249,237,.86)";
  context.fillStyle = "#2f241d";
  context.strokeText(text, 0, -2);
  context.fillText(text, 0, -2);
  context.restore();
}

export function applyDamage(block, amount) {
  if (!block?.game || block.game.state === "destroyed") return 0;
  const previous = block.game.hp;
  block.game.hp = Math.max(0, block.game.hp - amount);
  const ratio = block.game.hp / block.game.maxHp;
  const cfg = CONFIG.castle.levels[block.game.level];
  block.render.fillStyle = ratio > 0.55 ? cfg.color : ratio > 0.2 ? cfg.damaged : "#5c4b43";
  block.render.opacity = Math.max(0.45, 0.55 + ratio * 0.45);
  if (block.game.hp <= 0) {
    block.game.state = "destroyed";
    block.isSensor = true;
    block.collisionFilter.mask = 0;
    block.render.visible = false;
  } else if (ratio < 0.65) {
    block.game.state = "damaged";
  }
  return previous - block.game.hp;
}

export function calculateIntegrity(blocks) {
  const totals = {
    identity: { hp: 0, max: 0 },
    image: { hp: 0, max: 0 },
    reputation: { hp: 0, max: 0 }
  };
  blocks.forEach((block) => {
    const g = block.game;
    totals[g.level].hp += Math.max(0, Math.min(g.hp, g.maxHp));
    totals[g.level].max += g.maxHp;
  });
  return Object.fromEntries(Object.entries(totals).map(([level, data]) => {
    const percent = data.max ? Math.round((data.hp / data.max) * 100) : 0;
    return [level, percent];
  }));
}
