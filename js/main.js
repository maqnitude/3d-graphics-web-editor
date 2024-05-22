import { Editor } from "./editor/editor.js";
import { VerticalResizer } from "./editor/vertical-resizer.js";
import { Viewport } from "./editor/viewport.js";

import { Cube } from "./threejs/objects/cube.js";
import { Plane } from "./threejs/objects/plane.js";
import { Sphere } from "./threejs/objects/sphere.js";

const editor = new Editor();

// Editor interactions
VerticalResizer( editor );

const levelViewport = document.getElementById( "LevelViewport" );

const viewport = new Viewport( editor );
levelViewport.appendChild( viewport.container );

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

    console.log( "Adding object: " + selectedObject );

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

