// nuxt.config.ts
import vuetify from "vite-plugin-vuetify";

export default defineNuxtConfig({
  typescript: {
    strict: true,
  },
  ssr: true,
  build: {
    transpile: ["vuetify"],
  },

  css: ["vuetify/styles", "@mdi/font/css/materialdesignicons.css"],

  vite: {
    server: {
      proxy: {
        "/api/": {
          target: process.env.NUXT_PUBLIC_API,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    define: {
      "process.env.DEBUG": false,
    },
    plugins: [
      vuetify({
        autoImport: true,
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`, // ถ้ามีตัวแปร SCSS ที่คุณใช้ในโปรเจค
        },
      },
    },
  },
});
