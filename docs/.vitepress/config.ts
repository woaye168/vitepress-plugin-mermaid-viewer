import { defineConfig } from 'vitepress'
import { mermaidMarkdown, mermaidPlugin } from '../../src/index'

export default defineConfig({
  title: 'Mermaid Viewer',
  titleTemplate: 'vitepress-plugin-mermaid-viewer',
  description:
    'Mermaid diagrams for VitePress with fullscreen zoom, pan, copy, and download.',
  base: '/vitepress-plugin-mermaid-viewer/',
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/' },
      { text: 'Configuration', link: '/configuration' },
      { text: 'Examples', link: '/examples' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/' },
          { text: 'Configuration', link: '/configuration' },
          { text: 'Examples', link: '/examples' },
        ],
      },
    ],
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/syaning/vitepress-plugin-mermaid-viewer',
      },
    ],
    outline: { level: [2, 3] },
  },
  markdown: {
    config(md) {
      mermaidMarkdown(md)
    },
  },
  vite: {
    plugins: [mermaidPlugin()],
  },
})
