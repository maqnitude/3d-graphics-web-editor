import * as THREE from 'three'

class Cylinder extends THREE.Mesh {
  constructor() {
    const geometry = new THREE.CylinderGeometry(1, 1, 1, 32, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0x808080,
    });

    super( geometry, material );

    this.name = "Cylinder";
  }
}

export { Cylinder };
