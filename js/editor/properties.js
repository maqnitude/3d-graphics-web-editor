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
      this.object[ this.properties[ 0 ] ] = value;

      this.dispatchObjectChangedEvent( this.object );
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
  constructor( editor, parent, object, propertyString, propertyLabel, color ) {
    this.editor = editor,
    this.history = editor.history,
    this.eventDispatcher = editor.eventDispatcher,
    this.events = editor.events;

    this.parent = parent;
    this.object = object;
    this.properties = propertyString.split( "." );

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
    this.inputColor.addEventListener(
      "input",
      ( event ) => {
        const colorStyle = event.target.value;
        this.inputText.value = colorStyle;

        if ( this.properties.lenght === 1 ) {
          this.object[ this.properties[ 0 ] ].setStyle( colorStyle );
        } else {
          switch ( this.properties[ 0 ] ) {
            case "material":
              const material = this.object.material;

              this.setColor( material, this.properties[ 1 ], colorStyle );

              break;
          }
        }
      }
    );
    this.inputText.addEventListener(
      "keyup",
      ( event ) => {
        const colorStyle = event.target.value;
        this.inputColor.value = colorStyle;

        if ( event.key === "Enter" ) {
          if ( this.properties.lenght === 1 ) {
            this.object[ this.properties[ 0 ] ].setStyle( colorStyle );
          } else {
            switch ( this.properties[ 0 ] ) {
              case "material":
                const material = this.object.material;

                this.setColor( material, this.properties[ 1 ],  colorStyle );

                break;
            }
          }
        }
      }
    )
  }

  setValue( color ) {
    this.inputColor.value = color.getStyle();
    this.inputText.value = color.getStyle();
  }

  setColor( material, property, colorStyle ) {
    material[ property ].setStyle( colorStyle );

    this.eventDispatcher.dispatchEvent( this.events.materialChanged );
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

  // Common methods

  setPropertyValue( property, value ) {
    property?.setValue( value );
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

export {
  Properties,
  PropertyGroup,
  ReadOnlyProperty,
  ValueSliderProperty,
  BooleanProperty,
  Vector3Property,
  EulerProperty,
  ColorProperty,
  TextureProperty,
  DropdownProperty,
};
