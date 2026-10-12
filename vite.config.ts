import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// base: '/' suits a custom domain such as photography.richardmuscat.com.
// If you ever host under a sub-path (e.g. username.github.io/repo/), change it.
export default defineConfig({
  base: '/',
  build: { outDir: 'docs' },
  plugins: [vue(), tailwindcss()],
})
