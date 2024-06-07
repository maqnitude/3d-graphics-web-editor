import * as THREE from "three";

class Tetrahedron extends THREE.Mesh {
  constructor() {
    const geometry = new THREE.TetrahedronGeometry(1, 0);
    const material = new THREE.MeshBasicMaterial({
      color: 0x808080,
    });

    super( geometry, material );

    this.name = "Tetrahedron";
  }
}

export { Tetrahedron };
