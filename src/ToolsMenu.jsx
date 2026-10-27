import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Grid2X2 } from "lucide-react";
import { tools } from "./tools.js";

export function ToolsMenu({ base = "./" }) {
  const [open, setOpen] = useState(false);
  const container = useRef(null);
  const trigger = useRef(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const outside = (event) => {
      if (!container.current?.contains(event.target)) setOpen(false);
    };
    const escape = (event) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      trigger.current?.focus();
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <div className="tools-menu" ref={container} onBlur={(event) => {
      if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <button className="tools-menu-button" type="button" ref={trigger}
        aria-label="Lazo tools" aria-expanded={open} aria-controls={id}
        title="Lazo tools" onClick={() => setOpen(!open)}>
        <Grid2X2 size={17} aria-hidden="true" />
        <span>Tools</span>
        <ChevronDown className="tools-menu-chevron" size={14} aria-hidden="true" />
      </button>
      <div id={id} className="tools-menu-panel" hidden={!open}>
        {tools.map((tool) => (
          <a key={tool.slug} href={tool.url || `${base}${tool.slug}/`} onClick={() => setOpen(false)}>
            <span>{tool.name}</span>
            <small>{tool.url ? "Visit website" : "Page coming soon"}</small>
          </a>
        ))}
      </div>
    </div>
  );
}
