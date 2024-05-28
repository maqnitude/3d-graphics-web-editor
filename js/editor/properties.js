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
    this.input.setAttribute( "id", `input-${ propertyLabel }` );
    this.input.setAttribute( "type", type );
    this.input.setAttribute( "value", `${ value }` );
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
    this.inputNumber.setAttribute( "id", `input-${ propertyLabel }` );
    this.inputNumber.setAttribute( "type", "number" );
    this.inputNumber.setAttribute( "value", `${ value }` );
    this.inputNumber.setAttribute( "min", `${ min }` );
    this.inputNumber.setAttribute( "max", `${ max }` );
    this.inputNumber.setAttribute( "step", `${ step }` );
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
    this.inputSlider.setAttribute( "id", `input-${ propertyLabel }` );
    this.inputSlider.setAttribute( "type", "range" );
    this.inputSlider.setAttribute( "value", `${ value }` );
    this.inputSlider.setAttribute( "min", `${ min }` );
    this.inputSlider.setAttribute( "max", `${ max }` );
    this.inputSlider.setAttribute( "step", `${ step }` );
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
    this.inputNumber.setAttribute( "value", `${ value }` );
    this.inputSlider.setAttribute( "value", `${ value }` );
  }

  setupEventListeners() {
    this.input.addEventListener(
      
    )
  }
}

class Vector3Property {
  constructor(editor, object, parent, propertyLabel, vector3, type) {
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
    this.inputNumberX.setAttribute( "id", "input-x" );
    this.inputNumberX.setAttribute( "type", "number" );
    this.inputNumberX.setAttribute( "value", `${ vector3.getComponent(0) }` );
    this.inputNumberX.classList.add(
      "form-control",
    );
    this.inputNumberY = document.createElement( "input" );
    this.inputNumberY.readOnly = false;
    this.inputNumberY.setAttribute( "id", "input-y" );
    this.inputNumberY.setAttribute( "type", "number" );
    this.inputNumberY.setAttribute( "value", `${ vector3.getComponent(1) }` );
    this.inputNumberY.classList.add(
      "form-control",
    );
    this.inputNumberZ = document.createElement( "input" );
    this.inputNumberZ.readOnly = false;
    this.inputNumberZ.setAttribute( "id", "input-z" );
    this.inputNumberZ.setAttribute( "type", "number" );
    this.inputNumberZ.setAttribute( "value", `${ vector3.getComponent(2) }` );
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
    this.inputNumberX.setAttribute( "value", `${ vector3.getComponent(0) }` );
    this.inputNumberY.setAttribute( "value", `${ vector3.getComponent(1) }` );
    this.inputNumberZ.setAttribute( "value", `${ vector3.getComponent(2) }` );
  } 

  setupEventListeners() {
    this.inputNumberX.addEventListener(
      "input",
      (event) => {
        const value = event.target.value;
        switch(this.type) {
          case 'position':
            this.object.position.setComponent(0, value);
            break;
          case 'scale':
            this.object.scale.setComponent(0, value);
            break;
        }
        
        this.eventDispatcher.dispatchEvent(new CustomEvent(
          this.events.objectChanged.type,
          {
            detail: {
              object: this.object,
            }
          }
        ));
      }
    )
    this.inputNumberY.addEventListener(
      "input",
      (event) => {
        const value = event.target.value;
        switch(this.type) {
          case 'position':
            this.object.position.setComponent(1, value);
            break;
          case 'scale':
            this.object.scale.setComponent(1, value);
            break;
        }

        this.eventDispatcher.dispatchEvent(new CustomEvent(
          this.events.objectChanged.type,
          {
            detail: {
              object: this.object,
            }
          }
        ));
      }
    )
    this.inputNumberZ.addEventListener(
      "input",
      (event) => {
        const value = event.target.value;
        switch(this.type) {
          case 'position':
            this.object.position.setComponent(2, value);
            break;
          case 'scale':
            this.object.scale.setComponent(2, value);
            break;
        }

        this.eventDispatcher.dispatchEvent(new CustomEvent(
          this.events.objectChanged.type,
          {
            detail: {
              object: this.object,
            }
          }
        ));
      }
    )
  }
}

