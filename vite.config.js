import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // 5175 y no 5173 (ni 5174, que es de la versión B): Rincón del Oeste sigue ocupando el 5173 en esta máquina.
  // strictPort evita que Vite se mueva solo a otro puerto y rompa el CORS.
  server: { port: 5175, strictPort: true },
});
