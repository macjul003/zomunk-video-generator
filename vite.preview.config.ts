import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: ".",
  publicDir: "public",
  server: { port: 3002 },
  resolve: {
    alias: {
      remotion: path.resolve("./src/remotion-mock.ts"),
      "@remotion/google-fonts/PlusJakartaSans": path.resolve("./src/remotion-fonts-mock.ts"),
    },
  },
});
