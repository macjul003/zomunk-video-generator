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

async function getBundle(): Promise<string> {
  console.log("Bundling Remotion composition (~30s)…");
  const bundleCache = await bundle({
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

const uploadFields = upload.fields([
  { name: "destImage", maxCount: 1 },
  { name: "airlineLogo", maxCount: 1 },
]);

app.post("/render", uploadFields, async (req, res) => {
  const uploadedPaths: string[] = [];
  let outputPath: string | null = null;
  try {
    const deal: DealInput = JSON.parse(req.body.deal);
    const serveUrl = await getBundle();
    const files = req.files as Record<string, Express.Multer.File[]> | undefined;

    const destFile = files?.["destImage"]?.[0];
    if (destFile) {
      uploadedPaths.push(destFile.path);
      const ext = path.extname(destFile.originalname) || ".jpg";
      const filename = `upload-${Date.now()}${ext}`;
      fs.copyFileSync(destFile.path, path.join(serveUrl, filename));
      deal.destinationImageUrl = `/${filename}`;
    }

    const airlineFile = files?.["airlineLogo"]?.[0];
    if (airlineFile) {
      uploadedPaths.push(airlineFile.path);
      const ext = path.extname(airlineFile.originalname) || ".png";
      const filename = `airline-${Date.now()}${ext}`;
      fs.copyFileSync(airlineFile.path, path.join(serveUrl, filename));
      deal.airlineLogoUrl = `/${filename}`;
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
      if (outputPath) fs.unlink(outputPath, () => {});
      for (const p of uploadedPaths) fs.unlink(p, () => {});
    });
  } catch (err) {
    console.error("Render error:", err);
    if (outputPath) fs.unlink(outputPath, () => {});
    for (const p of uploadedPaths) fs.unlink(p, () => {});
    res.status(500).send(err instanceof Error ? err.message : "Render failed");
  }
});

const server = app.listen(PORT, () => {
  console.log(`Render server running on http://localhost:${PORT}`);
});

server.on("error", (err) => {
  console.error("Server error:", err);
  process.exit(1);
});

process.on("SIGINT", () => { server.close(); process.exit(0); });
