import * as THREE from "three";

const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

class Selector {
  constructor( editor, viewport ) {
    this.editor = editor;
    this.viewport = viewport;
    this.events = editor.events;

    this.ignore = false;

    //

    this.setupEventListeners();
  }

  // Methods
  
  setupEventListeners() {
    this.editor.eventDispatcher.addEventListener(
      this.editor.events.intersectionsDetected.type,
      this.onIntersectionsDetected.bind( this )
    )
  }

  getIntersects( raycaster ) {
    const objects = [];

    this.viewport.scene.traverseVisible( function( child ) {
      objects.push( child );
    });

    return raycaster.intersectObjects( objects, false );
  }

  getPointerIntersects( point, camera ) {
    // Convert mouse position to NDC
    mouse.set( (point.x * 2) - 1, -(point.y * 2) + 1);
    raycaster.setFromCamera( mouse, camera );
    
    return this.getIntersects( raycaster );
  }

  select ( object ) {
    this.editor.eventDispatcher.dispatchEvent(
      new CustomEvent(
        this.editor.events.objectSelected.type,
        {
          detail: {
            object: object,
          }
        }
      )
    )    
  }

  // Event handlers
  
  onIntersectionsDetected( event ) {
    if (this.ignore) { return; }

    const intersects = event.detail.intersects;

    if (intersects.length > 0) {
      const object = intersects[ 0 ].object;
      this.select( object );
    } else {
      this.select( null );
    }
  }
}

export { Selector };