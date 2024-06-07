import * as THREE from "three";

class Octahedron extends THREE.Mesh {
  constructor() {
    const geometry = new THREE.OctahedronGeometry(1, 0);
    const material = new THREE.MeshBasicMaterial({
      color: 0x808080,
    });

    super( geometry, material );

    this.name = "Octahedron";
  }
}

export { Octahedron };
