import { VerticalResizer } from "./editor/vertical-resizer.js";
import { Viewport } from "./editor/viewport.js";

// Editor interactions
VerticalResizer();

const levelViewport = document.getElementById("LevelViewport");

const viewport = new Viewport();
levelViewport.appendChild(viewport.container);
viewport.Render();

levelViewport.addEventListener("resizing", function() {
  viewport.Render();
});

window.addEventListener("resize", function() {
  viewport.Render();
});

