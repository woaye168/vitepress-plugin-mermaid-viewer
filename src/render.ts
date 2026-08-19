/// <reference path="./virtual.d.ts" />
import type { MermaidConfig } from 'mermaid'

let renderCount = 0
let pluginConfig: Record<string, unknown> = {}
let configLoaded = false

async function loadPluginConfig() {
  if (configLoaded) {
    return
  }
  try {
    pluginConfig = (await import('virtual:mermaid-viewer-config')).default
  } catch {
    pluginConfig = {}
  }
  configLoaded = true
}

function asTheme(value: unknown) {
  return typeof value === 'string' && value.trim() ? value : ''
}

function resolveTheme(isDark: boolean): NonNullable<MermaidConfig['theme']> {
  const configured = asTheme(pluginConfig.theme)
  if (configured) {
    return configured as NonNullable<MermaidConfig['theme']>
  }
  return isDark ? 'dark' : 'default'
}

export async function renderMermaid(code: string, isDark = false) {
  const mermaid = (await import('mermaid')).default
  await loadPluginConfig()

  const theme = resolveTheme(isDark)

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    ...pluginConfig,
    theme,
  })

  renderCount += 1
  const { svg } = await mermaid.render(`mermaid-svg-${renderCount}`, code)
  return svg
}
