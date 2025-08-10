import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
import * as path from 'path';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode !== "production";

  return {
    plugins: [
      react({
        babel: {
          plugins: isDev ? ["check-prop-types"] : [],
        },
      }),
      svgr()
    ],
    resolve: {
      alias: {
        '@shared': path.resolve(__dirname, 'src/shared'),
        '@styles': path.resolve(__dirname, 'src/styles'),
        '@images': path.resolve(__dirname, 'src/assets/images'),
      }
    },
    css: {
      modules: {
        localsConvention: 'camelCase', // (Optional) Transforms class names to camelCase in JS
        generateScopedName: isDev
          ? '[name]__[local]__[hash:base64:5]' // Readable class names in dev
          : '[hash:base64:8]', // Short hashes in production
      },
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@styles/vars.scss" as *;
          `, // Global SCSS imports
        },
      },
    },
    server: {
      proxy: {
        // Proxy API requests to your backend (http://localhost:3001)
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/api/, ''), // Remove '/api' prefix
        },
        // Alternatively, proxy specific routes directly:
        // '/posts': 'http://localhost:3001',
      },
    },
  };
});
