import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { createStyleImportPlugin } from "vite-plugin-style-import"
import pxtorem from "postcss-pxtorem"
import path from "node:path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    createStyleImportPlugin({
      libs: [
        {
          libraryName: "zarm",
          esModule: true,
          resolveStyle: (name) => {
            return `zarm/es/${name}/style/css`
          },
        },
      ],
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://api.chennick.wang",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // src 路径
      utils: path.resolve(__dirname, "src/utils"), // src 路径
    },
  },
  css: {
    modules: {
      localsConvention: "dashesOnly",
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
    postcss: {
      plugins: [
        pxtorem({
          rootValue: 37.5,
          propList: ["*"],
          selectorBlackList: [".norem"],
        }),
      ],
    },
  },
  optimizeDeps: {
    exclude: ["consola"],
  },
})
