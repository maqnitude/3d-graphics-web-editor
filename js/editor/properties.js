import * as THREE from "three";

import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

class ReadOnlyProperty {
  constructor( parent, propertyLabel, value, type ) {
    this.parent = parent;

    this.container = document.createElement( "div" );
    this.container.classList.add(
      "input-group"
    )

    this.input = document.createElement( "input" );
    this.input.readOnly = true;
    this.input.id = `input-${ propertyLabel }`;
    this.input.type = type;
    this.input.value = `${ value }`;
    this.input.classList.add(
      "form-control"
    );

    this.label = document.createElement( "label" );
    this.label.classList.add(
      "input-group-text",
      "fw-bold"
    );
    this.label.textContent = propertyLabel;

    this.container.appendChild( this.label );
    this.container.appendChild( this.input );
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
    this.container.classList.add(
      "input-group",
      "flex-column"
    );

    this.span = document.createElement( "span" );
    this.span.textContent = propertyLabel;
    this.span.classList.add(
      "input-group-text",
      "fw-bold"
    );

    this.inputContainer = document.createElement( "div" );
    this.inputContainer.classList.add(
      "input-group",
      "flex-nowrap"
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

    this.inputContainer.appendChild( this.span );
    this.inputContainer.appendChild( this.inputNumber );
    this.container.appendChild( this.inputContainer );
    this.container.appendChild( this.inputSlider );
    this.parent.appendChild( this.container );

    //

    this.setupEvents();
  }

  setValue( value ) {
    this.inputNumber.value = `${ value }`;
    this.inputSlider.value = `${ value }`;
  }

  setupEvents() {
    // number input must listen to "change" instead of "input",
    // otherwise you can only enter integer
    this.inputNumber.addEventListener( "change", this.onInputChanged.bind( this ) );
    this.inputSlider.addEventListener( "input", this.onInputChanged.bind( this ) );
  }

  // TODO: implement undo/redo for this shit
  onInputChanged( event ) {
    const value = Number( event.target.value );

    this.inputNumber.value = value;
    this.inputSlider.value = value;

    if ( this.properties.length === 1 ) {
      this.object[ this.properties[ 0 ] ] = value;

      if ( this.object.isCamera ) {
        this.object.updateProjectionMatrix();
      }

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
    this.container.classList.add(
      "input-group"
    );

    // this.formCheck = document.createElement("div")
    // this.formCheck.classList.add(
    //   "form-check",
    // );

    this.label = document.createElement("label");
    this.label.textContent = propertyLabel;
    this.label.classList.add(
      "input-group-text",
      "fw-bold"
    );

    this.inputContainer = document.createElement( "div" );
    this.inputContainer.classList.add(
      "input-group-text"
    );

    this.input = document.createElement( "input" );
    this.input.readOnly = false;
    this.input.id = `input-${ propertyLabel }`;
    this.input.type = "checkbox";
    this.input.checked = value;
    this.input.classList.add(
      "form-check-input"
    );

    this.inputContainer.appendChild( this.input );
    this.container.appendChild( this.label );
    this.container.appendChild( this.inputContainer );
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
    this.container.classList.add(
      "input-group"
    );

    this.select = document.createElement("select");
    this.select.id = `select-${propertyLabel}`;
    this.select.classList.add(
      "form-select"
    );

    this.label = document.createElement("label");
    this.label.classList.add(
      "input-group-text",
      "fw-bold"
    );
    this.label.textContent = propertyLabel;

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

    this.container.appendChild( this.label );
    this.container.appendChild( this.select );
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
    this.label.classList.add( "fw-bold" );
    this.label.textContent = propertyLabel;

    this.container = document.createElement( "div" );

    this.inputGroup = document.createElement( "div" );
    this.inputGroup.classList.add( "input-group" );

    const axes = [ 'x', 'y', 'z' ];

    axes.forEach( ( axis, index ) => {
      const span = document.createElement( "span" );
      span.textContent = axis.toUpperCase();
      span.classList.add("input-group-text");

      const inputNumber = document.createElement( "input" );
      inputNumber.readOnly = false;
      inputNumber.id = `input-${axis}`;
      inputNumber.type = "number";
      inputNumber.value = `${ vector3.getComponent( index ) }`;
      inputNumber.step = "0.001";
      inputNumber.classList.add( "form-control" );

      this.inputGroup.appendChild( span );
      this.inputGroup.appendChild( inputNumber );
    }  );

    this.container.appendChild( this.label );
    this.container.appendChild( this.inputGroup );

    this.parent.appendChild( this.container );

    //

    this.setupEvents();
  }

  setValue( vector3 ) {
    const inputNumbers = Array.from( this.inputGroup.getElementsByTagName( "input" ) );

    inputNumbers.forEach( ( inputNumber, index ) => {
      inputNumber.value = `${ vector3.getComponent( index ) }`;
    } );
  }

  // Change in properties, update in viewport
  setupEvents() {
    const inputNumbers = Array.from( this.inputGroup.getElementsByTagName( "input" ) );

    inputNumbers.forEach( ( inputNumber, index ) => {
      inputNumber.addEventListener( "change", ( event ) => {
        const value = Number(event.target.value);

        this.history.recordChange = true;
        this.history.newUndoBranch = true;

        this.eventManager.dispatch( this.events.objectChanged, { object: this.object } );

        this.object[ this.property ].setComponent(index, value);

        this.eventManager.dispatch( this.events.objectChanged, { object: this.object } );
      } );
    } );
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
    this.label.classList.add(
      "fw-bold",
    );
    this.label.textContent = propertyLabel;

    this.container = document.createElement( "div" );

    this.inputGroup = document.createElement( "div" );
    this.inputGroup.classList.add( "input-group" );

    const axes = [ 'x', 'y', 'z' ];

    axes.forEach( ( axis, index ) => {
      const span = document.createElement( "span" );
      span.textContent = axis.toUpperCase(  );
      span.classList.add( "input-group-text" );

      const inputNumber = document.createElement( "input" );
      inputNumber.readOnly = false;
      inputNumber.id = `input-${ axis }`;
      inputNumber.type = "number";
      inputNumber.value = `${ Number( ( euler[ axis ] * ( 180 / Math.PI ) ).toFixed( 2 ) ) }`;
      inputNumber.classList.add( "form-control" );

      this.inputGroup.appendChild( span );
      this.inputGroup.appendChild( inputNumber );
     } );

    this.container.appendChild( this.label );
    this.container.appendChild( this.inputGroup );

    this.parent.appendChild( this.container );

    this.setupEvents();
  }

  setValue( euler ) {
    const axes = ['x', 'y', 'z'];
    const inputNumbers = Array.from( this.inputGroup.getElementsByTagName( 'input' ) );

    inputNumbers.forEach( ( inputNumber, index ) => {
      inputNumber.value = `${ Number( ( euler[axes[index]] * ( 180 / Math.PI ) ).toFixed( 2 ) ) }`;
    } );
  }

  // Change in properties, update in viewport
  setupEvents() {
    const inputNumbers = Array.from( this.inputGroup.getElementsByTagName( 'input' ) );
    const rotationAxes = ['x', 'y', 'z'];

    inputNumbers.forEach( ( inputNumber, index ) => {
      inputNumber.addEventListener( "change", ( event ) => {
        const value = Number( event.target.value );

        this.history.recordChange = true;
        this.history.newUndoBranch = true;

        this.eventManager.dispatch( this.events.objectChanged, {  object: this.object  } );

        this.object.rotation[ rotationAxes[ index ] ] = ( value * ( Math.PI / 180 ) );

        this.eventManager.dispatch( this.events.objectChanged, {  object: this.object  } );
      } );
    } );
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

    this.container = document.createElement( "div" );
    this.container.classList.add(
      "input-group",
      "flex-nowrap"
    );

    this.label = document.createElement( "label" );
    this.label.classList.add(
      "input-group-text",
      "fw-bold"
    );
    this.label.textContent = propertyLabel;

    this.inputContainer = document.createElement( "div" );
    this.inputContainer.classList.add(
      "input-group",
      "flex-nowrap"
    );

    this.inputColor = document.createElement( "input" );
    this.inputColor.id = "input-color";
    this.inputColor.type = "color";
    this.inputColor.value = color.getStyle();
    this.inputColor.classList.add(
      "form-control",
      "w-50"
    );

    this.inputText = document.createElement( "input" );
    this.inputText.id = "input-text";
    this.inputText.type = "text";
    this.inputText.classList.add(
      "form-control",
      "w-50"
    );

    this.inputContainer.appendChild( this.inputColor );
    this.inputContainer.appendChild( this.inputText );
    this.container.appendChild( this.label );
    this.container.appendChild( this.inputContainer );
    this.parent.appendChild( this.container );

    //

    this.setupEvents();
  }

  setupEvents() {
    this.inputColor.addEventListener( "change", this.onInputChanged.bind( this ) );
    this.inputText.addEventListener( "change", this.onInputChanged.bind( this ) );
  }

  setValue( color ) {
    this.inputColor.value = color.getStyle();
    this.inputText.value = color.getStyle();
  }

  setColor( object, property, colorStyle ) {
    object[ property ].setStyle( colorStyle );

    if ( object.isMaterial ) {
      object.needsUpdate = true;
    }

    this.eventManager.dispatch( this.events.objectChanged, { object: this.object } );
  }

  // Event handlers

  onInputChanged( event ) {
    const colorStyle = new THREE.Color( event.target.value ).getStyle();

    this.inputColor.value = colorStyle;
    this.inputText.value = colorStyle;

    if ( this.properties.length === 1 ) {
      this.setColor( this.object, this.properties[ 0 ], colorStyle );
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
    this.container.classList.add(
      "input-group"
    );

    // This span is used to display the texture name
    this.span = document.createElement( "span" );
    this.span.classList.add(
      "input-group-text",
    );
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
      "input-group-text",
      "fw-bold"
    );
    this.label.textContent = propertyLabel;

    this.inputFile = document.createElement( "input" );
    this.inputFile.type = "file";
    this.inputFile.classList.add(
      "form-control",
    );

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
            default:
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
      "list-group",
      "d-flex",
      "flex-column",
      "gap-2"
    );

    this.header = document.createElement( "h5" );
    this.header.classList.add(
      "list-group-item",
      "list-group-item-primary",
      "my-0"
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
      "flex-column",
      "gap-2"
    );
  }

  // Common methods

  setPropertyValue( property, value ) {
    property?.setValue( value );
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
