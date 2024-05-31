class ReadOnlyProperty {
  constructor( parent, propertyLabel, value, type ) {
    this.parent = parent;

    this.listItem = document.createElement( "div" );
    this.listItem.classList.add(
      "list-group-item",
      "p-0"
    );

    this.formFloating = document.createElement( "div" );
    this.formFloating.classList.add(
      "form-floating"
    );

    this.input = document.createElement( "input" );
    this.input.readOnly = true;
    this.input.id = `input-${ propertyLabel }`;
    this.input.type = type;
    this.input.value = `${ value }`;
    this.input.classList.add(
      "form-control-plaintext"
    );

    this.label = document.createElement( "label" );
    this.label.setAttribute( "for", this.input.getAttribute( "id" ) );
    this.label.textContent = propertyLabel;

    this.formFloating.appendChild( this.input );
    this.formFloating.appendChild( this.label );
    this.listItem.appendChild( this.formFloating );
    this.parent.appendChild( this.listItem );
  }

  setValue( value ) {
    this.input.setAttribute( "value", `${ value }` );
  }
}

class ValueSliderProperty {
  constructor( parent, propertyLabel, value, min, max, step ) {
    this.history = null;

    this.parent = parent;

    this.listItem = document.createElement( "div" );
    this.listItem.classList.add(
      "list-group-item",
      "p-0"
    );

    this.inputGroup = document.createElement( "div" );
    this.inputGroup.classList.add(
      "input-group",
    );

    this.span = document.createElement( "span" );
    this.span.textContent = propertyLabel;
    this.span.classList.add(
      "input-group-text"
    );

    this.inputNumber = document.createElement( "input" );
    this.inputNumber.readOnly = false;
    this.inputNumber.id = `input-${ propertyLabel }`;
    this.inputNumber.type = "number";
    this.inputNumber.value = `${ value }`;
    this.inputNumber.min = `${ min }`;
    this.inputNumber.max = `${ max }`;
    this.inputNumber.step = `${ step }`;
    this.inputNumber.classList.add(
      "form-control",
    );
    this.inputNumber.addEventListener(
      "input",
      () => {
        this.inputSlider.value = this.inputNumber.value;
      }
    )

    this.inputSlider = document.createElement( "input" );
    this.inputSlider.readOnly = false;
    this.inputSlider.id = `input-${ propertyLabel }`;
    this.inputSlider.type = "range";
    this.inputSlider.value = `${ value }`;
    this.inputSlider.min = `${ min }`;
    this.inputSlider.max = `${ max }`;
    this.inputSlider.step = `${ step }`;
    this.inputSlider.classList.add(
      "form-range",
    );
    this.inputSlider.addEventListener(
      "input",
      () => {
        this.inputNumber.value = this.inputSlider.value;
      }
    )

    this.inputGroup.appendChild( this.span );
    this.inputGroup.appendChild( this.inputSlider );
    this.inputGroup.appendChild( this.inputNumber );
    this.listItem.appendChild( this.inputGroup );
    this.parent.appendChild( this.listItem );
  }

  setValue( value ) {
    this.inputNumber.value = `${ value }`;
    this.inputSlider.value = `${ value }`;
  }

  setupEventListeners() {
    this.input.addEventListener(
      
    )
  }
}

