// Open the Side Panel immediately when the extension icon is clicked
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

// Listen for global keyboard commands (e.g., Cmd+Shift+K)
chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle_side_panel") {
    // Allows keyboard shortcut integration to open the panel
    console.log("ClipPad shortcut triggered.");
  }
});

// Listens for structural content clips scraped from content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "NEW_CLIP_EVENT") {
    processAndStoreClip(message.data);
  }
});

const MAX_UNLOCKED_CLIPS = 50;

async function processAndStoreClip(clipData) {
  const data = await chrome.storage.local.get({ clipboardHistory: [] });
  let history = data.clipboardHistory;

  // Avoid duplicating identical back-to-back entries
  if (history.length > 0 && history[0].content === clipData.content) {
    return;
  }

  const newClip = {
    id: `clip_${Date.now()}`,
    content: clipData.content,
    type: clipData.type || "text",
    timestamp: Date.now(),
    isLocked: false,
    meta: {
      sourceUrl: clipData.url,
      pageTitle: clipData.title
    }
  };

  history.unshift(newClip);

  // Double-Buffer Strategy: Enforce capacity limits ONLY on unlocked clips
  const lockedClips = history.filter(c => c.isLocked);
  const unlockedClips = history.filter(c => !c.isLocked);

  if (unlockedClips.length > MAX_UNLOCKED_CLIPS) {
    history = [...lockedClips, ...unlockedClips.slice(0, MAX_UNLOCKED_CLIPS)];
  }

  await chrome.storage.local.set({ clipboardHistory: history });
  
  // Broadcast update to the open UI panel
  chrome.runtime.sendMessage({ type: "HISTORY_UPDATED" }).catch(() => {
    // Suppress errors if sidepanel isn't open to receive the broadcast
  });
}