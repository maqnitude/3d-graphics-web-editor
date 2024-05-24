class Editor {
  constructor() {
    // This enables all the events in here to be "global"
    // Publish/subscribe pattern
    this.eventDispatcher = new EventTarget();

    this.events = {
      rendererCreated: new Event( "rendererCreated" ),

      windowResized: new Event( "windowResized" ),

      objectAdded: new Event( "objectAdded" ),

      intersectionsDetected: new Event( "intersectionsDetected" ),
      objectSelected: new Event( "objectSelected" ),

      transformModeChanged: new Event( "transformModeChanged" ),
    };
  }
}

export { Editor };
