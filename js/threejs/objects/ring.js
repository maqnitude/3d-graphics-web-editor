import * as THREE from 'three';

class Ring extends THREE.Mesh {
  constructor() {
    const geometry = new THREE.RingGeometry(0.5, 1, 32, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0x808080,
    });

    super( geometry, material );

    this.name = "Ring";
  }
}

export { Ring };
