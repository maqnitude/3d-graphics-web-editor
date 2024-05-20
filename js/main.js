import { Editor } from "./editor/editor.js";
import { VerticalResizer } from "./editor/vertical-resizer.js";
import { Viewport } from "./editor/viewport.js";

const editor = new Editor();

// Editor interactions
VerticalResizer(editor);

const levelViewport = document.getElementById("LevelViewport");

const viewport = new Viewport(editor);
levelViewport.appendChild(viewport.container);

// Temporary solution
// TODO: create the renderer in editor.js and pass the renderer through a 
// custom event
editor.eventDispatcher.dispatchEvent(editor.events.rendererCreated);

window.addEventListener("resize", function(e) {
  editor.eventDispatcher.dispatchEvent(editor.events.windowResized);
});
