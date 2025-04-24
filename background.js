importScripts("services/config.js");
importScripts("services/gemini.js");
importScripts("services/classifier.js");

let lastFocusSite = "";
let lastFocusTabId = null;
let focusScrollY = 0;
let driftTimer = null;
let currentTabUrl = "about:blank";

// Utility: check if it's a new day
function isNewDay(lastDate) {
  const today = new Date().toLocaleDateString();
  return lastDate !== today;
}

// Save site switch history + FocusPoints + streak tracking
function saveHistory(from, to) {
  chrome.storage.local.get(
    { history: [], focusPoints: 0, lastFocusDate: "", streak: 0 },
    (result) => {
      const history = result.history;
      history.push({ from, to, time: new Date().toLocaleString() });

      let newFocusPoints = result.focusPoints + 1;
      const today = new Date().toLocaleDateString();
      let newStreak = result.streak;

      if (isNewDay(result.lastFocusDate)) {
        newStreak = result.lastFocusDate ? result.streak + 1 : 1;
      }

      chrome.storage.local.set({
        history,
        focusPoints: newFocusPoints,
        lastFocusDate: today,
        streak: newStreak
      });
    }
  );
}

function startDriftTimer() {
  if (driftTimer) clearTimeout(driftTimer);
  console.log("⏱️ Drift timer set...");

  driftTimer = setTimeout(async () => {
    console.log("💡 Drift timer triggered!");

    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs.length > 0 && tabs[0].url.startsWith("http")) {
        const driftTab = tabs[0];
        const nudgeMessage = await getPersonalizedNudge(currentTabUrl, driftTab.url);
        console.log("🔔 Sending follow-up nudge:", nudgeMessage);

        chrome.scripting.executeScript({
          target: { tabId: driftTab.id },
          files: ["dialog.js"]
        }, () => {
          if (chrome.runtime.lastError) {
            console.warn("⚠️ Injection failed:", chrome.runtime.lastError.message);
          } else {
            chrome.tabs.sendMessage(driftTab.id, {
              action: "showNudge",
              message: nudgeMessage
            });
          }
        });
      }
    });
  }, 10 * 1000); // use 60 * 1000 in production
}

async function isFocusSite(url) {
  try {
    if (!url || !url.startsWith("http")) {
      console.warn("⚠️ Skipping invalid or non-http URL:", url);
      return false;
    }

    const hostname = new URL(url).hostname;
    const type = await classifySite(hostname);
    console.log(`🔍 Site ${hostname} classified as:`, type);
    return type === "focus";
  } catch (err) {
    console.warn("⚠️ Failed to classify site due to URL error:", url, err);
    return false;
  }
}

async function handleTabChange(tabId, changeInfo, tab) {
  if (
    tab.url &&
    tab.url !== currentTabUrl &&
    tab.url.startsWith("http")
  ) {
    const isNowFocus = await isFocusSite(tab.url);
    const wasFocus = await isFocusSite(currentTabUrl);

    if (isNowFocus) {
      lastFocusSite = tab.url;
      lastFocusTabId = tab.id;
    }

    if (wasFocus && !isNowFocus) {
      startDriftTimer();
      saveHistory(currentTabUrl, tab.url);
    }

    currentTabUrl = tab.url;
  }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  handleTabChange(tabId, changeInfo, tab);
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    handleTabChange(activeInfo.tabId, {}, tab);
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "refocus") {
    console.log("🔁 Refocus triggered");

    if (lastFocusTabId !== null && lastFocusSite) {
      chrome.tabs.get(lastFocusTabId, (tab) => {
        if (chrome.runtime.lastError || !tab) {
          chrome.tabs.create({ url: lastFocusSite });
          return;
        }

        chrome.tabs.update(lastFocusTabId, { active: true, url: lastFocusSite }, () => {
          setTimeout(() => {
            chrome.scripting.executeScript({
              target: { tabId: lastFocusTabId },
              files: ["dialog.js"]
            }, () => {
              chrome.tabs.sendMessage(lastFocusTabId, {
                action: "showSuccess"
              });
            });
          }, 1000);
        });
      });
    } else if (lastFocusSite) {
      chrome.tabs.create({ url: lastFocusSite });
    } else {
      console.error("❌ Refocus failed — no site or tab stored.");
    }

    // Bonus points for refocus
    chrome.storage.local.get({ focusPoints: 0 }, (data) => {
      chrome.storage.local.set({ focusPoints: data.focusPoints + 2 });
    });
  }

  else if (message.action === "remindLater") {
    console.log("⏲️ Will remind again in 1 minute...");
    setTimeout(() => startDriftTimer(), 60 * 1000);
  }

  else if (message.action === "saveScroll") {
    focusScrollY = message.scrollY;
  }

  else if (message.action === "getScroll") {
    sendResponse({ scrollY: focusScrollY });
  }
});
