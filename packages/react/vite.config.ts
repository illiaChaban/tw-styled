import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react({ include: "pathToAllReactFiles.{jsx,tsx}" })],
    server: {
      port: 3000, // To run the app on port 3000
      open: true, // If we want to open the app once its started
    },
    test: {
      globals: true,
      environment: "jsdom",
    },
  };
});
