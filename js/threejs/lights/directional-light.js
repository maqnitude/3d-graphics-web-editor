import * as THREE from "three";

class DirectionalLight extends THREE.DirectionalLight {
  constructor() {
    super( 0xffffff, 1 );

    this.name = "Directional Light"
  }
}

export { DirectionalLight };
