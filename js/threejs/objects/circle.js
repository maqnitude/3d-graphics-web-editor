import * as THREE from "three";

class Circle extends THREE.Mesh {
  constructor() {
    const geometry = new THREE.CircleGeometry(1, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0x808080,
    });

    super( geometry, material );

    this.name = "Circle";
  }
}

export { Circle };
