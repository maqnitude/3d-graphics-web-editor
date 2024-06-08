import * as THREE from "three";

import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

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
    this.eventManager = editor.eventManager;
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

    this.inputGroup.appendChild( this.span );
    this.inputGroup.appendChild( this.inputSlider );
    this.inputGroup.appendChild( this.inputNumber );
    this.listItem.appendChild( this.inputGroup );
    this.container.appendChild( this.listItem );
    this.parent.appendChild( this.container );

    //

    this.setupEvents();
  }

  setValue( value ) {
    this.inputNumber.value = `${ value }`;
    this.inputSlider.value = `${ value }`;
  }

  setupEvents() {
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

    this.inputNumber.value = value;
    this.inputSlider.value = value;

    if ( this.properties.length === 1 ) {
      this.object[ this.properties[ 0 ] ] = value;

      this.eventManager.dispatch( this.events.objectChanged, { object: this.object } );
    } else {
      if ( this.object.isScene ) {
        const scene = this.object;

        scene[ this.properties[ 0 ] ] = value;

        this.eventManager.dispatch( this.events.objectChanged, { object: scene } );
      } else if ( this.object.isMesh ) {
        const mesh = this.object;

        switch ( this.properties[ 0 ] ) {
          case "geometry":
            switch ( this.properties[ 1 ] ) {
              case "parameters":
                // Change geometry parameters
                const params = mesh.geometry.parameters;
                params[ this.properties[ 2 ] ] = value;

                var newGeometry = null;
                switch ( mesh.geometry.type ) {
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
                  case "CapsuleGeometry":
                    newGeometry = new THREE.CapsuleGeometry(
                      params.radius,
                      params.length,
                      params.capSegments,
                      params.radialSegments,
                    )
                    break;
                  case "ConeGeometry":
                    newGeometry = new THREE.ConeGeometry(
                      params.radius,
                      params.height,
                      params.radialSegments,
                      params.heightSegments,
                      params.openEnded,
                    )
                    break;
                  case "CircleGeometry":
                    newGeometry = new THREE.CircleGeometry(
                      params.radius,
                      params.segments,
                    )
                    break;
                  case "CylinderGeometry":
                    newGeometry = new THREE.CylinderGeometry(
                      params.radiusBottom,
                      params.radiusTop,
                      params.height,
                      params.radialSegments,
                      params.heightSegments,
                      params.openEnded,
                    )
                    break;
                  case "RingGeometry":
                    newGeometry = new THREE.RingGeometry(
                      params.innerRadius,
                      params.outerRadius,
                      params.thetaSegments,
                      params.phiSegments,
                    )
                    break;
                  case "TorusGeometry":
                    newGeometry = new THREE.TorusGeometry(
                      params.radius,
                      params.tube,
                      params.radialSegments,
                      params.tubularSegments,
                    )
                    break;
                  case "TorusKnotGeometry":
                    newGeometry = new THREE.TorusKnotGeometry(
                      params.radius,
                      params.tube,
                      params.tubularSegments,
                      params.radialSegments,
                      params.p,
                      params.q,
                    )
                    break;
                  case "DodecahedronGeometry":
                    newGeometry = new THREE.DodecahedronGeometry(
                      params.radius,
                      params.detail,
                    )
                    break;
                  case "ExtrudeGeometry":
                    newGeometry = new THREE.ExtrudeGeometry(
                      params.steps,
                      params.depth,
                      params.bevelThickness,
                      params.bevelSize,
                      params.bevelOffset,
                      params.bevelSegments,
                    )
                    break;
                  case "IcosahedronGeometry":
                    newGeometry =  new THREE.IcosahedronGeometry(
                      params.radius,
                      params.detail,
                    )
                    break;
                  case "LatheGeometry":
                    newGeometry = new THREE.LatheGeometry(
                      params.points,
                      params.segments,
                    )
                    break;
                  case "OctahedronGeometry":
                    newGeometry = new THREE.OctahedronGeometry(
                      params.radius,
                      params.detail,
                    )
                    break;
                  case "TetrahedronGeometry":
                    newGeometry = new THREE.TetrahedronGeometry(
                      params.radius,
                      params.detail,
                    )
                    break;
                  case "TubeGeometry":
                    newGeometry = new THREE.TubeGeometry(
                      params.path,
                      params.segments,
                      params.radius,
                      params.radialSegments,
                    )
                    break;
                }

                mesh.geometry.dispose();
                mesh.geometry = newGeometry;
                mesh.geometry.computeBoundingSphere();

                this.eventManager.dispatch( this.events.geometryChanged, { object: mesh } );

                break;
              default:
                break;
            }

            break;
          case "material":
            const material = this.object.material;

            material[ this.properties[ 1 ] ] = value;

            material.needsUpdate = true;
            this.eventManager.dispatch( this.events.objectChanged, { object: this.object } );

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
    this.eventManager = editor.eventManager;
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

    this.setupEvents();
  }

  setValue( value ) {
    this.input.checked = value;
  }

  setupEvents() {
    this.input.addEventListener(
      "input",
      ( event ) => {
        const checked = Boolean( event.target.checked );

        if ( this.properties.length === 1 ) {
          // Save before updating the object
          this.history.recordChange = true;
          this.history.newUndoBranch = true;

          this.eventManager.dispatch( this.events.objectChanged, { object: this.object } );

          this.object[ this.properties[ 0 ] ] = checked;

          this.eventManager.dispatch( this.events.objectChanged, { object: this.object } );
        } else {
          if ( this.object.isMesh ) {
            switch ( this.properties[ 0 ] ) {
              case "material":
                const material = this.object.material;

                material[ this.properties[ 1 ] ] = checked;
                material.needsUpdate = true;

                this.eventManager.dispatch( this.events.materialChanged, { object: this.object } );

                break;
            }
          }
        }
      }
    );
  }
}

class DropdownProperty {
  constructor( editor, parent, object, property, propertyLabel, options, selectedOption ) {
    this.editor = editor;
    this.history = editor.history;
    this.eventManager = editor.eventManager;
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

    for (const key in options) {
      let optionElement = document.createElement("option");
      const option = options[key];
      optionElement.value = option;
      optionElement.text = key;

      if (option === selectedOption) {
        optionElement.selected = true;
      }

      this.select.appendChild(optionElement);
    };

    this.label = document.createElement("label");
    this.label.setAttribute("for", this.select.getAttribute("id"));
    this.label.textContent = propertyLabel;

    this.formFloating.appendChild( this.select );
    this.formFloating.appendChild( this.label );
    this.listItem.appendChild( this.formFloating );
    this.container.appendChild( this.listItem );
    this.parent.appendChild( this.container );

    //

    this.setupEvents();
  }

  setupEvents() {
    // TODO: This needs refactoring
    this.select.addEventListener(
      "change",
      ( event ) => {
        const selectedOption = event.target.value;

        switch ( this.property ) {
          case "material":
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
              case "MeshDepthMaterial":
                this.object.material = new THREE.MeshDepthMaterial({ color: 0x808080 });

                break;
              case "MeshLambertMaterial":
                this.object.material = new THREE.MeshLambertMaterial({ color: 0x808080 });

                break;
              case "MeshMatcapMaterial":
                this.object.material = new THREE.MeshMatcapMaterial({ color: 0x808080 });

                break;
              case "MeshPhysicalMaterial":
                this.object.material = new THREE.MeshPhysicalMaterial({ color: 0x808080 });

                break;
              case "MeshToonMaterial":
                this.object.material = new THREE.MeshToonMaterial({ color: 0x808080 });

                break;
            }

            this.object.material.needsUpdate = true;
            this.eventManager.dispatch( this.events.materialSelected );

            break;
        }
      }
    );
  }

  setValue( value ) {
    this.select.value = value;
  }
}


class Vector3Property {
  constructor( editor, parent, object, property, propertyLabel, vector3 ) {
    this.editor = editor;
    this.history = editor.history;
    this.eventManager = editor.eventManager;
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

    this.setupEvents();
  }

  setValue( vector3 ) {
    this.inputNumberX.value = `${ vector3.getComponent(0) }`;
    this.inputNumberY.value = `${ vector3.getComponent(1) }`;
    this.inputNumberZ.value = `${ vector3.getComponent(2) }`;
  }

  // Change in properties, update in viewport
  setupEvents() {
    this.inputNumberX.addEventListener(
      "input",
      ( event ) => {
        const value = Number( event.target.value );

        this.object[ this.property ].setComponent(0, value);

        this.eventManager.dispatch( this.events.objectChanged, { object: this.object } );
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

        this.eventManager.dispatch( this.events.objectChanged, { object: this.object } );
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

        this.eventManager.dispatch( this.events.objectChanged, { object: this.object } );

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

    this.eventManager.dispatch( this.events.objectChanged, { object: this.object } );
  }

  onBlur() {
    this.history.recordChange = false;
  }
}

class EulerProperty {
  constructor( editor, parent, object, property, propertyLabel, euler ) {
    this.editor = editor;
    this.history = editor.history;
    this.eventManager = editor.eventManager;
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

    this.setupEvents();
  }

  setValue( euler ) {
    this.inputNumberX.value = `${ Number((euler.x * (180 / Math.PI)).toFixed(2)) }`;
    this.inputNumberY.value = `${ Number((euler.y * (180 / Math.PI)).toFixed(2)) }`;
    this.inputNumberZ.value = `${ Number((euler.z * (180 / Math.PI)).toFixed(2)) }`;
  }

  // Change in properties, update in viewport
  setupEvents() {
    this.inputNumberX.addEventListener(
      "input",
      (event) => {
        const value = Number( event.target.value );

        this.object.rotation.x = (value * (Math.PI / 180));

        this.eventManager.dispatch( this.events.objectChanged, { object: this.object } );
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

        this.eventManager.dispatch( this.events.objectChanged, { object: this.object } );
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

        this.eventManager.dispatch( this.events.objectChanged, { object: this.object } );
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

    this.eventManager.dispatch( this.events.objectChanged, { object: this.object } );
  }

  onBlur() {
    this.history.recordChange = false;
  }
}

class ColorProperty {
  constructor( editor, parent, object, propertyString, propertyLabel, color ) {
    this.editor = editor,
    this.history = editor.history,
    this.eventManager = editor.eventManager,
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

    this.setupEvents();
  }

  setupEvents() {
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
          if ( this.properties.length === 1 ) {
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

    material.needsUpdate = true;

    this.eventManager.dispatch( this.events.objectChanged, { object: this.object } );
  }
}

class TextureProperty {
  constructor( editor, parent, object, propertyString, propertyLabel ) {
    this.editor = editor,
    this.history = editor.history,
    this.eventManager = editor.eventManager,
    this.events = editor.events,

    this.parent = parent,
    this.object = object,
    this.properties = propertyString.split( "." );

    this.container = document.createElement( "div" );

    // This span is used to display the texture name
    this.span = document.createElement( "span" );
    if ( this.properties.length === 1 ) {
      this.span.textContent = this.object[ this.properties[ 0 ] ]?.name;
    } else {
      switch ( this.properties[ 0 ] ) {
        case "material":
          this.span.textContent = this.object.material[ this.properties[ 1 ] ]?.name;
          break;
      }
    }

    this.label = document.createElement( "label" );
    this.label.classList.add(
      "d-block"
    );
    this.label.textContent = propertyLabel;

    this.inputFile = document.createElement( "input" );
    this.inputFile.type = "file";
    this.inputFile.classList.add( "form-control" );

    this.container.appendChild( this.label );
    this.container.appendChild( this.span );
    this.container.appendChild( this.inputFile );
    this.parent.appendChild( this.container );

    //

    this.setupEvents();
  }

  setupEvents() {
    this.inputFile.addEventListener(
      "change",
      ( event ) => {
        const file = event.target.files[ 0 ];

        if ( this.properties.length === 1 ) {
          switch ( this.properties[ 0 ] ) {
            case "background":
              if ( file ) {
                this.loadTexture( this.object, this.properties[ 0 ], file );
              }

              break;
            case "environment":
              if ( file ) {
                this.loadRGBE( this.object, this.properties[ 0 ], file );
              }

              break;
          }
        } else {
          if ( this.object.isMesh ) {
            switch ( this.properties[ 0 ] ) {
              case "material":
                const material = this.object.material;

                if ( file ) {
                  this.loadTexture( material, this.properties[ 1 ], file );
                }

                break;
              default:
                break;
            }
          }
        }
      }
    )
  }

  loadTexture( object, property, image ) {
    const validExtensions = [ "jpeg", "jpg", "png", "gif", "bmp" ];
    const extension = image.name.split( "." ).pop().toLowerCase();

    if ( !validExtensions.includes( extension ) ) {
      alert( "Unsupported image format!" );
      return;
    }

    if ( object[ property ] ) {
      object[ property ].dispose();
    }

    const reader = new FileReader();
    reader.onload = ( event ) => {
      const dataURL = event.target.result;

      const textureLoader = new THREE.TextureLoader();
      textureLoader.load( dataURL, ( texture ) => {
        texture.name = image.name;
        texture.colorSpace = THREE.SRGBColorSpace;
        object[ property ] = texture;

        if ( object.isScene ) {
          switch ( property ) {
            case "background":
              object.environment = object.background;
              object.environment.mapping = THREE.EquirectangularReflectionMapping;
              object.environmentRotation.y = object.backgroundRotation.y;

              break;
            case "environment":
              object.environment.mapping = THREE.EquirectangularReflectionMapping;

              break;
          }
        } else if ( object.isMaterial ) {
          object.needsUpdate = true;
        }

        this.eventManager.dispatch( this.events.objectChanged, { object: this.object } );
      });
    }

    reader.readAsDataURL( image );
  }

  // This should only be used to load environment map
  loadRGBE( object, property, hdr ) {
    const extension = hdr.name.split( "." ).pop().toLowerCase();

    if ( extension !== "hdr" ) {
      alert( "Uploaded file must be in HDR format! (.hdr)" );
      return;
    }

    if ( object[ property ] ) {
      object[ property ].dispose();
    }

    const reader = new FileReader();
    reader.onload = ( event ) => {
      const dataURL = event.target.result;

      const rgbeLoader = new RGBELoader();
      rgbeLoader.load( dataURL, ( texture ) => {
        texture.name = hdr.name;
        texture.mapping = THREE.EquirectangularReflectionMapping;

        if ( object.isScene ) {
          object.background = texture;
          object.environment = texture;

          this.eventManager.dispatch( this.events.objectChanged, { object: this.object } );
        } else if ( object.isMaterial ) {
          object[ property ] = texture;
          object.needsUpdate = true;

          this.eventManager.dispatch( this.events.materialChanged, { object: this.object } );
        }
      });
    }

    reader.readAsDataURL( hdr );
  }

  // Must be named setValue
  setValue( texture ) {
    this.span.textContent = texture?.name;
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
    const children = Array.from( this.container.children );
    for ( const child of children ) {
      if ( child !== this.header ) {
        this.container.removeChild( child );
      }
    }
  }
}

class Properties {
  constructor( editor ) {
    this.editor = editor;
    this.eventManager = editor.eventManager;
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
