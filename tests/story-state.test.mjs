import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  STORY_DURATION_MS,
  initialStoryState,
  storyReducer,
  getStoryPlayback,
  observeStoryEnvironment,
} from "../src/story-state.js";
import { observeSectionReveals } from "../src/useSectionReveals.js";

const readyState = () => ({
  ...initialStoryState,
  inView: true,
  reducedMotion: false,
  assets: { pressure: "loaded", composed: "loaded" },
});

function environment() {
  const events = new Map();
  const docEvents = new Map();
  let observer;
  const preference = {
    matches: false,
    addEventListener: (name, listener) => events.set(name, listener),
    removeEventListener: (name) => events.delete(name),
  };
  const doc = {
    hidden: false,
    addEventListener: (name, listener) => docEvents.set(name, listener),
    removeEventListener: (name) => docEvents.delete(name),
  };
  const win = {
    matchMedia: () => preference,
    IntersectionObserver: class {
      constructor(callback, options) {
        this.callback = callback;
        this.options = options;
        this.disconnected = false;
        this.observed = new Set();
        observer = this;
      }
      observe(element) {
        this.observed.add(element);
      }
      unobserve(element) {
        this.observed.delete(element);
      }
      disconnect() {
        this.disconnected = true;
      }
    },
  };
  return {
    win,
    doc,
    events,
    docEvents,
    preference,
    get observer() {
      return observer;
    },
  };
}

test("the scene is static until preferences and both images are ready", () => {
  assert.equal(getStoryPlayback(initialStoryState), "still");
  const state = { ...readyState(), assets: initialStoryState.assets };
  const first = storyReducer(state, {
    type: "asset",
    name: "pressure",
    status: "loaded",
  });
  assert.equal(getStoryPlayback(first), "still");
  const both = storyReducer(first, {
    type: "asset",
    name: "composed",
    status: "loaded",
  });
  assert.equal(getStoryPlayback(both), "playing");
  assert.equal(initialStoryState.assets.pressure, "pending");
});

test("manual pause survives leaving the viewport and hiding the tab", () => {
  let state = storyReducer(readyState(), { type: "toggle" });
  for (const changes of [
    { inView: false },
    { pageVisible: false },
    { inView: true },
    { pageVisible: true },
  ])
    state = storyReducer(state, { type: "environment", changes });
  assert.equal(getStoryPlayback(state), "paused");
  assert.equal(
    getStoryPlayback(storyReducer(state, { type: "toggle" })),
    "playing",
  );
});

test("automatic pause resumes only when visible and not manually paused", () => {
  assert.equal(getStoryPlayback({ ...readyState(), inView: false }), "paused");
  assert.equal(
    getStoryPlayback({ ...readyState(), pageVisible: false }),
    "paused",
  );
  assert.equal(getStoryPlayback(readyState()), "playing");
});

test("replay resets the CSS clock but does not bypass visibility or reduced motion", () => {
  const replayed = storyReducer(
    { ...readyState(), manuallyPaused: true },
    { type: "replay" },
  );
  assert.equal(replayed.revision, 1);
  assert.equal(replayed.manuallyPaused, false);
  assert.equal(getStoryPlayback(replayed), "playing");
  assert.equal(getStoryPlayback({ ...replayed, pageVisible: false }), "paused");
  assert.equal(getStoryPlayback({ ...replayed, reducedMotion: true }), "still");
});

test("reduced-motion preference and failed artwork always choose a still composition", () => {
  assert.equal(
    getStoryPlayback({ ...readyState(), reducedMotion: true }),
    "still",
  );
  const failed = storyReducer(readyState(), {
    type: "asset",
    name: "composed",
    status: "failed",
  });
  assert.equal(getStoryPlayback(failed), "still");
});

test("environment events drive visibility and preferences, and unsubscribe cleanly", () => {
  const env = environment();
  let state = readyState();
  const element = {};
  const cleanup = observeStoryEnvironment(
    element,
    (action) => {
      state = storyReducer(state, action);
    },
    env.win,
    env.doc,
  );
  env.observer.callback([{ isIntersecting: true, intersectionRatio: 0.5 }]);
  assert.equal(getStoryPlayback(state), "playing");
  env.observer.callback([{ isIntersecting: true, intersectionRatio: 0.1 }]);
  assert.equal(getStoryPlayback(state), "paused");
  env.observer.callback([{ isIntersecting: true, intersectionRatio: 1 }]);
  env.doc.hidden = true;
  env.docEvents.get("visibilitychange")();
  assert.equal(getStoryPlayback(state), "paused");
  env.doc.hidden = false;
  env.docEvents.get("visibilitychange")();
  assert.equal(getStoryPlayback(state), "playing");
  env.preference.matches = true;
  env.events.get("change")();
  assert.equal(getStoryPlayback(state), "still");
  cleanup();
  assert.equal(env.events.size + env.docEvents.size, 0);
  assert.equal(env.observer.disconnected, true);
});

