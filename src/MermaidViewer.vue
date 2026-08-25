<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { downloadMermaid, type MermaidExportFormat } from './export'
import { renderMermaid } from './render'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  graph: string
  id: string
}>()

const MIN_ZOOM = 0.25
const MAX_ZOOM = 8
const ZOOM_STEP = 1.2
const WHEEL_ZOOM_STEP = 1.12

const downloadFormats = [
  { id: 'png' as const, label: 'PNG' },
  { id: 'svg' as const, label: 'SVG' },
  { id: 'jpeg' as const, label: 'JPEG' },
]

const svgHtml = ref('')
const error = ref('')
const root = ref<HTMLElement | null>(null)
const canvas = ref<HTMLElement | null>(null)
const dialog = ref<HTMLDialogElement | null>(null)
const stage = ref<HTMLElement | null>(null)

const fullscreen = ref(false)
const copied = ref(false)
const downloadMenuOpen = ref(false)

const scale = ref(1)
const baseSvgWidth = ref(0)
const baseSvgHeight = ref(0)
const x = ref(0)
const y = ref(0)
const dragging = ref(false)

let themeObserver: MutationObserver | null = null
let copiedTimer = 0
let renderToken = 0
let lastDark: boolean | null = null
let keydownBound = false

let originX = 0
let originY = 0
let startX = 0
let startY = 0

let pendingZoomFactor = 1
let pendingAnchor: { clientX: number; clientY: number } | null = null
let scaleRaf = 0

const clampZoom = (level: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, level))

const source = computed(() => {
  try {
    return decodeURIComponent(props.graph)
  } catch {
    return props.graph
  }
})

const canvasStyle = computed(() => ({
  transform: `translate(-50%, -50%) translate(${x.value}px, ${y.value}px)`,
}))

function isDarkTheme() {
  return document.documentElement.classList.contains('dark')
}

function parseSvgLength(value: string | null) {
  if (!value || value.includes('%')) {
    return 0
  }
  const parsed = Number.parseFloat(value)
  return parsed > 0 ? parsed : 0
}

function readSvgNaturalSize(svg: SVGSVGElement) {
  const attrW = parseSvgLength(svg.getAttribute('width'))
  const attrH = parseSvgLength(svg.getAttribute('height'))
  if (attrW > 0 && attrH > 0) {
    return { width: attrW, height: attrH }
  }

  const viewBox = svg.viewBox?.baseVal
  if (viewBox && viewBox.width > 0 && viewBox.height > 0) {
    return { width: viewBox.width, height: viewBox.height }
  }

  try {
    const box = svg.getBBox()
    if (box.width > 0 && box.height > 0) {
      return { width: box.width, height: box.height }
    }
  } catch {
    // getBBox can throw before layout
  }

  return { width: 0, height: 0 }
}

function fullscreenSvg() {
  const svg = canvas.value?.querySelector('svg')
  return svg instanceof SVGSVGElement ? svg : null
}

function applySvgConstraints(svg: SVGSVGElement) {
  svg.removeAttribute('width')
  svg.removeAttribute('height')
  svg.style.setProperty('max-width', 'none', 'important')
  svg.style.setProperty('max-height', 'none', 'important')
}

function syncFullscreenSvgSize() {
  const svg = fullscreenSvg()
  if (!svg || baseSvgWidth.value <= 0 || baseSvgHeight.value <= 0) {
    return
  }

  applySvgConstraints(svg)
  const width = baseSvgWidth.value * scale.value
  const height = baseSvgHeight.value * scale.value
  svg.style.width = `${width}px`
  svg.style.height = `${height}px`

  if (canvas.value) {
    canvas.value.style.width = `${width}px`
    canvas.value.style.height = `${height}px`
  }
}

function measureBaseSvgSize() {
  const svg = fullscreenSvg()
  const host = stage.value
  if (!svg || !host) {
    return
  }

  const natural = readSvgNaturalSize(svg)
  if (!(natural.width > 0 && natural.height > 0)) {
    return
  }

  const availW = (host.clientWidth || window.innerWidth) * 0.92
  const availH = (host.clientHeight || window.innerHeight) * 0.92
  if (!(availW > 0 && availH > 0)) {
    return
  }

  // Fit inside the stage; never upscale past the diagram's natural size.
  const fit = Math.min(availW / natural.width, availH / natural.height, 1)
  baseSvgWidth.value = natural.width * fit
  baseSvgHeight.value = natural.height * fit
  syncFullscreenSvgSize()
}

