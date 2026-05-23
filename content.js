document.addEventListener("copy", () => {
  // Immediately grab the active selection text
  const selectedText = window.getSelection().toString().trim();
  if (!selectedText) return;

  // Wait a tiny bit (10ms) to ensure the system clipboard action completes without blocking
  setTimeout(() => {
    try {
      // Check if the extension was updated and context invalidated (prevents the Chrome error)
      if (!chrome.runtime?.id) {
        console.warn("ClipPad context invalidated. Please refresh the page.");
        return;
      }

      // Send structured payload to background worker
      chrome.runtime.sendMessage({
        type: "NEW_CLIP_EVENT",
        data: {
          content: selectedText,
          type: "text",
          url: window.location.href,
          title: document.title
        }
      });
    } catch (err) {
      // Suppress known invalidation error, log others
      if (!err.message.includes("Extension context invalidated")) {
        console.error("ClipPad failed to capture payload:", err);
      }
    }
  }, 10);
});