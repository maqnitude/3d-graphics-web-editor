class VerticalResizer {
  constructor( editor, leftSibling, rightSibling ) {
    this.eventManager = editor.eventManager;
    this.events = editor.events;

    this.leftSibling = leftSibling;
    this.rightSibling = rightSibling;

    this.isResizing = false;

    //

    this.container = document.createElement( "div" );
    this.container.setAttribute( "id", "vertical-resizer" );
    this.container.setAttribute(
      "class",
      "border"
    );
    this.container.setAttribute(
      "style",
      "width: 4px; cursor: col-resize;"
    );

    this.rightSibling.parentNode.insertBefore( this.container, this.rightSibling );

    //

    this.addEventListeners();
  }

  startX = 0;

  addEventListeners() {
    this.container.addEventListener( "mousedown", ( event ) => {
      event.preventDefault();

      this.isResizing = true;
      this.startX = event.clientX;
    });

    window.addEventListener( "mousemove", ( event ) => {
      if (!this.isResizing) return;

      let deltaX = event.clientX - this.startX;
      this.startX = event.clientX;

      let leftWidth = this.leftSibling.getBoundingClientRect().width + deltaX;
      let rightWidth = this.rightSibling.getBoundingClientRect().width - deltaX;

      let leftWidthPercent = leftWidth / this.leftSibling.parentElement.getBoundingClientRect().width * 100;
      let rightWidthPercent = rightWidth / this.rightSibling.parentElement.getBoundingClientRect().width * 100;

      // If the child is gonna get smaller then make it smaller first
      // Also prevents the fucker from growing twice as fast, due to + or - 2*deltaX
      if (deltaX < 0) {
        for (let child of this.leftSibling.children) {
          child.style.width = `${this.leftSibling.clientWidth + deltaX}px`;
        }
      }
      if (deltaX > 0) {
        for (let child of this.rightSibling.children) {
          child.style.width = `${this.rightSibling.clientWidth - deltaX}px`;
        }
      }

      // With flex-row, flex-basis controls width
      // DO NOT use px, use % instead, otherwise it will fuck up on window resize
      this.leftSibling.style.flexBasis = `${leftWidthPercent}%`;
      this.rightSibling.style.flexBasis = `${rightWidthPercent}%`;

      // Make sure these mfs stick to the resizer
      for (let child of this.leftSibling.children) {
        child.style.width = "100%";
      }
      for (let child of this.rightSibling.children) {
        child.style.width = "100%";
      }

      this.eventManager.dispatch( this.events.windowResized );
    });

    window.addEventListener("mouseup", ( event ) => {
      this.isResizing = false;

      for (let child of this.leftSibling.children) {
        child.style.width = "100%";
      }
      for (let child of this.rightSibling.children) {
        child.style.width = "100%";
      }
    });
  }
}

export { VerticalResizer };
