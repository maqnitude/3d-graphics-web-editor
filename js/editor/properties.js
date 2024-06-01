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
  constructor( editor, parent, propertyLabel, value, min, max, step ) {
    this.editor = editor;
    this.history = editor.history;

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

class BooleanProperty {
  constructor( editor, parent, propertyLabel, value ) {
    this.editor = editor;
    this.history = editor.history;

    this.parent = parent;

    this.listItem = document.createElement("div");
    this.listItem.classList.add(
      "list-group-item",
      "p-1"
    );

    this.formCheck = document.createElement("div")
    this.formCheck.classList.add(
      "form-check",
      "m-2"
    );

    this.input = document.createElement( "input" );
    this.input.readOnly = false;
    this.input.id = `input-${ propertyLabel }`;
    this.input.type = "checkbox";
    this.input.checked = value;
    this.input.classList.add(
      "form-check-input"
    );

    this.label = document.createElement("label");
    this.label.setAttribute("for", this.input.getAttribute( "id" ))
    this.label.textContent = propertyLabel;
    this.label.classList.add(
      "form-check-label"
    );

    this.formCheck.appendChild(this.input);
    this.formCheck.appendChild(this.label);
    this.listItem.appendChild(this.formCheck);
    this.parent.appendChild(this.listItem);
  }

  setValue( value ) {
    this.input.checked = value;
  }
}

class DropdownProperty {
  constructor( editor, parent, propertyLabel, options, selectedOption ) {
    this.editor = editor;
    this.history = editor.history;

    this.parent = parent;

    this.listItem = document.createElement("div");
    this.listItem.classList.add(
      "list-group-item",
      "p-0"
    );

    this.formFloating = document.createElement("div");
    this.formFloating.classList.add(
      "form-floating"
    );

    this.select = document.createElement("select");
    this.select.id = `select-${propertyLabel}`;
    this.select.classList.add(
      "form-select"
    );

    options.forEach(option => {
      let optionElement = document.createElement("option");
      optionElement.value = option;
      optionElement.text = option;
      if (option === selectedOption) {
        optionElement.selected = true;
      }
      this.select.appendChild(optionElement);
    });

    this.label = document.createElement("label");
    this.label.setAttribute("for", this.select.getAttribute("id"));
    this.label.textContent = propertyLabel;

    this.formFloating.appendChild(this.select);
    this.formFloating.appendChild(this.label);
    this.listItem.appendChild(this.formFloating);
    this.parent.appendChild(this.listItem);
  }

  setValue(value) {
    this.select.value = value;
  }
}


class Vector3Property {
  constructor( editor, parent, object, propertyLabel, vector3, type ) {
    this.editor = editor;
    this.history = editor.history;
    this.eventDispatcher = editor.eventDispatcher;
    this.events = editor.events;

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
      this.onFocus.bind( this )
    )
    this.inputNumberX.addEventListener(
      "blur",
      this.onBlur.bind( this )
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
    this.inputNumberY.addEventListener(
      "focus",
      this.onFocus.bind( this )
    )
    this.inputNumberY.addEventListener(
      "blur",
      this.onBlur.bind( this )
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
    this.inputNumberZ.addEventListener(
      "focus",
      this.onFocus.bind( this )
    )
    this.inputNumberZ.addEventListener(
      "blur",
      this.onBlur.bind( this )
    )
  }

  // Event handlers
  
  onFocus() {
    this.history.recordChange = true;
    this.history.newUndoBranch = true;

    this.dispatchObjectChangedEvent( this.object );
  }

  onBlur() {
    this.history.recordChange = false;
  }

  // Dispatch custome events

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
}

class EulerProperty {
  constructor( editor, parent, object, propertyLabel, euler ) {
    this.editor = editor;
    this.history = editor.history;
    this.eventDispatcher = editor.eventDispatcher;
    this.events = editor.events;

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
    this.inputNumberX.addEventListener(
      "focus",
      this.onFocus.bind( this )
    )
    this.inputNumberX.addEventListener(
      "blur",
      this.onBlur.bind( this )
    )

    this.inputNumberY.addEventListener(
      "input",
      (event) => {
        const value = Number( event.target.value );

        this.object.rotation.y = (value * (Math.PI / 180));

        this.dispatchObjectChangedEvent( this.object );
      }
    )
    this.inputNumberY.addEventListener(
      "focus",
      this.onFocus.bind( this )
    )
    this.inputNumberY.addEventListener(
      "blur",
      this.onBlur.bind( this )
    )

    this.inputNumberZ.addEventListener(
      "input",
      (event) => {
        const value = Number( event.target.value );

        this.object.rotation.z = (value * (Math.PI / 180));

        this.dispatchObjectChangedEvent( this.object );
      }
    )
    this.inputNumberZ.addEventListener(
      "focus",
      this.onFocus.bind( this )
    )
    this.inputNumberZ.addEventListener(
      "blur",
      this.onBlur.bind( this )
    )
  }

  // Event handlers

  onFocus() {
    this.history.recordChange = true;
    this.history.newUndoBranch = true;

    this.dispatchObjectChangedEvent( this.object );
  }

  onBlur() {
    this.history.recordChange = false;
  }

  // Dispatch custom events

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
}

class PropertyGroup {
  constructor( parent, title ) {
    this.parent = parent;

    this.container = document.createElement( "div" )
    this.container.classList.add(
      "list-group"
    );

    this.header = document.createElement( "h5" );
    this.header.classList.add(
      "list-group-item",
      "list-group-item-primary",
    );
    this.header.textContent = title;

    this.container.appendChild( this.header );

    this.parent.appendChild( this.container );
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

    this.objectProperties = new PropertyGroup( this.container, "Object" );
    this.objectName = new ReadOnlyProperty( this.objectProperties.container, "Name", this.mesh.name, "text" );
    this.objectUuid = new ReadOnlyProperty( this.objectProperties.container, "UUID", this.mesh.uuid, "text" );
    this.objectType = new ReadOnlyProperty( this.objectProperties.container, "Type", this.mesh.type, "text" );

    this.objectPosition = new Vector3Property( this.editor, this.objectProperties.container, this.mesh, "Position", this.mesh.position, "position" );
    this.objectRotation = new EulerProperty( this.editor, this.objectProperties.container, this.mesh, "Rotation", this.mesh.rotation );
    this.objectScale = new Vector3Property( this.editor, this.objectProperties.container, this.mesh, "Scale", this.mesh.scale, "scale" );

    this.objectVisible = new BooleanProperty( this.editor, this.objectProperties.container, "Visible", true );

    this.geometryProperties = new PropertyGroup( this.container, "Geometry" );
    this.geometryType = new ReadOnlyProperty( this.geometryProperties.container, "Type", this.mesh.geometry.type, "text");
    this.geometryParameters = this.mesh.geometry.parameters;
    this.setupGeometryProperties( this.geometryProperties.container, this.geometryType, this.geometryParameters );

    this.materialProperties = new PropertyGroup( this.container, "Material" );

    // test dropdown property
    console.log(this.mesh.material.type);
    this.materialType = new DropdownProperty( this.editor, this.materialProperties.container, "Type",
      ["MeshPhongMaterial", "MeshStandardMaterial", "MeshBasicMaterial", "MeshNormalMaterial"],
      this.mesh.material.type);

    this.textureProperties = new PropertyGroup( this.container, "Texture" );

    this.physicsProperties = new PropertyGroup( this.container, "Physics" );

    //

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.eventDispatcher.addEventListener(
      this.events.objectChanged.type,
      this.onObjectChanged.bind(this)
    )
  }

  setupGeometryProperties( parent, type, params ) {
    switch ( type ) {
      case "BoxGeometry":
        this.boxGeometryWidth = new ValueSliderProperty( this.editor, parent, "Width", params.width, 1, 30, 0.001 );
        this.boxGeometryHeight = new ValueSliderProperty( this.editor, parent, "Height", params.height, 1, 30, 0.001 );
        this.boxGeometryDepth = new ValueSliderProperty( this.editor, parent, "Depth", params.depth, 1, 30, 0.001 );
        this.boxGeometryWidthSegments = new ValueSliderProperty( this.editor, parent, "Width Segments", params.widthSegments, 1, 10, 1 );
        this.boxGeometryHeightSegments = new ValueSliderProperty( this.editor, parent, "Height Segments", params.heightSegments, 1, 10, 1 );
        this.boxGeometryDepthSegments = new ValueSliderProperty( this.editor, parent, "Depth Segments", params.depthSegments, 1, 10, 1 );

        break;
      case "PlaneGeometry":
        this.planeGeometryWidth = new ValueSliderProperty( this.editor, parent, "Width", params.width, 1, 30, 0.001 );
        this.planeGeometryHeight = new ValueSliderProperty( this.editor, parent, "Height", params.height, 1, 30, 0.001 );
        this.planeGeometryWidthSegments = new ValueSliderProperty( this.editor, parent, "Width Segments", params.widthSegments, 1, 30, 1 );
        this.planeGeometryHeightSegments = new ValueSliderProperty( this.editor, parent, "Height Segments", params.heightSegments, 1, 30, 1 );

        break;
      case "SphereGeometry":
        this.sphereGeometryRadius = new ValueSliderProperty( this.editor, parent, "Radius", params.radius, 1, 30, 0.001 );
        this.sphereGeometryWidthSegments = new ValueSliderProperty( this.editor, parent, "Width Segments", params.widthSegments, 1, 64, 1 );
        this.sphereGeometryHeightSegments = new ValueSliderProperty( this.editor, parent, "Height Segments", params.heightSegments, 1, 32, 1 );

        break;
    }
  }

  updateUI() {
    this.setPropertyValue( this.objectName, this.mesh.name );
    this.setPropertyValue( this.objectUuid, this.mesh.uuid );
    this.setPropertyValue( this.objectType, this.mesh.type );
    this.setPropertyValue( this.objectPosition, this.mesh.position );
    this.setPropertyValue( this.objectRotation, this.mesh.rotation );
    this.setPropertyValue( this.objectScale, this.mesh.scale );

    this.setPropertyValue( this.geometryType, this.mesh.geometry.type );
    
    const geometryProps = this.getGeometryProperties( this.geometryType );
    if ( geometryProps ) {
      for ( const prop in geometryProps ) {
        if ( this.geometryParameters.hasOwnProperty( prop ) ) {
          this.setPropertyValue( geometryProps[ prop ], this.geometryParameters[ prop ] );
        }
      }
    }
  }

  // Helpers

  setPropertyValue( property, value ) {
    property.setValue( value );
  }

  getGeometryProperties(geometryType) {
    const geometryPropertiesMap = {
      BoxGeometry: {
        width: this.boxGeometryWidth,
        height: this.boxGeometryHeight,
        depth: this.boxGeometryDepth,
        widthSegments: this.boxGeometryWidthSegments,
        heightSegments: this.boxGeometryHeightSegments,
        depthSegments: this.boxGeometryDepthSegments,
      },
      PlaneGeometry: {
        width: this.planeGeometryWidth,
        height: this.planeGeometryHeight,
        widthSegments: this.planeGeometryWidthSegments,
        heightSegments: this.planeGeometryHeightSegments,
      },
      SphereGeometry: {
        radius: this.sphereGeometryRadius,
        widthSegments: this.sphereGeometryWidthSegments,
        heightSegments: this.sphereGeometryHeightSegments,
      },
      // Add other geometry types as needed
    };

    return geometryPropertiesMap[geometryType];
  }

  // Event handlers

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
