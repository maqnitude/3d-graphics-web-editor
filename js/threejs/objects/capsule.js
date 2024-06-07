import * as THREE from 'three';

class Capsule extends THREE.Mesh {
  constructor() {
    const geometry = new THREE.CapsuleGeometry(1, 1, 3, 10);
    const material = new THREE.MeshBasicMaterial({
      color: 0x808080,
    });

    super( geometry, material );

    this.name = "Capsule";
  }
}

export { Capsule };