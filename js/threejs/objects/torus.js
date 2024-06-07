import * as THREE from 'three';

class Torus extends THREE.Mesh {
  constructor() {
    const geometry = new THREE.TorusGeometry(1, 0.4, 12, 48);
    const material = new THREE.MeshBasicMaterial({
      color: 0x808080,
    });

    super( geometry, material );

    this.name = "Torus";
  }
}

export { Torus };
