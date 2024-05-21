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
controls.update(); // the update method itself triggers the "change" event

controls.addEventListener("change", function() {
  viewport.render();
});

// Temporary solution
// TODO: create the renderer in editor.js and pass the renderer through a 
// custom event
editor.eventDispatcher.dispatchEvent(editor.events.rendererCreated);

window.addEventListener("resize", function(e) {
  editor.eventDispatcher.dispatchEvent(editor.events.windowResized);
});

// add click event listener to each group item
document.querySelectorAll('.list-group-item').forEach(function(item) {
  item.addEventListener('click', function() {
    document.querySelectorAll('.list-group-item').forEach(function(otherItem) {
      // unselect all other items
      otherItem.classList.remove('active');
    });
    // select the clicked item
    this.classList.add('active');
  });
});

// add click event listener to "Add" button in the popup modal
document.getElementById('AddObject').addEventListener('click', function() {
  const activeItems = document.getElementsByClassName('active');
  if (activeItems.length > 0) {
    const selectedObject = activeItems[0].getAttribute('object-name');
    console.log('Adding object: ' + selectedObject);
    switch (selectedObject) {
      case 'Sphere':
        break;
      case 'Box':
        break;
      case 'Plane':
        break;
    }
  }
});

