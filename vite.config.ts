import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { loadEnv } from 'vite'
import type { Plugin } from 'vite'
import { defineConfig } from 'vitest/config'
import { VitePWA } from 'vite-plugin-pwa'

const srcPath = fileURLToPath(new URL('./src', import.meta.url))
const pwaStubPath = fileURLToPath(
  new URL('./src/lib/pwa/register-sw-stub.ts', import.meta.url),
)
const tombstoneSwPath = fileURLToPath(
  new URL('./src/lib/pwa/tombstone-sw.js', import.meta.url),
)

function tombstoneSwPlugin(): Plugin {
  return {
    name: 'flood-response-tombstone-sw',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'sw.js',
        source: readFileSync(tombstoneSwPath, 'utf8'),
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isPwaEnabled = env.VITE_PWA_ENABLED === 'true'

  return {
    plugins: [
      react(),
      tailwindcss(),
      ...(isPwaEnabled
        ? [
            VitePWA({
              strategies: 'injectManifest',
              srcDir: 'src',
              filename: 'sw.ts',
              registerType: 'prompt',
              manifest: {
                name: 'Flood Response',
                short_name: 'Flood Response',
                description: 'Flood response and relief coordination for Assam.',
                start_url: '/',
                scope: '/',
                display: 'standalone',
                theme_color: '#155dfc',
                background_color: '#f8fafc',
                icons: [
                  {
                    src: '/icons/icon-192.png',
                    sizes: '192x192',
                    type: 'image/png',
                    purpose: 'any',
                  },
                  {
                    src: '/icons/icon-512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'any',
                  },
                  {
                    src: '/icons/icon-512-maskable.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'maskable',
                  },
                ],
              },
              injectManifest: {
                globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
              },
            }),
          ]
        : [tombstoneSwPlugin()]),
    ],
    resolve: {
      alias: {
        '@': srcPath,
        ...(isPwaEnabled
          ? {}
          : {
              'virtual:pwa-register/react': pwaStubPath,
              'virtual:pwa-register': pwaStubPath,
            }),
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/testing/setup.ts'],
      css: true,
      restoreMocks: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['src/**/*.test.{ts,tsx}', 'src/testing/**', 'src/types/**'],
      },
    },
  }
})
