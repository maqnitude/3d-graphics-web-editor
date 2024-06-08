import * as THREE from "three";

class DirectionalLight extends THREE.DirectionalLight {
  constructor( editor ) {
    super( 0xffffff, 1 );

    this.editor = editor;
    this.eventManager = editor.eventManager;
    this.events = editor.events;

    this.name = "Directional Light";

    this.helper = new THREE.DirectionalLightHelper( this, 1 );
    this.editor.sceneHelper.add( this.helper );

    //

    this.setupEvents();
  }

  setupEvents() {
    this.eventManager.add( this.events.objectChanged, this.onObjectChanged.bind( this ) );
  }

  onObjectChanged( event ) {
    const object = event.detail.object;

    if ( object.isDirectionalLight ) {
      this.helper.update();
    }
  }
}

export { DirectionalLight };
