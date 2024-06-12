import { ObjectProperties } from "./object-properties.js";
import { BooleanProperty, ColorProperty, PropertyGroup, ValueSliderProperty } from "./properties.js";

class LightProperties extends ObjectProperties {
  constructor( editor, light ) {
    super( editor, light );
    this.light = light;

    this.objectRotation.container.classList.add( "d-none" );
    this.objectScale.container.classList.add( "d-none" );
    this.objectCastShadow.container.classList.add( "d-none" );
    this.objectReceiveShadow.container.classList.add( "d-none" );

    this.lightProperties = new PropertyGroup( this.container, "Light" );
    this.setupLightProperties( this.lightProperties.content );
  }

  setupEvents() {
    this.eventManager.add( this.events.objectChanged, this.onObjectChanged.bind( this ) );
  }

  setupLightProperties( parent ) {
    const editor = this.editor;
    const light = this.light;

    this.lightColor = new ColorProperty( editor, parent, light, "color", "Color", light.color );
    this.lightIntesity = new ValueSliderProperty( editor, parent, light, "intensity", "Intensity", light.intensity, 0, 10, 0.001 );

    switch ( light.type ) {
      case "DirectionalLight":
        this.directionalLightCastShadow = new BooleanProperty( editor, parent, light, "castShadow", "Cast Shadow", light.castShadow );

        break;
      case "PointLight":
        this.pointLightCastShadow = new BooleanProperty( editor, parent, light, "castShadow", "Cast Shadow", light.castShadow );

        break;
      case "SpotLight":
        this.spotLightCastShadow = new BooleanProperty( editor, parent, light, "castShadow", "Cast Shadow", light.castShadow );

        break;
    }
  }

  updateUI() {
    super.updateUI();

    this.setPropertyValue( this.lightColor, this.light.color );
    this.setPropertyValue( this.lightIntesity, this.light.intensity );

    const lightProps = this.getLightProperties( this.light.type );
    for ( const prop in lightProps ) {
      if ( this.light.hasOwnProperty( prop ) ) {
        this.setPropertyValue( lightProps[ prop ], this.light[ prop ] );
      }
    }
  }

  getLightProperties( type ) {
    const lightProperties = {
      DirectionalLight: {
        castShadow: this.directionalLightCastShadow,
      },
      PointLight: {
        castShadow: this.pointLightCastShadow,
      },
      SpotLight: {
        castShadow: this.spotLightCastShadow,
      },
    }
    return lightProperties[ type ];
  }

  // Event handlers

  onObjectChanged( event ) {
    const object = event.detail.object;

    if ( object.isLight ) {
      this.light = object;
      this.updateUI();
    }
  }
}

export { LightProperties };
