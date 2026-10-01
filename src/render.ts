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

// 语义强调色（sce_app_docs 定制）：文档里写裸字母占位符（mermaid parser 只接受这种 token，
// var()/引号全被拒——实测），渲染前按主题替换成真实色值，主题切换组件重渲染即自适应。
// 占位符浏览器本不认识，但替换发生在渲染前，浏览器只见合法色值。
const SEMANTIC_COLORS: Record<string, [light: string, dark: string]> = {
  mmdaccent: ['#d9f7e3', '#1d4a2c'], // 强调块底色
  mmdaccentline: ['#0a9447', '#3ddc84'], // 强调描边
}

function applySemanticColors(code: string, isDark: boolean): string {
  let out = code
  for (const [token, [light, dark]] of Object.entries(SEMANTIC_COLORS)) {
    out = out.replaceAll(new RegExp(`\\b${token}\\b`, 'g'), isDark ? dark : light)
  }
  return out
}

export async function renderMermaid(code: string, isDark = false) {
  const mermaid = (await import('mermaid')).default
  await loadPluginConfig()
  code = applySemanticColors(code, isDark)

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
