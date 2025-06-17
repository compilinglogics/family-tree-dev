import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  optimizeDeps: {
    include: ["lamejs", '@ffmpeg/ffmpeg'],
  },
  build: {
    target: 'es2015',
  },
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
});
