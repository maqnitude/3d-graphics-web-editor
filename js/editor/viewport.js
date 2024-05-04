import * as THREE from "three";

function Viewport() {
  const container = document.createElement("div");
  container.setAttribute("id", "Viewport");
  container.setAttribute("class", "flex-grow-1 border p-0 m-0");

  const renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x333333);

  // Must set this to absolute or it will fuck up on window resize
  renderer.domElement.setAttribute("class", "position-absolute");

  container.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
  camera.position.set(0, 5, 10);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  const scene = new THREE.Scene();

  const grid = new THREE.Group();
  const grid1 = new THREE.GridHelper(30, 30, 0x888888);
  grid1.material.color.setHex(0x222222);
  grid1.material.vertexColors = false;
  grid.add(grid1);
  const grid2 = new THREE.GridHelper(30, 6, 0x222222);
  grid2.material.color.setHex(0x888888);
  grid2.material.vertexColors = false;
  grid.add(grid2);

  function UpdateAspectRatio() {
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
  }

  function Render() {
    // renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.offsetWidth, container.offsetHeight);

    UpdateAspectRatio();

    renderer.setViewport(0, 0, container.offsetWidth, container.offsetHeight);
    renderer.render(scene, camera);

    renderer.autoClear = false;
    renderer.render(grid, camera);
    renderer.autoClear = true;
  }

  return {
    container,
    Render
  };
}

export { Viewport };
