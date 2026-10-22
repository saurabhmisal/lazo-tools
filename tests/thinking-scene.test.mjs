import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createCanvas, loadImage, Path2D } from "@napi-rs/canvas";
import {
  drawThinkingScene,
  thinkingSceneAt,
  SCENE_ASSETS,
  SCENE_WIDTH,
  SCENE_HEIGHT,
  SCENE_RENDER_SCALE,
  PHONE_SCREENS,
  SCENE_LAYOUT,
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
  for (const [name, image] of Object.entries(artwork)) {
    const sprite = createCanvas(image.width, image.height).getContext("2d");
    sprite.drawImage(image, 0, 0);
    for (const [x, y] of [
      [100, 200],
      [200, 400],
      [20, 600],
      [500, 1500],
    ]) {
      assert.equal(
        sprite.getImageData(x, y, 1, 1).data[3],
        0,
        `${name}: background haze at ${x},${y}`,
      );
    }
  }
  const canvas = createCanvas(SCENE_WIDTH, SCENE_HEIGHT),
    ctx = canvas.getContext("2d");
  drawThinkingScene(ctx, artwork, 0, { PathType: Path2D });
  const start = canvas.toBuffer("image/png");
  const codeStart = ctx.getImageData(300, 110, 260, 140).data;
  drawThinkingScene(ctx, artwork, 10500, { PathType: Path2D });
  const end = canvas.toBuffer("image/png");
  assert.notDeepEqual(start, end);
  assert.notDeepEqual(codeStart, ctx.getImageData(300, 110, 260, 140).data);
  assert.ok(end.length > 20000);
  assert.doesNotThrow(() => drawThinkingScene(ctx, {}, 0, { still: true }));
});

test("every transition frame draws one opaque character in front of the desk", () => {
  const ctx = createCanvas(SCENE_WIDTH, SCENE_HEIGHT).getContext("2d");
  const artwork = { pressure: {}, composed: {} };
  let draws = [];
  ctx.drawImage = (image) =>
    draws.push({
      image,
      alpha: ctx.globalAlpha,
      desk: [...ctx.getImageData(500, SCENE_LAYOUT.desk.top + 6, 1, 1).data],
    });
  for (const time of [
    0, 6500, 7000, 7300, 7600, 7900, 8200, 8600, 10500, 11200, 11500, 11800,
    11999,
  ]) {
    draws = [];
    const frame = drawThinkingScene(ctx, artwork, time, { PathType: Path2D });
    assert.equal(draws.length, 1, `Double silhouette at ${time}ms`);
    assert.equal(draws[0].alpha, 1, `Translucent character at ${time}ms`);
    assert.equal(draws[0].image, artwork[frame.pose]);
    assert.deepEqual(
      draws[0].desk,
      [226, 232, 226, 255],
      "Desk must already be behind the character",
    );
  }
});

test("the scene renderer never repeats the top-level tagline in the GIF", () => {
  const ctx = createCanvas(SCENE_WIDTH, SCENE_HEIGHT).getContext("2d");
  const labels = [];
  ctx.fillText = (label) => labels.push(label);
  for (const time of [0, 4000, 8000, 10500, 11999])
    drawThinkingScene(ctx, {}, time, { PathType: Path2D });
  assert.doesNotMatch(labels.join(" "), /amplified|A doer for a thinker/i);
  assert.ok(labels.includes("Thinking out loud"));
  assert.ok(labels.includes("Still your call"));
});

test("the phone cycles six fictional product categories in stable 2-by-2 grids", () => {
  const modes = ["ride", "fintech", "healthcare", "rentals", "ott", "product"];
  assert.deepEqual(Object.keys(PHONE_SCREENS), modes);
  for (const [index, mode] of modes.entries()) {
    assert.equal(thinkingSceneAt(index * 2000).phoneMode, mode);
    assert.equal(thinkingSceneAt(index * 2000 + 1999).phoneMode, mode);
    assert.equal(PHONE_SCREENS[mode].length, 4);
  }
  assert.equal(thinkingSceneAt(0, true).phoneMode, "product");
  assert.deepEqual(
    PHONE_SCREENS.ride.map((item) => item.label),
    ["Bike", "Car", "Parcel", "Saved"],
  );
  assert.deepEqual(
    PHONE_SCREENS.fintech.map((item) => item.label),
    ["Pay", "Wallet", "Cards", "Scan"],
  );
  for (const items of Object.values(PHONE_SCREENS))
    for (const item of items) {
      assert.equal(item.icon.size, 24);
      assert.ok(
        item.icon.node.every(([tag]) =>
          ["path", "circle", "rect", "line", "polyline"].includes(tag),
        ),
      );
    }
});

