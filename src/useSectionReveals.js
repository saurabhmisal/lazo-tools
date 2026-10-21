import { useEffect } from "react";

export function observeSectionReveals(root, win) {
  if (!root || !win.IntersectionObserver || !win.matchMedia) return;
  const animations = new Set();
  const revealed = new WeakSet();
  let observer;
  let preference;
  const stop = () => {
    observer?.disconnect();
    animations.forEach((animation) => animation.cancel());
    animations.clear();
  };
  const onPreference = () => {
    if (preference.matches) stop();
  };
  try {
    preference = win.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) return;
    observer = new win.IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || revealed.has(entry.target)) continue;
          revealed.add(entry.target);
          observer.unobserve(entry.target);
          if (preference.matches || !entry.target.animate) continue;
          try {
            const animation = entry.target.animate(
              [
                { opacity: 0, transform: "translateY(8px)" },
                { opacity: 1, transform: "translateY(0)" },
              ],
              { duration: 420, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" },
            );
            animations.add(animation);
            animation.onfinish = () => animations.delete(animation);
          } catch {
            // The content is already visible if the animation API fails.
          }
        }
      },
      { threshold: 0.1 },
    );
    // No CSS hides these sections: a failed observer leaves readable content.
    root
      .querySelectorAll(".simple-mission, .release-section")
      .forEach((element) => observer.observe(element));
    preference.addEventListener?.("change", onPreference);
  } catch {
    stop();
  }
  return () => {
    stop();
    preference?.removeEventListener?.("change", onPreference);
  };
}

export function useSectionReveals(ref) {
  useEffect(() => observeSectionReveals(ref.current, window), [ref]);
}
