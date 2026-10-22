import { STORY_DURATION_MS } from "./story-state.js";

export const SCENE_WIDTH = 800;
export const SCENE_HEIGHT = 600;
export const SCENE_ASSETS = {
  pressure: "pm-thinking-v3.png",
  composed: "pm-contented-v3.png",
};

const clamp = (n) => Math.min(1, Math.max(0, n));
const ease = (n) => {
  const t = clamp(n);
  return t * t * (3 - 2 * t);
};

export function thinkingSceneAt(elapsed, still = false) {
  const seconds = still
    ? 10.5
    : (Math.max(0, elapsed) % STORY_DURATION_MS) / 1000;
  const reset = 1 - ease((seconds - 11) / 1);
  return {
    seconds,
    contented: ease((seconds - 6.8) / 1.8) * reset,
    progress: ease((seconds - 1.4) / 6.6) * reset,
    listening: still ? 0 : 1 - ease((seconds - 7.2) / 1.2),
    breath: still ? 0 : Math.sin((seconds * Math.PI) / 3) * 0.9,
    still,
  };
}

function roundBox(ctx, x, y, w, h, fill, stroke, radius = 8) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function text(ctx, value, x, y, size, color, family = "sans-serif") {
  ctx.font = `${size}px ${family}`;
  ctx.fillStyle = color;
  ctx.fillText(value, x, y);
}

