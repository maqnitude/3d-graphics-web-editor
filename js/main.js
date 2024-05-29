import { Editor } from "./editor/editor.js";
import { History } from "./editor/history.js";
import { MeshProperties } from "./editor/properties.js";
import { SceneTree } from "./editor/scene-tree.js";
import { VerticalResizer } from "./editor/vertical-resizer.js";
import { Viewport } from "./editor/viewport.js";

import { Cube } from "./threejs/objects/cube.js";
import { Plane } from "./threejs/objects/plane.js";
import { Sphere } from "./threejs/objects/sphere.js";

/*
 * Put together the editor here
 */

const menuBar = document.getElementById( "MenuBar" );
const mainToolBar = document.getElementById( "MainToolBar" );
const mainContent = document.getElementById( "MainContent" );

// Have to manually set the height of the main content, otherwise it will be fucked
let availableHeight = window.innerHeight - (menuBar.clientHeight + mainToolBar.clientHeight);
mainContent.style.height = `${ 100 * availableHeight / window.innerHeight }%`;

// Holy shit, did i just accidentally use dependency injection?
const editor = new Editor();
const history = new History( editor );
editor.history = history;

const viewport = new Viewport( editor );
history.viewport = viewport;

const leftSideBar = document.getElementById( "LeftSideBar" );
const levelViewport = document.getElementById( "LevelViewport" );
const rightSideBar = document.getElementById( "RightSideBar" );

levelViewport.appendChild( viewport.container );

const leftVerticalResizer = new VerticalResizer( editor, leftSideBar, levelViewport );
const rightVerticalResizer = new VerticalResizer( editor, levelViewport, rightSideBar );

const sceneTree = new SceneTree( viewport );
leftSideBar.appendChild( sceneTree.container );


/*
 * Need to do these after setting up the editor
 */

// Dispatching this doesn't really make sense,
// but we need to call render after adding the viewport
editor.eventDispatcher.dispatchEvent( editor.events.rendererCreated );

/*
 * Event handlers, mostly for interactivity
 */

window.addEventListener("resize", function() {
  editor.eventDispatcher.dispatchEvent(editor.events.windowResized);

  availableHeight = window.innerHeight - (menuBar.offsetHeight + mainToolBar.offsetHeight);
  mainContent.style.height = `${ 100 * availableHeight / window.innerHeight }%`;
});

// Handle shit on the menubar
const editUndo = document.getElementById( "EditUndo" );
const editRedo = document.getElementById( "EditRedo" );
editUndo.addEventListener(
  "click",
  function( event ) {
    history.undo();
    console.log("(undo) undos:", history.undos);
    console.log("(undo) redos:", history.redos)
  }
);
editRedo.addEventListener(
  "click",
  function( event ) {
    history.redo();
    console.log("(redo) undos:", history.undos);
    console.log("(redo) redos:", history.redos);
  }
)

// Handle shit in the right sidebar
// TODO: hide the properties container instead of removing it
editor.eventDispatcher.addEventListener(
  editor.events.objectSelected.type,
  function( event ) {
    const object = event.detail.object;
    const properties = document.getElementById( "Properties" );

    if (!object) {
      if (properties) { properties.remove(); }

      return;
    }

    if (object.isMesh) {
      if (properties) { properties.remove(); }

      const meshProperties = new MeshProperties( editor, object );
      rightSideBar.appendChild( meshProperties.container );
    }

    viewport.render();
  }
);
rightSideBar.addEventListener(
  "mouseenter",
  function( event ) {
    viewport.selector.ignore = true;
  }
);
rightSideBar.addEventListener(
  "mouseleave",
  function( event ) {
    viewport.selector.ignore = false;
  }
);

// add click event listener to each group item
const addObjectModal = document.getElementById( "AddObjectModal" );
addObjectModal.querySelectorAll( ".list-group-item" ).forEach( function( item ) {
  item.addEventListener( "click", function() {
    document.querySelectorAll( ".list-group-item" ).forEach( function( otherItem ) {
      // unselect all other items
      otherItem.classList.remove( "active" );
    });
    // select the clicked item
    this.classList.add( "active" );
  });
});

// add click event listener to "Add" button in the popup modal
const addObjectButton = document.getElementById( "AddObjectButton" );
addObjectButton.addEventListener( "click", function() {
  const activeItems = document.getElementsByClassName( "active" );

  if (activeItems.length > 0) {
    const selectedObject = activeItems[0].getAttribute( "object-name" );

    switch ( selectedObject ) {
      case "Cube":
        viewport.addObject( new Cube() );

        break;
      case "Sphere":
        viewport.addObject( new Sphere() );

        break;
      case "Plane":
        viewport.addObject( new Plane() );

        break;
    }
  }
});
