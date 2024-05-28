import * as THREE from "three";

class Sphere extends THREE.Mesh {
  constructor() {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x808080 });

    super( geometry, material );

    this.name = "Sphere";
  }
}

export { Sphere };
