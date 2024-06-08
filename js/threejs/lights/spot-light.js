import * as THREE from "three";

class SpotLight extends THREE.SpotLight {
  constructor( editor ) {
    super( 0xffffff );

    this.editor = editor;
    this.eventManager = editor.eventManager;
    this.events = editor.events;

    this.name = "Spot Light";

    this.helper = new THREE.SpotLightHelper( this );
    this.editor.sceneHelper.add( this.helper );

    this.setupEvents();
  }

  setupEvents() {
    this.eventManager.add( this.events.objectChanged, this.onObjectChanged.bind( this ) );
  }

  onObjectChanged( event ) {
    const object = event.detail.object;

    if ( object.isSpotLight ) {
      this.helper.update();
    }
  }
}

export { SpotLight };
