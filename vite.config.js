import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/portfolio-website/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        reaction: resolve(__dirname, 'reaction-time/index.html'),
        pathfinding: resolve(__dirname, 'pathfinding-algorithms-visualizer/index.html'),
      },
    },
  },
})
