import * as THREE from "three";

class CustomSinCurve extends THREE.Curve {
	constructor( scale = 1 ) {
		super();
		this.scale = scale;
	}

	getPoint( t, optionalTarget = new THREE.Vector3() ) {

		const tx = t * 3 - 1.5;
		const ty = Math.sin( 2 * Math.PI * t );
		const tz = 0;

		return optionalTarget.set( tx, ty, tz ).multiplyScalar( this.scale );
	}
}

class Tube extends THREE.Mesh {
  constructor() {
    const path = new CustomSinCurve(1);
    const geometry = new THREE.TubeGeometry(path, 64, 0.2, 8);
    const material = new THREE.MeshBasicMaterial({
      color: 0x808080,
    });

    super( geometry, material );

    this.name = "Tube";
  }
}

export { Tube };
