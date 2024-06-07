import * as THREE from "three";

class Icosahedron extends THREE.Mesh {
  constructor() {
    const geometry = new THREE.IcosahedronGeometry(1, 0);
    const material = new THREE.MeshBasicMaterial({
      color: 0x808080,
    });

    super( geometry, material );

    this.name = "Icosahedron";
  }
}

export { Icosahedron };
