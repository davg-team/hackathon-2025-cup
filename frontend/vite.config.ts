import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      app: "/src/app/",
      api: "/src/api/",
      features: "/src/features/",
      pages: "/src/pages/",
      shared: "/src/shared/",
      "~@diplodoc": "/node_modules/@diplodoc/",
      url: "url",
    },
  },
  build: {
    rollupOptions: {
      external: [],
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    proxy: {
      "/api/events": {
        target: "https://fsp-platform.online/",
        // target: "https://fsp-platform.ru/",
        secure: false,
        changeOrigin: true,
      },
      "/api/auth": {
        // target: "https://fsp-platform.online/",
        target: "https://fsp-platform.ru/",
        secure: false,
        changeOrigin: true,
      },
      "/api/organizations": {
        target: "https://fsp-platform.online/",
        secure: false,
        changeOrigin: true,
      },
      "/api/analytics": {
        target: "https://fsp-platform.online/",
        secure: false,
        changeOrigin: true,
      },
      "/api/reports": {
        target: "https://fsp-platform.online/",
        secure: false,
        changeOrigin: true,
      },
      "/api/aws_sign_s3": {
        target: "https://fsp-platform.online/",
        changeOrigin: true,
        secure: false,
      },
      "/api/teams": {
        target: "https://fsp-platform.online/",
        changeOrigin: true,
        secure: false,
      },
      "/api/team-events": {
        target: "https://fsp-platform.online/",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
