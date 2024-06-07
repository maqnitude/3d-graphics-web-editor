import { ObjectProperties } from "./object-properties.js";
import { EulerProperty, PropertyGroup, TextureProperty, ValueSliderProperty, Vector3Property } from "./properties.js";

class SceneProperties extends ObjectProperties {
  constructor( editor, scene ) {
    super( editor, scene );

    this.scene = scene;

    this.objectPosition.container.classList.add( "d-none" );
    this.objectRotation.container.classList.add( "d-none" );
    this.objectScale.container.classList.add( "d-none" );
    this.objectVisible.container.classList.add( "d-none" );
    this.objectCastShadow.container.classList.add( "d-none" );
    this.objectReceiveShadow.container.classList.add( "d-none" );

    this.sceneProperties = new PropertyGroup( this.container, "Scene" );
    this.setupSceneProperties( this.sceneProperties.container );

    //

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.eventDispatcher.addEventListener(
      this.events.objectChanged.type,
      this.onObjectChanged.bind( this )
    )
  }

  setupSceneProperties( parent ) {
    const editor = this.editor;
    const scene = this.scene;

    this.sceneBackground = new TextureProperty( editor, parent, scene, "background", "Background" );
    this.sceneBackgroundBlurriness = new ValueSliderProperty( editor, parent, scene, "backgroundBlurriness", "Background Blurriness", scene.backgroundBlurriness, 0, 1, 0.001 );
    this.sceneBackgroundIntensity = new ValueSliderProperty( editor, parent, scene, "backgroundIntensity", "Background Intensity", scene.backgroundIntensity, 0, 10, 0.01 );
    this.sceneBackgroundRotation = new EulerProperty( editor, parent, scene, "backgroundRotation", "Background Rotation", scene.backgroundRotation );
    this.sceneEnvironment = new TextureProperty( editor, parent, scene, "environment", "Environment" );
    this.sceneEnvironmentIntensity = new ValueSliderProperty( editor, parent, scene, "environmentIntensity", "Environment Intensity", scene.environmentIntensity, 0, 10, 0.01 );
  }

  updateUI() {
    super.updateUI();

    const scene = this.scene;
    const sceneProps = this.getSceneProperties();
    for ( const prop in sceneProps ) {
      if ( scene.hasOwnProperty( prop ) ) {
        this.setPropertyValue( sceneProps[ prop ], scene[ prop ] );
      }
    }
  }

  // Helpers

  getSceneProperties() {
    const scenePropertiesMap = {
      background: this.sceneBackground,
      backgroundBlurriness: this.sceneBackgroundBlurriness,
      backgroundIntesity: this.sceneBackgroundIntensity,
      backgroundRotation: this.sceneBackgroundRotation,
      environment: this.sceneEnvironment,
      environmentIntensity: this.sceneEnvironmentIntensity,
    }
    return scenePropertiesMap;
  }

  // Event handlers


  onObjectChanged( event ) {
    const object = event.detail.object;

    if ( object.isScene ) {
      this.scene = object;
      this.updateUI();
    }
  }
}

export { SceneProperties };
