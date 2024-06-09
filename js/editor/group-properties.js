import { ObjectProperties } from "./object-properties.js";

class GroupProperties extends ObjectProperties {
  constructor( editor, group ) {
    super( editor, group );

    this.object = group;

    //

    this.setupEvents();
  }

  setupEvents() {
    this.eventManager.add( this.events.objectChanged, this.onObjectChanged.bind( this ) );
  }

  // Event handlers

  onObjectChanged( event ) {
    const object = event.detail.object;

    if ( object.isGroup ) {
      this.object = object;
      this.updateUI();
    }
  }
}

export { GroupProperties };
