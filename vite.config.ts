import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
    // Set the base path for the production build
    // base: '/inf513/grupo21sc/Drinks-Ecommerce/public/build/',
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react({
            jsxRuntime: 'automatic',
            include: /\.(tsx|jsx)$/,
            babel: {
                plugins: []
            }
        }),
        tailwindcss(),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./resources/js', import.meta.url)),
            'ziggy-js': fileURLToPath(new URL('./vendor/tightenco/ziggy', import.meta.url)),
        },
    },
    server: {
        hmr: false,
        host: 'localhost',
        port: 5173,
    },
    build: {
        sourcemap: false,
        minify: false,
    },
});