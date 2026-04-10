import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("@stellar/stellar-sdk") ||
            id.includes("@stellar/freighter-api")
          ) {
            return "stellar";
          }
          return undefined;
        },
      },
    },
  },
});
