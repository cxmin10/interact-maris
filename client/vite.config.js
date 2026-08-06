import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/interact-maris/",

  plugins: [
    react(),
    tailwindcss(),
  ],
});