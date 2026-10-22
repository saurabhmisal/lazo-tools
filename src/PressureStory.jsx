import { useEffect, useReducer, useRef } from "react";
import {
  AppWindow,
  ArrowRight,
  ChartNoAxesCombined,
  Box,
  ClipboardList,
  Handshake,
  Lightbulb,
  Link2,
  MessageSquareText,
  NotebookPen,
  Pause,
  PanelTop,
  Play,
  Presentation,
  RotateCcw,
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
  { label: "Meeting notes", Icon: NotebookPen, tone: "sage" },
  { label: "Feedback", Icon: MessageSquareText, tone: "sky" },
  { label: "Product ideas", Icon: Lightbulb, tone: "gold" },
  { label: "Metrics", Icon: ChartNoAxesCombined, tone: "sky" },
  { label: "Requests", Icon: AppWindow, tone: "sage" },
];
const outputs = [
  { label: "Prototype", Icon: PanelTop },
  { label: "MVP", Icon: Box },
  { label: "Live survey", Icon: ClipboardList },
  { label: "Leadership updates", Icon: Presentation },
  { label: "People in the loop", Icon: Users },
  { label: "Stakeholders unblocked", Icon: Handshake },
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
  function assetStatus(name, status) {
    dispatch({ type: "asset", name, status });
  }
  return (
    <figure className="pressure-story" id="workspace">
      <div
        ref={ref}
        className="story-canvas"
        role="img"
        aria-label="An illustrated concept for the upcoming product: meeting notes, feedback, ideas, metrics, and requests flow into Lazo below the PM and laptop. Outputs include a prototype, an MVP, a live survey, leadership updates, people in the loop, and stakeholders unblocked. The PM keeps direction, review, and final say."
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
            More inputs. Same deadline.
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
                  <span className={`story-source-icon source-${tone}`}>
                    <Icon size={16} strokeWidth={1.7} />
                  </span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="story-person">
            <img
              className="story-pressure-art story-motion"
              src={`${import.meta.env.BASE_URL}assets/pm-pressure-v2.png`}
              alt=""
              width="1536"
              height="1024"
              decoding="async"
              hidden={state.assets.pressure === "failed"}
              fetchPriority="high"
              onLoad={() => assetStatus("pressure", "loaded")}
              onError={() => assetStatus("pressure", "failed")}
            />
            <img
              className="story-composed-art story-motion"
              src={`${import.meta.env.BASE_URL}assets/pm-composed-v2.png`}
              alt=""
              width="1536"
              height="1024"
              decoding="async"
              hidden={state.assets.composed === "failed"}
              onLoad={() => assetStatus("composed", "loaded")}
              onError={() => assetStatus("composed", "failed")}
            />
          </div>
          <div className="story-outputs">
            <span className="story-rail-label">Outputs</span>
            <div className="story-output-list">
              {outputs.map(({ label, Icon }, index) => (
                <div
                  className={`story-output story-output-${index + 1} story-motion`}
                  key={label}
                >
                  <span className="story-output-icon">
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
                  <span className={`source-${tone}`}>
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
              {outputs.map(({ Icon, label }, index) => (
                <span
                  key={label}
                  className={`flow-token flow-token-out-${index + 1} story-motion`}
                >
                  <span>
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
        </div>
      </figcaption>
    </figure>
  );
}
