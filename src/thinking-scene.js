import { STORY_DURATION_MS } from "./story-state.js";
import { __iconData as bike } from "lucide-react/dist/esm/icons/bike.mjs";
import { __iconData as car } from "lucide-react/dist/esm/icons/car-front.mjs";
import { __iconData as parcel } from "lucide-react/dist/esm/icons/package.mjs";
import { __iconData as pin } from "lucide-react/dist/esm/icons/map-pin.mjs";
import { __iconData as pay } from "lucide-react/dist/esm/icons/arrow-up-right.mjs";
import { __iconData as wallet } from "lucide-react/dist/esm/icons/wallet.mjs";
import { __iconData as card } from "lucide-react/dist/esm/icons/credit-card.mjs";
import { __iconData as scan } from "lucide-react/dist/esm/icons/scan-line.mjs";
import { __iconData as heart } from "lucide-react/dist/esm/icons/heart-pulse.mjs";
import { __iconData as activity } from "lucide-react/dist/esm/icons/activity.mjs";
import { __iconData as pill } from "lucide-react/dist/esm/icons/pill.mjs";
import { __iconData as calendar } from "lucide-react/dist/esm/icons/calendar-days.mjs";
import { __iconData as house } from "lucide-react/dist/esm/icons/house.mjs";
import { __iconData as key } from "lucide-react/dist/esm/icons/key-round.mjs";
import { __iconData as film } from "lucide-react/dist/esm/icons/film.mjs";
import { __iconData as tv } from "lucide-react/dist/esm/icons/tv-minimal-play.mjs";
import { __iconData as grid } from "lucide-react/dist/esm/icons/layout-grid.mjs";
import { __iconData as tasks } from "lucide-react/dist/esm/icons/list-checks.mjs";
import { __iconData as rocket } from "lucide-react/dist/esm/icons/rocket.mjs";
import { __iconData as compass } from "lucide-react/dist/esm/icons/compass.mjs";

export const SCENE_WIDTH = 800;
export const SCENE_HEIGHT = 600;
export const SCENE_RENDER_SCALE = 2;
export const SCENE_ASSETS = {
  pressure: "pm-thinking-v5.png",
  composed: "pm-contented-v5.png",
};
// Logical canvas positions shared by rendering and proportion/registration checks.
export const SCENE_LAYOUT = {
  character: { x: -40, y: 4, width: 400, height: 600 },
  desk: { top: 326, left: 218, right: 786, floor: 567 },
  laptop: { x: 41, y: 18.368, scale: 0.696 },
  tablet: { x: 342, y: -29.2, scale: 0.6 },
  phone: { x: 727.2, y: 263.6, scale: 0.6 },
};
export const PHONE_SCREENS = {
  ride: [
    { label: "Bike", icon: bike, color: "#ffd07a" },
    { label: "Car", icon: car, color: "#8dc4ff" },
    { label: "Parcel", icon: parcel, color: "#c5adff" },
    { label: "Saved", icon: pin, color: "#8edfc0" },
  ],
  fintech: [
    { label: "Pay", icon: pay, color: "#8edfc0" },
    { label: "Wallet", icon: wallet, color: "#8dc4ff" },
    { label: "Cards", icon: card, color: "#c5adff" },
    { label: "Scan", icon: scan, color: "#ffd07a" },
  ],
  healthcare: [
    { label: "Care", icon: heart, color: "#f5a8c9" },
    { label: "Vitals", icon: activity, color: "#8dc4ff" },
    { label: "Meds", icon: pill, color: "#c5adff" },
    { label: "Visits", icon: calendar, color: "#8edfc0" },
  ],
  rentals: [
    { label: "Homes", icon: house, color: "#ffd07a" },
    { label: "Saved", icon: pin, color: "#f5a8c9" },
    { label: "Tours", icon: calendar, color: "#8dc4ff" },
    { label: "Keys", icon: key, color: "#8edfc0" },
  ],
  ott: [
    { label: "Films", icon: film, color: "#c5adff" },
    { label: "Series", icon: tv, color: "#8dc4ff" },
    { label: "Live", icon: activity, color: "#f5a8c9" },
    { label: "Saved", icon: grid, color: "#ffd07a" },
  ],
  product: [
    { label: "Plan", icon: compass, color: "#8dc4ff" },
    { label: "Tasks", icon: tasks, color: "#c5adff" },
    { label: "Launch", icon: rocket, color: "#ffd07a" },
    { label: "Learn", icon: activity, color: "#8edfc0" },
  ],
};
const phoneModes = Object.keys(PHONE_SCREENS);
const phoneHeaders = {
  healthcare: ["Health", "Care plan", "Your wellbeing"],
  rentals: ["Rentals", "Your next place", "Find your fit"],
  ott: ["Watch", "Your watchlist", "Tonight's pick"],
  product: ["Product", "Next release", "Ready to review"],
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
  const contented = ease((seconds - 6.8) / 1.8) * reset;
  return {
    seconds,
    contented,
    pose: contented >= 0.5 ? "composed" : "pressure",
    nod: still ? 0 : Math.sin(contented * Math.PI) * 1.4,
    phoneMode:
      phoneModes[Math.min(phoneModes.length - 1, Math.floor(seconds / 2))],
    progress: ease((seconds - 1.4) / 6.6) * reset,
    listening: still ? 0 : 1 - ease((seconds - 7.2) / 1.2),
    breath: still ? 0 : Math.sin((seconds * Math.PI) / 3) * 0.9,
    still,
  };
}

