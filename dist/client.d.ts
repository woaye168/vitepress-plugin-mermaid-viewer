import type { DefineComponent } from 'vue'

declare const MermaidViewer: DefineComponent<{
  graph: string
  id: string
}>

export { MermaidViewer }

export declare function enhanceMermaid(app: {
  component: (name: string, component: unknown) => void
}): void
