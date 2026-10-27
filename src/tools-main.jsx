import React from "react";
import { createRoot } from "react-dom/client";
import { ToolPlaceholder } from "./ToolPlaceholder.jsx";
import { tools } from "./tools.js";
import "./styles.css";
import "./site-sections.css";
import "./lazo-identity.css";
import "./tools.css";

const root = document.getElementById("root");
const tool = tools.find((item) => item.slug === root.dataset.tool);
createRoot(root).render(<React.StrictMode><ToolPlaceholder tool={tool} /></React.StrictMode>);
