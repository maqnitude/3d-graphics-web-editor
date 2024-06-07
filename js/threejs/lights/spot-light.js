import * as THREE from "three";

class SpotLight extends THREE.SpotLight {
  constructor( editor ) {
    super( 0xffffff );

    this.editor = editor;
    this.eventDispatcher = editor.eventDispatcher;
    this.events = editor.events;

    this.name = "Spot Light";

    this.helper = new THREE.SpotLightHelper( this );
    this.editor.sceneHelper.add( this.helper );

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.eventDispatcher.addEventListener(
      this.events.objectChanged.type,
      this.onObjectChanged.bind( this )
    );
  }

  onObjectChanged( event ) {
    const object = event.detail.object;

    if ( object.isSpotLight ) {
      this.helper.update();
    }
  }
}

export { SpotLight };