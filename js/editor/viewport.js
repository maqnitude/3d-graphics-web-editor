import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";

import { Selector } from "./selector.js";

class Viewport {
  constructor( editor ) {
    this.editor = editor;
    this.eventDispatcher = editor.eventDispatcher;
    this.events = editor.events;

    this.history = editor.history;
    this.selector = editor.selector;

    this.container = this.createContainer();
    this.renderer = this.createRenderer();

    this.camera = this.editor.camera;

    this.orbitControls = new OrbitControls( this.camera, this.renderer.domElement );

    this.scene = editor.scene;

    this.sceneHelper = editor.sceneHelper;
    this.grid = this.createGrid();

    this.transformControls = new TransformControls( this.camera, this.renderer.domElement );
    this.sceneHelper.add( this.transformControls );

    //

    this.setupEventListeners();
  }

  // Initializers

  setupEventListeners() {
    document.addEventListener("mousedown", (event) => this.onMouseDown(event));

    document.addEventListener("mouseup", (event) => this.onMouseUp(event));

    this.eventDispatcher.addEventListener(
      this.events.rendererCreated.type,
      this.render.bind( this )
    );

    this.eventDispatcher.addEventListener(
      this.events.windowResized.type,
      this.render.bind( this )
    );

    this.eventDispatcher.addEventListener(
      this.events.objectAdded.type,
      this.onObjectAdded.bind( this )
    );
    this.eventDispatcher.addEventListener(
      this.events.objectSelected.type,
      this.onObjectSelected.bind( this )
    );
    this.eventDispatcher.addEventListener(
      this.events.objectChanged.type,
      this.onObjectChanged.bind( this )
    );
    this.eventDispatcher.addEventListener(
      this.events.objectRemoved.type,
      this.onObjectRemoved.bind( this )
    );

    this.eventDispatcher.addEventListener(
      this.events.materialChanged.type,
      this.onMaterialChanged.bind( this )
    );

    this.orbitControls.addEventListener(
      "change",
      this.render.bind( this )
    );

    this.transformControls.addEventListener(
      "change",
      this.render.bind( this )
    );

    this.transformControls.addEventListener(
      "dragging-changed",
      ( event ) => {
        this.orbitControls.enabled = !event.value;
      }
    );

    // Change in viewport, update in properties
    this.transformControls.addEventListener(
      "objectChange",
      ( event ) => {
        this.dispatchObjectChangedEvent( this.transformControls.object );
      }
    );
    this.transformControls.addEventListener(
      "mouseDown",
      ( event ) => {
        this.history.recordChange = true;
        this.history.newUndoBranch = true;

        this.dispatchObjectChangedEvent( this.transformControls.object );
      }
    );
    this.transformControls.addEventListener(
      "mouseUp",
      ( event ) => {
        this.history.recordChange = false;
      }
    );

    const translateButton = document.getElementById("Translate");
    translateButton.classList.remove('btn-secondary');
    translateButton.classList.add('btn-primary');

    const rotateButton = document.getElementById("Rotate");
    const scaleButton = document.getElementById("Scale");

    const transformButtons = [translateButton, rotateButton, scaleButton];

    for (let button of transformButtons) {
      button.onclick = () => {
        for (let button of transformButtons) {
          button.classList.add('btn-secondary');
        }
        button.classList.remove('btn-secondary');
        button.classList.add('btn-primary');
        this.eventDispatcher.dispatchEvent(new CustomEvent (
            this.events.transformModeChanged.type,
            {
              detail: {
                mode: button.id.toLowerCase(),
              }
            }
          )
        )
      }
    }

    this.eventDispatcher.addEventListener(
      this.events.transformModeChanged.type,
      this.onTransformModeChanged.bind(this)
    )

    // Make selector only work in viewport
    this.container.addEventListener(
      "mouseenter",
      ( event ) => {
        this.selector.ignore = false;
      }
    )
    this.container.addEventListener(
      "mouseleave",
      ( event ) => {
        this.selector.ignore = true;
      }
    )
  }

  createContainer() {
    const container = document.createElement( "div" );

    container.setAttribute( "id", "Viewport" );
    container.setAttribute( "class", "flex-grow-1 border p-0 m-0" );

    return container;
  }

