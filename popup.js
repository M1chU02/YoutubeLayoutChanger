document.addEventListener("DOMContentLoaded", () => {
  const cb = document.getElementById("enabled");

  chrome.storage.sync.get({ ytNarrowEnabled: true }, ({ ytNarrowEnabled }) => {
    cb.checked = !!ytNarrowEnabled;
  });

  cb.addEventListener("change", async () => {
    const enabled = cb.checked;
    await chrome.storage.sync.set({ ytNarrowEnabled: enabled });

    // Optionally, ask active YouTube tabs to refresh styles immediately.
    if (chrome.tabs && chrome.tabs.query) {
      chrome.tabs.query({ url: "*://*.youtube.com/*" }, (tabs) => {
        for (const t of tabs) {
          chrome.tabs.sendMessage(t.id, { type: "YT_NARROW_TOGGLE", enabled });
        }
      });
    }
  });
});