function productIcon(ctx, icon, x, y, size, PathType) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / icon.size, size / icon.size);
  ctx.strokeStyle = "#174f3e";
  ctx.lineWidth = 1.8;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const [tag, attrs] of icon.node) {
    if (tag === "path" && PathType) ctx.stroke(new PathType(attrs.d));
    else if (tag === "circle") {
      ctx.beginPath();
      ctx.arc(
        Number(attrs.cx),
        Number(attrs.cy),
        Number(attrs.r),
        0,
        Math.PI * 2,
      );
      ctx.stroke();
    } else if (tag === "rect") {
      ctx.beginPath();
      ctx.roundRect(
        Number(attrs.x || 0),
        Number(attrs.y || 0),
        Number(attrs.width),
        Number(attrs.height),
        Number(attrs.rx || 0),
      );
      ctx.stroke();
    } else if (tag === "line") {
      ctx.beginPath();
      ctx.moveTo(Number(attrs.x1), Number(attrs.y1));
      ctx.lineTo(Number(attrs.x2), Number(attrs.y2));
      ctx.stroke();
    } else if (tag === "polyline" && PathType) {
      ctx.stroke(new PathType(`M ${attrs.points}`));
    }
  }
  ctx.restore();
}

function standingDesk(ctx) {
  // The rear desk is painted first; the foreground character naturally occludes it.
  const { top, left, right, floor } = SCENE_LAYOUT.desk;
  const width = right - left;
  for (const x of [left + 48, right - 48]) {
    roundBox(ctx, x, top + 18, 26, floor - top - 25, "#788a81", "#a8b5ad", 3);
    roundBox(ctx, x + 6, top + 74, 14, floor - top - 81, "#b8c6bc", null, 2);
    roundBox(ctx, x - 30, floor - 10, 90, 10, "#c8d1cb", null, 4);
  }
  roundBox(ctx, left + 60, top + 26, width - 96, 12, "#677d70", null, 3);
  ctx.beginPath();
  ctx.moveTo(left + 18, top);
  ctx.lineTo(right - 18, top);
  ctx.lineTo(right, top + 12);
  ctx.lineTo(left, top + 12);
  ctx.closePath();
  ctx.fillStyle = "#e2e8e2";
  ctx.fill();
  roundBox(ctx, left, top + 12, width, 10, "#a3b4a8", null, 2);
  roundBox(ctx, 650, top + 22, 51, 16, "#263d31", null, 3);
  text(ctx, "96", 656, top + 33, 9, "#89d0b2", "monospace");
  text(ctx, "+  -", 679, top + 33, 8, "#c3d3c8", "monospace");
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

function appleWatch(ctx, frame) {
  // One registered watch replaces the small accessory variations in both poses.
  ctx.save();
  ctx.translate(153, 207);
  ctx.rotate(0.07);
  ctx.lineWidth = 0.9;
  ctx.strokeStyle = "#765d12";
  ctx.fillStyle = "#f5cf32";
  ctx.beginPath();
  ctx.roundRect(-5.8, -12, 11.6, 29.5, 2.4);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ffe56b";
  ctx.fillRect(-4.5, 7.5, 1.2, 8);
  ctx.fillStyle = "#404643";
  ctx.beginPath();
  ctx.roundRect(7.3, -4.8, 2, 4, 0.8);
  ctx.fill();
  ctx.fillStyle = "#252b28";
  ctx.strokeStyle = "#ccd3ce";
  ctx.beginPath();
  ctx.roundRect(-8.4, -9, 16.8, 16.5, 4);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#090e0c";
  ctx.beginPath();
  ctx.roundRect(-6.9, -7.5, 13.8, 13.5, 3);
  ctx.fill();
  wave(ctx, -4.8, -0.7, frame.seconds, frame.listening > 0.1, 0.32);
  ctx.restore();
}

function goldEarring(ctx) {
  // Anatomical left: the partly hidden ear at the viewer's right edge of the face.
  ctx.beginPath();
  ctx.arc(172.3, 71, 1.9, 0, Math.PI * 2);
  ctx.fillStyle = "#e7b83e";
  ctx.fill();
  ctx.strokeStyle = "#725013";
  ctx.lineWidth = 0.6;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(171.8, 70.5, 0.45, 0, Math.PI * 2);
  ctx.fillStyle = "#fff0a6";
  ctx.fill();
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

function phone(ctx, frame, PathType) {
  ctx.save();
  roundBox(ctx, -54, -104, 108, 208, "#aebbb2", "#d9dfda", 15);
  roundBox(ctx, -48, -98, 96, 196, "#f4f5f0", null, 10);
  roundBox(ctx, -18, -94, 36, 4, "#223a2d", null, 2);
  const ride = frame.phoneMode === "ride";
  const fintech = frame.phoneMode === "fintech";
  const header = phoneHeaders[frame.phoneMode];
  text(
    ctx,
    ride ? "Ride" : fintech ? "Money" : header[0],
    -40,
    -72,
    13,
    "#174f3e",
  );
  roundBox(ctx, -40, -62, 80, 49, ride ? "#dcebe6" : "#174f3e", null, 4);
  if (ride) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(-38, -60, 76, 45);
    ctx.clip();
    ctx.strokeStyle = "#b3c9bf";
    ctx.lineWidth = 3;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(-46, -58 + i * 15);
      ctx.lineTo(45, -40 + i * 15);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-30 + i * 25, -64);
      ctx.lineTo(-45 + i * 25, -8);
      ctx.stroke();
    }
    ctx.strokeStyle = "#2e7d63";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-24, -26);
    ctx.lineTo(-12, -43);
    ctx.lineTo(14, -39);
    ctx.lineTo(27, -49);
    ctx.stroke();
    ctx.restore();
    productIcon(ctx, pin, 19, -59, 16, PathType);
  } else if (fintech) {
    text(ctx, "Balance", -32, -47, 8, "#b9dac8");
    text(ctx, "12,480", -32, -28, 17, "#f4f5f0", "monospace");
  } else {
    text(ctx, header[1], -34, -47, 9, "#b9dac8");
    text(ctx, header[2], -34, -28, 9, "#f4f5f0");
  }
  PHONE_SCREENS[frame.phoneMode].forEach(({ label, icon, color }, i) => {
    const x = -40 + (i % 2) * 43;
    const y = -5 + Math.floor(i / 2) * 42;
    const amount = ease((frame.progress - i * 0.1) * 5);
    ctx.save();
    ctx.globalAlpha = 0.4 + amount * 0.6;
    roundBox(ctx, x, y, 37, 36, color, null, 4);
    productIcon(ctx, icon, x + 11, y + 4, 15, PathType);
    text(ctx, label, x + 5, y + 30, 8, "#174f3e");
    ctx.restore();
  });
  roundBox(ctx, -17, 90, 34, 3, "#718d7e", null, 2);
  ctx.restore();
}

