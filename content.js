function showToast(message) {
  // Create a minimal, premium glassmorphic toast notification
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: rgba(24, 24, 27, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    color: #f4f4f5;
    padding: 12px 20px;
    border-radius: 8px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    z-index: 2147483647;
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.3s ease, transform 0.3s ease;
    pointer-events: none;
  `;
  document.body.appendChild(toast);
  
  // Animate in
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });
  
  // Animate out and remove
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

document.addEventListener("copy", () => {
  // Immediately grab the active selection text
  const selectedText = window.getSelection().toString().trim();
  
  if (!selectedText) {
    showToast("ClipPad: Format not supported (Text only)");
    return;
  }

  // Wait a tiny bit (10ms) to ensure the system clipboard action completes without blocking
  setTimeout(() => {
    try {
      // Check if the extension was updated and context invalidated
      // Fail silently to prevent Chrome from flagging this as an error in the dashboard
      if (!chrome.runtime?.id) {
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
      // Fail silently to avoid triggering the Chrome Extensions error badge
    }
  }, 10);
});