// Injects/removes a <style> tag so we can toggle cleanly.
const STYLE_ID = "yt-narrow-cards-style";

function buildCSS() {
  return `
ytd-rich-item-renderer {
  max-width: 350px !important;
}

#contents.ytd-rich-grid-renderer {
  display: flex !important;
  flex-wrap: wrap !important;
  justify-content: center !important;
  align-items: stretch !important;
  gap: 16px !important;
}
`;
}

function applyStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = buildCSS();
  document.documentElement.appendChild(style);
}

function removeStyles() {
  const el = document.getElementById(STYLE_ID);
  if (el) el.remove();
}

// Observe page updates (YouTube is SPA); re-apply styles if enabled
let spaObserver = null;
function ensureSPAObserver(enabled) {
  if (!enabled) {
    if (spaObserver) {
      spaObserver.disconnect();
      spaObserver = null;
    }
    return;
  }
  if (spaObserver) return;
  spaObserver = new MutationObserver(() => {
    // If style tag was removed by page navigation, re-add it.
    if (!document.getElementById(STYLE_ID)) applyStyles();
  });
  spaObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}

async function syncFromStorageAndApply() {
  chrome.storage.sync.get({ ytNarrowEnabled: true }, ({ ytNarrowEnabled }) => {
    if (ytNarrowEnabled) {
      applyStyles();
    } else {
      removeStyles();
    }
    ensureSPAObserver(!!ytNarrowEnabled);
  });
}

// Respond to popup changes instantly
chrome.runtime.onMessage.addListener((msg) => {
  if (msg && msg.type === "YT_NARROW_TOGGLE") {
    if (msg.enabled) {
      applyStyles();
      ensureSPAObserver(true);
    } else {
      ensureSPAObserver(false);
      removeStyles();
    }
  }
});

// Also listen to direct storage changes (e.g., if altered elsewhere)
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && "ytNarrowEnabled" in changes) {
    const enabled = changes.ytNarrowEnabled.newValue;
    if (enabled) {
      applyStyles();
      ensureSPAObserver(true);
    } else {
      ensureSPAObserver(false);
      removeStyles();
    }
  }
});

// Kick things off when the content script runs
syncFromStorageAndApply();
