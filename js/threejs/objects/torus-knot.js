import * as THREE from 'three';

class TorusKnot extends THREE.Mesh {
  constructor() {
    const geometry = new THREE.TorusKnotGeometry(1, 0.4, 64, 8, 2, 3);
    const material = new THREE.MeshBasicMaterial({
      color: 0x808080,
    });
    
    super( geometry, material );

    this.name = "Torus Knot";
  }
}

export { TorusKnot };