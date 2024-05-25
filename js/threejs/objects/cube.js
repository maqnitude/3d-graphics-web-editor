import * as THREE from "three";

class Cube extends THREE.Mesh {
  constructor() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0x808080
    });

    super( geometry, material );

    this.name = "Cube";
  }
}

export { Cube };
