function VerticalResizer(editor) {
  const eventDispatcher = editor.eventDispatcher;
  const events = editor.events;

  var vResizers = document.getElementsByClassName("vertical-resizer");

  for (let i = 0; i < vResizers.length; i++) {
    let isResizing = false;
    let resizer = vResizers[i];

    let leftSibling = resizer.previousElementSibling;
    let rightSibling = resizer.nextElementSibling;

    let startX;

    resizer.addEventListener("mousedown", function(e) {
      e.preventDefault();

      isResizing = true;
      startX = e.clientX;
    });

    window.addEventListener("mousemove", function(e) {
      if (!isResizing) return;

      let deltaX = e.clientX - startX;
      startX = e.clientX;

      let leftWidth = leftSibling.getBoundingClientRect().width + deltaX;
      let rightWidth = rightSibling.getBoundingClientRect().width - deltaX;

      let leftWidthPercent = leftWidth / leftSibling.parentElement.getBoundingClientRect().width * 100;
      let rightWidthPercent = rightWidth / rightSibling.parentElement.getBoundingClientRect().width * 100;

      // If the child is gonna get smaller then make it smaller first
      // Also prevents the fucker from growing twice as fast, due to + or - 2*deltaX
      if (deltaX < 0) {
        for (let child of leftSibling.children) {
          child.style.width = `${leftSibling.clientWidth + deltaX}px`;
        }
      }
      if (deltaX > 0) {
        for (let child of rightSibling.children) {
          child.style.width = `${rightSibling.clientWidth - deltaX}px`;
        }
      }

      // With flex-row, flex-basis controls width
      // DO NOT use px, use % instead, otherwise it will fuck up on window resize
      leftSibling.style.flexBasis = `${leftWidthPercent}%`;
      rightSibling.style.flexBasis = `${rightWidthPercent}%`;

      // Make sure these mfs stick to the resizer
      for (let child of leftSibling.children) {
        child.style.width = "100%";
      }
      for (let child of rightSibling.children) {
        child.style.width = "100%";
      }

      eventDispatcher.dispatchEvent(events.windowResized);
    });

    window.addEventListener("mouseup", function(e) {
      isResizing = false;

      for (let child of leftSibling.children) {
        child.style.width = "100%";
      }
      for (let child of rightSibling.children) {
        child.style.width = "100%";
      }
    });
  }
}

export { VerticalResizer };
