console.log("👁️ FocusFlow content script running on", window.location.href);

// Listen for scroll to save position
window.addEventListener("scroll", () => {
  chrome.runtime.sendMessage({
    action: "saveScroll",
    scrollY: window.scrollY
  });
});

// Allow background to ask for scroll position
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getScroll") {
    sendResponse({ scrollY: window.scrollY });
  }
});