class EulerProperty {
  constructor(editor, object, parent, propertyLabel, euler) {
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
    this.inputNumberX.setAttribute( "id", "input-x" );
    this.inputNumberX.setAttribute( "type", "number" );
    this.inputNumberX.setAttribute( "value", `${ Number((euler.x * (180 / Math.PI)).toFixed(2))}` );
    this.inputNumberX.classList.add(
      "form-control",
    );
    this.inputNumberY = document.createElement( "input" );
    this.inputNumberY.readOnly = false;
    this.inputNumberY.setAttribute( "id", "input-y" );
    this.inputNumberY.setAttribute( "type", "number" );
    this.inputNumberY.setAttribute( "value", `${ Number((euler.y * (180 / Math.PI)).toFixed(2))}` );
    this.inputNumberY.classList.add(
      "form-control",
    );
    this.inputNumberZ = document.createElement( "input" );
    this.inputNumberZ.readOnly = false;
    this.inputNumberZ.setAttribute( "id", "input-z" );
    this.inputNumberZ.setAttribute( "type", "number" );
    this.inputNumberZ.setAttribute( "value", `${ Number((euler.z * (180 / Math.PI)).toFixed(2))}` );
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

  setValue( euler ) {
    this.inputNumberX.setAttribute( "value", `${ Number((euler.x * (180 / Math.PI)).toFixed(2)) }` );
    this.inputNumberY.setAttribute( "value", `${ Number((euler.y * (180 / Math.PI)).toFixed(2)) }` );
    this.inputNumberZ.setAttribute( "value", `${ Number((euler.z * (180 / Math.PI)).toFixed(2)) }` );
  }

  setupEventListeners() {
    this.inputNumberX.addEventListener(
      "input",
      (event) => {
        const value = event.target.value;
        this.object.rotation.x = (value * (Math.PI / 180));

        this.eventDispatcher.dispatchEvent(new CustomEvent(
          this.events.objectChanged.type,
          {
            detail: {
              object: this.object,
            }
          }
        ));
      }
    )
    this.inputNumberY.addEventListener(
      "input",
      (event) => {
        const value = event.target.value;
        this.object.rotation.y = (value * (Math.PI / 180));

        this.eventDispatcher.dispatchEvent(new CustomEvent(
          this.events.objectChanged.type,
          {
            detail: {
              object: this.object,
            }
          }
        ));
      }
    )
    this.inputNumberZ.addEventListener(
      "input",
      (event) => {
        const value = event.target.value;
        this.object.rotation.z = (value * (Math.PI / 180));

        this.eventDispatcher.dispatchEvent(new CustomEvent(
          this.events.objectChanged.type,
          {
            detail: {
              object: this.object,
            }
          }
        ));
      }
    )
  }
}


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

    this.objectPosition = new Vector3Property( this.editor, this.mesh, this.objectProperties, "Position", this.mesh.position, "position" );
    this.objectRotation = new EulerProperty( this.editor, this.mesh, this.objectProperties, "Rotation", this.mesh.rotation );
    this.objectScale = new Vector3Property( this.editor, this.mesh, this.objectProperties, "Scale", this.mesh.scale, "scale" );

    this.geometryProperties = this.createListGroup( "Geometry" );
    this.geometryType = new ReadOnlyProperty( this.geometryProperties, "Type", this.mesh.geometry.type, "text");
    switch ( this.mesh.geometry.type ) {
      case "BoxGeometry":
        const params = this.mesh.geometry.parameters;

        this.geometryWidth = new ValueSliderProperty( this.geometryProperties, "Width", params.width, 1, 30, 0.001 );
        this.geometryHeight = new ValueSliderProperty( this.geometryProperties, "Height", params.height, 1, 30, 0.001 );
        this.geometryDepth = new ValueSliderProperty( this.geometryProperties, "Depth", params.depth, 1, 30, 0.001 );
        this.geometryWidthSegments = new ValueSliderProperty( this.geometryProperties, "Width Segments", params.widthSegments, 1, 10, 1 );
        this.geometryHeightSegments = new ValueSliderProperty( this.geometryProperties, "Height Segments", params.heightSegments, 1, 10, 1 );
        this.geometryDepthSegments = new ValueSliderProperty( this.geometryProperties, "Depth Segments", params.depthSegments, 1, 10, 1 );

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

        this.geometryWidth.setValue( params.width );
        this.geometryHeight.setValue( params.height);
        this.geometryDepth.setValue( params.depth);
        this.geometryWidthSegments.setValue( params.widthSegments);
        this.geometryHeightSegments.setValue( params.heightSegments);
        this.geometryDepthSegments.setValue( params.depthSegments);
        break;
      case "PlaneGeometry":
        // TODO

        break;
      case "SphereGeometry":
        // TODO

        break;
    }
  }

  onObjectChanged(event) {
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
