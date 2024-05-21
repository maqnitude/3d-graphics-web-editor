import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

class Viewport {
  constructor(editor) {
    this.editor = editor;
    this.container = this.createContainer();
    this.renderer = this.createRenderer();

    this.perspectiveCamera = this.createPerspectiveCamera();
    this.orthographicCamera = this.createOrthographicCamera();

    // Default camera: perspective
    this.currentCamera = this.perspectiveCamera;

    this.controls = new OrbitControls(this.currentCamera, this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.sceneHelper = new THREE.Scene();
    this.grid = this.createGrid();

    //

    this.editor.eventDispatcher.addEventListener(
      this.editor.events.rendererCreated.type,
      this.render.bind(this)
    );
    this.editor.eventDispatcher.addEventListener(
      this.editor.events.windowResized.type,
      this.render.bind(this)
    );
    this.editor.eventDispatcher.addEventListener(
      this.editor.events.objectAdded.type,
      this.onObjectAdded.bind(this)
    );

    this.controls.addEventListener(
      "change",
      this.render.bind(this)
    );
  }

  // Initializers

  createContainer() {
    const container = document.createElement("div");

    container.setAttribute("id", "Viewport");
    container.setAttribute("class", "flex-grow-1 border p-0 m-0")

    return container;
  }

  createRenderer() {
    const renderer = new THREE.WebGLRenderer({
      antialias: true
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x333333);

    // Must set this to absolute or it will fuck up on window resize
    renderer.domElement.setAttribute("class", "position-absolute");

    this.container.appendChild(renderer.domElement);

    this.editor.eventDispatcher.dispatchEvent(this.editor.events.rendererCreated);

    return renderer;
  }

  createPerspectiveCamera() {
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);

    camera.position.set(0, 5, 10);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    return camera;
  }

  createOrthographicCamera() {

  }

  createGrid() {
    const GRID_COLORS = [
      0x555555,
      0x888888
    ];

    const grid = new THREE.Group();

    const grid1 = new THREE.GridHelper(30, 30, 0x888888);
    grid1.material.color.setHex(GRID_COLORS[0]);
    grid1.material.vertexColors = false;
    grid.add(grid1);

    const grid2 = new THREE.GridHelper(30, 6, 0x222222);
    grid2.material.color.setHex(GRID_COLORS[1]);
    grid2.material.vertexColors = false;
    grid.add(grid2);

    return grid;
  }

  // Methods
  
  addObject(object) {
    this.scene.add(object.mesh);

    this.editor.eventDispatcher.dispatchEvent(this.editor.events.objectAdded);
  }

  updateAspectRatio() {
    this.currentCamera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.currentCamera.updateProjectionMatrix();
  }

  render() {
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

    this.updateAspectRatio();

    this.renderer.setViewport(0, 0, this.container.clientWidth, this.container.clientHeight);
    this.renderer.render(this.scene, this.currentCamera);

    this.renderer.autoClear = false;
    this.renderer.render(this.grid, this.currentCamera);
    this.renderer.autoClear = true;
  }

  // Events handlers
  
  onObjectAdded() {
    this.render();

    console.log("Object added successfully");
  }
}

export { Viewport }
