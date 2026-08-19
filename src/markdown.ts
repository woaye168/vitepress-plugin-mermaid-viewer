export function mermaidMarkdown(md: {
  renderer: { rules: { fence: Function } }
}) {
  const fence = md.renderer.rules.fence.bind(md.renderer.rules)

  md.renderer.rules.fence = (
    tokens: any[],
    idx: number,
    options: unknown,
    env: unknown,
    slf: unknown,
  ) => {
    const token = tokens[idx]
    const lang = token.info.trim().split(/\s+/)[0]

    if (lang === 'mermaid' || lang === 'mmd') {
      return `<Mermaid id="mermaid-${idx}" graph="${encodeURIComponent(token.content)}"></Mermaid>\n`
    }

    return fence(tokens, idx, options, env, slf)
  }
}
