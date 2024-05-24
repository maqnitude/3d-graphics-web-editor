import { Editor } from "./editor/editor.js";
import { SceneTree } from "./editor/scene-tree.js";
import { VerticalResizer } from "./editor/vertical-resizer.js";
import { Viewport } from "./editor/viewport.js";

import { Cube } from "./threejs/objects/cube.js";
import { Plane } from "./threejs/objects/plane.js";
import { Sphere } from "./threejs/objects/sphere.js";

const editor = new Editor();

// const sceneTree = document.getElementById( "SceneTree" );
const leftSideBar = document.getElementById( "LeftSideBar" );
const levelViewport = document.getElementById( "LevelViewport" );
const propertiesPanel = document.getElementById( "PropertiesPanel" );

const viewport = new Viewport( editor );
levelViewport.appendChild( viewport.container );

const sceneTree = new SceneTree( viewport );
leftSideBar.appendChild( sceneTree.container );

const leftVerticalResizer = new VerticalResizer( editor, leftSideBar, levelViewport);
leftVerticalResizer.addToDOM();

const rightVerticalResizer = new VerticalResizer( editor, levelViewport, propertiesPanel);
rightVerticalResizer.addToDOM();

// Temporary solution
// TODO: create the renderer in editor.js and pass the renderer through a 
// custom event
editor.eventDispatcher.dispatchEvent( editor.events.rendererCreated );

window.addEventListener("resize", function() {
  editor.eventDispatcher.dispatchEvent(editor.events.windowResized);
});

// add click event listener to each group item
document.querySelectorAll( ".list-group-item" ).forEach( function( item ) {
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
document.getElementById( "AddObject" ).addEventListener( "click", function() {
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

