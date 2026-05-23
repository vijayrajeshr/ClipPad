<div align="center">
  <br />
  <img src="icons/icon.png" width="96" alt="ClipPad Logo" />
  <h2>ClipPad</h2>
  <p>
    <b>Professional, local-first contextual clipboard with immutable pinning.</b>
  </p>
  <br />

  <p>
    <a href="https://github.com/vijayrajeshr/ClipPad/stargazers">
      <img src="https://img.shields.io/github/stars/vijayrajeshr/ClipPad?style=for-the-badge&color=A855F7&labelColor=18181B" alt="Stars" />
    </a>
    <a href="https://github.com/vijayrajeshr/ClipPad/network/members">
      <img src="https://img.shields.io/github/forks/vijayrajeshr/ClipPad?style=for-the-badge&color=3B82F6&labelColor=18181B" alt="Forks" />
    </a>
  </p>

  <p>
    <a href="#features">Features</a> •
    <a href="#installation">Installation</a> •
    <a href="#usage">Usage</a> •
    <a href="#architecture">Architecture</a>
  </p>
</div>

---

ClipPad is a modern, elegantly designed clipboard manager built directly into your browser's side panel. It silently captures your copied text, pairs it with the precise context of the webpage you copied it from, and presents it in a highly responsive, glassmorphic interface. 

Never lose track of important snippets, reference links, or notes again.

> **Note:** To truly make this README "animative", it is highly recommended to record a short, 5-second GIF of the extension in use (showing the slide-up card animations and hover effects) and place it right here.

## Features

- **Contextual Capture**  
  Automatically records the page title and source URL alongside your copied text, so you always know exactly where a snippet came from.

- **Persistent Pinning**  
  Lock essential clips in place so they are never overwritten. Pinned clips receive a distinct visual emphasis.

- **Lightning Fast Search**  
  Instantly filter your clipboard history in real-time.

- **Premium Aesthetics**  
  Zinc-inspired dark mode, subtle staggered micro-animations, custom SVG iconography, and glassmorphic header elements.

- **Local-First Privacy**  
  All data is stored securely within your browser's local storage. No external servers, no telemetry.

## Installation

ClipPad is currently available for manual installation in Chrome and Chromium-based browsers.

1. Clone or download this repository:
   ```bash
   git clone https://github.com/vijayrajeshr/ClipPad.git
   ```

2. Open Google Chrome and navigate to your extensions page:
   ```text
   chrome://extensions/
   ```

3. Enable **Developer mode** using the toggle in the top right corner.

4. Click **Load unpacked** and select the directory where you cloned the `ClipPad` repository.

5. *Tip:* Pin the extension to your toolbar and use the shortcut `Ctrl+Shift+K` (or `Cmd+Shift+K` on macOS) to instantly toggle the side panel from any tab.

## Usage

Once installed, ClipPad runs seamlessly in the background. 

1. Highlight and copy any text on a webpage.
2. Open the ClipPad Side Panel.
3. Your copied text will instantly animate into the list, complete with a hyperlink back to the source webpage.
4. Click the **Pin icon** to lock a clip permanently, or click the **Copy icon** to push it back to your active clipboard.

## Architecture

ClipPad is purposefully built with vanilla web technologies to ensure maximum performance, instant load times, and minimal memory overhead.

- **Manifest V3** — Conforms to modern, secure extension standards.
- **Service Workers** — Event-driven background processing via `background.js`.
- **Content Scripts** — Securely extracts context via `content.js`.
- **Vanilla JS & CSS** — Zero bulky dependencies. Pure performance and custom styling.

<br />

<div align="center">
  <p>Developed with precision by <a href="https://github.com/vijayrajeshr">Vijay</a></p>
</div>
