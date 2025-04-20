function updateItemStyles() {
  const items = document.querySelectorAll("ytd-rich-item-renderer");
  items.forEach((item) => {
    item.style.maxWidth = "350px";
  });

  const gridContents = document.querySelector(
    "#contents.ytd-rich-grid-renderer"
  );

  if (gridContents) {
    gridContents.style.display = "flex";
    gridContents.style.flexWrap = "wrap";
    gridContents.style.justifyContent = "center";
  }
}

window.addEventListener("load", () => {
  updateItemStyles();
});

const observer = new MutationObserver(() => {
  updateItemStyles();
});

observer.observe(document.body, { childList: true, subtree: true });
