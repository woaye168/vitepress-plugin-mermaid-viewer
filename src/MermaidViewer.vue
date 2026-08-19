<script setup>
  import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
  import { downloadMermaidPng } from './export'
  import { renderMermaid } from './render'

  defineOptions({ inheritAttrs: false })

  const props = defineProps({
    graph: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  })

  const svgHtml = ref('')
  const error = ref('')
  let themeObserver = null

  const root = ref(null)
  const canvas = ref(null)
  const dialog = ref(null)
  const fullscreen = ref(false)
  const copied = ref(false)
  let copiedTimer = 0

  const scale = ref(1)
  const x = ref(0)
  const y = ref(0)
  const dragging = ref(false)

  let originX = 0
  let originY = 0
  let startX = 0
  let startY = 0

  const minZoom = 0.25
  const maxZoom = 8
  const clampZoom = (level) => Math.min(maxZoom, Math.max(minZoom, level))

  const source = computed(() => {
    try {
      return decodeURIComponent(props.graph)
    } catch {
      return props.graph
    }
  })

  const renderChart = async () => {
    const isDark = document.documentElement.classList.contains('dark')

    try {
      svgHtml.value = await renderMermaid(source.value, isDark)
      error.value = ''
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err)
    }
  }

  const canvasStyle = computed(() => ({
    transform: `translate(${x.value}px, ${y.value}px) scale(${scale.value})`,
  }))

  const onInlineClick = (event) => {
    if (fullscreen.value) {
      return
    }
    if (window.getSelection()?.toString()) {
      return
    }
    event.preventDefault()
    openFullscreen()
  }

  const zoomIn = () => {
    scale.value = clampZoom(scale.value * 1.2)
  }

  const zoomOut = () => {
    scale.value = clampZoom(scale.value / 1.2)
  }

  const resetView = () => {
    scale.value = 1
    x.value = 0
    y.value = 0
  }

  const openFullscreen = async () => {
    fullscreen.value = true
    resetView()
    await nextTick()
    dialog.value?.showModal()
  }

  const closeFullscreen = () => {
    dialog.value?.close()
  }

  const onDialogClose = () => {
    fullscreen.value = false
    dragging.value = false
    copied.value = false
    resetView()
  }

  const onKeydown = (event) => {
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

  const onWheel = (event) => {
    if (!fullscreen.value) {
      return
    }
    event.preventDefault()
    const factor = event.deltaY > 0 ? 1 / 1.12 : 1.12
    scale.value = clampZoom(scale.value * factor)
  }

  const onPointerDown = (event) => {
    if (!fullscreen.value || event.button !== 0) {
      return
    }
    dragging.value = true
    originX = event.clientX
    originY = event.clientY
    startX = x.value
    startY = y.value
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event) => {
    if (!dragging.value) {
      return
    }
    x.value = startX + (event.clientX - originX)
    y.value = startY + (event.clientY - originY)
  }

  const onPointerUp = () => {
    dragging.value = false
  }

  const copyCode = async () => {
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

  const downloadPng = () => {
    const host = fullscreen.value ? canvas.value : root.value
    const svg = host?.querySelector('svg')
    if (svg) {
      downloadMermaidPng(svg)
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', onKeydown)
    themeObserver = new MutationObserver(() => {
      renderChart()
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    renderChart()
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', onKeydown)
    themeObserver?.disconnect()
    window.clearTimeout(copiedTimer)
  })
</script>

<template>
  <div
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
        <button
          type="button"
          class="mermaid-btn"
          title="Download PNG"
          aria-label="Download PNG"
          @click="downloadPng"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 4v11" />
            <path d="M7 11l5 5 5-5" />
            <path d="M5 19h14" />
          </svg>
        </button>
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
          class="mermaid-btn mermaid-btn-accent"
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
        class="mermaid-fs-stage"
        :class="{ dragging }"
        @wheel="onWheel"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
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

  .mermaid-btn-accent,
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
  }

  .mermaid-fs::backdrop {
    background: rgba(20, 20, 18, 0.55);
  }

  .mermaid-fs-stage {
    width: 100%;
    height: 100%;
    overflow: hidden;
    cursor: grab;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mermaid-fs-stage.dragging {
    cursor: grabbing;
  }

  .mermaid-fs-canvas {
    transform-origin: center center;
    will-change: transform;
  }

  .mermaid-fs-canvas :deep(svg) {
    display: block;
    width: min(92vw, 1400px);
    height: auto;
    max-width: none;
  }
</style>
