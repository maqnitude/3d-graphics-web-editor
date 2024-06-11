import * as THREE from "three";

class OrthographicCamera extends THREE.OrthographicCamera {
  constructor( editor ) {
    const width = window.innerWidth / 400;
    const height = window.innerHeight / 400;

    super( width / -2, width / 2, height / 2, height / -2, 1, 1000 );

    this.editor = editor;
    this.eventManager = editor.eventManager;
    this.events = editor.events;

    this.name = "Orthographic Camera";

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

    if ( object.isOrthographicCamera ) {
      this.helper.update();
    }
  }
}

export { OrthographicCamera };
