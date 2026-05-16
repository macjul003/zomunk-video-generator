import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { enableTailwind } from "@remotion/tailwind-v4";
import type { DealInput } from "../src/types/DealInput";

const PORT = 3003;
const ROOT = path.resolve(__dirname, "..");
const TMP = path.join(ROOT, "tmp");
fs.mkdirSync(path.join(TMP, "renders"), { recursive: true });

const upload = multer({ dest: path.join(TMP, "uploads"), limits: { fileSize: 20 * 1024 * 1024 } });
const app = express();

app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (_req.method === "OPTIONS") { res.sendStatus(204); return; }
  next();
});

let bundleCache: string | null = null;

async function getBundle(): Promise<string> {
  if (bundleCache) return bundleCache;
  console.log("Bundling Remotion composition (one-time, ~30s)…");
  bundleCache = await bundle({
    entryPoint: path.join(ROOT, "src", "index.ts"),
    publicDir: path.join(ROOT, "public"),
    webpackOverride: (config) => enableTailwind(config),
  });
  // Remotion places publicDir files under bundle/public/ but staticFile() resolves to /filename.
  // Copy them to the bundle root so the bundle server can serve them at the expected paths.
  const bundlePublicDir = path.join(bundleCache, "public");
  if (fs.existsSync(bundlePublicDir)) {
    fs.cpSync(bundlePublicDir, bundleCache, { recursive: true });
  }
  console.log("Bundle ready:", bundleCache);
  return bundleCache;
}

app.post("/render", upload.single("destImage"), async (req, res) => {
  let uploadedPath: string | null = null;
  let outputPath: string | null = null;
  try {
    const deal: DealInput = JSON.parse(req.body.deal);
    const serveUrl = await getBundle();

    // If an image was uploaded, copy it into the bundle dir so Remotion's server can serve it
    if (req.file) {
      uploadedPath = req.file.path;
      const ext = path.extname(req.file.originalname) || ".jpg";
      const filename = `upload-${Date.now()}${ext}`;
      const dest = path.join(serveUrl, filename);
      fs.copyFileSync(uploadedPath, dest);
      deal.destinationImageUrl = `/${filename}`;
    }

    const props = deal as unknown as Record<string, unknown>;
    const composition = await selectComposition({
      serveUrl,
      id: "ZomunkReel",
      inputProps: props,
    });

    outputPath = path.join(TMP, "renders", `render-${Date.now()}.mp4`);
    await renderMedia({
      composition,
      serveUrl,
      codec: "h264",
      outputLocation: outputPath,
      inputProps: props,
      onProgress: ({ progress }) => {
        process.stdout.write(`\rRendering: ${Math.round(progress * 100)}%`);
      },
    });
    console.log("\nRender complete:", outputPath);

    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Disposition", `attachment; filename="zomunk-deal.mp4"`);
    const stream = fs.createReadStream(outputPath);
    stream.pipe(res);
    stream.on("close", () => {
      fs.unlink(outputPath!, () => {});
      if (uploadedPath) fs.unlink(uploadedPath, () => {});
    });
  } catch (err) {
    console.error("Render error:", err);
    if (outputPath) fs.unlink(outputPath, () => {});
    if (uploadedPath) fs.unlink(uploadedPath, () => {});
    res.status(500).send(err instanceof Error ? err.message : "Render failed");
  }
});

const server = app.listen(PORT, () => {
  console.log(`Render server running on http://localhost:${PORT}`);
  // Pre-warm the bundle
  getBundle().catch(console.error);
});

server.on("error", (err) => {
  console.error("Server error:", err);
  process.exit(1);
});

// Keep process alive
process.on("SIGINT", () => { server.close(); process.exit(0); });
