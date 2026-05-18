# Zomunk Video Generator

A tool for generating short-form flight deal videos for social media. Fill in the deal details, preview live on a phone mockup, and export a ready-to-post 1080×1920 MP4.

Built with [Remotion](https://remotion.dev), React, and TypeScript.

---

## Features

- **Live preview** — see both the list and details screens update as you type
- **One-click render** — exports a polished 13-second vertical video (~4MB)
- **Animated screens** — smooth transitions, price count-up, verified pill reveal
- **Fully customisable** — destination, price, airline, stops, travel class, images
- **Claude Code ready** — open in Claude Code and say "set it up" — it handles the rest

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18 or higher
- [Claude Code](https://claude.ai/code) *(optional — for one-command setup)*

### With Claude Code

```
1. Clone the repo and open the folder in Claude Code
2. Say: "set it up"
3. Claude reads CLAUDE.md and gets everything running
```

### Manually

```bash
# Clone
git clone https://github.com/macjul003/zomunk-video-generator.git
cd zomunk-video-generator

# Install
npm install

# Start the tool
npm run tool
```

Open **http://localhost:3006** in your browser.

---

## Usage

1. Fill in the deal details on the left panel
2. Upload a destination photo and airline logo
3. Watch the live phone preview update in real time
4. Hit **Render Video** — takes ~30–60 seconds
5. The MP4 downloads automatically

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Video rendering | [Remotion](https://remotion.dev) |
| UI framework | React + TypeScript |
| Dev server | Vite |
| Render server | Express + ts-node |
| Icons | [Phosphor Icons](https://phosphoricons.com) |
| Fonts | Plus Jakarta Sans (Google Fonts) |

---

## Project Structure

```
src/
  screens/            # Four animated video screens
    SplashScreen.tsx
    ListScreen.tsx
    DetailsScreen.tsx
    ClosingScreen.tsx
  Composition.tsx     # Timeline and transitions
  Root.tsx            # Remotion entry point
  types/
    DealInput.ts      # Shared input interface
tool/
  ToolApp.tsx         # Tool UI
  DealForm.tsx        # Form fields
server/
  render-server.ts    # Express render API
public/               # Static assets
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run tool` | Start tool UI + render server |
| `npm run dev` | Open Remotion Studio |
| `npm run tool:ui` | Start tool UI only |
| `npm run tool:server` | Start render server only |

---

## Ports

| Port | Service |
|------|---------|
| 3006 | Tool UI |
| 3003 | Render server |
| 3000 | Remotion Studio (optional) |

---

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Open a pull request

---

Built by [Zomunk](https://zomunk.com)
