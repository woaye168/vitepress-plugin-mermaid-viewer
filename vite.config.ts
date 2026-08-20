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
        const clientCssPath = resolve(distDir, 'client.css')
        const clientJs = readFileSync(clientJsPath, 'utf8').replace(
          /^import '\.\/client\.css';?\n/,
          '',
        )

        // VitePress SSR loads the published client entry in Node, which cannot
        // import .css. Inject styles in the browser instead.
        const css = readFileSync(clientCssPath, 'utf8')
        const inject = `const __mvCss = ${JSON.stringify(css)};
if (typeof document !== "undefined" && !document.getElementById("vitepress-plugin-mermaid-viewer-css")) {
  const s = document.createElement("style");
  s.id = "vitepress-plugin-mermaid-viewer-css";
  s.textContent = __mvCss;
  document.head.appendChild(s);
}
`

        writeFileSync(clientJsPath, inject + clientJs)

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