test("missing or failing observer APIs do not hide content or crash the scene", () => {
  const env = environment();
  delete env.win.IntersectionObserver;
  let state = readyState();
  let cleanup = observeStoryEnvironment(
    {},
    (action) => {
      state = storyReducer(state, action);
    },
    env.win,
    env.doc,
  );
  assert.equal(state.inView, true);
  cleanup();
  env.win.matchMedia = () => {
    throw new Error("Unavailable");
  };
  cleanup = observeStoryEnvironment(
    {},
    (action) => {
      state = storyReducer(state, action);
    },
    env.win,
    env.doc,
  );
  assert.equal(getStoryPlayback(state), "still");
  cleanup();
});

test("section reveals run once and cancel when reduced motion is requested", () => {
  const env = environment();
  let cancelled = false;
  let started = 0;
  const element = {
    animate: () => {
      started++;
      return {
        cancel: () => {
          cancelled = true;
        },
      };
    },
  };
  const cleanup = observeSectionReveals(
    { querySelectorAll: () => [element] },
    env.win,
  );
  assert.equal(env.observer.observed.has(element), true);
  env.observer.callback([{ isIntersecting: true, target: element }]);
  env.observer.callback([{ isIntersecting: true, target: element }]);
  assert.equal(started, 1);
  assert.equal(env.observer.observed.has(element), false);
  env.preference.matches = true;
  env.events.get("change")();
  assert.equal(cancelled, true);
  assert.equal(env.observer.disconnected, true);
  cleanup();
  assert.equal(env.events.size, 0);
});

test("failed reveal initialization and unsupported animation leave sections visible", () => {
  const env = environment();
  env.win.IntersectionObserver = class {
    constructor() {
      throw new Error("Unavailable");
    }
  };
  assert.doesNotThrow(() => observeSectionReveals({}, env.win)?.());
  env.win.matchMedia = () => {
    throw new Error("Unavailable");
  };
  assert.doesNotThrow(() => observeSectionReveals({}, env.win)?.());
});

test("the CSS loop uses the shared 12-second clock and reduced-motion final state", () => {
  assert.equal(STORY_DURATION_MS, 12000);
  const css = readFileSync(
    new URL("../src/pressure-story.css", import.meta.url),
    "utf8",
  );
  assert.match(css, /animation-duration: var\(--story-duration\)/);
  assert.match(css, /animation-play-state: var\(--story-play-state\)/);
  assert.match(css, /animation-iteration-count: infinite/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /animation: none !important/);
  const component = readFileSync(
    new URL("../src/ThinkingScene.jsx", import.meta.url),
    "utf8",
  );
  assert.ok(component.includes("import.meta.env.BASE_URL}assets/"));
  for (const name of ["pm-thinking-v5.png", "pm-contented-v5.png"]) {
    const png = readFileSync(
      new URL(`../public/assets/${name}`, import.meta.url),
    );
    assert.equal(png.subarray(1, 4).toString(), "PNG");
    assert.equal(png.readUInt32BE(16), 1024);
    assert.equal(png.readUInt32BE(20), 1536);
    assert.equal(png[25], 6, "RGBA artwork must preserve its transparency");
  }
});

test("transport paths occupy their own grid row below the artwork on desktop and mobile", () => {
  const css = readFileSync(
    new URL("../src/pressure-story.css", import.meta.url),
    "utf8",
  );
  assert.match(css, /\.story-person\s*\{\s*grid-area: 1 \/ 2;/);
  assert.match(css, /\.story-flow\s*\{\s*grid-area: 2 \/ 1 \/ 3 \/ 4;/);
  assert.match(css, /\.story-person\s*\{\s*grid-area: 2 \/ 1 \/ 3 \/ 4;/);
  assert.match(css, /\.story-flow\s*\{\s*grid-area: 3 \/ 1 \/ 4 \/ 4;/);
  assert.doesNotMatch(css, /story-pressure-heading/);
  assert.match(css, /border-bottom-left-radius: 22px/);
  assert.match(css, /border-bottom-right-radius: 22px/);
  assert.match(css, /\.flow-track\s*\{[^}]*overflow: hidden;/);
  for (const direction of ["input", "output"]) {
    const count = direction === "input" ? 5 : 8;
    for (let i = 1; i <= count; i++) {
      assert.ok(css.includes(`@keyframes flow-${direction}-${i}`));
    }
  }
  for (const stage of [
    "first",
    "second",
    "third",
    "fourth",
    "fifth",
    "sixth",
    "seventh",
    "eighth",
  ]) {
    assert.ok(css.includes(`@keyframes story-output-${stage}`));
  }
  assert.match(css, /grid-template-rows: repeat\(3, 64px\)/);
  assert.match(css, /grid-template-rows: 360px 72px 80px/);
  assert.match(css, /grid-template-rows: 80px 280px 64px 240px 112px/);
});
