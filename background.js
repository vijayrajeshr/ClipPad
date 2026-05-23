// Automatically inject content scripts into all existing tabs on install/update
// This ensures users don't have to manually refresh pages for the extension to work
chrome.runtime.onInstalled.addListener(async () => {
  try {
    const tabs = await chrome.tabs.query({ url: ["http://*/*", "https://*/*"] });
    for (const tab of tabs) {
      // Safely attempt injection. Restricted pages (like the Chrome Web Store) will naturally fail and be caught.
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
      }).catch(() => { /* Silently ignore restricted pages */ });
    }
  } catch (error) {
    console.error("ClipPad: Failed to query tabs during install:", error);
  }
});

// Open the Side Panel immediately when the extension icon is clicked
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

// Listens for structural content clips scraped from content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "NEW_CLIP_EVENT") {
    processAndStoreClip(message.data);
  }
});

const MAX_UNLOCKED_CLIPS = 50;

async function processAndStoreClip(clipData) {
  const data = await chrome.storage.local.get({ clipboardHistory: [] });
  let history = data.clipboardHistory || [];

  // Avoid duplicating identical back-to-back entries
  if (history.length > 0 && history[0].content === clipData.content) {
    return;
  }

  const newClip = {
    id: `clip_${Date.now()}`,
    content: clipData.content || "",
    type: clipData.type || "text",
    timestamp: Date.now(),
    isLocked: false,
    meta: {
      sourceUrl: clipData.url || "",
      pageTitle: clipData.title || "Webpage"
    }
  };

  history.unshift(newClip);

  // Sort: Locked clips always at top, then sort by timestamp descending
  history.sort((a, b) => {
    if (a.isLocked === b.isLocked) return b.timestamp - a.timestamp;
    return a.isLocked ? -1 : 1;
  });

  // Double-Buffer Strategy: Enforce capacity limits ONLY on unlocked clips
  const lockedClips = history.filter(c => c.isLocked);
  const unlockedClips = history.filter(c => !c.isLocked).slice(0, MAX_UNLOCKED_CLIPS);

  history = [...lockedClips, ...unlockedClips];

  await chrome.storage.local.set({ clipboardHistory: history });
  
  // Broadcast update to the open UI panel
  chrome.runtime.sendMessage({ type: "HISTORY_UPDATED" }).catch(() => {
    // Suppress errors if sidepanel isn't open to receive the broadcast
  });
}