export const STORY_DURATION_MS = 12000;

export const initialStoryState = {
  manuallyPaused: false,
  inView: false,
  pageVisible: true,
  reducedMotion: true,
  revision: 0,
  assets: { pressure: "pending", composed: "pending" },
};

export function storyReducer(state, action) {
  switch (action.type) {
    case "environment":
      return { ...state, ...action.changes };
    case "asset":
      if (!Object.hasOwn(state.assets, action.name)) return state;
      return {
        ...state,
        assets: { ...state.assets, [action.name]: action.status },
      };
    case "toggle":
      return { ...state, manuallyPaused: !state.manuallyPaused };
    case "replay":
      return { ...state, revision: state.revision + 1, manuallyPaused: false };
    default:
      return state;
  }
}

export function getStoryPlayback(state) {
  const assetsReady = Object.values(state.assets).every(
    (status) => status === "loaded",
  );
  if (state.reducedMotion || !assetsReady) return "still";
  return state.inView && state.pageVisible && !state.manuallyPaused
    ? "playing"
    : "paused";
}

export function observeStoryEnvironment(element, dispatch, win, doc) {
  const update = (changes) => dispatch({ type: "environment", changes });
  let preference;
  try {
    preference = win.matchMedia?.("(prefers-reduced-motion: reduce)");
  } catch {
    // Keep the static composition if motion preferences cannot be determined.
  }
  const onPreference = () =>
    update({ reducedMotion: preference?.matches ?? true });
  const onVisibility = () => update({ pageVisible: !doc.hidden });
  onPreference();
  onVisibility();
  preference?.addEventListener?.("change", onPreference);
  doc.addEventListener("visibilitychange", onVisibility);

  let observer;
  try {
    if (win.IntersectionObserver) {
      observer = new win.IntersectionObserver(
        ([entry]) =>
          update({
            inView: entry.isIntersecting && entry.intersectionRatio >= 0.15,
          }),
        { threshold: [0, 0.15] },
      );
      observer.observe(element);
    } else {
      update({ inView: true });
    }
  } catch {
    update({ inView: true });
  }
  return () => {
    observer?.disconnect();
    preference?.removeEventListener?.("change", onPreference);
    doc.removeEventListener("visibilitychange", onVisibility);
  };
}
