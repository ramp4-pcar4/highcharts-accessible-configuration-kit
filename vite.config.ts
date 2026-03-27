import { defineConfig } from 'vite';
import type { UserConfigExport } from 'vite';

import vue from '@vitejs/plugin-vue';
import dsv from '@rollup/plugin-dsv';
import path from 'path';

const baseConfig: UserConfigExport = {
    plugins: [
        vue(),
        dsv()
    ],
    base: './',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    build: {
        target: 'esnext'
    },
    server: {
        open: '/index-ca-en.html'
    }
};

export default defineConfig(() => {
    if (process.argv.includes('plugin')) {
        Object.assign(baseConfig.build!, {
            lib: {
                entry: path.resolve(__dirname, './highcharts-plugin.ts'),
                name: 'HighchartsAccessibleConfigurationKit',
                fileName: 'highcharts-accessible-configuration-kit'
            },
            rolldownOptions: {
                external: ['vue', 'pinia', 'vue-final-modal', 'vue-papa-parse'],
                output: {
                    globals: {
                        vue: 'Vue',
                        pinia: 'Pinia',
                        'vue-final-modal': 'VueFinalModal',
                        'vue-papa-parse': 'VuePapaParse'
                    },
                    codeSplitting: false,
                    dir: 'dist'
                }
            },
            copyPublicDir: false
        });
    } else {
        Object.assign(baseConfig.build!, {
            rollupOptions: {
                input: {
                    main: path.resolve(__dirname, 'index.html'),
                    en: path.resolve(__dirname, 'index-ca-en.html'),
                    fr: path.resolve(__dirname, 'index-ca-fr.html')
                }
            }
        });
    }

    return baseConfig;
});
