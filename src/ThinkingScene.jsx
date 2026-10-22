import { useEffect, useRef, useState } from "react";
import {
  drawThinkingScene,
  SCENE_ASSETS,
  SCENE_WIDTH,
  SCENE_HEIGHT,
  SCENE_RENDER_SCALE,
} from "./thinking-scene.js";

export function ThinkingScene({ playback, revision, dispatch }) {
  const canvas = useRef(null);
  const artwork = useRef({});
  const elapsed = useRef(0);
  const [loaded, setLoaded] = useState(0);
  const [drawn, setDrawn] = useState(false);

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
    context.setTransform(SCENE_RENDER_SCALE, 0, 0, SCENE_RENDER_SCALE, 0, 0);
    if (playback === "still") elapsed.current = 0;
    let request;
    let previous;
    const paint = (time) => {
      if (playback === "playing" && previous !== undefined)
        elapsed.current += time - previous;
      previous = time;
      try {
        drawThinkingScene(context, artwork.current, elapsed.current, {
          still: playback === "still",
        });
      } catch {
        setDrawn(false);
        return;
      }
      setDrawn(true);
      if (playback === "playing" && typeof requestAnimationFrame === "function")
        request = requestAnimationFrame(paint);
    };
    paint(performance.now());
    return () => {
      if (request !== undefined) cancelAnimationFrame(request);
    };
  }, [loaded, playback, revision]);

  return (
    <div className="thinking-scene" data-rendered={drawn}>
      <img
        src={`${import.meta.env.BASE_URL}assets/thinker-scene-poster-v9.png`}
        alt=""
        width={SCENE_WIDTH}
        height={SCENE_HEIGHT}
        decoding="async"
      />
      <canvas
        ref={canvas}
        width={SCENE_WIDTH * SCENE_RENDER_SCALE}
        height={SCENE_HEIGHT * SCENE_RENDER_SCALE}
        aria-hidden="true"
      />
    </div>
  );
}
