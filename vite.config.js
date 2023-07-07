import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require("path");
const rawPlugin = require('vite-raw-plugin')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), rawPlugin({fileRegex: /\.md$/})],
  resolve: {
    alias: {
      find: '@/',
      replacement: path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: "build"
  },
  server: {
    strictPort: true,
    hmr: {
      port: 443 // Run the websocket server on the SSL port
    }
  }
})
