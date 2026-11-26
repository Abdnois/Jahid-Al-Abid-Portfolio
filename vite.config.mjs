import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * The portfolio itself is a static Framer export and is NOT processed by Vite.
 * Only the FlexCarousel is built here, as a self-contained ES module that
 * bundles React, ReactDOM and OGL. The vanilla loader imports it on demand at
 * <=1024px, so desktop never downloads or executes it.
 */
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'js/flexcarousel',
    emptyOutDir: true,
    cssCodeSplit: false,
    target: 'es2020',
    lib: {
      entry: 'src/flexcarousel/entry.jsx',
      formats: ['es'],
      fileName: () => 'flexcarousel.js',
      cssFileName: 'flexcarousel'
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    }
  }
});
