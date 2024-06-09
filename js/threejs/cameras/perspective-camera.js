import * as THREE from "three";

class PerspectiveCamera extends THREE.PerspectiveCamera {
  constructor( editor ) {
    super( 50, window.innerWidth / window.innerHeight, 1, 1000 );

    this.editor = editor;
    this.eventManager = editor.eventManager;
    this.events = editor.events;

    this.name = "Perspective Camera";

    this.helper = new THREE.CameraHelper( this );
    this.editor.sceneHelper.add( this.helper );

    //

    this.setupEvents();
  }

  setupEvents() {
    this.eventManager.add( this.events.objectChanged, this.onObjectChanged.bind( this ) );
  }

  onObjectChanged( event ) {
    const object = event.detail.object;

    if ( object.isPerspectiveCamera ) {
      this.helper.update();
    }
  }
}

export { PerspectiveCamera };
