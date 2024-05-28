class Editor {
  constructor() {
    // This enables all the events in here to be "global"
    // Publish/subscribe pattern
    this.eventDispatcher = new EventTarget();

    this.events = {
      rendererCreated: new Event( "rendererCreated" ),

      windowResized: new Event( "windowResized" ),

      intersectionsDetected: new Event( "intersectionsDetected" ),
      
      objectAdded: new Event( "objectAdded" ),
      objectSelected: new Event( "objectSelected" ),
      objectChanged: new Event( "objectChanged "),

      transformModeChanged: new Event( "transformModeChanged" ),
    };
  }
}

export { Editor };
