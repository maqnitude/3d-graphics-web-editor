import * as THREE from "three";

class DirectionalLight extends THREE.DirectionalLight {
  constructor( editor ) {
    super( 0xffffff, 1 );

    this.editor = editor;
    this.eventDispatcher = editor.eventDispatcher;
    this.events = editor.events;

    this.name = "Directional Light"

    this.helper = new THREE.DirectionalLightHelper( this, 1 );
    this.editor.sceneHelper.add( this.helper );

    //

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

    if ( object.isDirectionalLight) {
      this.helper.update();
    }
  }
}

export { DirectionalLight };
