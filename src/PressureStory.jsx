import { useEffect, useReducer, useRef } from "react";
import { ThinkingScene } from "./ThinkingScene.jsx";
import {
  AppWindow,
  ArrowRight,
  ChartNoAxesCombined,
  Compass,
  Download,
  Handshake,
  Lightbulb,
  Link2,
  MessageSquareText,
  NotebookPen,
  Pause,
  Play,
  Rocket,
  RotateCcw,
  Send,
  Users,
} from "lucide-react";
import {
  STORY_DURATION_MS,
  initialStoryState,
  storyReducer,
  getStoryPlayback,
  observeStoryEnvironment,
} from "./story-state.js";

const inputs = [
  { label: "Meeting notes", Icon: NotebookPen, tone: "blue" },
  { label: "Feedback", Icon: MessageSquareText, tone: "violet" },
  { label: "Product ideas", Icon: Lightbulb, tone: "amber" },
  { label: "Metrics", Icon: ChartNoAxesCombined, tone: "cyan" },
  { label: "Requests", Icon: AppWindow, tone: "rose" },
];
const outputs = [
  { label: "Decisions published", Icon: Send, tone: "blue" },
  { label: "Stakeholder unblocked", Icon: Handshake, tone: "violet" },
  { label: "Multiple launches", Icon: Rocket, tone: "cyan" },
  { label: "Clear strategy", Icon: Compass, tone: "amber" },
  { label: "Aligned teams", Icon: Users, tone: "rose" },
  { label: "Measurable impact", Icon: ChartNoAxesCombined, tone: "mint" },
];

export function PressureStory({ onExplore }) {
  const ref = useRef(null);
  const [state, dispatch] = useReducer(storyReducer, initialStoryState);
  const playback = getStoryPlayback(state);
  const animated = playback !== "still";
  useEffect(
    () => observeStoryEnvironment(ref.current, dispatch, window, document),
    [],
  );
  return (
    <figure className="pressure-story" id="workspace">
      <div
        ref={ref}
        className="story-canvas"
        role="img"
        aria-label="An illustrated concept for the upcoming product: a standing PM thinks seriously with an Apple Pencil, then smiles as work progresses on smaller devices on a lower height-adjustable desk behind him. His yellow-strap Apple Watch visualises voice dictation, the laptop writes code, the iPad adds handwritten notes, and the phone cycles fictional ride-hailing, fintech, healthcare, rentals, OTT and product app grids. Meeting notes, feedback, ideas, metrics, and requests flow into Lazo below the character and devices. Outcomes include decisions published, a stakeholder unblocked, multiple launches, clear strategy, aligned teams and measurable impact. The PM keeps direction, review, and final say."
        data-motion={animated ? "full" : "still"}
        data-playback={playback}
        data-static-art={
          state.assets.composed !== "loaded" &&
          state.assets.pressure === "loaded"
            ? "pressure"
            : "composed"
        }
        style={{
          "--story-duration": `${STORY_DURATION_MS}ms`,
          "--story-play-state": playback === "playing" ? "running" : "paused",
        }}
      >
        <div key={state.revision} className="story-clock" aria-hidden="true">
          <p className="story-pressure-heading story-motion">
            You, but amplified.
          </p>
          <div className="story-inputs">
            <span className="story-rail-label">Inputs</span>
            <div className="story-input-list">
              {inputs.map(({ label, Icon, tone }, index) => (
                <div
                  className="story-input story-motion"
                  key={label}
                  style={{
                    "--input-angle": `${[-3, 2, -1, 3, -2][index]}deg`,
                    "--input-shift": `${[-3, 5, 0, -4, 3][index]}px`,
                  }}
                >
                  <span className={`story-source-icon story-color-${tone}`}>
                    <Icon size={16} strokeWidth={1.7} />
                  </span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="story-person">
            <ThinkingScene
              playback={playback}
              revision={state.revision}
              dispatch={dispatch}
            />
          </div>
          <div className="story-outputs">
            <span className="story-rail-label">Outputs</span>
            <div className="story-output-list">
              {outputs.map(({ label, Icon, tone }, index) => (
                <div
                  className={`story-output story-output-${index + 1} story-motion`}
                  key={label}
                >
                  <span className={`story-output-icon story-color-${tone}`}>
                    <Icon size={17} strokeWidth={1.7} />
                  </span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="story-flow">
            <div className="flow-track flow-track-in">
              {inputs.map(({ Icon, label, tone }, index) => (
                <span
                  key={label}
                  className={`flow-token flow-token-in-${index + 1} story-motion`}
                >
                  <span className={`story-color-${tone}`}>
                    <Icon size={18} />
                  </span>
                </span>
              ))}
            </div>
            <div className="story-hub">
              <Link2 size={22} />
              <span>Lazo</span>
            </div>
            <div className="flow-track flow-track-out">
              {outputs.map(({ Icon, label, tone }, index) => (
                <span
                  key={label}
                  className={`flow-token flow-token-out-${index + 1} story-motion`}
                >
                  <span className={`story-color-${tone}`}>
                    <Icon size={18} />
                  </span>
                </span>
              ))}
            </div>
          </div>
          <p className="story-direction story-motion">You set the direction</p>
          <div className="story-resolution story-motion">
            <p>Less chasing. Clearer next moves.</p>
            <span>You keep the final say</span>
          </div>
        </div>
      </div>
      <figcaption className="story-caption">
        <span>Illustrated concept. Lazo is in development.</span>
        <button className="text-link" onClick={onExplore}>
          Explore preview <ArrowRight size={14} />
        </button>
        <div className="story-controls">
          {animated && (
            <>
              <button
                type="button"
                className="icon-button"
                aria-label={
                  state.manuallyPaused ? "Resume animation" : "Pause animation"
                }
                aria-pressed={state.manuallyPaused}
                title={
                  state.manuallyPaused ? "Resume animation" : "Pause animation"
                }
                onClick={() => dispatch({ type: "toggle" })}
              >
                {state.manuallyPaused ? (
                  <Play size={17} />
                ) : (
                  <Pause size={17} />
                )}
              </button>
              <button
                type="button"
                className="icon-button"
                aria-label="Replay animation"
                title="Replay animation"
                onClick={() => dispatch({ type: "replay" })}
              >
                <RotateCcw size={17} />
              </button>
            </>
          )}
          <a
            className="icon-button"
            href={`${import.meta.env.BASE_URL}assets/thinker-scene-v8.gif`}
            download="lazo-a-doer-for-a-thinker.gif"
            aria-label="Download animation as GIF"
            title="Download animation as GIF"
          >
            <Download size={17} />
          </a>
        </div>
      </figcaption>
    </figure>
  );
}
