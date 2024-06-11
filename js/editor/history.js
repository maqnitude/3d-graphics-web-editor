class Entry {
  constructor( type ) {
    this.type = type;
  }
}
class AddRemoveEntry extends Entry {
  constructor( type, object ) {
    super( type );

    this.object = object; // reference to object
  }
}

class ChangeEntry extends Entry {
  constructor( object ) {
    super( "change" );

    this.id = object.id;

    this.position = object.position.clone();
    this.rotation = object.rotation.clone();
    this.scale = object.scale.clone();

    this.visible = object.visible;

    // if ( object.isMesh ) {
    //   this.geometry = object.geometry.clone();
    // } else if ( object.isLight ) {
    //   this.intensity = object.intensity;
    // }
  }
}

// TODO: Reimplement this so that we don't have to manually save before applying changes
class History {
  constructor( editor ) {
    this.editor = editor;
    this.eventManager = editor.eventManager;
    this.events = editor.events;

    this.maxEntries = 100;
    this.undos = [];
    this.redos = [];

    this.recordChange = false; // if true, change will be recorded then goes back to false
    this.newUndoBranch = true;

    //

    this.setupEvents();
  }

  setupEvents() {
    this.eventManager.add( this.events.objectAdded, this.onObjectAdded.bind( this ) );
    this.eventManager.add( this.events.objectRemoved, this.onObjectRemoved.bind( this ) );
    this.eventManager.add( this.events.objectChanged, this.onObjectChanged.bind( this ) );
  }

  undo() {
    if (this.undos.length === 0) { return; }

    const entry = this.undos.pop();

    switch ( entry.type ) {
      case "add":
        this.editor.scene.remove( entry.object );

        this.eventManager.dispatch( this.events.objectRemoved, { object: null } );

        this.redos.push( entry );

        break;
      case "remove":
        this.editor.scene.add( entry.object );

        this.eventManager.dispatch( this.events.objectAdded, { object: null } );

        this.redos.push( entry );

        break;
      case "change":
        let object = this.editor.scene.getObjectById( entry.id );

        // The top entry in undos only contains the last action, therefore we need
        // to push the current object state to redos before undoing
        this.redos.push( new ChangeEntry( object ) );

        if (object) {
          if (entry.position) { object.position.copy( entry.position ); }
          if (entry.rotation) { object.rotation.copy( entry.rotation ); }
          if (entry.scale) { object.scale.copy( entry.scale ); }
          object.visible = entry.visible;

          // if ( object.isMesh ) {
          //   if ( entry.geometry ) { object.geometry.copy( entry.geometry ); }
          // } else if ( object.isLight ) {
          //   object.intensity = entry.intensity;
          // }
        }

        this.eventManager.dispatch( this.events.objectChanged, { object: object } );

        break;
    }

    // console.log("undos:", this.undos);
    // console.log("redos:", this.redos);
  }

  redo() {
    if (this.redos.length === 0) { return; }

    const entry = this.redos.pop();

    switch ( entry.type ) {
      case "add":
        this.editor.scene.add( entry.object );

        this.eventManager.dispatch( this.events.objectAdded, { object: null } );

        this.undos.push( entry );

        break;
      case "remove":
        this.editor.scene.remove( entry.object );

        this.eventManager.dispatch( this.events.objectRemoved, { object: null } );

        this.undos.push( entry );

        break;
      case "change":
        let object = this.editor.scene.getObjectById( entry.id );

        // Same logic as in unfo(), we need to push current object state t
        // undos before redoing
        this.undos.push( new ChangeEntry( object ) );

        if (object) {
          if (entry.position) { object.position.copy( entry.position ); }
          if (entry.rotation) { object.rotation.copy( entry.rotation ); }
          if (entry.scale) { object.scale.copy( entry.scale ); }
          object.visible = entry.visible;

          // if ( object.isMesh ) {
          //   if ( entry.geometry ) { object.geometry.copy( entry.geometry ); }
          // } else if ( object.isLight ) {
          //   object.intensity = entry.intensity;
          // }
        }

        this.eventManager.dispatch( this.events.objectChanged, { object: object } );

        break;
    }

    // console.log("undos:", this.undos);
    // console.log("redos:", this.redos);
  }

  // Event handlers

  onObjectAdded( event ) {
    if ( !event.detail.object ) { return; }

    const object = event.detail.object;

    if (this.newUndoBranch) {
      this.redos.splice( 0, this.redos.length );
      this.newUndoBranch = false;
    }

    if (this.undos.length > this.maxEntries) {
      this.undos.shift();
    }

    const entry = new AddRemoveEntry( "add", object );

    this.undos.push( entry );

    // console.log("undos:", this.undos);
    // console.log("redos:", this.redos);
  }

  onObjectRemoved( event ) {
    if ( !event.detail.object ) { return; }

    const object = event.detail.object;

    if (this.newUndoBranch) {
      this.redos.splice( 0, this.redos.length );
      this.newUndoBranch = false;
    }

    if (this.undos.length > this.maxEntries) {
      this.undos.shift();
    }

    const entry = new AddRemoveEntry( "remove", object );

    this.undos.push( entry );

    // console.log("undos:", this.undos);
    // console.log("redos:", this.redos);
  }

  onObjectChanged( event ) {
    if ( !this.recordChange || !event.detail.object ) { return; }

    const object = event.detail.object;

    if (this.newUndoBranch) {
      this.redos.splice( 0, this.redos.length );
      this.newUndoBranch = false;
    }

    if (this.undos.length > this.maxEntries) {
      this.undos.shift();
    }

    const entry = new ChangeEntry( object );

    const lastEntry = this.undos[ this.undos.length - 1 ];
    if (!lastEntry) {
      this.undos.push( entry );
    } else if (JSON.stringify( entry ) !== JSON.stringify( lastEntry )) {
      this.undos.push( entry );
    }

    this.recordChange = false;

    // console.log("undos:", this.undos);
    // console.log("redos:", this.redos);
  }
}

export { History };
