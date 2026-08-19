import type { MermaidConfig } from 'mermaid'
import type { Plugin } from 'vite'

const virtualId = 'virtual:mermaid-viewer-config'
const resolvedVirtualId = `\0${virtualId}`

export function mermaidPlugin(options: MermaidConfig = {}): Plugin {
  return {
    name: 'vitepress-mermaid-viewer',
    resolveId(id) {
      if (id === virtualId) {
        return resolvedVirtualId
      }
    },
    load(id) {
      if (id === resolvedVirtualId) {
        return `export default ${JSON.stringify(options)}`
      }
    },
    config() {
      return {
        optimizeDeps: {
          include: ['mermaid'],
        },
        ssr: {
          noExternal: ['mermaid'],
        },
      }
    },
  }
}
