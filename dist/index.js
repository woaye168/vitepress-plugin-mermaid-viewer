function c(e) {
  const r = e.renderer.rules.fence.bind(e.renderer.rules);
  e.renderer.rules.fence = (i, n, a, s, u) => {
    const t = i[n], m = t.info.trim().split(/\s+/)[0];
    return m === "mermaid" || m === "mmd" ? `<Mermaid id="mermaid-${n}" graph="${encodeURIComponent(t.content)}"></Mermaid>
` : r(i, n, a, s, u);
  };
}
const d = "virtual:mermaid-viewer-config", o = `\0${d}`;
function l(e = {}) {
  return {
    name: "vitepress-mermaid-viewer",
    resolveId(r) {
      if (r === d)
        return o;
    },
    load(r) {
      if (r === o)
        return `export default ${JSON.stringify(e)}`;
    },
    config() {
      return {
        optimizeDeps: {
          include: ["mermaid"]
        },
        ssr: {
          noExternal: ["mermaid"]
        }
      };
    }
  };
}
export {
  c as mermaidMarkdown,
  l as mermaidPlugin
};
//# sourceMappingURL=index.js.map
