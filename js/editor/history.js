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
    this.newUndoBranch = true;

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

        this.dispatchObjectRemovedEvent( null );

        this.redos.push( entry );

        break;
      case "remove":
        this.scene.add( entry.object );

        this.dispatchObjectAddedEvent( null );

        this.redos.push( entry );

        break;
      case "change":
        let object = this.scene.getObjectById( entry.id );

        // The top entry in undos only contains the last action, therefore we need
        // to push the current object state to redos before undoing
        this.redos.push({
          type: "change",
          id: object.id,
          position: object.position.clone(),
          rotation: object.rotation.clone(),
          scale: object.scale.clone()
        });

        if (object) {
          if (entry.position) { object.position.copy( entry.position ) }
          if (entry.rotation) { object.rotation.copy( entry.rotation ) }
          if (entry.scale) { object.scale.copy( entry.scale ) }
        }

        this.dispatchObjectChangedEvent( object );

        break;
    }
  }

  redo() {
    if (this.redos.length === 0) { return; }

    const entry = this.redos.pop();

    switch ( entry.type ) {
      case "add":
        this.scene.add( entry.object );

        this.dispatchObjectAddedEvent( null );

        this.undos.push( entry );

        break;
      case "remove":
        this.scene.remove( entry.object );

        this.dispatchObjectRemovedEvent( null );

        this.undos.push( entry );

        break;
      case "change":
        let object = this.scene.getObjectById( entry.id );

        // Same logic as in unfo(), we need to push current object state t
        // undos before redoing
        this.undos.push({
          type: "change",
          id: object.id,
          position: object.position.clone(),
          rotation: object.rotation.clone(),
          scale: object.scale.clone()
        });

        if (object) {
          if (entry.position) { object.position.copy( entry.position ) }
          if (entry.rotation) { object.rotation.copy( entry.rotation ) }
          if (entry.scale) { object.scale.copy( entry.scale ) }
        }

        this.dispatchObjectChangedEvent( object );

        break;
    }
  }

  // Event handlers

  onObjectAdded( event ) {
    if (!event.detail.object) { return; }

    const object = event.detail.object;

    if (this.newUndoBranch) {
      this.redos.splice( 0, this.redos.length );
      this.newUndoBranch = false;
    }

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
    if (!event.detail.object) { return; }

    const object = event.detail.object;

    if (this.newUndoBranch) {
      this.redos.splice( 0, this.redos.length );
      this.newUndoBranch = false;
    }

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
    if (!this.recordChange) { return; }
    if (!event.detail.object) { return; }

    const object = event.detail.object;

    if (this.newUndoBranch) {
      this.redos.splice( 0, this.redos.length );
      this.newUndoBranch = false;
    }

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

    const lastEntry = this.undos[ this.undos.length - 1 ];
    console.log(lastEntry);
    if (!lastEntry) {
      this.undos.push( entry );
    } else if (JSON.stringify( entry ) !== JSON.stringify( lastEntry )) {
      this.undos.push( entry );
    }

    this.recordChange = false;
  }

  // Dispatch custom events

  dispatchObjectAddedEvent( object ) {
    this.eventDispatcher.dispatchEvent(new CustomEvent(
      this.events.objectAdded.type,
      {
        detail: {
          object: object
        }
      }
    ));
  }

  dispatchObjectRemovedEvent( object ) {
    this.eventDispatcher.dispatchEvent(new CustomEvent(
      this.events.objectRemoved.type,
      {
        detail: {
          object: object
        }
      }
    ));
  }

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
