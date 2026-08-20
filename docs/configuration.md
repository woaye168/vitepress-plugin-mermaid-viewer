# Configuration

The plugin is three small pieces: a markdown fence helper, a Vite plugin that holds Mermaid options, and a theme registration function. None of them wraps the VitePress config.

## `mermaidMarkdown(md)`

Import from `vitepress-plugin-mermaid-viewer` and call it inside `markdown.config`.

It intercepts fenced code blocks whose language is `mermaid` or `mmd` and renders:

```html
<Mermaid id="mermaid-N" graph="..."></Mermaid>
```

`graph` is the fence body, URI-encoded. Every other fence is left to the original Markdown renderer.

```ts
import { mermaidMarkdown } from 'vitepress-plugin-mermaid-viewer'

export default {
  markdown: {
    config(md) {
      mermaidMarkdown(md)
      // other markdown-it plugins can be registered here as well
    },
  },
}
```

The `Mermaid` component must be registered in the theme, or the custom element will not render.

## `mermaidPlugin(options?)`

Import from `vitepress-plugin-mermaid-viewer` and add it to `vite.plugins`.

```ts
import { mermaidPlugin } from 'vitepress-plugin-mermaid-viewer'

export default {
  vite: {
    plugins: [mermaidPlugin()],
  },
}
```

The Vite plugin does two things:

1. Exposes `options` to the client through `virtual:mermaid-viewer-config`.
2. Tells Vite to pre-bundle Mermaid and keep it in the SSR bundle (`optimizeDeps.include` and `ssr.noExternal`).

`options` is a [Mermaid `MermaidConfig`](https://mermaid.js.org/config/setup/modules/config.html). It is passed to `mermaid.initialize()` on the client.

### Theme

| `theme` in `mermaidPlugin()` | Result |
| --- | --- |
| omitted | Light pages use Mermaid `default`. Dark pages use `dark`. |
| set, for example `'forest'` | Every diagram uses that theme, in both light and dark mode. |

```ts
mermaidPlugin({
  theme: 'forest',
})
```

Supported built-in values include `default`, `neutral`, `dark`, `forest`, and `base`. See the [Mermaid theme list](https://mermaid.js.org/config/theming.html).

### Other Mermaid options

Any other initialize option can be passed through. These are applied on every render, together with `startOnLoad: false` and `securityLevel: 'loose'`.

```ts
mermaidPlugin({
  flowchart: {
    htmlLabels: true,
    curve: 'basis',
  },
  sequence: {
    actorMargin: 60,
  },
})
```

`theme` from the options object always wins over the light / dark default if you set it.

## `enhanceMermaid(app)`

Import from `vitepress-plugin-mermaid-viewer/client` only. That entry loads Vue and the viewer; using it in `.vitepress/config` would pull the browser bundle into Node.

```ts
import { enhanceMermaid } from 'vitepress-plugin-mermaid-viewer/client'

enhanceMermaid(app)
```

It is equivalent to:

```ts
import { MermaidViewer } from 'vitepress-plugin-mermaid-viewer/client'

app.component('Mermaid', MermaidViewer)
```

Use the helper unless you need a different component name.

## Full example

```ts
// .vitepress/config.ts
import { defineConfig } from 'vitepress'
import { mermaidMarkdown, mermaidPlugin } from 'vitepress-plugin-mermaid-viewer'

export default defineConfig({
  markdown: {
    config(md) {
      mermaidMarkdown(md)
    },
  },
  vite: {
    plugins: [
      mermaidPlugin({
        flowchart: { htmlLabels: true },
      }),
    ],
  },
})
```

```ts
// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import { enhanceMermaid } from 'vitepress-plugin-mermaid-viewer/client'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    enhanceMermaid(app)
  },
}
```
