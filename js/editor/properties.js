import * as THREE from "three";

class ReadOnlyProperty {
  constructor( parent, propertyLabel, value, type ) {
    this.parent = parent;

    this.container = document.createElement( "div" );

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
    this.container.appendChild( this.listItem );
    this.parent.appendChild( this.container );
  }

  setValue( value ) {
    this.input.value = `${ value }`;
  }
}

class ValueSliderProperty {
  constructor( editor, parent, object, propertyString, propertyLabel, value, min, max, step ) {
    this.editor = editor;
    this.history = editor.history;
    this.eventDispatcher = editor.eventDispatcher;
    this.events = editor.events;

    this.parent = parent;
    this.object = object;
    this.properties = propertyString.split( "." );

    this.container = document.createElement( "div" );

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
    this.container.appendChild( this.listItem );
    this.parent.appendChild( this.container );

    //

    this.setupEventListeners();
  }

  setValue( value ) {
    this.inputNumber.value = `${ value }`;
    this.inputSlider.value = `${ value }`;
  }

  setupEventListeners() {
    this.inputNumber.addEventListener(
      "input",
      this.onInput.bind( this )
    );

    this.inputSlider.addEventListener(
      "input",
      this.onInput.bind( this )
    );
  }

  onInput( event ) {
    const value = Number( event.target.value );

    if ( this.properties.length === 1 ) {
      if ( this.object.isMesh ) {
        // Do nothing
      } else if ( this.object.isLight ) {
        // Do nothing
      }
    } else {
      if ( this.object.isMesh ) {
        switch ( this.properties[ 0 ] ) {
          case "geometry":
            switch ( this.properties[ 1 ] ) {
              case "parameters":
                // Change geometry parameters
                const params = this.object.geometry.parameters;
                params[ this.properties[ 2 ] ] = value;

                var newGeometry = null;
                switch ( this.object.geometry.type ) {
                  case "BoxGeometry":
                    newGeometry = new THREE.BoxGeometry(
                      params.width,
                      params.height,
                      params.depth,
                      params.widthSegments,
                      params.heightSegments,
                      params.depthSegments
                    );
                    break;
                  case "PlaneGeometry":
                    newGeometry = new THREE.PlaneGeometry(
                      params.width,
                      params.height,
                      params.widthSegments,
                      params.heightSegments
                    )
                    break;
                  case "SphereGeometry":
                    newGeometry = new THREE.SphereGeometry(
                      params.radius,
                      params.widthSegments,
                      params.heightSegments
                    )
                    break;
                }

                this.object.geometry.dispose();
                this.object.geometry = newGeometry;
                this.object.geometry.computeBoundingSphere();

                this.eventDispatcher.dispatchEvent( this.events.geometryChanged );

                break;
              default:
                break;
            }

            break;
          case "material":
            break;
          default:
            break;
        }
      }
    }
  }
}

class BooleanProperty {
  constructor( editor, parent, object, propertyString, propertyLabel, value ) {
    this.editor = editor;
    this.history = editor.history;
    this.eventDispatcher = editor.eventDispatcher;
    this.events = editor.events;

    this.parent = parent;
    this.object = object;
    this.properties = propertyString.split( "." );

    this.container = document.createElement( "div" );

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

    this.formCheck.appendChild( this.input );
    this.formCheck.appendChild( this.label );
    this.listItem.appendChild( this.formCheck );
    this.container.appendChild( this.listItem );
    this.parent.appendChild( this.container );

    //

    this.setupEventListeners();
  }

  setValue( value ) {
    this.input.checked = value;
  }

