// Supplement class, no need to export
class Node {
  constructor( sceneTree, object, draggable ) {
    this.sceneTree = sceneTree;
    this.eventDispatcher = sceneTree.eventDispatcher;
    this.events = sceneTree.events;

    this.object = object;
    this.children = []; // This is used to update the nodes after refreshing
    this.isActive = false;

    //

    this.container = document.createElement( "li" );
    this.container.setAttribute( "id", `Node-${ object.uuid }` );
    this.container.setAttribute( "style", "list-style-type: none;" );
    this.container.draggable = draggable;

    const listGroupId = `ListGroup-${ object.uuid }`;

    this.listGroupItem = document.createElement( "div" );
    this.listGroupItem.setAttribute( "class", "list-group-item list-group-item-action" );

    this.collapseButton = document.createElement( "button" );
    this.collapseButton.setAttribute( "class", "btn btn-dark btn-sm" );
    this.collapseButton.setAttribute( "type", "button" );
    this.collapseButton.setAttribute( "data-bs-toggle", "collapse" );
    this.collapseButton.setAttribute( "data-bs-target", `#${listGroupId}` );
    this.collapseButton.innerText = "+";

    // This span holds the name of the object
    this.span = document.createElement( "span" );
    this.span.innerText = ` ${ object.name }`;

    // Each node will have their own "sub-list"
    this.listGroup = document.createElement( "ul" );
    this.listGroup.setAttribute( "id", listGroupId );
    this.listGroup.setAttribute( "class", "list-group" );

    this.listGroupItem.appendChild( this.collapseButton );
    this.listGroupItem.appendChild( this.span );
    this.container.appendChild( this.listGroupItem );
    this.container.appendChild( this.listGroup );

    //

    this.updateCollapseButton();

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.listGroupItem.addEventListener(
      "click",
      this.onClick.bind( this )
    );

    this.collapseButton.addEventListener(
      "click",
      this.onCollapseButtonClick.bind( this )
    );

    this.eventDispatcher.addEventListener(
      this.events.objectSelected.type,
      this.onObjectSelected.bind( this )
    )
  }

  // Methods

  addChildNode( node ) {
    this.listGroup.appendChild( node.container );
    this.children.push( node );
    this.updateCollapseButton();
  }

  updateCollapseButton() {
    this.collapseButton.style.display = this.children.length > 0 ? "inline-block" : "none";

    const isExpanded = this.collapseButton.getAttribute("aria-expanded") === "true";
    this.collapseButton.innerText = isExpanded ? "-" : "+";
  }

  activate() {
    this.isActive = true;
    this.listGroupItem.classList.add( "active" );

    // Deselect other this.
    for (const node of this.sceneTree.nodes) {
      if (node !== this) {
        node.isActive = false;
        node.listGroupItem.classList.remove( "active" );
      }
    }
  }

  deactivate() {
    this.isActive = false;
    this.listGroupItem.classList.remove( "active" );
  }

  // Event handlers

  onClick() {
    this.activate();

    this.sceneTree.eventDispatcher.dispatchEvent(new CustomEvent(
      this.sceneTree.events.objectSelected.type,
      {
        detail: {
          object: this.object,
        }
      }
    ));
  }

  onCollapseButtonClick() {
    this.updateCollapseButton();
  }

  onObjectSelected( event ) {
    const object = event.detail.object;

    if (object && object.uuid === this.object.uuid) {
      this.activate();
    } else {
      this.deactivate();
    }
  }
}

class SceneTree {
  constructor( editor ) {
    // Make use of a data structure for these fucking nodes?
    this.editor = editor;
    this.eventDispatcher = editor.eventDispatcher;
    this.events = editor.events;

    this.selectedNode = null; // Don't know what to do with this yet

    this.nodes = []; // Need this to track all the nodes currently in the scene tree

    //

    this.container = document.createElement( "div" );
    this.container.setAttribute( "id", "SceneTree" );

    this.row = document.createElement( "div" );
    this.row.setAttribute( "class", "row" );

    this.col = document.createElement( "div" );
    this.col.setAttribute( "class", "col" );

    this.rootListGroup = document.createElement( "div" );
    this.rootListGroup.setAttribute( "id", "RootListGroup" );
    this.rootListGroup.setAttribute( "class", "list-group" );

    this.container.appendChild( this.row );
    this.row.appendChild( this.col );
    this.col.appendChild( this.rootListGroup );

    //

    this.refresh();

    this.setupEventListeners();
  }

  // Methods

  setupEventListeners() {
    this.eventDispatcher.addEventListener(
      this.events.objectAdded.type,
      this.onObjectAdded.bind( this )
    )

    this.eventDispatcher.addEventListener(
      this.events.objectRemoved.type,
      this.onObjectRemoved.bind( this )
    )
  }

  setNodes( nodes ) {
    // Clear the sceneTree first
    while (this.rootListGroup.firstChild) {
      this.rootListGroup.removeChild(this.rootListGroup.lastChild);
    }

    // IIFE, recursively update every node
    (( nodes ) => {
      for ( let i = 0; i < nodes.length; i++ ) {
        const node = nodes[ i ];
        node.updateCollapseButton();

        if ( nodes.children !== undefined ) {
          update( nodes.children );
        }
      }
    })( nodes );

    for ( let i = 0; i < nodes.length; i++ ) {
      const node = nodes[ i ];

      this.rootListGroup.appendChild(node.container);
    }
  }

  refresh() {
    this.nodes.splice( 0, this.nodes.length );

    const camera = this.editor.viewportCamera;
    const scene = this.editor.scene;

    const nodes = [];

    const cameraNode = new Node( this, camera, false );
    const sceneNode = new Node( this, scene, false );

    // Recursive function to create the nodes and establish parent-child relationships
    const addNodes = ( objects, parentNode, level ) => {
      for (let i = 0; i < objects.length; i++) {
        const object = objects[ i ];

        const node = new Node( this, object, true );
        node.container.style.paddingLeft = `${ level + 1 }rem`;

        parentNode.addChildNode( node );

        this.nodes.push( node );

        addNodes( object.children, node, level + 1 );
      } 
    };
    addNodes( scene.children, sceneNode, 0 );

    // Only need to push top-level nodes thanks to addChildNode()
    nodes.push( cameraNode );
    nodes.push( sceneNode );

    this.nodes.push( cameraNode );
    this.nodes.push( sceneNode );

    this.setNodes( nodes );
  }

  // Event handlers

  onObjectAdded() {
    this.refresh();
  }

  onObjectRemoved() {
    this.refresh();
  }

  onDrag() {

  }

  onDragOver() {

  }

  onDrop() {

  }
  
}

export { SceneTree };
