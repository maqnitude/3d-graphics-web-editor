import * as THREE from "three";

class Sphere {
  constructor() {
    this.geometry = new THREE.SphereGeometry(1, 32, 32);
    this.material = new THREE.MeshBasicMaterial({ color: 0x808080 });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }
}

export { Sphere };