  setupEventListeners() {
    this.input.addEventListener(
      "input",
      ( event ) => {
        const checked = Boolean( event.target.checked );

        if ( this.properties.length === 1 ) {
          // Save before updating the object
          this.history.recordChange = true;
          this.history.newUndoBranch = true;

          this.dispatchObjectChangedEvent( this.object );

          this.object[ this.properties[ 0 ] ] = checked;

          this.dispatchObjectChangedEvent( this.object );
        } else {
          if ( this.object.isMesh ) {
            switch ( this.properties[ 0 ] ) {
              case "material":
                this.object.material[ this.properties[ 1 ] ] = checked;

                this.eventDispatcher.dispatchEvent( this.events.materialChanged );

                break;
            }
          }
        }
      }
    )
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

class DropdownProperty {
  constructor( editor, parent, object, property, propertyLabel, options, selectedOption ) {
    this.editor = editor;
    this.history = editor.history;
    this.eventDispatcher = editor.eventDispatcher;
    this.events = editor.events;

    this.parent = parent;
    this.object = object;
    this.property = property;

    this.container = document.createElement( "div" );

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

    this.formFloating.appendChild( this.select );
    this.formFloating.appendChild( this.label );
    this.listItem.appendChild( this.formFloating );
    this.container.appendChild( this.listItem );
    this.parent.appendChild( this.container );

    //

    this.setupEventListeners();
  }

  setupEventListeners() {
    // TODO: This needs refactoring
    this.select.addEventListener(
      "change",
      ( event ) => {
        const selectedOption = event.target.value;

        if (this.property === "material") {
          this.object.material.dispose();

          switch ( selectedOption ) {
            case "MeshBasicMaterial":
              this.object.material = new THREE.MeshBasicMaterial({ color: 0x808080 });

              break;
            case "MeshStandardMaterial":
              this.object.material = new THREE.MeshStandardMaterial({ color: 0x808080 });

              break;
            case "MeshNormalMaterial":
              this.object.material = new THREE.MeshNormalMaterial();

              break;
            case "MeshPhongMaterial":
              this.object.material = new THREE.MeshPhongMaterial({ color: 0x808080 });

              break;
          }

          this.eventDispatcher.dispatchEvent( this.events.materialChanged );
        }

        // Ensure the material updates correctly
        this.object.material.needsUpdate = true;

        this.dispatchObjectChangedEvent( this.object );
      }
    )
  }

  setValue( value ) {
    this.select.value = value;
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


class Vector3Property {
  constructor( editor, parent, object, property, propertyLabel, vector3 ) {
    this.editor = editor;
    this.history = editor.history;
    this.eventDispatcher = editor.eventDispatcher;
    this.events = editor.events;

    this.parent = parent;
    this.object = object;
    this.property = property;

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

        this.object[ this.property ].setComponent(0, value);

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

        this.object[ this.property ].setComponent(1, value);

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

        this.object[ this.property ].setComponent(2, value);

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

    // BUG: SOMETHING WRONG HERE?
    // this.dispatchObjectChangedEvent( this.object );
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
  constructor( editor, parent, object, property, propertyLabel, euler ) {
    this.editor = editor;
    this.history = editor.history;
    this.eventDispatcher = editor.eventDispatcher;
    this.events = editor.events;

    this.parent = parent;
    this.object = object;
    this.property = property;

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

class ColorProperty {
  constructor( editor, parent, object, property, propertyLabel, color ) {
    this.editor = editor,
    this.history = editor.history,
    this.eventDispatcher = editor.eventDispatcher,
    this.events = editor.events;

    this.parent = parent;
    this.object = object;
    this.property = property;

    this.label = document.createElement("label");
    this.label.textContent = propertyLabel;

    this.container = document.createElement("div");
    this.container.classList.add("input-group");

    this.inputColor = document.createElement("input");
    this.inputColor.id = "input-color";
    this.inputColor.type = "color";
    this.inputColor.value = color.getStyle();
    this.inputColor.classList.add("form-control");

    this.inputText = document.createElement("input");
    this.inputText.id = "input-text";
    this.inputText.type = "text";
    this.inputText.classList.add("form-control");

    this.container.appendChild(this.label);
    this.container.appendChild(this.inputColor);
    this.container.appendChild(this.inputText);
    this.parent.appendChild(this.container);

    //

    this.setupEventListeners();
  }

  setupEventListeners() {
    // TODO: Need to fix this
    this.inputColor.addEventListener(
      "input",
      ( event ) => {
        const color = new THREE.Color( event.target.value );
        this.inputText.value = color.getStyle();
      }
    );
    this.inputText.addEventListener(
      "input",
      ( event ) => {
        const colorHex = event.target.value;
        this.inputColor.value = colorHex;
      }
    )
  }

  setValue( color ) {
    this.inputColor.value = color.getStyle();
  }
}

class TextureProperty {
  constructor( editor, parent, object, propertyString, propertyLabel ) {
    this.editor = editor,
    this.history = editor.history,
    this.eventDispatcher = editor.eventDispatcher,
    this.events = editor.events,

    this.parent = parent,
    this.object = object,
    this.properties = propertyString.split( "." );

    this.container = document.createElement( "div" );

    this.inputFile = document.createElement( "input" );
    this.inputFile.type = "file";
    this.inputFile.accept = "image/*"; // Accept image files only
    this.inputFile.classList.add( "form-control" );

    this.label = document.createElement( "label" );
    this.label.textContent = propertyLabel;

    this.container.appendChild( this.label );
    this.container.appendChild( this.inputFile );
    this.parent.appendChild( this.container );

    //

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.inputFile.addEventListener(
      "change",
      ( event ) => {
        if ( this.properties.length === 1 ) {
          // Do nothing
        } else {
          switch ( this.properties[ 0 ] ) {
            case "material":
              const material = this.object.material;
              const file = event.target.files[ 0 ];

              if ( file ) {
                this.loadTexture( material, this.properties[ 1 ], file );
              }

              break;
            default:
              break;
          }
        }
      }
    )
  }

  loadTexture( material, property, image ) {
    if ( material[ property ] ) {
      material[ property ].dispose();
    }

    const reader = new FileReader();
    reader.onload = ( event ) => {
      const dataURL = event.target.result;

      const texture = new THREE.TextureLoader().load( dataURL, () => {
        material[ property ] = texture;

        material.needsUpdate = true;
        this.eventDispatcher.dispatchEvent( this.events.materialChanged );
      });
      texture.colorSpace = THREE.SRGBColorSpace;
    }

    reader.readAsDataURL( image );
  }

  // TODO: find a better way to deal with setting shit up in the properties
  // Keep this to prevent errors
  setValue( value ) {
    return;
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

  clear() {
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
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
    this.setupObjectProperties( this.objectProperties.container );

    this.geometryProperties = new PropertyGroup( this.container, "Geometry" );
    this.setupGeometryProperties( this.geometryProperties.container );

    this.materialProperties = new PropertyGroup( this.container, "Material" );
    this.setupMaterialProperties( this.materialProperties.container );

    this.physicsProperties = new PropertyGroup( this.container, "Physics" );

    //

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.eventDispatcher.addEventListener(
      this.events.objectChanged.type,
      this.onObjectChanged.bind( this )
    );

    this.eventDispatcher.addEventListener(
      this.events.materialChanged.type,
      this.onMaterialChanged.bind( this )
    );
  }

  setupObjectProperties( parent ) {
    const editor = this.editor;
    const object = this.mesh;

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

  setupGeometryProperties( parent ) {
    const editor = this.editor;
    const object = this.mesh;
    const geometry = object.geometry;
    const params = geometry.parameters;

    this.geometryType = new ReadOnlyProperty( parent, "Type", geometry.type, "text");

    switch ( geometry.type ) {
      case "BoxGeometry":
        this.boxGeometryWidth = new ValueSliderProperty( editor, parent, object, "geometry.parameters.width", "Width", params.width, 1, 30, 0.001 );
        this.boxGeometryHeight = new ValueSliderProperty( editor, parent, object, "geometry.parameters.height", "Height", params.height, 1, 30, 0.001 );
        this.boxGeometryDepth = new ValueSliderProperty( editor, parent, object, "geometry.parameters.depth", "Depth", params.depth, 1, 30, 0.001 );
        this.boxGeometryWidthSegments = new ValueSliderProperty( editor, parent, object, "geometry.parameters.widthSegments", "Width Segments", params.widthSegments, 1, 10, 1 );
        this.boxGeometryHeightSegments = new ValueSliderProperty( editor, parent, object, "geometry.parameters.heightSegments", "Height Segments", params.heightSegments, 1, 10, 1 );
        this.boxGeometryDepthSegments = new ValueSliderProperty( editor, parent, object, "geometry.parameters.depthSegments", "Depth Segments", params.depthSegments, 1, 10, 1 );

        break;
      case "PlaneGeometry":
        this.planeGeometryWidth = new ValueSliderProperty( editor, parent, object, "geometry.parameters.width", "Width", params.width, 1, 30, 0.001 );
        this.planeGeometryHeight = new ValueSliderProperty( editor, parent, object, "geometry.parameters.height", "Height", params.height, 1, 30, 0.001 );
        this.planeGeometryWidthSegments = new ValueSliderProperty( editor, parent, object, "geometry.parameters.widthSegments", "Width Segments", params.widthSegments, 1, 30, 1 );
        this.planeGeometryHeightSegments = new ValueSliderProperty( editor, parent, object, "geometry.parameters.heightSegments", "Height Segments", params.heightSegments, 1, 30, 1 );

        break;
      case "SphereGeometry":
        this.sphereGeometryRadius = new ValueSliderProperty( editor, parent, object, "geometry.parameters.radius", "Radius", params.radius, 1, 30, 0.001 );
        this.sphereGeometryWidthSegments = new ValueSliderProperty( editor, parent, object, "geometry.parameters.widthSegments", "Width Segments", params.widthSegments, 1, 64, 1 );
        this.sphereGeometryHeightSegments = new ValueSliderProperty( editor, parent, object, "geometry.parameters.heightSegments", "Height Segments", params.heightSegments, 1, 32, 1 );

        break;
    }
  }

  setupMaterialProperties( parent ) {
    const editor = this.editor;
    const object = this.mesh;
    const material = object.material;

    this.materialTypes = new DropdownProperty( editor, parent, object, "material", "Type",
      [
        "MeshBasicMaterial",
        "MeshNormalMaterial",
        "MeshPhongMaterial",
        "MeshStandardMaterial",
      ],
      material.type);

    this.materialTransparent = new BooleanProperty( editor, parent, object, "material.transparent", "Transparent", material.transparent );
    this.materialOpacity = new ValueSliderProperty( editor, parent, object, "material.opacity", "Opacity", material.opacity, 0, 1, 0.01 );
    this.materialDepthTest = new BooleanProperty( editor, parent, object, "material.depthTest", "Depth Test", material.depthTest );
    this.materialDepthWrite = new BooleanProperty( editor, parent, object, "material.depthWrite", "Depth Write", material.depthWrite );
    this.materialAlphaTest = new ValueSliderProperty( editor, parent, object, "material.alphaTest", "Alpha Test", material.alphaTest, 0, 1, 0.01 );
    this.materialAlphaHash = new BooleanProperty( editor, parent, object, "material.alphaHash", "Alpha Hash", material.alphaHash );
    this.materialVisible = new BooleanProperty( editor, parent, object, "material.visible", "Visible", material.visible );

    switch ( material.type ) {
      case "MeshBasicMaterial":
        this.basicMaterialColor = new ColorProperty( editor, parent, object, "material.color", "Color", material.color );
        this.basicMaterialWireframe = new BooleanProperty( editor, parent, object, "material.wireframe", "Wireframe", material.wireframe );
        this.basicMaterialVertexColors = new BooleanProperty( editor, parent, object, "material.vertexColors", "Vertex Colors", material.vertexColors );
        this.basicMaterialEnvMap = new TextureProperty( editor, parent, object, "material.envMap", "Environment Map", material.envMap );
        this.basicMaterialMap = new TextureProperty( editor, parent, object, "material.map", "Color Map", material.map );
        this.basicMaterialAlphaMap = new TextureProperty( editor, parent, object, "material.alphaMap", "Alpha Map", material.alphaMap );
        this.basicMaterialCombine = new DropdownProperty( editor, parent, object, "material.combine", "Combine",
          [
            THREE.MultiplyOperation,
            THREE.MixOperation,
            THREE.AddOperation
          ], material.combine);
        this.basicMaterialReflectivity = new ValueSliderProperty( editor, parent, object, "material.reflectivity", "Reflectivity", material.reflectivity, 0, 1, 0.001 );
        this.basicMaterialRefactionRatio = new ValueSliderProperty( editor, parent, object, "material.refractionRatio", "Refraction Ratio", material.refractionRatio, 0, 1, 0.001 );

        break;
      case "MeshNormalMaterial":
        this.normalMaterialFlatShading = new BooleanProperty( editor, parent, object, "material.flatShading", "Flat Shading", material.flatShading );
        this.normalMaterialWireframe = new BooleanProperty( editor, parent, object, "material.wireframe", "Wireframe", material.wireframe );

        break;
      case "MeshPhongMaterial":
        this.phongMaterialColor = new ColorProperty( editor, parent, object, "material.color", "Color", material.color );
        this.phongMaterialEmissive = new ColorProperty( editor, parent, object, "material.emissive", "Emissive", material.emissive );
        this.phongMaterialSpecular = new ColorProperty( editor, parent, object, "material.specular", "Specular", material.specular );
        this.phongMaterialShininess = new ValueSliderProperty( editor, parent, object, "material.shininess", "Shininess", material.shininess, 0, 100, 0.1 );
        this.phongMaterialFlatShading = new BooleanProperty( editor, parent, object, "material.flatShading", "Flat Shading", material.flatShading );
        this.phongMaterialWireframe = new BooleanProperty ( editor, parent, object, "material.wireframe", "Wireframe", material.wireframe );
        this.phongMaterialVertexColors = new BooleanProperty( editor, parent, object, "material.vertexColors", "Vertex Colors", material.vertexColors );
        this.phongMaterialEnvMap = new TextureProperty( editor, parent, object, "material.envMap", "Environment Map", material.envMap );
        this.phongMaterialMap = new TextureProperty( editor, parent, object, "material.map", "Color Map", material.map );
        this.phongMaterialAlphaMap = new TextureProperty( editor, parent, object, "material.alphaMap", "Alpha Map", material.alphaMap );
        this.phongMaterialCombine = new DropdownProperty( editor, parent, object, "material.combine", "Combine",
          [
            THREE.MultiplyOperation,
            THREE.MixOperation,
            THREE.AddOperation
          ], material.combine);
        this.phongMaterialReflectivity = new ValueSliderProperty( editor, parent, object, "material.reflectivity", "Reflectivity", material.reflectivity, 0, 1, 0.001 );
        this.phongMaterialRefractionRatio = new ValueSliderProperty( editor, parent, object, "material.refractionRatio", "Refraction Ratio", material.refractionRatio, 0, 1, 0.001 );

        break;
      case "MeshStandardMaterial":
        this.standardMaterialColor = new ColorProperty( editor, parent, object, "material.color", "Color", material.color );
        this.standardMaterialEmissive = new ColorProperty( editor, parent, object, "material.emissive", "Emissive", material.emissive );
        this.standardMaterialRoughness = new ValueSliderProperty( editor, parent, object, "material.roughness", "Roughness", material.roughness, 0, 1, 0.001 );
        this.standardMaterialMetalness = new ValueSliderProperty( editor, parent, object, "material.metalness", "Metalness", material.metalness, 0, 1, 0.001 );
        this.standardMaterialFlatShading = new BooleanProperty( editor, parent, object, "material.flatShading", "Flat Shading", material.flatShading );
        this.standardMaterialWireframe = new BooleanProperty ( editor, parent, object, "material.wireframe", "Wireframe", material.wireframe );
        this.standardMaterialVertexColors = new BooleanProperty( editor, parent, object, "material.vertexColors", "Vertex Colors", material.vertexColors );
        this.standardMaterialEnvMap = new TextureProperty( editor, parent, object, "material.envMap", "Environment Map", material.envMap );
        this.standardMaterialMap = new TextureProperty( editor, parent, object, "material.map", "Color Map", material.map );
        this.standardMaterialRoughnessMap = new TextureProperty( editor, parent, object, "material.roughnessMap", "Roughness Map", material.roughnessMap );
        this.standardMaterialAlphaMap = new TextureProperty( editor, parent, object, "material.alphaMap", "Alpha Map", material.alphaMap );
        this.standardMaterialMetalnessMap = new TextureProperty( editor, parent, object, "material.metalnessMap", "Metalness Map", material.metalnessMap );

        break;
    }
  }

  updateUI() {
    const objectProps = this.getObjectProperties();
    for ( const prop in objectProps ) {
      if ( this.mesh.hasOwnProperty( prop ) ) {
        this.setPropertyValue( objectProps[ prop ], this.mesh[ prop ] );
      }
    }

    const geometry = this.mesh.geometry;
    const params = geometry.parameters;
    this.setPropertyValue( this.geometryType, geometry.type );

    const geometryProps = this.getGeometryProperties( geometry.type );
    if ( geometryProps ) {
      for ( const prop in geometryProps ) {
        if ( params.hasOwnProperty( prop ) ) {
          this.setPropertyValue( geometryProps[ prop ], params[ prop ] );
        }
      }
    }

    const material = this.mesh.material;
    this.setPropertyValue( this.materialTypes, material.type );
    this.setPropertyValue( this.materialTransparent, material.transparent );
    this.setPropertyValue( this.materialOpacity, material.opacity );
    this.setPropertyValue( this.materialDepthTest, material.depthTest );
    this.setPropertyValue( this.materialDepthWrite, material.depthWrite );
    this.setPropertyValue( this.materialAlphaTest, material.alphaTest );
    this.setPropertyValue( this.materialAlphaHash, material.alphaHas );
    this.setPropertyValue( this.materialVisible, material.visible );

    const materialProps = this.getMaterialProperties( material.type );
    if ( materialProps ) {
      for ( const prop in materialProps ) {
        if ( material.hasOwnProperty( prop ) ) {
          this.setPropertyValue( materialProps[ prop ], material[ prop ] );
        }
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

  getGeometryProperties( geometryType = null ) {
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

    if ( !geometryType ) {
      return geometryPropertiesMap;
    }

    return geometryPropertiesMap[ geometryType ];
  }

  getMaterialProperties( materialType = null ) {
    const materialPropertiesMap = {
      MeshBasicMaterial: {
        color: this.basicMaterialColor,
        wireframe: this.basicMaterialWireframe,
        vertexColors: this.basicMaterialVertexColors,
        envMap: this.basicMaterialEnvMap,
        map: this.basicMaterialMap,
        alphaMap: this.basicMaterialAlphaMap,
        combine: this.basicMaterialCombine,
        reflectivity: this.basicMaterialReflectivity,
        refractionRatio: this.basicMaterialRefactionRatio,
      },
      MeshNormalMaterial: {
        flatShading: this.normalMaterialFlatShading,
        wireframe: this.normalMaterialWireframe,
      },
      MeshPhongMaterial: {
        color: this.phongMaterialColor,
        emissive: this.phongMaterialEmissive,
        specular: this.phongMaterialSpecular,
        shininess: this.phongMaterialShininess,
        flatShading: this.phongMaterialFlatShading,
        wireframe: this.phongMaterialWireframe,
        vertexColors: this.phongMaterialVertexColors,
        envMap: this.phongMaterialEnvMap,
        map: this.phongMaterialMap,
        alphaMap: this.phongMaterialAlphaMap,
        combine: this.phongMaterialCombine,
        reflectivity: this.phongMaterialReflectivity,
        refractionRatio: this.phongMaterialRefractionRatio,
      },
      MeshStandardMaterial: {
        color: this.standardMaterialColor,
        emissive: this.standardMaterialEmissive,
        roughness: this.standardMaterialRoughness,
        metalness: this.standardMaterialMetalness,
        flatShading: this.standardMaterialFlatShading,
        wireframe: this.standardMaterialWireframe,
        vertexColors: this.standardMaterialVertexColors,
        envMap: this.standardMaterialEnvMap,
        map: this.standardMaterialMap,
        roughnessMap: this.standardMaterialRoughnessMap,
        alphaMap: this.standardMaterialAlphaMap,
        metalnessMap: this.standardMaterialMetalnessMap,
      },
    };

    if ( !materialType ) {
      return materialPropertiesMap;
    }

    return materialPropertiesMap[ materialType ];
  }

  setPropertyValue( property, value ) {
    property?.setValue( value );
  }

  // Event handlers

  onObjectChanged( event ) {
    const object = event.detail.object;

    if ( object.isMesh ) {
      this.mesh = object;
      this.updateUI();
    }
  }

  onMaterialChanged( event ) {
    this.materialProperties.clear();
    this.setupMaterialProperties( this.materialProperties.container );
  }
}

class LightProperties extends Properties {
  constructor( editor, light ) {
    super( editor );
    this.light = light;

    this.objectProperties = new PropertyGroup( this.container, "Object" );
    this.setupObjectProperties( this.objectProperties.container );

    this.lightProperties = new PropertyGroup( this.container, "Light" );
    this.setupLightProperties( this.lightProperties.container );
  }

  setupEventListeners() {
    this.eventDispatcher.addEventListener(
      this.events.objectChanged.type,
      this.onObjectChanged.bind( this )
    )
  }

  setupObjectProperties( parent ) {
    const editor = this.editor;
    const object = this.light;

    this.objectName = new ReadOnlyProperty( parent, "Name", object.name, "text" );
    this.objectUuid = new ReadOnlyProperty( parent, "UUID", object.uuid, "text" );
    this.objectType = new ReadOnlyProperty( parent, "Type", object.type, "text" );
    this.objectPosition = new Vector3Property( editor, parent, object, "position", "Position", object.position );
    this.objectVisible = new BooleanProperty( editor, parent, object, "visible", "Visible", object.visible );
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
    }
  }

  updateUI() {
    const objectProps = this.getObjectProperties();
    for ( const prop in objectProps ) {
      if ( this.light.hasOwnProperty( prop ) ) {
        this.setPropertyValue( objectProps[ prop ], this.light[ prop ] );
      }
    }

    this.setPropertyValue( this.lightColor, this.light.color );
    this.setPropertyValue( this.lightIntesity, this.light.intensity );

    const lightProps = this.getLightProperties( this.light.type );
    for ( const prop in lightProps ) {
      if ( this.light.hasOwnProperty( prop ) ) {
        this.setPropertyValue( lightProps[ prop ], this.light[ prop ] );
      }
    }
  }

  getObjectProperties() {
    const objectPropertiesMap = {
      name: this.objectName,
      uuid: this.objectUuid,
      type: this.objectType,
      position: this.objectPosition,
      visible: this.objectVisible,
    }
    return objectPropertiesMap;
  }

  getLightProperties( type ) {
    const lightProperties = {
      DirectionalLight: {
        castShadow: this.directionalLightCastShadow,
      }
    }
    return lightProperties[ type ];
  }

  setPropertyValue( property, value ) {
    property.setValue( value );
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

export { Properties, MeshProperties, LightProperties };
