import * as THREE from "three";

class PointLight extends THREE.PointLight {
  constructor( editor ) {
    super( 0xffffff, 1, 0 );

    this.editor = editor;
    this.eventDispatcher = editor.eventDispatcher;
    this.events = editor.events;

    this.name = "Point Light";

    this.helper = new THREE.PointLightHelper( this, 1 );
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

    if ( object.isPointLight ) {
      this.helper.update();
    }
  }
}

export { PointLight };