import { useEffect, useRef, useState } from "react";
import {
  drawThinkingScene,
  SCENE_ASSETS,
  SCENE_WIDTH,
  SCENE_HEIGHT,
  sceneRenderScaleForWidth,
} from "./thinking-scene.js";

export function ThinkingScene({ playback, revision, dispatch }) {
  const canvas = useRef(null);
  const artwork = useRef({});
  const elapsed = useRef(0);
  const [renderScale, setRenderScale] = useState(1);
  const [loaded, setLoaded] = useState(0);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const resize = () => setRenderScale(sceneRenderScaleForWidth(canvas.current?.clientWidth, window.devicePixelRatio));
    resize();
    if (typeof ResizeObserver === "function") {
      const observer = new ResizeObserver(resize);
      if (canvas.current) observer.observe(canvas.current);
      return () => observer.disconnect();
    }
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    let active = true;
    const images = Object.entries(SCENE_ASSETS).map(([name, filename]) => {
      const image = new Image();
      image.onload = () => {
        if (!active) return;
        artwork.current[name] = image;
        setLoaded((count) => count + 1);
        dispatch({ type: "asset", name, status: "loaded" });
      };
      image.onerror = () => {
        if (active) dispatch({ type: "asset", name, status: "failed" });
      };
      image.src = `${import.meta.env.BASE_URL}assets/${filename}`;
      return image;
    });
    return () => {
      active = false;
      images.forEach((image) => {
        image.onload = null;
        image.onerror = null;
      });
    };
  }, [dispatch]);

  useEffect(() => {
    elapsed.current = 0;
  }, [revision]);

  useEffect(() => {
    let context;
    try {
      context = canvas.current?.getContext("2d");
    } catch {
      return;
    }
    if (!context || !loaded) return;
    context.setTransform(renderScale, 0, 0, renderScale, 0, 0);
    if (playback === "still") elapsed.current = 0;
    let request;
    let previous;
    let lastPaint = -Infinity;
    let hasPainted = false;
    const paint = (time) => {
      if (playback === "playing" && previous !== undefined)
        elapsed.current += time - previous;
      previous = time;
      if (playback === "playing" && time - lastPaint < 1000 / 30) {
        request = requestAnimationFrame(paint);
        return;
      }
      lastPaint = time;
      try {
        drawThinkingScene(context, artwork.current, elapsed.current, {
          still: playback === "still",
        });
      } catch {
        setDrawn(false);
        return;
      }
      if (!hasPainted) { setDrawn(true); hasPainted = true; }
      if (playback === "playing" && typeof requestAnimationFrame === "function")
        request = requestAnimationFrame(paint);
    };
    paint(performance.now());
    return () => {
      if (request !== undefined) cancelAnimationFrame(request);
    };
  }, [loaded, playback, revision, renderScale]);

  return (
    <div className="thinking-scene" data-rendered={drawn}>
      <img
        src={`${import.meta.env.BASE_URL}assets/thinker-scene-poster-v10.png`}
        alt=""
        width={SCENE_WIDTH}
        height={SCENE_HEIGHT}
        decoding="async"
      />
      <canvas
        ref={canvas}
        width={Math.round(SCENE_WIDTH * renderScale)}
        height={Math.round(SCENE_HEIGHT * renderScale)}
        aria-hidden="true"
      />
    </div>
  );
}