test("the desk and devices grow while preserving the lower tabletop and prominent character", () => {
  const { character, desk, laptop, tablet, phone } = SCENE_LAYOUT;
  assert.ok(
    desk.top > 275,
    "The tabletop must be lower than the previous scene",
  );
  assert.ok(desk.floor - desk.top < character.height * 0.45);
  assert.ok(desk.right - desk.left >= 473 * 1.19);
  assert.ok(laptop.scale >= 0.58 * 1.19);
  assert.ok(tablet.scale >= 0.5 * 1.19 && phone.scale >= 0.5 * 1.19);
  assert.ok(208 * phone.scale < character.height * 0.23);
  assert.ok(237 * laptop.scale < character.height * 0.3);
  assert.ok(140 * tablet.scale < character.height * 0.15);
  assert.equal(
    phone.y + 104 * phone.scale,
    desk.top,
    "Phone must rest on the desk",
  );
  assert.ok(Math.abs(laptop.y + 442 * laptop.scale - desk.top) < 0.01);
  const phoneLeft = phone.x - 54 * phone.scale;
  const phoneRight = phone.x + 54 * phone.scale;
  const laptopLeft = laptop.x + 306 * laptop.scale;
  const laptopRight = laptop.x + 690 * laptop.scale;
  const tabletLeft = tablet.x + (418 - 115) * tablet.scale;
  const tabletRight = tablet.x + (418 + 115) * tablet.scale;
  assert.ok(desk.left < laptopLeft && laptopRight < tabletLeft);
  assert.ok(tabletRight < phoneLeft && phoneRight < desk.right);
  for (const [x, y] of [
    [character.x + (330 * character.width) / 1024, character.y + 20],
    [phoneRight, desk.floor],
  ]) {
    assert.ok(x >= 0 && x <= SCENE_WIDTH && y >= 0 && y <= SCENE_HEIGHT);
  }
});

test("serious thinking changes to a smile only after supporting work has progressed", async () => {
  assert.equal(thinkingSceneAt(4000).pose, "pressure");
  assert.equal(thinkingSceneAt(8200).pose, "composed");
  assert.ok(thinkingSceneAt(8200).progress > 0.95);
  const portraits = [];
  for (const file of Object.values(SCENE_ASSETS)) {
    const image = await loadImage(
      new URL(`../public/assets/${file}`, import.meta.url).pathname,
    );
    const ctx = createCanvas(image.width, image.height).getContext("2d");
    ctx.drawImage(image, 0, 0);
    portraits.push(ctx.getImageData(400, 110, 140, 135).data);
    // Sample the solid black swoosh interiors, away from white shoe outlines.
    for (const [x, y] of [
      [503, 1370],
      [690, 1420],
    ]) {
      const [r, g, b, a] = ctx.getImageData(x, y, 1, 1).data;
      assert.ok(
        Math.max(r, g, b) < 85 && a > 240,
        `${file}: black shoe tick missing`,
      );
    }
  }
  assert.notDeepEqual(
    portraits[0],
    portraits[1],
    "The facial expressions must differ",
  );
});

