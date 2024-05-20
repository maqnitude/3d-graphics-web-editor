import { Editor } from "./editor/editor.js";
import { VerticalResizer } from "./editor/vertical-resizer.js";
import { Viewport } from "./editor/viewport.js";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const editor = new Editor();

// Editor interactions
VerticalResizer(editor);

const levelViewport = document.getElementById("LevelViewport");

const viewport = new Viewport(editor);
levelViewport.appendChild(viewport.container);

// TODO: put this in viewport (viewport.controls for example)
// zooming in and out is very laggy
const controls = new OrbitControls(viewport.currentCamera, viewport.renderer.domElement);

// Temporary solution
// TODO: create the renderer in editor.js and pass the renderer through a 
// custom event
editor.eventDispatcher.dispatchEvent(editor.events.rendererCreated);

window.addEventListener("resize", function(e) {
  editor.eventDispatcher.dispatchEvent(editor.events.windowResized);
});

// without this zooming in and out is fucking laggy, don't know why
function animate() {
  requestAnimationFrame(animate);

  controls.update();
  viewport.render();
}

animate();
