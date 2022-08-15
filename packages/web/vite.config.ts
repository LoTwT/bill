import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { createStyleImportPlugin } from "vite-plugin-style-import"
import pxtorem from "postcss-pxtorem"

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
