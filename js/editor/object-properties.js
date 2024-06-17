import { BooleanProperty, EulerProperty, Properties, PropertyGroup, ReadOnlyProperty, Vector3Property } from "./properties.js";

class ObjectProperties extends Properties {
  constructor( editor, object ) {
    super( editor );

    this.object = object;

    this.objectProperties = new PropertyGroup( this.container, "Object" );
    this.setupObjectProperties( this.objectProperties.content );

    //

    this.setupEvents();
  }

  setupEvents() {
    this.eventManager.add( this.events.objectChanged, this.onObjectChanged.bind( this ) );
  }

  setupObjectProperties( parent ) {
    const editor = this.editor;
    const object = this.object;

    this.objectName = new ReadOnlyProperty( parent, "Name", object.name, "text" );
    this.objectUuid = new ReadOnlyProperty( parent, "UUID", object.uuid, "text" );
    this.objectType = new ReadOnlyProperty( parent, "Type", object.type, "text" );
    this.objectPosition = new Vector3Property( editor, parent, object, "position", "Position", object.position );
    this.objectRotation = new EulerProperty( editor, parent, object, "rotation", "Rotation", object.rotation );
    this.objectScale = new Vector3Property( editor, parent, object, "scale", "Scale", object.scale );
    this.objectVisible = new BooleanProperty( editor, parent, object, "visible", "Visible", object.visible );
    this.objectCastShadow = new BooleanProperty( editor, parent, object, "castShadow", "Cast Shadow", object.castShadow );
    this.objectReceiveShadow = new BooleanProperty( editor, parent, object, "receiveShadow", "Receive Shadow", object.receiveShadow );
  }

  updateUI() {
    const object = this.object;
    const objectProps = this.getObjectProperties();
    for ( const prop in objectProps ) {
      if ( object.hasOwnProperty( prop ) ) {
        this.setPropertyValue( objectProps[ prop ], object[ prop ] );
      }
    }
  }

  // Helpers

  getObjectProperties() {
    const objectPropertiesMap = {
      name: this.objectName,
      uuid: this.objectUuid,
      type: this.objectType,
      position: this.objectPosition,
      rotation: this.objectRotation,
      scale: this.objectScale,
      visible: this.objectVisible,
      castShadow: this.objectCastShadow,
      receiveShadow: this.objectReceiveShadow,
    }
    return objectPropertiesMap;
  }

  // Event handlers

  onObjectChanged( event ) {
    const object = event.detail.object;

    if ( object.isObject3D ) {
      this.object = object;
      this.updateUI();
    }
  }
}

export { ObjectProperties };
