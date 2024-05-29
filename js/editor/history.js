class History {
  constructor( editor ) {
    this.editor = editor;
    this.eventDispatcher = editor.eventDispatcher;
    this.events = editor.events;

    this.viewport = null;
    this.scene = editor.scene;

    this.maxEntries = 100;
    this.undos = [];
    this.redos = [];

    this.recordChange = false; // if true, change will be recorded then goes back to false

    //

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.eventDispatcher.addEventListener(
      this.events.objectAdded.type,
      this.onObjectAdded.bind( this )
    );

    this.eventDispatcher.addEventListener(
      this.events.objectRemoved.type,
      this.onObjectRemoved.bind( this )
    );

    this.eventDispatcher.addEventListener(
      this.events.objectChanged.type,
      this.onObjectChanged.bind( this )
    );
  }

  undo() {
    if (this.undos.length === 0) { return; }

    const entry = this.undos.pop();

    switch ( entry.type ) {
      case "add":
        this.scene.remove( entry.object );

        this.viewport.render();

        break;
      case "remove":
        this.scene.add( entry.object );

        this.eventDispatcher.dispatchEvent( this.events.objectAdded );

        break;
      case "change":
        let object = this.scene.getObjectById( entry.id );

        if (object) {
          if (entry.position) { object.position.copy( entry.position ) }
          if (entry.rotation) { object.rotation.copy( entry.rotation ) }
          if (entry.scale) { object.scale.copy( entry.scale ) }
        }

        this.viewport.render();

        break;
    }

    this.redos.push( entry );
  }

  redo() {
    if (this.redos.length === 0) { return; }

    const entry = this.redos.pop();

    switch ( entry.type ) {
      case "add":
        this.scene.add( entry.object );

        this.viewport.render();

        break;
      case "remove":
        this.scene.remove( entry.object );

        this.viewport.render();

        break;
      case "change":
        let object = this.scene.getObjectById( entry.id );

        if (object) {
          if (entry.position) { object.position.copy( entry.position ) }
          if (entry.rotation) { object.rotation.copy( entry.rotation ) }
          if (entry.scale) { object.scale.copy( entry.scale ) }
        }

        this.dispatchObjectChangedEvent( object );

        break;
    }

    this.undos.push( entry );
  }

  // Event handlers

  onObjectAdded( event ) {
    // New undo branch, need to clear redos
    if (this.redos.length > 0) {
      this.redos.splice( 0, this.redos.length );
    }

    const object = event.detail.object;

    if (!object) { return; }

    if (this.undos.length > this.maxEntries) {
      this.undos.shift();
    }

    const entry = {
      type: "add",
      object: object
    }

    this.undos.push( entry );
  }

  onObjectRemoved( event ) {
    // New undo branch, need to clear redos
    if (this.redos.length > 0) {
      this.redos.splice( 0, this.redos.length );
    }

    const object = event.detail.object;

    if (!object) { return; }

    if (this.undos.length > this.maxEntries) {
      this.undos.shift();
    }

    const entry = {
      type: "remove",
      object: object
    }

    this.undos.push( entry );
  }

  onObjectChanged( event ) {
    // New undo branch, need to clear redos
    if (this.redos.length > 0) {
      this.redos.splice( 0, this.redos.length );
    }

    if (!this.recordChange) { return; }

    const object = event.detail.object;

    if (!object) { return; }

    if (this.undos.length > this.maxEntries) {
      this.undos.shift();
    }

    const entry = {
      type: "change",
      id: object.id,
      position: object.position.clone(),
      rotation: object.rotation.clone(),
      scale: object.scale.clone()
    }

    this.undos.push( entry );

    this.recordChange = false;
  }

  // Dispatch custom events

  dispatchObjectChangedEvent( object ) {
    this.eventDispatcher.dispatchEvent(new CustomEvent(
      this.events.objectChanged.type,
      {
        detail: {
          object: object
        }
      }
    ));
  }
}

export { History };