  createRenderer() {
    const renderer = new THREE.WebGLRenderer({
      antialias: true
    });

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setClearColor( 0x333333 );

    // Must set this to absolute or it will fuck up on window resize
    renderer.domElement.setAttribute( "class", "position-absolute" );

    this.container.appendChild( renderer.domElement );

    this.eventDispatcher.dispatchEvent( this.events.rendererCreated );

    return renderer;
  }

  createGrid() {
    const GRID_COLORS = [
      0x555555,
      0x888888
    ];

    const grid = new THREE.Group();

    const grid1 = new THREE.GridHelper( 30, 30, 0x888888 );
    grid1.material.color.setHex( GRID_COLORS[ 0 ] );
    grid1.material.vertexColors = false;
    grid.add( grid1 );

    const grid2 = new THREE.GridHelper( 30, 6, 0x222222 );
    grid2.material.color.setHex( GRID_COLORS[ 1 ] );
    grid2.material.vertexColors = false;
    grid.add( grid2 );

    return grid;
  }

  // Methods

  dispatchObjectChangedEvent( object ) {
    this.eventDispatcher.dispatchEvent(new CustomEvent(
      this.events.objectChanged.type,
      {
        detail: {
          object: object,
        }
      }
    ));
  }

  addObject( object ) {
    this.scene.add( object );
    // this.eventDispatcher.dispatchEvent( this.events.objectAdded );
    this.eventDispatcher.dispatchEvent( new CustomEvent(
      this.events.objectAdded.type,
      {
        detail: {
          object: object
        }
      }
    ));
  }

  removeObject( object ) {
    this.scene.remove( object );
    // this.eventDispatcher.dispatchEvent( this.events.objectRemoved );
    this.eventDispatcher.dispatchEvent( new CustomEvent(
      this.events.objectRemoved.type,
      {
        detail: {
          object: object
        }
      }
    ));
  }

  getMousePosition( dom, x, y ) {
    const rect = dom.getBoundingClientRect();
    return [ ( x - rect.left ) / rect.width, ( y - rect.top ) / rect.height ];
  }

  updateAspectRatio() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
  }

  render() {
    this.renderer.setSize( this.container.clientWidth, this.container.clientHeight ); 

    this.updateAspectRatio();

    this.renderer.setViewport( 0, 0, this.container.clientWidth, this.container.clientHeight );
    this.renderer.render( this.scene, this.editor.viewportCamera );

    if ( this.camera === this.editor.viewportCamera ) {
      this.renderer.autoClear = false;

      if ( this.grid.visible ) { this.renderer.render( this.grid, this.camera ) };
      if ( this.sceneHelper.visible ) { this.renderer.render( this.sceneHelper, this.camera ) };

      this.renderer.autoClear = true;
    }
  }

  // Events handlers

  onObjectAdded( event ) {
    this.render();
  }

  onObjectRemoved( event ) {
    this.transformControls.detach();
    this.selector.deselect();

    this.render();
  }

  onObjectSelected( event ) {
    const object = event.detail.object;

    this.transformControls.detach();

    if (object !== null && object !== this.scene && object !== this.camera) {
      this.transformControls.attach( object );
    }

    this.render();
  }

  onObjectChanged( event ) {
    this.render();
  }

  onMaterialChanged( event ) {
    this.render();
  }

  onDownPosition = new THREE.Vector2();
  onUpPosition = new THREE.Vector2();

  onMouseDown( event ) {
    const array = this.getMousePosition( this.container, event.clientX, event.clientY );
    this.onDownPosition.fromArray( array );
  }

  onMouseUp( event ) {
    const array = this.getMousePosition( this.container, event.clientX, event.clientY );
    this.onUpPosition.fromArray( array );

    if (this.onDownPosition.distanceTo( this.onUpPosition ) === 0) {
      const intersects = this.selector.getPointerIntersects( this.onUpPosition, this.camera );
      this.eventDispatcher.dispatchEvent(
        new CustomEvent(
          this.events.intersectionsDetected.type,
          {
            detail: {
              intersects: intersects,
            }
          }
        )
      );
    }
  }

  onTransformModeChanged( event ) {
    const mode = event.detail.mode;
    this.transformControls.setMode(mode);
  }
}

export { Viewport }