test("both poses keep the same yellow strap and black Apple Watch on the left wrist", async () => {
  const artwork = {};
  for (const [pose, file] of Object.entries(SCENE_ASSETS))
    artwork[pose] = await loadImage(
      new URL(`../public/assets/${file}`, import.meta.url).pathname,
    );
  const ctx = createCanvas(SCENE_WIDTH, SCENE_HEIGHT).getContext("2d");
  let baseline;
  const poses = new Set();
  for (const time of [0, 4000, 7300, 7900, 8600, 10500, 11500, 11999]) {
    const frame = thinkingSceneAt(time);
    poses.add(frame.pose);
    // Cancel body movement so the same anatomical wrist pixels can be compared.
    ctx.setTransform(1, 0, 0, 1, 0, -frame.breath - frame.nod);
    drawThinkingScene(ctx, artwork, time, { PathType: Path2D });
    const samples = [
      [153, 220],
      [153, 202],
      [146, 207],
      [159, 204],
    ].map(([x, y]) => [...ctx.getImageData(x, y, 1, 1).data]);
    assert.deepEqual(samples[0], [245, 207, 50, 255], "Strap must stay yellow");
    assert.deepEqual(
      samples[1],
      [9, 14, 12, 255],
      "Watch face must stay black",
    );
    baseline ??= samples;
    assert.deepEqual(samples, baseline, `Watch changed at ${time}ms`);
  }
  assert.deepEqual([...poses].sort(), ["composed", "pressure"]);
});

test("the small gold earring stays on the anatomical left ear in both expressions", async () => {
  const artwork = {};
  for (const [pose, file] of Object.entries(SCENE_ASSETS))
    artwork[pose] = await loadImage(
      new URL(`../public/assets/${file}`, import.meta.url).pathname,
    );
  const ctx = createCanvas(SCENE_WIDTH, SCENE_HEIGHT).getContext("2d");
  let baseline;
  for (const time of [0, 4000, 7900, 10500, 11500]) {
    const frame = thinkingSceneAt(time);
    ctx.setTransform(1, 0, 0, 1, 0, -frame.breath - frame.nod);
    drawThinkingScene(ctx, artwork, time, { PathType: Path2D });
    const gold = [...ctx.getImageData(172, 71, 1, 1).data];
    assert.deepEqual(
      gold,
      [231, 184, 62, 255],
      `Left-ear stud changed at ${time}ms`,
    );
    baseline ??= gold;
    assert.deepEqual(gold, baseline);
    // The opposite visible ear must retain skin, not a second gold stud.
    const [r, g, b] = ctx.getImageData(114, 86, 1, 1).data;
    assert.ok(b > 70 && r > g && g > b);
  }
});

test("the live scene and poster preserve a two-times resolution without changing layout ratio", () => {
  assert.equal(SCENE_RENDER_SCALE, 2);
  const poster = readFileSync(
    new URL("../public/assets/thinker-scene-poster-v9.png", import.meta.url),
  );
  assert.equal(poster.readUInt32BE(16), SCENE_WIDTH * SCENE_RENDER_SCALE);
  assert.equal(poster.readUInt32BE(20), SCENE_HEIGHT * SCENE_RENDER_SCALE);
  const component = readFileSync(
    new URL("../src/ThinkingScene.jsx", import.meta.url),
    "utf8",
  );
  assert.match(component, /width=\{SCENE_WIDTH \* SCENE_RENDER_SCALE\}/);
  assert.match(
    component,
    /context\.setTransform\(SCENE_RENDER_SCALE, 0, 0, SCENE_RENDER_SCALE, 0, 0\)/,
  );
});

test("a real looping GIF is downloadable without autoplaying it for reduced motion", () => {
  const gif = readFileSync(
    new URL("../public/assets/thinker-scene-v9.gif", import.meta.url),
  );
  assert.equal(gif.subarray(0, 6).toString(), "GIF89a");
  assert.equal(gif.readUInt16LE(6), 800);
  assert.equal(gif.readUInt16LE(8), 600);
  assert.ok(gif.includes(Buffer.from("NETSCAPE2.0")));
  assert.equal(gif.at(-1), 0x3b);
  const component = readFileSync(
    new URL("../src/ThinkingScene.jsx", import.meta.url),
    "utf8",
  );
  assert.match(component, /thinker-scene-poster-v9\.png/);
  assert.doesNotMatch(component, /<img[^>]*\.gif/);
  assert.match(component, /cancelAnimationFrame/);
  assert.match(component, /playback === "still"/);
});
