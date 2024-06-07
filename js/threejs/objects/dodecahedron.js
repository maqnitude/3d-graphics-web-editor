import * as THREE from "three";

class Dodecahedron extends THREE.Mesh {
  constructor() {
    const geometry = new THREE.DodecahedronGeometry(1, 0);
    const material = new THREE.MeshBasicMaterial({
      color: 0x808080,
    });

    super( geometry, material );

    this.name = "Dodecahedron";
  }
}

export { Dodecahedron };
