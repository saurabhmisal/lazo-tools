import { writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import gifenc from "gifenc";
import {
  drawThinkingScene,
  SCENE_ASSETS,
  SCENE_WIDTH,
  SCENE_HEIGHT,
} from "../src/thinking-scene.js";
import { STORY_DURATION_MS } from "../src/story-state.js";

const { GIFEncoder, quantize, applyPalette } = gifenc;
const root = new URL("../public/assets/", import.meta.url);
const artwork = {};
for (const [name, filename] of Object.entries(SCENE_ASSETS))
  artwork[name] = await loadImage(new URL(filename, root).pathname);
const font = "/System/Library/Fonts/Supplemental/Chalkboard.ttc";
if (existsSync(font)) GlobalFonts.registerFromPath(font, "LazoHand");
const options = { handwriting: '"LazoHand", cursive' };
const canvas = createCanvas(SCENE_WIDTH, SCENE_HEIGHT);
const ctx = canvas.getContext("2d");
drawThinkingScene(ctx, artwork, 10500, { ...options, still: true });
await writeFile(
  new URL("thinker-scene-poster.png", root),
  canvas.toBuffer("image/png"),
);

const width = 640,
  height = 480,
  fps = 20;
const scaled = createCanvas(width, height),
  surface = scaled.getContext("2d");
const pixels = (time) => {
  drawThinkingScene(ctx, artwork, time, options);
  surface.drawImage(canvas, 0, 0, width, height);
  return surface.getImageData(0, 0, width, height).data;
};
const sampleTimes = [0, 4000, 7500, 10500];
const samples = new Uint8Array(width * height * 4 * sampleTimes.length);
sampleTimes.forEach((time, i) =>
  samples.set(pixels(time), i * width * height * 4),
);
const palette = quantize(samples, 256);
const gif = GIFEncoder();
for (let frame = 0; frame < (STORY_DURATION_MS / 1000) * fps; frame++) {
  const index = applyPalette(pixels((frame * 1000) / fps), palette);
  gif.writeFrame(index, width, height, {
    ...(frame === 0 ? { palette } : {}),
    delay: 1000 / fps,
    repeat: 0,
  });
}
gif.finish();
await writeFile(new URL("thinker-scene.gif", root), gif.bytes());
console.log(
  `Rendered ${STORY_DURATION_MS / 1000}s loop at ${fps}fps (${(gif.bytes().length / 1024 / 1024).toFixed(1)} MiB).`,
);
