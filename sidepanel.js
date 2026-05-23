document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.getElementById("searchBar");
  
  renderHistory();

  // Watch local storage live changes to dynamically refresh the sidepanel UI
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "HISTORY_UPDATED") {
      renderHistory(searchBar.value);
    }
  });

  searchBar.addEventListener("input", (e) => {
    renderHistory(e.target.value);
  });
});

async function renderHistory(filterText = "") {
  const clipList = document.getElementById("clipList");
  const data = await chrome.storage.local.get({ clipboardHistory: [] });
  
  clipList.innerHTML = "";
  const query = filterText.toLowerCase();

  const filteredHistory = data.clipboardHistory.filter(clip => 
    clip.content.toLowerCase().includes(query) || 
    (clip.meta.pageTitle && clip.meta.pageTitle.toLowerCase().includes(query))
  );

  if (filteredHistory.length === 0) {
    clipList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 13V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V13M15 11L12 14M12 14L9 11M12 14V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h3>Your clipboard is empty</h3>
        <p>Copy anything from your browser to see it appear here instantly.</p>
        
        <div class="social-links">
          <span>Developed by Vijay</span>
          <div class="social-icons">
            <a href="https://github.com/vijayrajeshr" target="_blank" title="GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
            </a>
            <a href="https://www.linkedin.com/in/vijayrajeshr/" target="_blank" title="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
        </div>
      </div>`;
    return;
  }

  filteredHistory.forEach((clip, index) => {
    const card = document.createElement("div");
    card.className = `clip-card ${clip.isLocked ? "pinned" : ""}`;
    card.style.animationDelay = `${Math.min(index * 0.05, 0.5)}s`;

    const pinIcon = clip.isLocked 
      ? `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M19 10.9984L14.414 6.41243L15.121 5.70543C15.512 5.31443 15.512 4.68143 15.121 4.29043C14.73 3.89943 14.097 3.89943 13.707 4.29043L9.121 8.87643C8.934 9.06343 8.828 9.31743 8.828 9.58343V13.1694L4.707 17.2904C4.316 17.6814 4.316 18.3144 4.707 18.7054C5.098 19.0964 5.731 19.0964 6.121 18.7054L10.243 14.5834H13.828C14.094 14.5834 14.348 14.4774 14.535 14.2904L19.121 9.70443C19.512 9.31343 19.512 8.68043 19.121 8.28943C18.73 7.89843 18.097 7.89843 17.707 8.28943L17 8.99643L19 10.9984Z"/></svg>`
      : `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 15.5L7 13.5M10.5 9L15 4.5M15 4.5C16.5 4.5 17.5 5.5 17.5 7L13 11.5L15 13.5L17.5 14L19.5 12C20 11.5 20 10.5 19.5 9.5L14.5 4.5C13.5 4 12.5 4 12 4.5L10 6.5L10.5 9L15 4.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 16.5L4 22M10 16.5L8.5 18M10 16.5L13.5 19L14 16.5L11.5 14M11.5 14L9 10.5L6.5 10L9 12.5L11.5 14Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    card.innerHTML = `
      <div class="clip-body">${escapeHTML(clip.content)}</div>
      <div class="clip-footer">
        <a href="${clip.meta.sourceUrl}" target="_blank" class="source-link" title="${escapeHTML(clip.meta.pageTitle || "Webpage")}">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.8284 10.1716L10.1716 13.8284M10.1716 13.8284C9.40018 14.5998 8.14986 14.5998 7.37845 13.8284C6.60703 13.057 6.60703 11.8067 7.37845 11.0353L11.6211 6.79264C12.3925 6.02122 13.6428 6.02122 14.4142 6.79264C15.1857 7.56405 15.1857 8.81437 14.4142 9.58579M10.1716 13.8284L5.92893 18.0711C5.15751 18.8425 3.9072 18.8425 3.13579 18.0711C2.36437 17.2996 2.36437 16.0493 3.13579 15.2779L7.37845 11.0353M13.8284 10.1716C14.5998 9.40018 15.8501 9.40018 16.6216 10.1716C17.393 10.943 17.393 12.1933 16.6216 12.9647L12.3789 17.2074C11.6075 17.9788 10.3572 17.9788 9.58579 17.2074M13.8284 10.1716L18.0711 5.92893C18.8425 5.15751 20.0928 5.15751 20.8642 5.92893C21.6356 6.70034 21.6356 7.95066 20.8642 8.72208L16.6216 12.9647" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>${escapeHTML(clip.meta.pageTitle || "Webpage")}</span>
        </a>
        <div class="actions">
          <button class="btn-action btn-lock ${clip.isLocked ? 'active' : ''}" data-id="${clip.id}" title="${clip.isLocked ? 'Unpin' : 'Pin'}">
            ${pinIcon}
          </button>
          <button class="btn-action btn-copy" data-id="${clip.id}" title="Copy">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 16H6C4.89543 16 4 15.1046 4 14V6C4 4.89543 4.89543 4 6 4H14C15.1046 4 16 4.89543 16 6V8M10 8H18C19.1046 8 20 8.89543 20 10V18C20 19.1046 19.1046 20 18 20H10C8.89543 20 8 19.1046 8 18V10C8 8.89543 8.89543 8 10 8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    const lockBtn = card.querySelector(".btn-lock");
    lockBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleLock(clip.id);
    });
    
    const copyBtn = card.querySelector(".btn-copy");
    copyBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      copyToClipboard(clip.content, copyBtn);
    });

    card.addEventListener("click", () => copyToClipboard(clip.content, copyBtn));

    clipList.appendChild(card);
  });
}

async function toggleLock(clipId) {
  const data = await chrome.storage.local.get({ clipboardHistory: [] });
  const updatedHistory = data.clipboardHistory.map(clip => {
    if (clip.id === clipId) {
      return { ...clip, isLocked: !clip.isLocked };
    }
    return clip;
  });
  await chrome.storage.local.set({ clipboardHistory: updatedHistory });
  renderHistory(document.getElementById("searchBar").value);
}

function copyToClipboard(text, btnElement) {
  navigator.clipboard.writeText(text).then(() => {
    if (btnElement) {
      const originalSVG = btnElement.innerHTML;
      btnElement.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13L9 17L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      btnElement.classList.add('copied');
      setTimeout(() => {
        btnElement.innerHTML = originalSVG;
        btnElement.classList.remove('copied');
      }, 1500);
    }
  });
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}