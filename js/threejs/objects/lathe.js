import * as THREE from "three";

class Lathe extends THREE.Mesh {
	constructor() {
		const points = [];
		for (let i = 0; i < 10; i++) {
			points.push(new THREE.Vector2(Math.sin(i * 0.2) * 10 + 5, (i - 5) * 2));
		}
		const geometry = new THREE.LatheGeometry(points, 12);
		const material = new THREE.MeshBasicMaterial({
			color: 0x808080,
		});

		super( geometry, material );

		this.name = "Lathe";
	}
}

export { Lathe };