async function renderChart() {
  const token = ++renderToken
  const isDark = isDarkTheme()
  lastDark = isDark

  try {
    const svg = await renderMermaid(source.value, isDark)
    if (token !== renderToken) {
      return
    }
    svgHtml.value = svg
    error.value = ''
    if (fullscreen.value) {
      await nextTick()
      measureBaseSvgSize()
    }
  } catch (err) {
    if (token !== renderToken) {
      return
    }
    error.value = err instanceof Error ? err.message : String(err)
  }
}

function applyZoomAt(nextScale: number, clientX: number, clientY: number) {
  const host = stage.value
  const clamped = clampZoom(nextScale)
  const prev = scale.value
  if (clamped === prev) {
    return
  }

  if (!host) {
    scale.value = clamped
    syncFullscreenSvgSize()
    return
  }

  // x/y are offsets from the stage center (canvas uses translate(-50%,-50%) + translate(x,y)).
  const rect = host.getBoundingClientRect()
  const cx = clientX - rect.left - rect.width / 2
  const cy = clientY - rect.top - rect.height / 2
  const ratio = clamped / prev

  x.value = cx - (cx - x.value) * ratio
  y.value = cy - (cy - y.value) * ratio
  scale.value = clamped
  syncFullscreenSvgSize()
}

function scheduleZoomAt(factor: number, clientX: number, clientY: number) {
  pendingZoomFactor *= factor
  pendingAnchor = { clientX, clientY }
  if (scaleRaf) {
    return
  }
  scaleRaf = requestAnimationFrame(() => {
    scaleRaf = 0
    if (!pendingAnchor || pendingZoomFactor === 1) {
      pendingZoomFactor = 1
      pendingAnchor = null
      return
    }
    const nextScale = scale.value * pendingZoomFactor
    const anchor = pendingAnchor
    pendingZoomFactor = 1
    pendingAnchor = null
    applyZoomAt(nextScale, anchor.clientX, anchor.clientY)
  })
}

function zoomIn() {
  const host = stage.value
  if (!host) {
    scale.value = clampZoom(scale.value * ZOOM_STEP)
    syncFullscreenSvgSize()
    return
  }
  const rect = host.getBoundingClientRect()
  applyZoomAt(scale.value * ZOOM_STEP, rect.left + rect.width / 2, rect.top + rect.height / 2)
}

function zoomOut() {
  const host = stage.value
  if (!host) {
    scale.value = clampZoom(scale.value / ZOOM_STEP)
    syncFullscreenSvgSize()
    return
  }
  const rect = host.getBoundingClientRect()
  applyZoomAt(scale.value / ZOOM_STEP, rect.left + rect.width / 2, rect.top + rect.height / 2)
}

function resetView() {
  scale.value = 1
  x.value = 0
  y.value = 0
  syncFullscreenSvgSize()
}

function bindKeydown() {
  if (keydownBound) {
    return
  }
  document.addEventListener('keydown', onKeydown)
  keydownBound = true
}

function unbindKeydown() {
  if (!keydownBound) {
    return
  }
  document.removeEventListener('keydown', onKeydown)
  keydownBound = false
}

async function openFullscreen() {
  fullscreen.value = true
  resetView()
  baseSvgWidth.value = 0
  baseSvgHeight.value = 0
  await nextTick()
  dialog.value?.showModal()
  // showModal() focuses the first button; keep focus on the dialog so
  // mobile browsers do not paint an outline on Zoom in.
  dialog.value?.focus()
  await nextTick()
  measureBaseSvgSize()
}

function closeFullscreen() {
  dialog.value?.close()
}

async function onDialogClose() {
  fullscreen.value = false
  dragging.value = false
  copied.value = false
  downloadMenuOpen.value = false
  resetView()
  await nextTick()
  root.value?.blur()
}

