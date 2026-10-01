const __mvCss = ".mermaid-block[data-v-d9fc4468]{position:relative;margin:1em 0;cursor:zoom-in}.mermaid-block .mermaid[data-v-d9fc4468]{overflow-x:auto}.mermaid-error[data-v-d9fc4468]{margin:0;padding:.75rem 1rem;color:var(--vp-c-danger-1, #b42318);font-size:.85rem;white-space:pre-wrap}.mermaid-toolbar[data-v-d9fc4468]{position:absolute;top:1rem;right:1rem;z-index:2;display:flex;align-items:center;gap:.25rem;padding:.35rem .4rem;border-radius:8px;background:var(--vp-c-bg-elv);border:1px solid var(--vp-c-divider);box-shadow:0 8px 24px #00000014}.mermaid-btn[data-v-d9fc4468]{-webkit-appearance:none;-moz-appearance:none;appearance:none;display:flex;align-items:center;justify-content:center;width:2rem;height:2rem;padding:0;border:none;border-radius:6px;background:transparent;color:var(--vp-c-text-2);cursor:pointer}.mermaid-btn[data-v-d9fc4468]:hover{color:var(--vp-c-text-1);background:var(--vp-c-bg-soft)}.mermaid-btn.copied[data-v-d9fc4468]{color:var(--vp-c-brand-1)}.mermaid-btn svg[data-v-d9fc4468]{width:1.1rem;height:1.1rem;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.mermaid-download[data-v-d9fc4468]{position:relative}.mermaid-download-menu[data-v-d9fc4468]{position:absolute;top:calc(100% + .35rem);right:0;z-index:3;min-width:5.5rem;padding:.25rem;border-radius:8px;background:var(--vp-c-bg-elv);border:1px solid var(--vp-c-divider);box-shadow:0 8px 24px #00000014}.mermaid-download-item[data-v-d9fc4468]{-webkit-appearance:none;-moz-appearance:none;appearance:none;display:block;width:100%;padding:.4rem .65rem;border:none;border-radius:6px;background:transparent;color:var(--vp-c-text-1);font:inherit;font-size:.85rem;text-align:left;cursor:pointer}.mermaid-download-item[data-v-d9fc4468]:hover{background:var(--vp-c-bg-soft)}.mermaid-fs[data-v-d9fc4468]{width:100vw;height:100vh;max-width:none;max-height:none;margin:0;padding:0;border:0;background:var(--vp-c-bg);color:var(--vp-c-text-1);user-select:none;-webkit-user-select:none;outline:none}.mermaid-fs[data-v-d9fc4468]::backdrop{background:#1414128c}.mermaid-fs-stage[data-v-d9fc4468]{position:relative;width:100%;height:100%;overflow:hidden;cursor:grab}.mermaid-fs-stage.dragging[data-v-d9fc4468]{cursor:grabbing}.mermaid-fs-canvas[data-v-d9fc4468]{position:absolute;left:50%;top:50%;transform-origin:center center}.mermaid-fs-canvas[data-v-d9fc4468] svg{display:block;height:auto;max-width:none!important}\n";
if (typeof document !== "undefined" && !document.getElementById("vitepress-plugin-mermaid-viewer-css")) {
  const s = document.createElement("style");
  s.id = "vitepress-plugin-mermaid-viewer-css";
  s.textContent = __mvCss;
  document.head.appendChild(s);
}
import { defineComponent as zt, ref as p, computed as ht, watch as Ft, onMounted as Dt, onUnmounted as Rt, openBlock as C, createElementBlock as k, withKeys as gt, withModifiers as B, createCommentVNode as R, toDisplayString as pt, createElementVNode as l, Fragment as $t, renderList as Vt, normalizeClass as vt, normalizeStyle as Nt, nextTick as $ } from "vue";
const Zt = '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", sans-serif';
let G = {}, wt = !1;
async function It() {
  if (!wt) {
    try {
      G = (await import("virtual:mermaid-viewer-config")).default;
    } catch {
      G = {};
    }
    wt = !0;
  }
}
function Wt() {
  const n = G.themeVariables;
  if (!n || typeof n != "object")
    return "";
  const i = n.fontFamily;
  return typeof i == "string" && i.trim() ? i.trim() : "";
}
function qt(n) {
  const i = n.querySelector("text, tspan, foreignObject span, foreignObject div, foreignObject p") || n, o = getComputedStyle(i).fontFamily;
  return o && o !== "initial" ? o : "";
}
function Ut(n) {
  return Wt() || qt(n) || Zt;
}
function Yt(n) {
  var r;
  const i = (n == null ? void 0 : n.querySelector("span, div, p")) || n, o = i && "innerHTML" in i ? i.innerHTML : "";
  if (o)
    return o.split(/<br\s*\/?>/i).map((u) => u.replace(/<[^>]+>/g, "").trim()).filter(Boolean);
  const a = ((r = n == null ? void 0 : n.textContent) == null ? void 0 : r.trim()) ?? "";
  return a ? [a] : [];
}
function Xt(n, i, o) {
  const a = Yt(i || n);
  if (!a.length) {
    n.remove();
    return;
  }
  const r = parseFloat(n.getAttribute("x") || "0"), u = parseFloat(n.getAttribute("y") || "0"), c = parseFloat(n.getAttribute("width") || "0"), f = parseFloat(n.getAttribute("height") || "0"), m = i == null ? void 0 : i.querySelector("span, div, p"), d = m ? getComputedStyle(m) : null, b = parseFloat((d == null ? void 0 : d.fontSize) || "16") * 1.2, h = u + f / 2 - (a.length - 1) * b / 2, g = document.createElementNS("http://www.w3.org/2000/svg", "text");
  g.setAttribute("x", String(r + c / 2)), g.setAttribute("y", String(h)), g.setAttribute("text-anchor", "middle"), g.setAttribute("dominant-baseline", "central"), g.setAttribute("font-family", o), d && (g.setAttribute("font-size", d.fontSize), g.setAttribute("font-weight", d.fontWeight), g.setAttribute("fill", d.color)), a.forEach((A, M) => {
    const x = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "tspan"
    );
    x.setAttribute("x", String(r + c / 2)), x.setAttribute("dy", M === 0 ? "0" : String(b)), x.setAttribute("font-family", o), x.textContent = A, g.appendChild(x);
  }), n.replaceWith(g);
}
function Gt(n, i) {
  const o = n.cloneNode(!0);
  o.removeAttribute("style"), o.querySelectorAll("text, tspan").forEach((u) => {
    u.setAttribute("font-family", i);
  });
  const a = n.querySelectorAll("foreignObject");
  o.querySelectorAll("foreignObject").forEach((u, c) => {
    Xt(u, a[c], i);
  });
  const r = document.createElementNS("http://www.w3.org/2000/svg", "style");
  return r.textContent = `text, tspan { font-family: ${i} !important; }`, o.appendChild(r), o;
}
function Kt(n, i) {
  var f;
  const a = Gt(n, i), r = (f = n.viewBox) == null ? void 0 : f.baseVal;
  let u = 0, c = 0;
  if (r != null && r.width && (r != null && r.height))
    u = r.width, c = r.height;
  else
    try {
      const m = n.getBBox();
      u = m.width, c = m.height;
    } catch {
      u = n.clientWidth || 800, c = n.clientHeight || 600;
    }
  return a.setAttribute("width", String(Math.ceil(u))), a.setAttribute("height", String(Math.ceil(c))), a.setAttribute("xmlns", "http://www.w3.org/2000/svg"), a.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink"), {
    xml: '<?xml version="1.0" encoding="UTF-8"?>' + new XMLSerializer().serializeToString(a),
    width: u,
    height: c
  };
}
function X(n, i) {
  const o = URL.createObjectURL(n), a = document.createElement("a");
  a.href = o, a.download = i, a.click(), URL.revokeObjectURL(o);
}
const Jt = {
  png: "image/png",
  jpeg: "image/jpeg"
};
async function Qt(n, i, o, a) {
  const r = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(n)}`, u = new Image();
  await new Promise((y, b) => {
    u.onload = () => y(), u.onerror = b, u.src = r;
  });
  const c = 2, f = document.createElement("canvas");
  f.width = Math.max(1, Math.ceil(i * c)), f.height = Math.max(1, Math.ceil(o * c));
  const m = f.getContext("2d");
  if (!m)
    return null;
  const d = getComputedStyle(document.documentElement).getPropertyValue("--vp-c-bg").trim() || "#ffffff";
  return m.fillStyle = d, m.fillRect(0, 0, f.width, f.height), m.drawImage(u, 0, 0, f.width, f.height), new Promise((y) => {
    f.toBlob(
      y,
      Jt[a],
      a === "jpeg" ? 0.92 : void 0
    );
  });
}
async function te(n, i = "png") {
  await It();
  const o = Ut(n), { xml: a, width: r, height: u } = Kt(n, o), c = new Blob([a], { type: "image/svg+xml;charset=utf-8" });
  if (i === "svg") {
    X(c, "mermaid-diagram.svg");
    return;
  }
  try {
    const f = await Qt(a, r, u, i);
    if (f) {
      X(f, `mermaid-diagram.${i === "jpeg" ? "jpg" : i}`);
      return;
    }
  } catch {
  }
  X(c, "mermaid-diagram.svg");
}
let yt = 0, N = {}, bt = !1;
async function ee() {
  if (!bt) {
    try {
      N = (await import("virtual:mermaid-viewer-config")).default;
    } catch {
      N = {};
    }
    bt = !0;
  }
}
function ne(n) {
  return typeof n == "string" && n.trim() ? n : "";
}
function ie(n) {
  const i = ne(N.theme);
  return i || (n ? "dark" : "default");
}
const oe = {
  mmdaccent: ["#d9f7e3", "#1d4a2c"],
  // 强调块底色
  mmdaccentline: ["#0a9447", "#3ddc84"]
  // 强调描边
};
function ae(n, i) {
  let o = n;
  for (const [a, [r, u]] of Object.entries(oe))
    o = o.replaceAll(new RegExp(`\\b${a}\\b`, "g"), i ? u : r);
  return o;
}
async function re(n, i = !1) {
  const o = (await import("mermaid")).default;
  await ee(), n = ae(n, i);
  const a = ie(i);
  o.initialize({
    startOnLoad: !1,
    securityLevel: "loose",
    ...N,
    theme: a
  }), yt += 1;
  const { svg: r } = await o.render(`mermaid-svg-${yt}`, n);
  return r;
}
const le = ["id", "onKeydown"], se = ["innerHTML"], ue = {
  key: 1,
  class: "mermaid-error"
}, ce = { class: "mermaid-download" }, de = ["aria-expanded"], fe = {
  key: 0,
  class: "mermaid-download-menu",
  role: "menu",
  "aria-label": "Download format"
}, me = ["onClick"], he = ["title", "aria-label"], ge = {
  key: 0,
  viewBox: "0 0 24 24",
  "aria-hidden": "true"
}, pe = {
  key: 1,
  viewBox: "0 0 24 24",
  "aria-hidden": "true"
}, ve = ["innerHTML"], we = 0.25, ye = 8, V = 1.2, xt = 1.12, be = /* @__PURE__ */ zt({
  inheritAttrs: !1,
  __name: "MermaidViewer",
  props: {
    graph: {},
    id: {}
  },
  setup(n) {
    const i = n, o = [
      { id: "png", label: "PNG" },
      { id: "svg", label: "SVG" },
      { id: "jpeg", label: "JPEG" }
    ], a = p(""), r = p(""), u = p(null), c = p(null), f = p(null), m = p(null), d = p(!1), y = p(!1), b = p(!1), h = p(1), g = p(0), A = p(0), M = p(0), x = p(0), T = p(!1);
    let _ = null, Z = 0, I = 0, j = null, z = !1, K = 0, J = 0, Q = 0, tt = 0, E = 1, O = null, P = 0;
    const W = (t) => Math.min(ye, Math.max(we, t)), F = ht(() => {
      try {
        return decodeURIComponent(i.graph);
      } catch {
        return i.graph;
      }
    }), St = ht(() => ({
      transform: `translate(-50%, -50%) translate(${M.value}px, ${x.value}px)`
    }));
    function q() {
      return document.documentElement.classList.contains("dark");
    }
    function et(t) {
      if (!t || t.includes("%"))
        return 0;
      const e = Number.parseFloat(t);
      return e > 0 ? e : 0;
    }
    function Mt(t) {
      var w;
      const e = et(t.getAttribute("width")), s = et(t.getAttribute("height"));
      if (e > 0 && s > 0)
        return { width: e, height: s };
      const v = (w = t.viewBox) == null ? void 0 : w.baseVal;
      if (v && v.width > 0 && v.height > 0)
        return { width: v.width, height: v.height };
      try {
        const S = t.getBBox();
        if (S.width > 0 && S.height > 0)
          return { width: S.width, height: S.height };
      } catch {
      }
      return { width: 0, height: 0 };
    }
    function nt() {
      var e;
      const t = (e = c.value) == null ? void 0 : e.querySelector("svg");
      return t instanceof SVGSVGElement ? t : null;
    }
    function Ct(t) {
      t.removeAttribute("width"), t.removeAttribute("height"), t.style.setProperty("max-width", "none", "important"), t.style.setProperty("max-height", "none", "important");
    }
    function L() {
      const t = nt();
      if (!t || g.value <= 0 || A.value <= 0)
        return;
      Ct(t);
      const e = g.value * h.value, s = A.value * h.value;
      t.style.width = `${e}px`, t.style.height = `${s}px`, c.value && (c.value.style.width = `${e}px`, c.value.style.height = `${s}px`);
    }
    function it() {
      const t = nt(), e = m.value;
      if (!t || !e)
        return;
      const s = Mt(t);
      if (!(s.width > 0 && s.height > 0))
        return;
      const v = (e.clientWidth || window.innerWidth) * 0.92, w = (e.clientHeight || window.innerHeight) * 0.92;
      if (!(v > 0 && w > 0))
        return;
      const S = Math.min(v / s.width, w / s.height, 1);
      g.value = s.width * S, A.value = s.height * S, L();
    }
    async function ot() {
      const t = ++I, e = q();
      j = e;
      try {
        const s = await re(F.value, e);
        if (t !== I)
          return;
        a.value = s, r.value = "", d.value && (await $(), it());
      } catch (s) {
        if (t !== I)
          return;
        r.value = s instanceof Error ? s.message : String(s);
      }
    }
    function U(t, e, s) {
      const v = m.value, w = W(t), S = h.value;
      if (w === S)
        return;
      if (!v) {
        h.value = w, L();
        return;
      }
      const D = v.getBoundingClientRect(), dt = e - D.left - D.width / 2, ft = s - D.top - D.height / 2, mt = w / S;
      M.value = dt - (dt - M.value) * mt, x.value = ft - (ft - x.value) * mt, h.value = w, L();
    }
    function kt(t, e, s) {
      E *= t, O = { clientX: e, clientY: s }, !P && (P = requestAnimationFrame(() => {
        if (P = 0, !O || E === 1) {
          E = 1, O = null;
          return;
        }
        const v = h.value * E, w = O;
        E = 1, O = null, U(v, w.clientX, w.clientY);
      }));
    }
    function at() {
      const t = m.value;
      if (!t) {
        h.value = W(h.value * V), L();
        return;
      }
      const e = t.getBoundingClientRect();
      U(h.value * V, e.left + e.width / 2, e.top + e.height / 2);
    }
    function rt() {
      const t = m.value;
      if (!t) {
        h.value = W(h.value / V), L();
        return;
      }
      const e = t.getBoundingClientRect();
      U(h.value / V, e.left + e.width / 2, e.top + e.height / 2);
    }
    function H() {
      h.value = 1, M.value = 0, x.value = 0, L();
    }
    function At() {
      z || (document.addEventListener("keydown", ut), z = !0);
    }
    function lt() {
      z && (document.removeEventListener("keydown", ut), z = !1);
    }
    async function Y() {
      var t, e;
      d.value = !0, H(), g.value = 0, A.value = 0, await $(), (t = f.value) == null || t.showModal(), (e = f.value) == null || e.focus(), await $(), it();
    }
    function st() {
      var t;
      (t = f.value) == null || t.close();
    }
    async function Et() {
      var t;
      d.value = !1, T.value = !1, y.value = !1, b.value = !1, H(), await $(), (t = u.value) == null || t.blur();
    }
    function Ot(t) {
      var e;
      d.value || (e = window.getSelection()) != null && e.toString() || (t.preventDefault(), Y());
    }
    function ut(t) {
      d.value && (t.key === "0" ? H() : t.key === "+" || t.key === "=" ? at() : (t.key === "-" || t.key === "_") && rt());
    }
    function Lt(t) {
      if (!d.value)
        return;
      t.preventDefault();
      const e = t.deltaY > 0 ? 1 / xt : xt;
      kt(e, t.clientX, t.clientY);
    }
    function Bt(t) {
      Ht(), !(!d.value || t.button !== 0) && (T.value = !0, K = t.clientX, J = t.clientY, Q = M.value, tt = x.value, t.currentTarget.setPointerCapture(t.pointerId));
    }
    function Tt(t) {
      T.value && (M.value = Q + (t.clientX - K), x.value = tt + (t.clientY - J));
    }
    function ct() {
      T.value = !1;
    }
    async function _t() {
      if (F.value) {
        try {
          await navigator.clipboard.writeText(F.value);
        } catch {
          const t = document.createElement("textarea");
          t.value = F.value, t.setAttribute("readonly", ""), t.style.position = "fixed", t.style.left = "-9999px", document.body.appendChild(t), t.select(), document.execCommand("copy"), t.remove();
        }
        y.value = !0, window.clearTimeout(Z), Z = window.setTimeout(() => {
          y.value = !1;
        }, 1500);
      }
    }
    function Pt() {
      b.value = !b.value;
    }
    function Ht() {
      b.value = !1;
    }
    function jt(t) {
      b.value = !1;
      const e = d.value ? c.value : u.value, s = e == null ? void 0 : e.querySelector("svg");
      s && te(s, t);
    }
    return Ft(d, (t) => {
      t ? At() : lt();
    }), Dt(() => {
      j = q(), _ = new MutationObserver(() => {
        const t = q();
        t !== j && (j = t, ot());
      }), _.observe(document.documentElement, {
        attributes: !0,
        attributeFilter: ["class"]
      }), ot();
    }), Rt(() => {
      lt(), _ == null || _.disconnect(), window.clearTimeout(Z), P && cancelAnimationFrame(P), E = 1, O = null;
    }), (t, e) => (C(), k("div", {
      id: n.id,
      ref_key: "root",
      ref: u,
      class: "mermaid-block",
      role: "button",
      tabindex: "0",
      title: "Open fullscreen",
      "aria-label": "Open mermaid fullscreen",
      onClick: Ot,
      onKeydown: [
        gt(B(Y, ["prevent"]), ["enter"]),
        gt(B(Y, ["prevent"]), ["space"])
      ]
    }, [
      d.value ? R("", !0) : (C(), k("div", {
        key: 0,
        class: "mermaid",
        innerHTML: a.value
      }, null, 8, se)),
      r.value && !d.value ? (C(), k("pre", ue, pt(r.value), 1)) : R("", !0),
      d.value ? (C(), k("dialog", {
        key: 2,
        ref_key: "dialog",
        ref: f,
        class: "mermaid-fs",
        tabindex: "-1",
        "aria-label": "Mermaid fullscreen preview",
        onClose: Et,
        onClick: B(st, ["self"])
      }, [
        l("div", {
          class: "mermaid-toolbar",
          onPointerdown: e[0] || (e[0] = B(() => {
          }, ["prevent", "stop"])),
          onMousedown: e[1] || (e[1] = B(() => {
          }, ["prevent", "stop"])),
          onClick: e[2] || (e[2] = B(() => {
          }, ["stop"]))
        }, [
          l("button", {
            type: "button",
            class: "mermaid-btn",
            title: "Zoom in",
            "aria-label": "Zoom in",
            onClick: at
          }, [...e[3] || (e[3] = [
            l("svg", {
              viewBox: "0 0 24 24",
              "aria-hidden": "true"
            }, [
              l("circle", {
                cx: "11",
                cy: "11",
                r: "7"
              }),
              l("path", { d: "M20 20l-3.5-3.5" }),
              l("path", { d: "M11 8v6M8 11h6" })
            ], -1)
          ])]),
          l("button", {
            type: "button",
            class: "mermaid-btn",
            title: "Zoom out",
            "aria-label": "Zoom out",
            onClick: rt
          }, [...e[4] || (e[4] = [
            l("svg", {
              viewBox: "0 0 24 24",
              "aria-hidden": "true"
            }, [
              l("circle", {
                cx: "11",
                cy: "11",
                r: "7"
              }),
              l("path", { d: "M20 20l-3.5-3.5" }),
              l("path", { d: "M8 11h6" })
            ], -1)
          ])]),
          l("button", {
            type: "button",
            class: "mermaid-btn",
            title: "Reset view",
            "aria-label": "Reset view",
            onClick: H
          }, [...e[5] || (e[5] = [
            l("svg", {
              viewBox: "0 0 24 24",
              "aria-hidden": "true"
            }, [
              l("path", { d: "M15 3h6v6" }),
              l("path", { d: "M9 21H3v-6" }),
              l("path", { d: "M21 3l-7 7M3 21l7-7" })
            ], -1)
          ])]),
          l("div", ce, [
            l("button", {
              type: "button",
              class: "mermaid-btn",
              title: "Download",
              "aria-label": "Download",
              "aria-haspopup": "menu",
              "aria-expanded": b.value,
              onClick: Pt
            }, [...e[6] || (e[6] = [
              l("svg", {
                viewBox: "0 0 24 24",
                "aria-hidden": "true"
              }, [
                l("path", { d: "M12 4v11" }),
                l("path", { d: "M7 11l5 5 5-5" }),
                l("path", { d: "M5 19h14" })
              ], -1)
            ])], 8, de),
            b.value ? (C(), k("div", fe, [
              (C(), k($t, null, Vt(o, (s) => l("button", {
                key: s.id,
                type: "button",
                class: "mermaid-download-item",
                role: "menuitem",
                onClick: (v) => jt(s.id)
              }, pt(s.label), 9, me)), 64))
            ])) : R("", !0)
          ]),
          l("button", {
            type: "button",
            class: vt(["mermaid-btn", { copied: y.value }]),
            title: y.value ? "Copied" : "Copy code",
            "aria-label": y.value ? "Copied" : "Copy code",
            onClick: _t
          }, [
            y.value ? (C(), k("svg", ge, [...e[7] || (e[7] = [
              l("path", { d: "M5 13l4 4L19 7" }, null, -1)
            ])])) : (C(), k("svg", pe, [...e[8] || (e[8] = [
              l("rect", {
                x: "8",
                y: "8",
                width: "12",
                height: "12",
                rx: "2"
              }, null, -1),
              l("path", { d: "M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" }, null, -1)
            ])]))
          ], 10, he),
          l("button", {
            type: "button",
            class: "mermaid-btn",
            title: "Close",
            "aria-label": "Close",
            onClick: st
          }, [...e[9] || (e[9] = [
            l("svg", {
              viewBox: "0 0 24 24",
              "aria-hidden": "true"
            }, [
              l("path", { d: "M6 6l12 12M18 6L6 18" })
            ], -1)
          ])])
        ], 32),
        l("div", {
          ref_key: "stage",
          ref: m,
          class: vt(["mermaid-fs-stage", { dragging: T.value }]),
          onPointerdown: Bt,
          onPointermove: Tt,
          onPointerup: ct,
          onPointercancel: ct,
          onWheel: Lt,
          onDblclick: H
        }, [
          l("div", {
            ref_key: "canvas",
            ref: c,
            class: "mermaid-fs-canvas",
            style: Nt(St.value),
            innerHTML: a.value
          }, null, 12, ve)
        ], 34)
      ], 544)) : R("", !0)
    ], 40, le));
  }
}), xe = (n, i) => {
  const o = n.__vccOpts || n;
  for (const [a, r] of i)
    o[a] = r;
  return o;
}, Se = /* @__PURE__ */ xe(be, [["__scopeId", "data-v-d9fc4468"]]);
function Ce(n) {
  n.component("Mermaid", Se);
}
export {
  Se as MermaidViewer,
  Ce as enhanceMermaid
};
//# sourceMappingURL=client.js.map
