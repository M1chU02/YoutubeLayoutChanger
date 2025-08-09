chrome.runtime.onInstalled.addListener(async () => {
  // Hide/disable the action by default, show only when rules match.
  chrome.action.disable();

  // Ensure we have a default setting for the toggle.
  chrome.storage.sync.get({ ytNarrowEnabled: true }, (data) => {
    // If the key doesn't exist, set default true.
    if (typeof data.ytNarrowEnabled === "undefined") {
      chrome.storage.sync.set({ ytNarrowEnabled: true });
    }
  });

  // Reset rules, then add a rule to show the action on *.youtube.com
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostSuffix: "youtube.com" },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowAction()],
      },
    ]);
  });
});
