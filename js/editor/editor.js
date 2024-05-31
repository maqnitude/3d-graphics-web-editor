import * as THREE from "three";
import { History } from "./history.js";
import { Selector } from "./selector.js";

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

    this.history = new History( this );
    this.selector = new Selector( this );

    this.scene = new THREE.Scene();
    this.scene.name = "Scene";

    this.sceneHelper = new THREE.Scene();
    this.sceneHelper.add( new THREE.HemisphereLight( 0xffffff, 0x888888, 2 ) );
  }
}

export { Editor };
