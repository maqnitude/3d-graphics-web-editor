import { ObjectProperties } from "./object-properties.js";
import { PropertyGroup, ValueSliderProperty } from "./properties.js";

class CameraProperties extends ObjectProperties {
  constructor( editor, camera ) {
    super( editor, camera );

    this.camera = camera;

    this.cameraProperties = new PropertyGroup( this.container, "Camera" );
    this.setupCameraProperties( this.cameraProperties.container );

    //

    this.setupEvents();
  }

  setupEvents() {
    this.eventManager.add( this.events.objectChanged, this.onObjectChanged.bind( this ) );
  }

  setupCameraProperties( parent ) {
    const editor = this.editor;
    const camera = this.camera;

    switch ( camera.type ) {
      case "PerspectiveCamera":
        this.perspectiveCameraFOV = new ValueSliderProperty( editor, parent, camera, "fov", "FOV", camera.fov, 0, 180, 0.01 );
        this.perspectiveCameraNear = new ValueSliderProperty( editor, parent, camera, "near", "Near", camera.near, 0, 1000000, 0.01 );
        this.perspectiveCameraFar = new ValueSliderProperty( editor, parent, camera, "far", "Far", camera.near, 0, 1000000, 0.01 );

        break;
      case "OrthographicCamera":
        this.orthographicCameraLeft = new ValueSliderProperty( editor, parent, camera, "left", "Left", camera.left, 0, 1000000, 0.01 );
        this.orthographicCameraRight = new ValueSliderProperty( editor, parent, camera, "right", "Right", camera.right, 0, 1000000, 0.01 );
        this.orthographicCameraTop = new ValueSliderProperty( editor, parent, camera, "top", "Top", camera.top, 0, 1000000, 0.01 );
        this.orthographicCameraBottom = new ValueSliderProperty( editor, parent, camera, "bottom", "Bottom", camera.bottom, 0, 1000000, 0.01 );
        this.orthographicCameraNear = new ValueSliderProperty( editor, parent, camera, "near", "Near", camera.near, 0, 1000000, 0.01 );
        this.orthographicCameraFar = new ValueSliderProperty( editor, parent, camera, "far", "Far", camera.far, 0, 1000000, 0.01 );

        break;
    }
  }

  updateUI() {
    super.updateUI();

    const camera = this.camera;
    const cameraProps = this.getCameraProperties( camera.type );
    for ( const prop in cameraProps ) {
      if ( camera.hasOwnProperty( prop ) ) {
        this.setPropertyValue( cameraProps[ prop ], camera[ prop ] );
      }
    }
  }

  // Helpers

  getCameraProperties( cameraType ) {
    const cameraPropertiesMap = {
      PerspectiveCamera: {
        fov: this.perspectiveCameraFOV,
        near: this.perspectiveCameraNear,
        far: this.perspectiveCameraFar,
      },
      OrthographicCamera: {
        left: this.orthographicCameraLeft,
        right: this.orthographicCameraRight,
        top: this.orthographicCameraTop,
        bottom: this.orthographicCameraBottom,
        near: this.orthographicCameraNear,
        far: this.orthographicCameraFar,
      }
    }
    return cameraPropertiesMap[ cameraType ];
  }

  // Event handlers

  onObjectChanged( event ) {
    const object = event.detail.object;

    if ( object.isCamera ) {
      if ( object !== this.editor.viewportCamera ) {
        this.camera = object;
      }

      this.updateUI();
    }
  }
}

export { CameraProperties };