function onInlineClick(event: MouseEvent) {
  if (fullscreen.value) {
    return
  }
  if (window.getSelection()?.toString()) {
    return
  }
  event.preventDefault()
  openFullscreen()
}

function onKeydown(event: KeyboardEvent) {
  if (!fullscreen.value) {
    return
  }
  if (event.key === '0') {
    resetView()
  } else if (event.key === '+' || event.key === '=') {
    zoomIn()
  } else if (event.key === '-' || event.key === '_') {
    zoomOut()
  }
}

function onWheel(event: WheelEvent) {
  if (!fullscreen.value) {
    return
  }
  event.preventDefault()
  const factor = event.deltaY > 0 ? 1 / WHEEL_ZOOM_STEP : WHEEL_ZOOM_STEP
  scheduleZoomAt(factor, event.clientX, event.clientY)
}

function onStagePointerDown(event: PointerEvent) {
  closeDownloadMenu()
  if (!fullscreen.value || event.button !== 0) {
    return
  }
  dragging.value = true
  originX = event.clientX
  originY = event.clientY
  startX = x.value
  startY = y.value
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
}

function onPointerMove(event: PointerEvent) {
  if (!dragging.value) {
    return
  }
  x.value = startX + (event.clientX - originX)
  y.value = startY + (event.clientY - originY)
}

function onPointerUp() {
  dragging.value = false
}

async function copyCode() {
  if (!source.value) {
    return
  }
  try {
    await navigator.clipboard.writeText(source.value)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = source.value
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    textarea.remove()
  }
  copied.value = true
  window.clearTimeout(copiedTimer)
  copiedTimer = window.setTimeout(() => {
    copied.value = false
  }, 1500)
}

function toggleDownloadMenu() {
  downloadMenuOpen.value = !downloadMenuOpen.value
}

function closeDownloadMenu() {
  downloadMenuOpen.value = false
}

function downloadAs(format: MermaidExportFormat) {
  downloadMenuOpen.value = false
  const host = fullscreen.value ? canvas.value : root.value
  const svg = host?.querySelector('svg')
  if (svg) {
    downloadMermaid(svg, format)
  }
}

watch(fullscreen, (open) => {
  if (open) {
    bindKeydown()
  } else {
    unbindKeydown()
  }
})

onMounted(() => {
  lastDark = isDarkTheme()
  themeObserver = new MutationObserver(() => {
    const nextDark = isDarkTheme()
    if (nextDark === lastDark) {
      return
    }
    lastDark = nextDark
    renderChart()
  })
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
  renderChart()
})

onUnmounted(() => {
  unbindKeydown()
  themeObserver?.disconnect()
  window.clearTimeout(copiedTimer)
  if (scaleRaf) {
    cancelAnimationFrame(scaleRaf)
  }
  pendingZoomFactor = 1
  pendingAnchor = null
})
</script>

