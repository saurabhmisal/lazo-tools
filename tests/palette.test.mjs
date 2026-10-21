import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const css = readFileSync(
  new URL("../src/lazo-identity.css", import.meta.url),
  "utf8",
);
const palette = {
  emerald: "#2e7d63",
  "emerald-hover": "#25674f",
  "emerald-light": "#89d0b2",
  "emerald-deep": "#174f3e",
  pearl: "#f4f5f0",
  charcoal: "#181b19",
  "control-border": "#718d7e",
};

function luminance(hex) {
  const rgb = [1, 3, 5].map((offset) => {
    const channel = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}

function contrast(a, b) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test("the user-selected emerald palette is defined in the active identity stylesheet", () => {
  for (const [name, color] of Object.entries(palette)) {
    assert.ok(css.includes(`--${name}: ${color};`), `Missing ${name} token`);
  }
  assert.ok(css.includes("--coral: var(--emerald-light);"));
  for (const oldColor of [
    "#f2a18c",
    "#f7b6a4",
    "#b6533e",
    "#934b39",
    "#8f4735",
    "#85432f",
  ]) {
    assert.ok(!css.includes(oldColor), `Old coral accent remains: ${oldColor}`);
  }
});

test("primary and hover button text meet normal-text AA contrast", () => {
  assert.ok(contrast(palette.pearl, palette.emerald) >= 4.5);
  assert.ok(contrast(palette.pearl, palette["emerald-hover"]) >= 4.5);
});

test("emerald text variants remain readable on their intended surfaces", () => {
  assert.ok(contrast(palette["emerald-light"], palette.charcoal) >= 4.5);
  assert.ok(contrast(palette["emerald-deep"], palette.pearl) >= 4.5);
});

test("form boundaries and emerald focus colours meet non-text contrast", () => {
  assert.ok(contrast(palette["control-border"], "#ffffff") >= 3);
  assert.ok(contrast(palette["control-border"], palette.pearl) >= 3);
  assert.ok(contrast(palette["emerald-deep"], palette.pearl) >= 3);
  assert.ok(contrast(palette["emerald-light"], palette.charcoal) >= 3);
});
