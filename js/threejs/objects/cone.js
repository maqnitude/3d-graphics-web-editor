import * as THREE from 'three';

class Cone extends THREE.Mesh {
  constructor() {
    const geometry = new THREE.ConeGeometry(1, 1, 32, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0x808080,
    });

    super( geometry, material );

    this.name = "Cone";
  }
}

export { Cone };