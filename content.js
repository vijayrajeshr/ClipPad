document.addEventListener("copy", () => {
  // Let the system finish copying data, then extract it cleanly
  setTimeout(async () => {
    try {
      const selectedText = window.getSelection().toString().trim();
      
      if (!selectedText) return;

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
      console.error("ClipPad failed to capture clipboard payload safely:", err);
    }
  }, 100);
});