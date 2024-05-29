import * as THREE from "three";

class Editor {
  constructor() {
    // This enables all the events in here to be "global"
    // Publish/subscribe pattern
    this.eventDispatcher = new EventTarget();

    this.events = {
      rendererCreated: new Event( "rendererCreated" ),

      windowResized: new Event( "windowResized" ),

      intersectionsDetected: new Event( "intersectionsDetected" ),
      
      objectAdded: new Event( "objectAdded" ),
      objectSelected: new Event( "objectSelected" ),
      objectChanged: new Event( "objectChanged "),
      objectRemoved: new Event( "objectRemoved" ),

      transformModeChanged: new Event( "transformModeChanged" ),
    };

    this.history = null;

    this.scene = new THREE.Scene();
  }
}

export { Editor };
