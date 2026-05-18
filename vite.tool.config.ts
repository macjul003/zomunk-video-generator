import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: path.resolve("tool"),
  publicDir: path.resolve("public"),
  server: { port: 3004, host: true },
  resolve: {
    alias: [
      // Only alias the exact "remotion" bare import — not sub-paths like "remotion/no-react"
      { find: /^remotion$/, replacement: path.resolve("./src/remotion-mock.ts") },
      { find: "@remotion/google-fonts/PlusJakartaSans", replacement: path.resolve("./src/remotion-fonts-mock.ts") },
    ],
  },
});
