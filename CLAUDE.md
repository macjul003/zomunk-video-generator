# Zomunk Video Generator

A tool for generating flight deal reels as MP4 videos. Fill in deal details, preview live, and render a 1080×1920 video ready to post.

## What this project does

- **Tool UI** — a form where you fill in flight deal data and see a live phone preview
- **Render server** — takes the form data and renders a full MP4 video using Remotion
- **Remotion studio** — optional, for frame-by-frame inspection of the animation

## Getting the latest updates

When a teammate says "pull the latest", "update the app", "get the latest changes", or similar, do the following:

### 1. Pull latest changes

```bash
git pull
```

### 2. Install any new dependencies

```bash
npm install
```

### 3. Restart the tool

```bash
lsof -ti :3003,3006 | xargs kill -9 2>/dev/null; npm run tool
```

Then open http://localhost:3006 — everything is up to date.

---

## First-time setup

When a teammate says "set it up" or "get this running", do the following in order:

### 1. Check Node.js

```bash
node -v
```

Needs to be v18 or higher. If missing or outdated, tell the user to install it from https://nodejs.org and re-open the project.

### 2. Install dependencies

```bash
npm install
```

This takes 1–2 minutes. Wait for it to finish.

### 3. Start the tool

```bash
npm run tool
```

This starts two things at once:
- **Tool UI** at http://localhost:3006 — the form + live preview
- **Render server** at http://localhost:3003 — handles video rendering

Open http://localhost:3006 in the browser.

## How to use the tool

1. Fill in the deal details in the left panel (destination, prices, stops, airline, etc.)
2. Upload a destination image and airline logo (drag & drop or click)
3. Watch the live phone preview on the right update in real time
4. Click **Render Video** — takes ~30–60 seconds
5. The MP4 downloads automatically when done

## Port reference

| Port | What |
|------|------|
| 3006 | Tool UI (Vite) |
| 3003 | Render server (Express + Remotion) |
| 3000 | Remotion Studio (optional, `npm run dev`) |

## Restarting servers

If something stops working or ports are in use:

```bash
# Kill anything on the tool ports
lsof -ti :3003,3006 | xargs kill -9 2>/dev/null; npm run tool
```

## Project structure

```
src/
  screens/          # The four video screens (Splash, List, Details, Closing)
  types/DealInput.ts  # Shared input type — add new fields here first
  Composition.tsx   # Remotion timeline and transitions
  Root.tsx          # Remotion entry point with default props
tool/
  ToolApp.tsx       # Tool UI shell
  DealForm.tsx      # Form fields — add new inputs here
  useObjectUrl.ts   # Converts File objects to blob URLs for preview
server/
  render-server.ts  # Express server that bundles + renders via Remotion
public/             # Static assets (destination images, airline logos)
```

## Adding a new field

1. Add it to `src/types/DealInput.ts`
2. Add a default value in `tool/ToolApp.tsx`, `src/preview-main.tsx`, and `src/Root.tsx`
3. Add an input in `tool/DealForm.tsx`
4. Use it in the relevant screen under `src/screens/`