class Vector3Property {
  constructor(object, parent, propertyLabel, vector3, type) {
    this.editor = null;
    this.history = null;

    this.object = object;
    this.parent = parent;
    this.type = type;

    this.label = document.createElement( "label" );
    this.label.textContent = propertyLabel;

    this.container = document.createElement( "div" );

    this.inputGroupX = document.createElement( "div" );
    this.inputGroupX.classList.add(
      "input-group",
    );
    this.inputGroupY = document.createElement( "div" );
    this.inputGroupY.classList.add(
      "input-group",
    );
    this.inputGroupZ = document.createElement( "div" );
    this.inputGroupZ.classList.add(
      "input-group",
    );

    this.spanX = document.createElement( "span" );
    this.spanX.textContent = "X";
    this.spanX.classList.add(
      "input-group-text"
    );
    this.spanY = document.createElement( "span" );
    this.spanY.textContent = "Y";
    this.spanY.classList.add(
      "input-group-text"
    );
    this.spanZ = document.createElement( "span" );
    this.spanZ.textContent = "Z";
    this.spanZ.classList.add(
      "input-group-text"
    );

    this.inputNumberX = document.createElement( "input" );
    this.inputNumberX.readOnly = false;
    this.inputNumberX.id = "input-x";
    this.inputNumberX.type = "number";
    this.inputNumberX.value = `${ vector3.getComponent(0) }`;
    this.inputNumberX.step = "0.001";
    this.inputNumberX.classList.add(
      "form-control",
    );
    this.inputNumberY = document.createElement( "input" );
    this.inputNumberY.readOnly = false;
    this.inputNumberY.id = "input-y";
    this.inputNumberY.type = "number";
    this.inputNumberY.value = `${ vector3.getComponent(1) }`;
    this.inputNumberY.step = "0.001";
    this.inputNumberY.classList.add(
      "form-control",
    );
    this.inputNumberZ = document.createElement( "input" );
    this.inputNumberZ.readOnly = false;
    this.inputNumberZ.id = "input-z";
    this.inputNumberZ.type = "number";
    this.inputNumberZ.value = `${ vector3.getComponent(2) }`;
    this.inputNumberZ.step = "0.001";
    this.inputNumberZ.classList.add(
      "form-control",
    );

    this.inputGroupX.appendChild(this.spanX);
    this.inputGroupX.appendChild(this.inputNumberX);

    this.inputGroupY.appendChild(this.spanY);
    this.inputGroupY.appendChild(this.inputNumberY);

    this.inputGroupZ.appendChild(this.spanZ);
    this.inputGroupZ.appendChild(this.inputNumberZ);

    this.container.appendChild(this.label);
    this.container.appendChild(this.inputGroupX);
    this.container.appendChild(this.inputGroupY);
    this.container.appendChild(this.inputGroupZ);

    this.parent.appendChild(this.container);

    this.setupEventListeners();
  }

  setValue( vector3 ) {
    this.inputNumberX.value = `${ vector3.getComponent(0) }`;
    this.inputNumberY.value = `${ vector3.getComponent(1) }`;
    this.inputNumberZ.value = `${ vector3.getComponent(2) }`;
  } 

  // Change in properties, update in viewport
  setupEventListeners() {
    this.inputNumberX.addEventListener(
      "input",
      ( event ) => {
        const value = Number( event.target.value );

        switch(this.type) {
          case 'position':
            this.object.position.setComponent(0, value);
            break;
          case 'scale':
            this.object.scale.setComponent(0, value);
            break;
        }

        this.dispatchObjectChangedEvent( this.object );
      }
    )
    this.inputNumberX.addEventListener(
      "focus",
      ( event ) => {
        this.history.recordChange = true;
        this.history.newUndoBranch = true;

        this.dispatchObjectChangedEvent( this.object );

        this.history.recordChange = true;
      }
    )

    this.inputNumberY.addEventListener(
      "input",
      ( event ) => {
        const value = Number( event.target.value );

        switch(this.type) {
          case 'position':
            this.object.position.setComponent(1, value);
            break;
          case 'scale':
            this.object.scale.setComponent(1, value);
            break;
        }

        this.dispatchObjectChangedEvent( this.object );
      }
    )

    this.inputNumberZ.addEventListener(
      "input",
      (event) => {
        const value = Number( event.target.value );

        switch(this.type) {
          case 'position':
            this.object.position.setComponent(2, value);
            break;
          case 'scale':
            this.object.scale.setComponent(2, value);
            break;
        }

        this.dispatchObjectChangedEvent( this.object );

      }
    )
  }

  dispatchObjectChangedEvent( object ) {
    this.editor.eventDispatcher.dispatchEvent(new CustomEvent(
      this.editor.events.objectChanged.type,
      {
        detail: {
          object: object,
        }
      }
    ));
  }
}

