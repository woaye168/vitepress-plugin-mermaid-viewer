const __mvCss = ".mermaid-block[data-v-d9fc4468]{position:relative;margin:1em 0;cursor:zoom-in}.mermaid-block .mermaid[data-v-d9fc4468]{overflow-x:auto}.mermaid-error[data-v-d9fc4468]{margin:0;padding:.75rem 1rem;color:var(--vp-c-danger-1, #b42318);font-size:.85rem;white-space:pre-wrap}.mermaid-toolbar[data-v-d9fc4468]{position:absolute;top:1rem;right:1rem;z-index:2;display:flex;align-items:center;gap:.25rem;padding:.35rem .4rem;border-radius:8px;background:var(--vp-c-bg-elv);border:1px solid var(--vp-c-divider);box-shadow:0 8px 24px #00000014}.mermaid-btn[data-v-d9fc4468]{-webkit-appearance:none;-moz-appearance:none;appearance:none;display:flex;align-items:center;justify-content:center;width:2rem;height:2rem;padding:0;border:none;border-radius:6px;background:transparent;color:var(--vp-c-text-2);cursor:pointer}.mermaid-btn[data-v-d9fc4468]:hover{color:var(--vp-c-text-1);background:var(--vp-c-bg-soft)}.mermaid-btn.copied[data-v-d9fc4468]{color:var(--vp-c-brand-1)}.mermaid-btn svg[data-v-d9fc4468]{width:1.1rem;height:1.1rem;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.mermaid-download[data-v-d9fc4468]{position:relative}.mermaid-download-menu[data-v-d9fc4468]{position:absolute;top:calc(100% + .35rem);right:0;z-index:3;min-width:5.5rem;padding:.25rem;border-radius:8px;background:var(--vp-c-bg-elv);border:1px solid var(--vp-c-divider);box-shadow:0 8px 24px #00000014}.mermaid-download-item[data-v-d9fc4468]{-webkit-appearance:none;-moz-appearance:none;appearance:none;display:block;width:100%;padding:.4rem .65rem;border:none;border-radius:6px;background:transparent;color:var(--vp-c-text-1);font:inherit;font-size:.85rem;text-align:left;cursor:pointer}.mermaid-download-item[data-v-d9fc4468]:hover{background:var(--vp-c-bg-soft)}.mermaid-fs[data-v-d9fc4468]{width:100vw;height:100vh;max-width:none;max-height:none;margin:0;padding:0;border:0;background:var(--vp-c-bg);color:var(--vp-c-text-1);user-select:none;-webkit-user-select:none;outline:none}.mermaid-fs[data-v-d9fc4468]::backdrop{background:#1414128c}.mermaid-fs-stage[data-v-d9fc4468]{position:relative;width:100%;height:100%;overflow:hidden;cursor:grab}.mermaid-fs-stage.dragging[data-v-d9fc4468]{cursor:grabbing}.mermaid-fs-canvas[data-v-d9fc4468]{position:absolute;left:50%;top:50%;transform-origin:center center}.mermaid-fs-canvas[data-v-d9fc4468] svg{display:block;height:auto;max-width:none!important}\n";
if (typeof document !== "undefined" && !document.getElementById("vitepress-plugin-mermaid-viewer-css")) {
  const s = document.createElement("style");
  s.id = "vitepress-plugin-mermaid-viewer-css";
  s.textContent = __mvCss;
  document.head.appendChild(s);
}
import { defineComponent as Ft, ref as p, computed as ht, watch as jt, onMounted as Dt, onUnmounted as Vt, openBlock as k, createElementBlock as C, withKeys as gt, withModifiers as O, createCommentVNode as V, toDisplayString as pt, createElementVNode as a, Fragment as $t, renderList as Rt, normalizeClass as vt, normalizeStyle as Zt, nextTick as $ } from "vue";
const Nt = '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", sans-serif';
let G = {}, wt = !1;
async function Wt() {
  if (!wt) {
    try {
      G = (await import("virtual:mermaid-viewer-config")).default;
    } catch {
      G = {};
    }
    wt = !0;
  }
}
function qt() {
  const n = G.themeVariables;
  if (!n || typeof n != "object")
    return "";
  const i = n.fontFamily;
  return typeof i == "string" && i.trim() ? i.trim() : "";
}
function It(n) {
  const i = n.querySelector("text, tspan, foreignObject span, foreignObject div, foreignObject p") || n, r = getComputedStyle(i).fontFamily;
  return r && r !== "initial" ? r : "";
}
function Ut(n) {
  return qt() || It(n) || Nt;
}
function Yt(n) {
  var l;
  const i = (n == null ? void 0 : n.querySelector("span, div, p")) || n, r = i && "innerHTML" in i ? i.innerHTML : "";
  if (r)
    return r.split(/<br\s*\/?>/i).map((u) => u.replace(/<[^>]+>/g, "").trim()).filter(Boolean);
  const o = ((l = n == null ? void 0 : n.textContent) == null ? void 0 : l.trim()) ?? "";
  return o ? [o] : [];
}
function Xt(n, i, r) {
  const o = Yt(i || n);
  if (!o.length) {
    n.remove();
    return;
  }
  const l = parseFloat(n.getAttribute("x") || "0"), u = parseFloat(n.getAttribute("y") || "0"), c = parseFloat(n.getAttribute("width") || "0"), f = parseFloat(n.getAttribute("height") || "0"), m = i == null ? void 0 : i.querySelector("span, div, p"), d = m ? getComputedStyle(m) : null, b = parseFloat((d == null ? void 0 : d.fontSize) || "16") * 1.2, h = u + f / 2 - (o.length - 1) * b / 2, g = document.createElementNS("http://www.w3.org/2000/svg", "text");
  g.setAttribute("x", String(l + c / 2)), g.setAttribute("y", String(h)), g.setAttribute("text-anchor", "middle"), g.setAttribute("dominant-baseline", "central"), g.setAttribute("font-family", r), d && (g.setAttribute("font-size", d.fontSize), g.setAttribute("font-weight", d.fontWeight), g.setAttribute("fill", d.color)), o.forEach((A, M) => {
    const x = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "tspan"
    );
    x.setAttribute("x", String(l + c / 2)), x.setAttribute("dy", M === 0 ? "0" : String(b)), x.setAttribute("font-family", r), x.textContent = A, g.appendChild(x);
  }), n.replaceWith(g);
}
function Gt(n, i) {
  const r = n.cloneNode(!0);
  r.removeAttribute("style"), r.querySelectorAll("text, tspan").forEach((u) => {
    u.setAttribute("font-family", i);
  });
  const o = n.querySelectorAll("foreignObject");
  r.querySelectorAll("foreignObject").forEach((u, c) => {
    Xt(u, o[c], i);
  });
  const l = document.createElementNS("http://www.w3.org/2000/svg", "style");
  return l.textContent = `text, tspan { font-family: ${i} !important; }`, r.appendChild(l), r;
}
function Kt(n, i) {
  var f;
  const o = Gt(n, i), l = (f = n.viewBox) == null ? void 0 : f.baseVal;
  let u = 0, c = 0;
  if (l != null && l.width && (l != null && l.height))
    u = l.width, c = l.height;
  else
    try {
      const m = n.getBBox();
      u = m.width, c = m.height;
    } catch {
      u = n.clientWidth || 800, c = n.clientHeight || 600;
    }
  return o.setAttribute("width", String(Math.ceil(u))), o.setAttribute("height", String(Math.ceil(c))), o.setAttribute("xmlns", "http://www.w3.org/2000/svg"), o.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink"), {
    xml: '<?xml version="1.0" encoding="UTF-8"?>' + new XMLSerializer().serializeToString(o),
    width: u,
    height: c
  };
}
function X(n, i) {
  const r = URL.createObjectURL(n), o = document.createElement("a");
  o.href = r, o.download = i, o.click(), URL.revokeObjectURL(r);
}
const Jt = {
  png: "image/png",
  jpeg: "image/jpeg"
};
async function Qt(n, i, r, o) {
  const l = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(n)}`, u = new Image();
  await new Promise((y, b) => {
    u.onload = () => y(), u.onerror = b, u.src = l;
  });
  const c = 2, f = document.createElement("canvas");
  f.width = Math.max(1, Math.ceil(i * c)), f.height = Math.max(1, Math.ceil(r * c));
  const m = f.getContext("2d");
  if (!m)
    return null;
  const d = getComputedStyle(document.documentElement).getPropertyValue("--vp-c-bg").trim() || "#ffffff";
  return m.fillStyle = d, m.fillRect(0, 0, f.width, f.height), m.drawImage(u, 0, 0, f.width, f.height), new Promise((y) => {
    f.toBlob(
      y,
      Jt[o],
      o === "jpeg" ? 0.92 : void 0
    );
  });
}
async function te(n, i = "png") {
  await Wt();
  const r = Ut(n), { xml: o, width: l, height: u } = Kt(n, r), c = new Blob([o], { type: "image/svg+xml;charset=utf-8" });
  if (i === "svg") {
    X(c, "mermaid-diagram.svg");
    return;
  }
  try {
    const f = await Qt(o, l, u, i);
    if (f) {
      X(f, `mermaid-diagram.${i === "jpeg" ? "jpg" : i}`);
      return;
    }
  } catch {
  }
  X(c, "mermaid-diagram.svg");
}
let yt = 0, Z = {}, bt = !1;
async function ee() {
  if (!bt) {
    try {
      Z = (await import("virtual:mermaid-viewer-config")).default;
    } catch {
      Z = {};
    }
    bt = !0;
  }
}
function ne(n) {
  return typeof n == "string" && n.trim() ? n : "";
}
function ie(n) {
  const i = ne(Z.theme);
  return i || (n ? "dark" : "default");
}
async function oe(n, i = !1) {
  const r = (await import("mermaid")).default;
  await ee();
  const o = ie(i);
  r.initialize({
    startOnLoad: !1,
    securityLevel: "loose",
    ...Z,
    theme: o
  }), yt += 1;
  const { svg: l } = await r.render(`mermaid-svg-${yt}`, n);
  return l;
}
const ae = ["id", "onKeydown"], re = ["innerHTML"], le = {
  key: 1,
  class: "mermaid-error"
}, se = { class: "mermaid-download" }, ue = ["aria-expanded"], ce = {
  key: 0,
  class: "mermaid-download-menu",
  role: "menu",
  "aria-label": "Download format"
}, de = ["onClick"], fe = ["title", "aria-label"], me = {
  key: 0,
  viewBox: "0 0 24 24",
  "aria-hidden": "true"
}, he = {
  key: 1,
  viewBox: "0 0 24 24",
  "aria-hidden": "true"
}, ge = ["innerHTML"], pe = 0.25, ve = 8, R = 1.2, xt = 1.12, we = /* @__PURE__ */ Ft({
  inheritAttrs: !1,
  __name: "MermaidViewer",
  props: {
    graph: {},
    id: {}
  },
  setup(n) {
    const i = n, r = [
      { id: "png", label: "PNG" },
      { id: "svg", label: "SVG" },
      { id: "jpeg", label: "JPEG" }
    ], o = p(""), l = p(""), u = p(null), c = p(null), f = p(null), m = p(null), d = p(!1), y = p(!1), b = p(!1), h = p(1), g = p(0), A = p(0), M = p(0), x = p(0), T = p(!1);
    let _ = null, N = 0, W = 0, z = null, F = !1, K = 0, J = 0, Q = 0, tt = 0, E = 1, L = null, P = 0;
    const q = (t) => Math.min(ve, Math.max(pe, t)), j = ht(() => {
      try {
        return decodeURIComponent(i.graph);
      } catch {
        return i.graph;
      }
    }), St = ht(() => ({
      transform: `translate(-50%, -50%) translate(${M.value}px, ${x.value}px)`
    }));
    function I() {
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
    function kt(t) {
      t.removeAttribute("width"), t.removeAttribute("height"), t.style.setProperty("max-width", "none", "important"), t.style.setProperty("max-height", "none", "important");
    }
    function B() {
      const t = nt();
      if (!t || g.value <= 0 || A.value <= 0)
        return;
      kt(t);
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
      g.value = s.width * S, A.value = s.height * S, B();
    }
    async function ot() {
      const t = ++W, e = I();
      z = e;
      try {
        const s = await oe(j.value, e);
        if (t !== W)
          return;
        o.value = s, l.value = "", d.value && (await $(), it());
      } catch (s) {
        if (t !== W)
          return;
        l.value = s instanceof Error ? s.message : String(s);
      }
    }
    function U(t, e, s) {
      const v = m.value, w = q(t), S = h.value;
      if (w === S)
        return;
      if (!v) {
        h.value = w, B();
        return;
      }
      const D = v.getBoundingClientRect(), dt = e - D.left - D.width / 2, ft = s - D.top - D.height / 2, mt = w / S;
      M.value = dt - (dt - M.value) * mt, x.value = ft - (ft - x.value) * mt, h.value = w, B();
    }
    function Ct(t, e, s) {
      E *= t, L = { clientX: e, clientY: s }, !P && (P = requestAnimationFrame(() => {
        if (P = 0, !L || E === 1) {
          E = 1, L = null;
          return;
        }
        const v = h.value * E, w = L;
        E = 1, L = null, U(v, w.clientX, w.clientY);
      }));
    }
    function at() {
      const t = m.value;
      if (!t) {
        h.value = q(h.value * R), B();
        return;
      }
      const e = t.getBoundingClientRect();
      U(h.value * R, e.left + e.width / 2, e.top + e.height / 2);
    }
    function rt() {
      const t = m.value;
      if (!t) {
        h.value = q(h.value / R), B();
        return;
      }
      const e = t.getBoundingClientRect();
      U(h.value / R, e.left + e.width / 2, e.top + e.height / 2);
    }
    function H() {
      h.value = 1, M.value = 0, x.value = 0, B();
    }
    function At() {
      F || (document.addEventListener("keydown", ut), F = !0);
    }
    function lt() {
      F && (document.removeEventListener("keydown", ut), F = !1);
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
    function Lt(t) {
      var e;
      d.value || (e = window.getSelection()) != null && e.toString() || (t.preventDefault(), Y());
    }
    function ut(t) {
      d.value && (t.key === "0" ? H() : t.key === "+" || t.key === "=" ? at() : (t.key === "-" || t.key === "_") && rt());
    }
    function Bt(t) {
      if (!d.value)
        return;
      t.preventDefault();
      const e = t.deltaY > 0 ? 1 / xt : xt;
      Ct(e, t.clientX, t.clientY);
    }
    function Ot(t) {
      Ht(), !(!d.value || t.button !== 0) && (T.value = !0, K = t.clientX, J = t.clientY, Q = M.value, tt = x.value, t.currentTarget.setPointerCapture(t.pointerId));
    }
    function Tt(t) {
      T.value && (M.value = Q + (t.clientX - K), x.value = tt + (t.clientY - J));
    }
    function ct() {
      T.value = !1;
    }
    async function _t() {
      if (j.value) {
        try {
          await navigator.clipboard.writeText(j.value);
        } catch {
          const t = document.createElement("textarea");
          t.value = j.value, t.setAttribute("readonly", ""), t.style.position = "fixed", t.style.left = "-9999px", document.body.appendChild(t), t.select(), document.execCommand("copy"), t.remove();
        }
        y.value = !0, window.clearTimeout(N), N = window.setTimeout(() => {
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
    function zt(t) {
      b.value = !1;
      const e = d.value ? c.value : u.value, s = e == null ? void 0 : e.querySelector("svg");
      s && te(s, t);
    }
    return jt(d, (t) => {
      t ? At() : lt();
    }), Dt(() => {
      z = I(), _ = new MutationObserver(() => {
        const t = I();
        t !== z && (z = t, ot());
      }), _.observe(document.documentElement, {
        attributes: !0,
        attributeFilter: ["class"]
      }), ot();
    }), Vt(() => {
      lt(), _ == null || _.disconnect(), window.clearTimeout(N), P && cancelAnimationFrame(P), E = 1, L = null;
    }), (t, e) => (k(), C("div", {
      id: n.id,
      ref_key: "root",
      ref: u,
      class: "mermaid-block",
      role: "button",
      tabindex: "0",
      title: "Open fullscreen",
      "aria-label": "Open mermaid fullscreen",
      onClick: Lt,
      onKeydown: [
        gt(O(Y, ["prevent"]), ["enter"]),
        gt(O(Y, ["prevent"]), ["space"])
      ]
    }, [
      d.value ? V("", !0) : (k(), C("div", {
        key: 0,
        class: "mermaid",
        innerHTML: o.value
      }, null, 8, re)),
      l.value && !d.value ? (k(), C("pre", le, pt(l.value), 1)) : V("", !0),
      d.value ? (k(), C("dialog", {
        key: 2,
        ref_key: "dialog",
        ref: f,
        class: "mermaid-fs",
        tabindex: "-1",
        "aria-label": "Mermaid fullscreen preview",
        onClose: Et,
        onClick: O(st, ["self"])
      }, [
        a("div", {
          class: "mermaid-toolbar",
          onPointerdown: e[0] || (e[0] = O(() => {
          }, ["prevent", "stop"])),
          onMousedown: e[1] || (e[1] = O(() => {
          }, ["prevent", "stop"])),
          onClick: e[2] || (e[2] = O(() => {
          }, ["stop"]))
        }, [
          a("button", {
            type: "button",
            class: "mermaid-btn",
            title: "Zoom in",
            "aria-label": "Zoom in",
            onClick: at
          }, [...e[3] || (e[3] = [
            a("svg", {
              viewBox: "0 0 24 24",
              "aria-hidden": "true"
            }, [
              a("circle", {
                cx: "11",
                cy: "11",
                r: "7"
              }),
              a("path", { d: "M20 20l-3.5-3.5" }),
              a("path", { d: "M11 8v6M8 11h6" })
            ], -1)
          ])]),
          a("button", {
            type: "button",
            class: "mermaid-btn",
            title: "Zoom out",
            "aria-label": "Zoom out",
            onClick: rt
          }, [...e[4] || (e[4] = [
            a("svg", {
              viewBox: "0 0 24 24",
              "aria-hidden": "true"
            }, [
              a("circle", {
                cx: "11",
                cy: "11",
                r: "7"
              }),
              a("path", { d: "M20 20l-3.5-3.5" }),
              a("path", { d: "M8 11h6" })
            ], -1)
          ])]),
          a("button", {
            type: "button",
            class: "mermaid-btn",
            title: "Reset view",
            "aria-label": "Reset view",
            onClick: H
          }, [...e[5] || (e[5] = [
            a("svg", {
              viewBox: "0 0 24 24",
              "aria-hidden": "true"
            }, [
              a("path", { d: "M15 3h6v6" }),
              a("path", { d: "M9 21H3v-6" }),
              a("path", { d: "M21 3l-7 7M3 21l7-7" })
            ], -1)
          ])]),
          a("div", se, [
            a("button", {
              type: "button",
              class: "mermaid-btn",
              title: "Download",
              "aria-label": "Download",
              "aria-haspopup": "menu",
              "aria-expanded": b.value,
              onClick: Pt
            }, [...e[6] || (e[6] = [
              a("svg", {
                viewBox: "0 0 24 24",
                "aria-hidden": "true"
              }, [
                a("path", { d: "M12 4v11" }),
                a("path", { d: "M7 11l5 5 5-5" }),
                a("path", { d: "M5 19h14" })
              ], -1)
            ])], 8, ue),
            b.value ? (k(), C("div", ce, [
              (k(), C($t, null, Rt(r, (s) => a("button", {
                key: s.id,
                type: "button",
                class: "mermaid-download-item",
                role: "menuitem",
                onClick: (v) => zt(s.id)
              }, pt(s.label), 9, de)), 64))
            ])) : V("", !0)
          ]),
          a("button", {
            type: "button",
            class: vt(["mermaid-btn", { copied: y.value }]),
            title: y.value ? "Copied" : "Copy code",
            "aria-label": y.value ? "Copied" : "Copy code",
            onClick: _t
          }, [
            y.value ? (k(), C("svg", me, [...e[7] || (e[7] = [
              a("path", { d: "M5 13l4 4L19 7" }, null, -1)
            ])])) : (k(), C("svg", he, [...e[8] || (e[8] = [
              a("rect", {
                x: "8",
                y: "8",
                width: "12",
                height: "12",
                rx: "2"
              }, null, -1),
              a("path", { d: "M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" }, null, -1)
            ])]))
          ], 10, fe),
          a("button", {
            type: "button",
            class: "mermaid-btn",
            title: "Close",
            "aria-label": "Close",
            onClick: st
          }, [...e[9] || (e[9] = [
            a("svg", {
              viewBox: "0 0 24 24",
              "aria-hidden": "true"
            }, [
              a("path", { d: "M6 6l12 12M18 6L6 18" })
            ], -1)
          ])])
        ], 32),
        a("div", {
          ref_key: "stage",
          ref: m,
          class: vt(["mermaid-fs-stage", { dragging: T.value }]),
          onPointerdown: Ot,
          onPointermove: Tt,
          onPointerup: ct,
          onPointercancel: ct,
          onWheel: Bt,
          onDblclick: H
        }, [
          a("div", {
            ref_key: "canvas",
            ref: c,
            class: "mermaid-fs-canvas",
            style: Zt(St.value),
            innerHTML: o.value
          }, null, 12, ge)
        ], 34)
      ], 544)) : V("", !0)
    ], 40, ae));
  }
}), ye = (n, i) => {
  const r = n.__vccOpts || n;
  for (const [o, l] of i)
    r[o] = l;
  return r;
}, be = /* @__PURE__ */ ye(we, [["__scopeId", "data-v-d9fc4468"]]);
function Se(n) {
  n.component("Mermaid", be);
}
export {
  be as MermaidViewer,
  Se as enhanceMermaid
};
//# sourceMappingURL=client.js.map
