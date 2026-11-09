import React from "react";
import { createRoot } from "react-dom/client";
import { ToolPlaceholder } from "./ToolPlaceholder.jsx";
import { RetiredEveryday } from "./RetiredEveryday.jsx";
import { tools } from "./tools.js";
import "./styles.css";
import "./site-sections.css";
import "./lazo-identity.css";
import "./tools.css";
import "./brand-type.css";
import "./family-consent.css";

import "./family-theme.css";

const root = document.getElementById("root");
const tool = tools.find((item) => item.slug === root.dataset.tool);
createRoot(root).render(<React.StrictMode>{root.dataset.tool === "everyday" ? <RetiredEveryday /> : <ToolPlaceholder tool={tool} />}</React.StrictMode>);
