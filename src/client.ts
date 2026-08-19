/// <reference path="./vue.d.ts" />
import MermaidViewer from './MermaidViewer.vue'

export { MermaidViewer }

export function enhanceMermaid(app: {
  component: (name: string, component: unknown) => void
}) {
  app.component('Mermaid', MermaidViewer)
}
