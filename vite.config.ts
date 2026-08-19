import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { defineConfig } from 'vite'

const distDir = resolve(import.meta.dirname, 'dist')

export default defineConfig({
  plugins: [
    vue(),
    dts({
      entryRoot: 'src',
      include: ['src'],
      exclude: ['src/vue.d.ts', 'src/virtual.d.ts'],
      tsconfigPath: resolve(import.meta.dirname, 'tsconfig.json'),
      compilerOptions: {
        skipLibCheck: true,
      },
    }),
    {
      name: 'fix-published-dist',
      closeBundle() {
        const clientJsPath = resolve(distDir, 'client.js')
        const clientJs = readFileSync(clientJsPath, 'utf8')
        if (!clientJs.includes("import './client.css'")) {
          writeFileSync(clientJsPath, `import './client.css'\n${clientJs}`)
        }

        writeFileSync(
          resolve(distDir, 'client.d.ts'),
          [
            "import type { DefineComponent } from 'vue'",
            '',
            'declare const MermaidViewer: DefineComponent<{',
            '  graph: string',
            '  id: string',
            '}>',
            '',
            'export { MermaidViewer }',
            '',
            'export declare function enhanceMermaid(app: {',
            '  component: (name: string, component: unknown) => void',
            '}): void',
            '',
          ].join('\n'),
        )
      },
    },
  ],
  build: {
    lib: {
      entry: {
        index: resolve(import.meta.dirname, 'src/index.ts'),
        client: resolve(import.meta.dirname, 'src/client.ts'),
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: [
        'vue',
        'vitepress',
        'mermaid',
        'vite',
        'virtual:mermaid-viewer-config',
      ],
      output: {
        assetFileNames: 'client.css',
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
})
