class Properties {
  constructor( editor ) {
    this.editor = editor;
    this.eventDispatcher = editor.eventDispatcher;
    this.events = editor.events;
    
    //
    
    this.container = document.createElement( "div" );
    this.container.setAttribute( "id", "Properties" );
    this.container.classList.add(
      // "h-100",
      "overflow-scroll"
    );
  }

  createListGroup( title ) {
    const listGroup = document.createElement( "div" )
    listGroup.classList.add(
      "list-group"
    );

    const header = document.createElement( "h5" );
    header.classList.add(
      "list-group-item",
      "list-group-item-primary",
    );
    header.textContent = title;

    listGroup.appendChild( header );

    return listGroup;
  }

  addReadOnlyProperty( parent, propertyLabel, value, type ) {
    const listItem = document.createElement( "div" );
    listItem.classList.add(
      "list-group-item",
      "p-0"
    );

    const formFloating = document.createElement( "div" );
    formFloating.classList.add(
      "form-floating"
    );

    const input = document.createElement( "input" );
    input.readOnly = true;
    input.setAttribute( "id", `input-${ propertyLabel }` );
    input.setAttribute( "type", type );
    input.setAttribute( "value", `${ value }` );
    input.classList.add(
      "form-control-plaintext"
    );

    const label = document.createElement( "label" );
    label.setAttribute( "for", input.getAttribute( "id" ) );
    label.textContent = propertyLabel;

    formFloating.appendChild( input );
    formFloating.appendChild( label );
    listItem.appendChild( formFloating );
    parent.appendChild( listItem );
  }

  addValueSliderProperty( parent, propertyLabel, value, min, max, step ) {
    const listItem = document.createElement( "div" );
    listItem.classList.add(
      "list-group-item",
      "p-0"
    );

    const inputGroup = document.createElement( "div" );
    inputGroup.classList.add(
      "input-group",
    );

    const span = document.createElement( "span" );
    span.textContent = propertyLabel;
    span.classList.add(
      "input-group-text"
    );

    const inputNumber = document.createElement( "input" );
    inputNumber.readOnly = false;
    inputNumber.setAttribute( "id", `input-${ propertyLabel }` );
    inputNumber.setAttribute( "type", "number" );
    inputNumber.setAttribute( "value", `${ value }` );
    inputNumber.setAttribute( "min", `${ min }` );
    inputNumber.setAttribute( "max", `${ max }` );
    inputNumber.setAttribute( "step", `${ step }` );
    inputNumber.classList.add(
      "form-control",
    );
    inputNumber.addEventListener(
      "input",
      () => {
        inputSlider.value = inputNumber.value;
      }
    )

    const inputSlider = document.createElement( "input" );
    inputSlider.readOnly = false;
    inputSlider.setAttribute( "id", `input-${ propertyLabel }` );
    inputSlider.setAttribute( "type", "range" );
    inputSlider.setAttribute( "value", `${ value }` );
    inputSlider.setAttribute( "min", `${ min }` );
    inputSlider.setAttribute( "max", `${ max }` );
    inputSlider.setAttribute( "step", `${ step }` );
    inputSlider.classList.add(
      "form-range",
    );
    inputSlider.addEventListener(
      "input",
      () => {
        inputNumber.value = inputSlider.value;
      }
    )

    inputGroup.appendChild( span );
    inputGroup.appendChild( inputSlider );
    inputGroup.appendChild( inputNumber );
    listItem.appendChild( inputGroup );
    parent.appendChild( listItem );
  }

  addVector2Property( parent, propertyLabel, vector2 ) {
    const listItem = document.createElement( "div" );
    listItem.classList.add(
      "list-group-item",
      "p-0"
    );
    
    // TODO

    parent.appendChild( listItem );
  }

  addVector3Property( parent, propertyLabel, vector3 ) {
    const listItem = document.createElement( "div" );
    listItem.classList.add(
      "list-group-item",
      "p-0"
    );

    // TODO

    parent.appendChild( listItem );
  }
}

class CameraProperties extends Properties {
  constructor( editor, camera ) {
    super( editor );

    // TODO
  }
}

class SceneProperties extends Properties {
  constructor( editor, scene ) {
    super( editor );

    // TODO
  }
}

class MeshProperties extends Properties {
  constructor( editor, mesh ) {
    super( editor );

    this.objectProperties = this.createListGroup( "Object" );
    this.addReadOnlyProperty( this.objectProperties, "Name", mesh.name, "text" );
    this.addReadOnlyProperty( this.objectProperties, "UUID", mesh.uuid, "text" );
    this.addReadOnlyProperty( this.objectProperties, "Type", mesh.type, "text" );

    this.geometryProperties = this.createListGroup( "Geometry" );
    this.addReadOnlyProperty( this.geometryProperties, "Type", mesh.geometry.type, "text");
    switch ( mesh.geometry.type ) {
      case "BoxGeometry":
        const params = mesh.geometry.parameters;

        this.addValueSliderProperty( this.geometryProperties, "Width", params.width, 1, 30, 0.001 );
        this.addValueSliderProperty( this.geometryProperties, "Height", params.height, 1, 30, 0.001 );
        this.addValueSliderProperty( this.geometryProperties, "Depth", params.depth, 1, 30, 0.001 );
        this.addValueSliderProperty( this.geometryProperties, "Width Segments", params.widthSegments, 1, 10, 1 );
        this.addValueSliderProperty( this.geometryProperties, "Height Segments", params.heightSegments, 1, 10, 1 );
        this.addValueSliderProperty( this.geometryProperties, "Depth Segments", params.depthSegments, 1, 10, 1 );

        break;
      case "PlaneGeometry":
        // TODO

        break;
      case "SphereGeometry":
        // TODO

        break;
    }

    this.materialProperties = this.createListGroup( "Material" );

    this.textureProperties = this.createListGroup( "Texture" );

    this.physicsProperties = this.createListGroup( "Physics" );

    this.container.appendChild( this.objectProperties );
    this.container.appendChild( this.geometryProperties );
    this.container.appendChild( this.materialProperties );
    this.container.appendChild( this.textureProperties );
    this.container.appendChild( this.physicsProperties );
  }
}

class LightProperties extends Properties {
  constructor( editor, light ) {
    super( editor );

    // TODO
  }
}

class LightShadowProperties extends Properties {
  constructor( editor, lightShadow ) {
    super( editor );

    // TODO
  }
}

export { Properties, MeshProperties };