class EulerProperty {
  constructor(object, parent, propertyLabel, euler) {
    this.editor = null;
    this.history = null;

    this.object = object;
    this.parent = parent;

    this.label = document.createElement( "label" );
    this.label.textContent = propertyLabel;

    this.container = document.createElement( "div" );

    this.inputGroupX = document.createElement( "div" );
    this.inputGroupX.classList.add(
      "input-group",
    );
    this.inputGroupY = document.createElement( "div" );
    this.inputGroupY.classList.add(
      "input-group",
    );
    this.inputGroupZ = document.createElement( "div" );
    this.inputGroupZ.classList.add(
      "input-group",
    );

    this.spanX = document.createElement( "span" );
    this.spanX.textContent = "X";
    this.spanX.classList.add(
      "input-group-text"
    );
    this.spanY = document.createElement( "span" );
    this.spanY.textContent = "Y";
    this.spanY.classList.add(
      "input-group-text"
    );
    this.spanZ = document.createElement( "span" );
    this.spanZ.textContent = "Z";
    this.spanZ.classList.add(
      "input-group-text"
    );

    this.inputNumberX = document.createElement( "input" );
    this.inputNumberX.readOnly = false;
    this.inputNumberX.id = "input-x";
    this.inputNumberX.type = "number";
    this.inputNumberX.value = `${ Number((euler.x * (180 / Math.PI)).toFixed(2))}`;
    this.inputNumberX.classList.add(
      "form-control",
    );
    this.inputNumberY = document.createElement( "input" );
    this.inputNumberY.readOnly = false;
    this.inputNumberY.id = "input-y";
    this.inputNumberY.type = "number";
    this.inputNumberY.value = `${ Number((euler.y * (180 / Math.PI)).toFixed(2))}`;
    this.inputNumberY.classList.add(
      "form-control",
    );
    this.inputNumberZ = document.createElement( "input" );
    this.inputNumberZ.readOnly = false;
    this.inputNumberZ.id = "input-z";
    this.inputNumberZ.type = "number";
    this.inputNumberZ.value = `${ Number((euler.z * (180 / Math.PI)).toFixed(2))}`;
    this.inputNumberZ.classList.add(
      "form-control",
    );

    this.inputGroupX.appendChild(this.spanX);
    this.inputGroupX.appendChild(this.inputNumberX);

    this.inputGroupY.appendChild(this.spanY);
    this.inputGroupY.appendChild(this.inputNumberY);

    this.inputGroupZ.appendChild(this.spanZ);
    this.inputGroupZ.appendChild(this.inputNumberZ);

    this.container.appendChild(this.label);
    this.container.appendChild(this.inputGroupX);
    this.container.appendChild(this.inputGroupY);
    this.container.appendChild(this.inputGroupZ);

    this.parent.appendChild(this.container);

    //

    this.setupEventListeners();
  }

  setValue( euler ) {
    this.inputNumberX.value = `${ Number((euler.x * (180 / Math.PI)).toFixed(2)) }`;
    this.inputNumberY.value = `${ Number((euler.y * (180 / Math.PI)).toFixed(2)) }`;
    this.inputNumberZ.value = `${ Number((euler.z * (180 / Math.PI)).toFixed(2)) }`;
  }

  // Change in properties, update in viewport
  setupEventListeners() {
    this.inputNumberX.addEventListener(
      "input",
      (event) => {
        const value = Number( event.target.value );

        this.object.rotation.x = (value * (Math.PI / 180));

        this.dispatchObjectChangedEvent( this.object );
      }
    )
    this.inputNumberY.addEventListener(
      "input",
      (event) => {
        const value = Number( event.target.value );

        this.object.rotation.y = (value * (Math.PI / 180));

        this.dispatchObjectChangedEvent( this.object );
      }
    )
    this.inputNumberZ.addEventListener(
      "input",
      (event) => {
        const value = Number( event.target.value );

        this.object.rotation.z = (value * (Math.PI / 180));

        this.dispatchObjectChangedEvent( this.object );
      }
    )
  }

  dispatchObjectChangedEvent( object ) {
    this.editor.eventDispatcher.dispatchEvent(new CustomEvent(
      this.editor.events.objectChanged.type,
      {
        detail: {
          object: object,
        }
      }
    ));
  }
}