function check(ctx, x, y, color) {
  ctx.beginPath();
  ctx.moveTo(x, y + 4);
  ctx.lineTo(x + 4, y + 8);
  ctx.lineTo(x + 13, y - 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.stroke();
}

function wave(ctx, x, y, seconds, listening, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.strokeStyle = listening ? "#ffd76d" : "#89d0b2";
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  for (let i = 0; i < 7; i++) {
    const h = listening ? 3 + (1 + Math.sin(seconds * 5 + i * 1.3)) * 6 : 3;
    ctx.beginPath();
    ctx.moveTo(i * 5, -h / 2);
    ctx.lineTo(i * 5, h / 2);
    ctx.stroke();
  }
  ctx.restore();
}

function laptop(ctx, frame) {
  roundBox(ctx, 330, 205, 360, 223, "#a2ada9", "#d1dad4", 12);
  roundBox(ctx, 338, 213, 344, 206, "#172321", null, 6);
  ctx.fillStyle = "#293c35";
  ctx.fillRect(338, 213, 344, 27);
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(351 + i * 11, 226, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = ["#f5a8c9", "#ffd07a", "#8edfc0"][i];
    ctx.fill();
  }
  text(ctx, "product.tsx", 392, 230, 11, "#c4d2ca", "monospace");
  const lines = [
    ["const idea = yourDirection", "#c5adff"],
    ["const plan = await lazo.prepare()", "#8dc4ff"],
    ["", "#89d0b2"],
    ["function Prototype() {", "#ffd07a"],
    ["  return <YourNextBigThing />", "#8edfc0"],
    ["}", "#ffd07a"],
    ["", "#89d0b2"],
    ["// ready for your review", "#9caf9f"],
  ];
  const budget = frame.still ? 1000 : 12 + frame.progress * 200;
  let consumed = 0;
  ctx.save();
  ctx.beginPath();
  ctx.rect(347, 245, 325, 165);
  ctx.clip();
  lines.forEach(([line, color], i) => {
    const length = Math.max(0, Math.floor(budget - consumed));
    text(ctx, String(i + 1), 349, 261 + i * 17, 10, "#718d7e", "monospace");
    text(
      ctx,
      line.slice(0, length),
      369,
      261 + i * 17,
      11.5,
      color,
      "monospace",
    );
    consumed += line.length;
  });
  ctx.restore();
  ctx.beginPath();
  ctx.moveTo(330, 428);
  ctx.lineTo(690, 428);
  ctx.lineTo(717, 442);
  ctx.lineTo(306, 442);
  ctx.closePath();
  ctx.fillStyle = "#c1cbc6";
  ctx.fill();
  roundBox(ctx, 470, 428, 83, 5, "#7f9286", null, 2);
  if (frame.progress > 0.8) {
    check(ctx, 654, 396, "#89d0b2");
  }
}

function tablet(ctx, frame, handwriting) {
  ctx.save();
  ctx.translate(418, 510);
  ctx.rotate(-0.065);
  roundBox(ctx, -109, -66, 218, 140, "#9ba7a1", "#c6d2ca", 13);
  roundBox(ctx, -102, -60, 204, 127, "#f4f5f0", null, 7);
  text(
    ctx,
    "One clear bet".slice(0, Math.floor(frame.progress * 28)),
    -88,
    -31,
    18,
    "#174f3e",
    handwriting,
  );
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "#89d0b2";
  ctx.beginPath();
  ctx.moveTo(-88, -23);
  ctx.lineTo(-88 + 148 * ease((frame.progress - 0.2) * 5), -23);
  ctx.stroke();
  for (let i = 0; i < 3; i++) {
    ctx.strokeStyle = "#718d7e";
    ctx.strokeRect(-85, -9 + i * 21, 7, 7);
    const line = ["Who needs it?", "What matters?", "Try, then learn"][i];
    text(
      ctx,
      line.slice(
        0,
        Math.floor(
          line.length * clamp((frame.progress - 0.25 - i * 0.18) / 0.25),
        ),
      ),
      -67,
      i * 21,
      13,
      "#314d3e",
      handwriting,
    );
  }
  if (frame.progress > 0.9) check(ctx, -86, 12, "#2e7d63");
  ctx.restore();
}

function phone(ctx, frame) {
  ctx.save();
  ctx.translate(716, 484);
  ctx.rotate(0.065);
  roundBox(ctx, -42, -95, 88, 180, "#aebbb2", "#d9dfda", 16);
  roundBox(ctx, -36, -89, 76, 168, "#f4f5f0", null, 11);
  roundBox(ctx, -16, -85, 36, 5, "#223a2d", null, 3);
  text(ctx, "Your app", -26, -60, 12, "#174f3e");
  const colours = ["#8dc4ff", "#c5adff", "#8edfc0", "#ffd07a"];
  for (let i = 0; i < 4; i++) {
    const amount = ease((frame.progress - i * 0.16) * 4);
    ctx.save();
    ctx.globalAlpha = 0.12 + amount * 0.88;
    ctx.translate(0, (1 - amount) * 8);
    roundBox(ctx, -26, -47 + i * 27, 56, 21, colours[i], null, 4);
    ctx.fillStyle = "#174f3e";
    ctx.globalAlpha *= 0.4;
    ctx.fillRect(-20, -41 + i * 27, 20 + i * 4, 2);
    ctx.fillRect(-20, -36 + i * 27, 34, 2);
    ctx.restore();
  }
  if (frame.progress > 0.95) check(ctx, -3, 65, "#2e7d63");
  ctx.restore();
}

// Shared by the live canvas and offline GIF exporter, so both tell the same story.
export function drawThinkingScene(
  ctx,
  artwork,
  elapsed,
  { still = false, handwriting = '"Kalam", cursive' } = {},
) {
  const frame = thinkingSceneAt(elapsed, still);
  ctx.clearRect(0, 0, SCENE_WIDTH, SCENE_HEIGHT);
  ctx.fillStyle = "#181b19";
  ctx.fillRect(0, 0, SCENE_WIDTH, SCENE_HEIGHT);
  const image = artwork.pressure || artwork.composed;
  ctx.save();
  ctx.translate(0, frame.breath);
  if (image) ctx.drawImage(image, -40, 4, 400, 600);
  if (artwork.composed && frame.contented > 0) {
    ctx.globalAlpha = frame.contented;
    ctx.drawImage(artwork.composed, -40, 4, 400, 600);
  }
  ctx.restore();
  // The watch face is at this fixed point in the registered character artwork.
  wave(
    ctx,
    147,
    206 + frame.breath,
    frame.seconds,
    frame.listening > 0.1,
    0.32,
  );
  wave(ctx, 350, 143, frame.seconds, frame.listening > 0.1, 0.9);
  text(
    ctx,
    frame.contented > 0.7 ? "Still your call" : "Thinking out loud",
    399,
    149,
    18,
    "#b8c9bf",
    handwriting,
  );
  laptop(ctx, frame);
  tablet(ctx, frame, handwriting);
  phone(ctx, frame);
  return frame;
}