// Shared by the live canvas and offline GIF exporter, so both tell the same story.
export function drawThinkingScene(
  ctx,
  artwork,
  elapsed,
  {
    still = false,
    handwriting = '"Kalam", cursive',
    PathType = globalThis.Path2D,
  } = {},
) {
  const frame = thinkingSceneAt(elapsed, still);
  ctx.clearRect(0, 0, SCENE_WIDTH, SCENE_HEIGHT);
  ctx.fillStyle = "#181b19";
  ctx.fillRect(0, 0, SCENE_WIDTH, SCENE_HEIGHT);
  standingDesk(ctx);
  ctx.save();
  ctx.translate(SCENE_LAYOUT.laptop.x, SCENE_LAYOUT.laptop.y);
  ctx.scale(SCENE_LAYOUT.laptop.scale, SCENE_LAYOUT.laptop.scale);
  laptop(ctx, frame);
  ctx.restore();
  ctx.strokeStyle = "#8c9f92";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(625, 306);
  ctx.lineTo(646, SCENE_LAYOUT.desk.top);
  ctx.lineTo(673, SCENE_LAYOUT.desk.top);
  ctx.stroke();
  ctx.save();
  ctx.translate(SCENE_LAYOUT.tablet.x, SCENE_LAYOUT.tablet.y);
  ctx.scale(SCENE_LAYOUT.tablet.scale, SCENE_LAYOUT.tablet.scale);
  tablet(ctx, frame, handwriting);
  ctx.restore();
  ctx.save();
  ctx.translate(SCENE_LAYOUT.phone.x, SCENE_LAYOUT.phone.y);
  ctx.scale(SCENE_LAYOUT.phone.scale, SCENE_LAYOUT.phone.scale);
  phone(ctx, frame, PathType);
  ctx.restore();
  // Exactly one full-opacity sprite is painted per frame: never blend two silhouettes.
  const image = artwork[frame.pose] || artwork.pressure || artwork.composed;
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.translate(0, frame.breath + frame.nod);
  if (image) {
    const { x, y, width, height } = SCENE_LAYOUT.character;
    ctx.drawImage(image, x, y, width, height);
    appleWatch(ctx, frame);
    goldEarring(ctx);
  }
  ctx.restore();
  wave(ctx, 355, 28, frame.seconds, frame.listening > 0.1, 0.9);
  text(
    ctx,
    frame.contented > 0.7 ? "Still your call" : "Thinking out loud",
    399,
    34,
    18,
    "#b8c9bf",
    handwriting,
  );
  return frame;
}
