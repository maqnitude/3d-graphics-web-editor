// Supplement class, no need to export
class Node {
  constructor( sceneTree, object, draggable ) {
    this.sceneTree = sceneTree;
    this.editor = sceneTree.editor;
    this.eventManager = sceneTree.eventManager;
    this.events = sceneTree.events;

    this.object = object;
    this.children = []; // This is used to update the nodes after refreshing
    this.isActive = false;

    //

    this.container = document.createElement( "li" );
    this.container.id = `Node-${ object.uuid }`;
    this.container.setAttribute( "style", "list-style-type: none;" );
    this.container.classList.add(
      "m-0"
    );
    this.container.draggable = draggable;

    const listGroupId = `ListGroup-${ object.uuid }`;

    this.listGroupItem = document.createElement( "div" );
    this.listGroupItem.classList.add(
      "list-group-item",
      "list-group-item-action",
    );

    this.collapseButton = document.createElement( "button" );
    this.collapseButton.classList.add(
      "btn",
      "btn-sm",
      "btn-collapse-node"
    );
    this.collapseButton.type = "button";
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

    this.setupEvents();
  }

  setupEvents() {
    this.listGroupItem.addEventListener(
      "click",
      this.onClick.bind( this )
    );

    this.collapseButton.addEventListener(
      "click",
      this.onCollapseButtonClick.bind( this )
    );

    this.eventManager.add(
      this.events.objectSelected,
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

    this.eventManager.dispatch( this.events.objectSelected, { object: this.object } );
  }

  // BUG: have to double click collapse the node initially
  onCollapseButtonClick() {
    this.updateCollapseButton();
  }

  onObjectSelected( event ) {
    const object = event.detail.object;

    if ( object && object.uuid === this.object.uuid ) {
      this.activate();

      this.editor.selectedObject = object;
    } else {
      this.deactivate();
    }
  }
}

class SceneTree {
  constructor( editor ) {
    // Make use of a data structure for these fucking nodes?
    this.editor = editor;
    this.eventManager = editor.eventManager;
    this.events = editor.events;

    this.selectedNode = null; // Don't know what to do with this yet

    this.nodes = []; // Need this to track all the nodes currently in the scene tree

    //

    this.container = document.createElement( "div" );
    this.container.setAttribute( "id", "SceneTree" );
    this.container.classList.add(
      "overflow-y-scroll",
      "overflow-x-hidden",
      "d-flex",
      "flex-column",
    );

    this.row = document.createElement( "div" );
    this.row.classList.add(
      "row",
    );

    this.col = document.createElement( "div" );
    this.col.classList.add(
      "col",
      "p-0"
    );

    this.rootListGroup = document.createElement( "div" );
    this.rootListGroup.setAttribute( "id", "RootListGroup" );
    this.rootListGroup.setAttribute( "class", "list-group" );

    this.col.appendChild( this.rootListGroup );
    this.row.appendChild( this.col );
    this.container.appendChild( this.row );

    //

    this.refresh();

    this.setupEvents();
  }

  // Methods

  setupEvents() {
    this.eventManager.add( this.events.objectAdded, this.onObjectAdded.bind( this ) );
    this.eventManager.add( this.events.objectRemoved, this.onObjectRemoved.bind( this ) );
  }

  setNodes( nodes ) {
    // Clear the sceneTree first
    while (this.rootListGroup.firstChild) {
      this.rootListGroup.removeChild(this.rootListGroup.lastChild);
    }

    // IIFE, recursively update every node
    (function update( nodes ) {
      for ( let i = 0; i < nodes.length; i++ ) {
        const node = nodes[ i ];
        node.updateCollapseButton();

        if ( node.children ) {
          update( node.children );
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
    const addNodes = ( objects, parentNode ) => {
      for (let i = 0; i < objects.length; i++) {
        const object = objects[ i ];

        const node = new Node( this, object, true );
        node.container.style.paddingLeft = `${ 32 }px`;

        parentNode.addChildNode( node );

        this.nodes.push( node );

        addNodes( object.children, node );
      }
    };
    addNodes( scene.children, sceneNode );

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
