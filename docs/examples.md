# Examples

Click any diagram to open the fullscreen viewer. These fences use the same `mermaid` syntax you would write in a VitePress page.

## Flowchart

````md
```mermaid
flowchart TD
  User[Author] --> MD[Markdown fence]
  MD --> VP[VitePress]
  VP --> View[Inline diagram]
  View -->|click| FS[Fullscreen viewer]
  FS --> Zoom[Zoom and pan]
  FS --> Save[Download PNG]
```
````

```mermaid
flowchart TD
  User[Author] --> MD[Markdown fence]
  MD --> VP[VitePress]
  VP --> View[Inline diagram]
  View -->|click| FS[Fullscreen viewer]
  FS --> Zoom[Zoom and pan]
  FS --> Save[Download PNG]
```

## Sequence diagram

```mermaid
sequenceDiagram
  actor Author
  participant Config as VitePress config
  participant Theme as Theme
  participant Viewer as Mermaid viewer

  Author->>Config: mermaidMarkdown(md)
  Author->>Config: mermaidPlugin(options)
  Author->>Theme: enhanceMermaid(app)
  Author->>Viewer: ```mermaid fence
  Viewer-->>Author: inline SVG
  Author->>Viewer: open fullscreen
```

## Class diagram

```mermaid
classDiagram
  class mermaidPlugin {
    +options MermaidConfig
    +resolveId()
    +load()
  }
  class mermaidMarkdown {
    +fence(tokens, idx)
  }
  class enhanceMermaid {
    +app VueApp
  }
  mermaidMarkdown --> enhanceMermaid : registers Mermaid
  mermaidPlugin --> enhanceMermaid : provides config
```

## State diagram

```mermaid
stateDiagram-v2
  [*] --> Inline
  Inline --> Fullscreen : click / Enter
  Fullscreen --> Inline : Esc / close
  Fullscreen --> Fullscreen : zoom / pan
```

## Entity-relationship

```mermaid
erDiagram
  SITE ||--o{ PAGE : contains
  PAGE ||--o{ DIAGRAM : embeds
  DIAGRAM {
    string id
    string graph
  }
```

## Mindmap

```mermaid
mindmap
  root((Mermaid Viewer))
    Setup
      mermaidMarkdown
      mermaidPlugin
      enhanceMermaid
    Viewer
      Zoom
      Pan
      Copy source
      Download PNG
    Fences
      mermaid
      mmd
```

## Gantt

```mermaid
gantt
  title Publish a VitePress plugin
  dateFormat YYYY-MM-DD
  section Package
    Extract plugin           :done,    des1, 2026-08-18, 1d
    Publish 0.1.0            :done,    des2, 2026-08-19, 1d
  section Docs
    Write configuration guide :active,  des3, 2026-08-20, 1d
    Add live examples         :         des4, after des3, 1d
```

## Pie chart

```mermaid
pie showData
  title Time spent on a diagram
  "Write the fence" : 25
  "Check the layout" : 40
  "Export a PNG" : 35
```

## Git graph

```mermaid
gitGraph
  commit id: "init"
  commit id: "add mermaid fences"
  branch viewer
  checkout viewer
  commit id: "fullscreen zoom"
  commit id: "PNG export"
  checkout main
  merge viewer
  commit id: "publish npm package"
```

`mmd` works as an alias for `mermaid`:

````md
```mmd
pie title Fence aliases
  "mermaid" : 80
  "mmd" : 20
```
````