class Properties {
  constructor( editor ) {
    this.editor = editor;
    this.eventDispatcher = editor.eventDispatcher;
    this.events = editor.events;

    this.history = editor.history;

    //
    
    this.container = document.createElement( "div" );
    this.container.id = "Properties";
    this.container.classList.add(
      // "h-100",
      "overflow-scroll",
      "d-flex",
      "flex-column"
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
    this.mesh = mesh;

    this.objectProperties = this.createListGroup( "Object" );
    this.objectName = new ReadOnlyProperty( this.objectProperties, "Name", this.mesh.name, "text" );
    this.objectUuid = new ReadOnlyProperty( this.objectProperties, "UUID", this.mesh.uuid, "text" );
    this.objectType = new ReadOnlyProperty( this.objectProperties, "Type", this.mesh.type, "text" );

    this.objectPosition = new Vector3Property( this.mesh, this.objectProperties, "Position", this.mesh.position, "position" );
    this.objectPosition.editor = this.editor;
    this.objectPosition.history = this.editor.history;

    this.objectRotation = new EulerProperty( this.mesh, this.objectProperties, "Rotation", this.mesh.rotation );
    this.objectRotation.editor = this.editor;
    this.objectRotation.history = this.editor.history;

    this.objectScale = new Vector3Property( this.mesh, this.objectProperties, "Scale", this.mesh.scale, "scale" );
    this.objectPosition.editor = this.editor;
    this.objectPosition.history = this.editor.history;

    this.geometryProperties = this.createListGroup( "Geometry" );
    this.geometryType = new ReadOnlyProperty( this.geometryProperties, "Type", this.mesh.geometry.type, "text");
    switch ( this.mesh.geometry.type ) {
      case "BoxGeometry":
        var params = this.mesh.geometry.parameters;

        this.boxGeometryWidth = new ValueSliderProperty( this.geometryProperties, "Width", params.width, 1, 30, 0.001 );
        this.boxGeometryHeight = new ValueSliderProperty( this.geometryProperties, "Height", params.height, 1, 30, 0.001 );
        this.boxGeometryDepth = new ValueSliderProperty( this.geometryProperties, "Depth", params.depth, 1, 30, 0.001 );
        this.boxGeometryWidthSegments = new ValueSliderProperty( this.geometryProperties, "Width Segments", params.widthSegments, 1, 10, 1 );
        this.boxGeometryHeightSegments = new ValueSliderProperty( this.geometryProperties, "Height Segments", params.heightSegments, 1, 10, 1 );
        this.boxGeometryDepthSegments = new ValueSliderProperty( this.geometryProperties, "Depth Segments", params.depthSegments, 1, 10, 1 );

        break;
      case "PlaneGeometry":
        var params = this.mesh.geometry.parameters;

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

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.eventDispatcher.addEventListener(
      this.events.objectChanged.type,
      this.onObjectChanged.bind(this)
    )
  }

  updateUI() {
    this.objectName.setValue( this.mesh.name );
    this.objectUuid.setValue( this.mesh.uuid );
    this.objectType.setValue( this.mesh.type );

    this.objectPosition.setValue( this.mesh.position );
    this.objectRotation.setValue( this.mesh.rotation );
    this.objectScale.setValue( this.mesh.scale );
    
    this.geometryType.setValue( this.mesh.geometry.type );
    switch ( this.mesh.geometry.type ) {
      case "BoxGeometry":
        const params = this.mesh.geometry.parameters;

        this.boxGeometryWidth.setValue( params.width );
        this.boxGeometryHeight.setValue( params.height);
        this.boxGeometryDepth.setValue( params.depth);
        this.boxGeometryWidthSegments.setValue( params.widthSegments);
        this.boxGeometryHeightSegments.setValue( params.heightSegments);
        this.boxGeometryDepthSegments.setValue( params.depthSegments);

        break;
      case "PlaneGeometry":
        // TODO

        break;
      case "SphereGeometry":
        // TODO

        break;
    }
  }

  onObjectChanged( event ) {
    this.mesh = event.detail.object;

    this.updateUI();
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
