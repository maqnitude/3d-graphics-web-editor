import * as THREE from "three";

class PerspectiveCamera extends THREE.PerspectiveCamera {
  constructor( editor ) {
    super( 50, window.innerWidth / window.innerHeight, 1, 1000 );

    this.editor = editor;
    this.eventManager = editor.eventManager;
    this.events = editor.events;

    this.name = "Perspective Camera";

    this.helper = new THREE.CameraHelper( this );
    this.helper.visible = false;
    this.editor.sceneHelper.add( this.helper );

    //

    this.setupEvents();
  }

  setupEvents() {
    this.eventManager.add( this.events.objectChanged, this.onObjectChanged.bind( this ) );

    this.addEventListener( "added", () => {
      this.helper.visible = true;
    })
    this.addEventListener( "removed", () => {
      this.helper.visible = false;
    });
  }

  onObjectChanged( event ) {
    const object = event.detail.object;

    if ( object.isPerspectiveCamera ) {
      this.helper.update();
    }
  }
}

export { PerspectiveCamera };
