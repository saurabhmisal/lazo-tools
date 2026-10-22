import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createCanvas, loadImage } from "@napi-rs/canvas";
import {
  drawThinkingScene,
  thinkingSceneAt,
  SCENE_ASSETS,
  SCENE_WIDTH,
  SCENE_HEIGHT,
} from "../src/thinking-scene.js";
import { STORY_DURATION_MS } from "../src/story-state.js";

test("the storyboard moves from thinking and dictation to completed device work", () => {
  const start = thinkingSceneAt(0),
    middle = thinkingSceneAt(5000),
    end = thinkingSceneAt(10500);
  assert.equal(start.contented, 0);
  assert.equal(start.progress, 0);
  assert.equal(start.listening, 1);
  assert.ok(middle.progress > 0 && middle.progress < 1);
  assert.equal(end.contented, 1);
  assert.equal(end.progress, 1);
  assert.equal(end.listening, 0);
});

test("reduced motion shows completed work without breathing or listening movement", () => {
  assert.deepEqual(thinkingSceneAt(0, true), thinkingSceneAt(5000, true));
  const still = thinkingSceneAt(0, true);
  assert.equal(still.contented, 1);
  assert.equal(still.progress, 1);
  assert.equal(still.breath, 0);
  assert.equal(still.listening, 0);
});

test("the device loop shares the input/output duration and resets gently", () => {
  assert.deepEqual(thinkingSceneAt(0), thinkingSceneAt(STORY_DURATION_MS));
  const before = thinkingSceneAt(STORY_DURATION_MS - 1);
  assert.ok(before.progress < 0.001 && before.contented < 0.001);
  assert.ok(Math.abs(before.breath) < 0.01);
});

test("both character states and device progress produce different nonblank frames", async () => {
  const artwork = {};
  for (const [name, file] of Object.entries(SCENE_ASSETS))
    artwork[name] = await loadImage(
      new URL(`../public/assets/${file}`, import.meta.url).pathname,
    );
  const canvas = createCanvas(SCENE_WIDTH, SCENE_HEIGHT),
    ctx = canvas.getContext("2d");
  drawThinkingScene(ctx, artwork, 0);
  const start = canvas.toBuffer("image/png");
  const codeStart = ctx.getImageData(330, 205, 360, 223).data;
  drawThinkingScene(ctx, artwork, 10500);
  const end = canvas.toBuffer("image/png");
  assert.notDeepEqual(start, end);
  assert.notDeepEqual(codeStart, ctx.getImageData(330, 205, 360, 223).data);
  assert.ok(end.length > 20000);
  assert.doesNotThrow(() => drawThinkingScene(ctx, {}, 0, { still: true }));
});

test("a real looping GIF is downloadable without autoplaying it for reduced motion", () => {
  const gif = readFileSync(
    new URL("../public/assets/thinker-scene.gif", import.meta.url),
  );
  assert.equal(gif.subarray(0, 6).toString(), "GIF89a");
  assert.equal(gif.readUInt16LE(6), 640);
  assert.equal(gif.readUInt16LE(8), 480);
  assert.ok(gif.includes(Buffer.from("NETSCAPE2.0")));
  assert.equal(gif.at(-1), 0x3b);
  const component = readFileSync(
    new URL("../src/ThinkingScene.jsx", import.meta.url),
    "utf8",
  );
  assert.match(component, /thinker-scene-poster\.png/);
  assert.doesNotMatch(component, /<img[^>]*\.gif/);
  assert.match(component, /cancelAnimationFrame/);
  assert.match(component, /playback === "still"/);
});
