import * as THREE from "three";

class Cube {
  constructor() {
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({
      color: 0x808080
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }
}

export { Cube };