<template>
  <div
    :id="id"
    ref="root"
    class="mermaid-block"
    role="button"
    tabindex="0"
    title="Open fullscreen"
    aria-label="Open mermaid fullscreen"
    @click="onInlineClick"
    @keydown.enter.prevent="openFullscreen"
    @keydown.space.prevent="openFullscreen"
  >
    <div v-if="!fullscreen" class="mermaid" v-html="svgHtml" />
    <pre v-if="error && !fullscreen" class="mermaid-error">{{ error }}</pre>

    <dialog
      v-if="fullscreen"
      ref="dialog"
      class="mermaid-fs"
      tabindex="-1"
      aria-label="Mermaid fullscreen preview"
      @close="onDialogClose"
      @click.self="closeFullscreen"
    >
      <div
        class="mermaid-toolbar"
        @pointerdown.prevent.stop
        @mousedown.prevent.stop
        @click.stop
      >
        <button
          type="button"
          class="mermaid-btn"
          title="Zoom in"
          aria-label="Zoom in"
          @click="zoomIn"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
            <path d="M11 8v6M8 11h6" />
          </svg>
        </button>
        <button
          type="button"
          class="mermaid-btn"
          title="Zoom out"
          aria-label="Zoom out"
          @click="zoomOut"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
            <path d="M8 11h6" />
          </svg>
        </button>
        <button
          type="button"
          class="mermaid-btn"
          title="Reset view"
          aria-label="Reset view"
          @click="resetView"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 3h6v6" />
            <path d="M9 21H3v-6" />
            <path d="M21 3l-7 7M3 21l7-7" />
          </svg>
        </button>
        <div class="mermaid-download">
          <button
            type="button"
            class="mermaid-btn"
            title="Download"
            aria-label="Download"
            aria-haspopup="menu"
            :aria-expanded="downloadMenuOpen"
            @click="toggleDownloadMenu"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 4v11" />
              <path d="M7 11l5 5 5-5" />
              <path d="M5 19h14" />
            </svg>
          </button>
          <div
            v-if="downloadMenuOpen"
            class="mermaid-download-menu"
            role="menu"
            aria-label="Download format"
          >
            <button
              v-for="format in downloadFormats"
              :key="format.id"
              type="button"
              class="mermaid-download-item"
              role="menuitem"
              @click="downloadAs(format.id)"
            >
              {{ format.label }}
            </button>
          </div>
        </div>
        <button
          type="button"
          class="mermaid-btn"
          :class="{ copied }"
          :title="copied ? 'Copied' : 'Copy code'"
          :aria-label="copied ? 'Copied' : 'Copy code'"
          @click="copyCode"
        >
          <svg v-if="copied" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else viewBox="0 0 24 24" aria-hidden="true">
            <rect x="8" y="8" width="12" height="12" rx="2" />
            <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
          </svg>
        </button>
        <button
          type="button"
          class="mermaid-btn"
          title="Close"
          aria-label="Close"
          @click="closeFullscreen"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
      <div
        ref="stage"
        class="mermaid-fs-stage"
        :class="{ dragging }"
        @pointerdown="onStagePointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
        @wheel="onWheel"
        @dblclick="resetView"
      >
        <div
          ref="canvas"
          class="mermaid-fs-canvas"
          :style="canvasStyle"
          v-html="svgHtml"
        />
      </div>
    </dialog>
  </div>
</template>

<style scoped>
.mermaid-block {
  position: relative;
  margin: 1em 0;
  cursor: zoom-in;
}

.mermaid-block .mermaid {
  overflow-x: auto;
}

.mermaid-error {
  margin: 0;
  padding: 0.75rem 1rem;
  color: var(--vp-c-danger-1, #b42318);
  font-size: 0.85rem;
  white-space: pre-wrap;
}

.mermaid-toolbar {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.35rem 0.4rem;
  border-radius: 8px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.mermaid-btn {
  appearance: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
}

.mermaid-btn:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
}

.mermaid-btn.copied {
  color: var(--vp-c-brand-1);
}

.mermaid-btn svg {
  width: 1.1rem;
  height: 1.1rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.mermaid-download {
  position: relative;
}

.mermaid-download-menu {
  position: absolute;
  top: calc(100% + 0.35rem);
  right: 0;
  z-index: 3;
  min-width: 5.5rem;
  padding: 0.25rem;
  border-radius: 8px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.mermaid-download-item {
  appearance: none;
  display: block;
  width: 100%;
  padding: 0.4rem 0.65rem;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-1);
  font: inherit;
  font-size: 0.85rem;
  text-align: left;
  cursor: pointer;
}

.mermaid-download-item:hover {
  background: var(--vp-c-bg-soft);
}

.mermaid-fs {
  width: 100vw;
  height: 100vh;
  max-width: none;
  max-height: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  user-select: none;
  -webkit-user-select: none;
  outline: none;
}

.mermaid-fs::backdrop {
  background: rgba(20, 20, 18, 0.55);
}

.mermaid-fs-stage {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: grab;
}

.mermaid-fs-stage.dragging {
  cursor: grabbing;
}

.mermaid-fs-canvas {
  position: absolute;
  left: 50%;
  top: 50%;
  transform-origin: center center;
}

.mermaid-fs-canvas :deep(svg) {
  display: block;
  height: auto;
  max-width: none !important;
}
</style>
