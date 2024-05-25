import * as THREE from "three";

class Plane extends THREE.Mesh {
  constructor() {
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.MeshBasicMaterial({ color: 0x808080 });

    super( geometry, material );

    this.name = "Plane";
  }
}

export { Plane };
