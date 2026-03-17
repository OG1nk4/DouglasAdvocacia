import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                blog1: resolve(__dirname, 'blog/direitos-digitais-influencers.html'),
                blog2: resolve(__dirname, 'blog/guarda-compartilhada.html'),
                blog3: resolve(__dirname, 'blog/cobrancas-indevidas.html'),
                blog4: resolve(__dirname, 'blog/rescisao-trabalhista.html'),
                blog5: resolve(__dirname, 'blog/planejamento-tributario.html'),
                blog6: resolve(__dirname, 'blog/contratos-rurais.html'),
            },
        },
    },
});
