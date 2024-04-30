function VerticalResizer() {
  var vResizers = document.getElementsByClassName("vertical-resizer");

  for (let i = 0; i < vResizers.length; i++) {
    let isResizing = false;
    let resizer = vResizers[i];
    let startX;

    resizer.addEventListener("mousedown", function(e) {
      isResizing = true;
      startX = e.clientX;
      e.preventDefault();
    });

    window.addEventListener("mousemove", function(e) {
      if (!isResizing) return;

      let leftSibling = resizer.previousElementSibling;
      let rightSibling = resizer.nextElementSibling;

      let deltaX = e.clientX - startX;
      startX = e.clientX;

      let leftWidth = leftSibling.getBoundingClientRect().width + deltaX;
      let rightWidth = rightSibling.getBoundingClientRect().width - deltaX;

      leftSibling.style.flexBasis = `${leftWidth}px`;
      rightSibling.style.flexBasis = `${rightWidth}px`;
    });

    window.addEventListener("mouseup", function(e) {
      isResizing = false;
    });
  }
}

export { VerticalResizer };
