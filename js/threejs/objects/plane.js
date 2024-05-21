import * as THREE from "three";

class Plane {
  constructor() {
    this.geometry = new THREE.PlaneGeometry(2, 2);
    this.material = new THREE.MeshBasicMaterial({ color: 0x808080 });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }
}

export { Plane };
