import {defineConfig, loadEnv} from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({command, mode}) => {
    const env = loadEnv(mode, process.cwd(), '')

    return {
        plugins: [
            laravel({
                input: [
                    'resources/sass/app.scss',
                    'resources/js/app.tsx',
                ],
                refresh: true,
            }),
            react(),
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'resources/js'),
                '~': path.resolve(__dirname, 'node_modules') + '/',
            },
        },
        server: {
            host: 'localhost',
            port: 5173,
            hmr: {
                host: 'localhost'
            }
        },
        build: {
            outDir: 'public/build',
            emptyOutDir: true,
            manifest: true
        },
        define: {
            __APP_ENV__: JSON.stringify(env.APP_ENV),
        }
    }
});
