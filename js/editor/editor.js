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

      geometryChanged: new Event( "geometryChanged" ),
      materialChanged: new Event( "materialChanged" ),

      transformModeChanged: new Event( "transformModeChanged" ),
    };

    this.history = new History( this );
    this.selector = new Selector( this );

    this.perspectiveCamera = this.createPerspectiveCamera();
    this.orthographicCamera = this.createOrthographicCamera();
    this.camera = this.perspectiveCamera; // Defaults to perspective camera

    this.viewportCamera = this.camera;
    this.viewportCamera.name = "Viewport Camera";

    this.scene = new THREE.Scene();
    this.scene.name = "Scene";

    this.sceneHelper = new THREE.Scene();
    this.sceneHelper.add( new THREE.HemisphereLight( 0xffffff, 0x888888, 2 ) );
  }

  createPerspectiveCamera() {
    const camera = new THREE.PerspectiveCamera( 50, 1, 0.1, 1000 );

    camera.position.set( 0, 5, 10 );
    camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

    return camera;
  }

  createOrthographicCamera() {

  }

}

export { Editor };
