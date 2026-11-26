import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Second isolated Vite build for the Process Scroll Stack. It writes only to
 * js/scrollstack/ and never touches the FlexCarousel bundle or index.html.
 */
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'js/scrollstack',
        emptyOutDir: true,
        cssCodeSplit: false,
        target: 'es2020',
        lib: {
            entry: 'src/scrollstack/entry.jsx',
            formats: ['es'],
            fileName: () => 'scrollstack.js',
            cssFileName: 'scrollstack'
        },
        rollupOptions: {
            output: {
                inlineDynamicImports: true
            }
        }
    }
});
