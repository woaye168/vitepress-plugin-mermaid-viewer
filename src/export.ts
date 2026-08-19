const exportFontFamily =
  '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", sans-serif'

function foreignObjectLines(live: Element | null | undefined) {
  const inner = live?.querySelector('span, div, p') || live
  const html = inner && 'innerHTML' in inner ? inner.innerHTML : ''
  if (html) {
    return html
      .split(/<br\s*\/?>/i)
      .map((part) => part.replace(/<[^>]+>/g, '').trim())
      .filter(Boolean)
  }
  const text = live?.textContent?.trim() ?? ''
  return text ? [text] : []
}

function replaceForeignObject(
  cloneFo: SVGForeignObjectElement,
  liveFo?: Element,
) {
  const lines = foreignObjectLines(liveFo || cloneFo)
  if (!lines.length) {
    cloneFo.remove()
    return
  }

  const x = parseFloat(cloneFo.getAttribute('x') || '0')
  const y = parseFloat(cloneFo.getAttribute('y') || '0')
  const width = parseFloat(cloneFo.getAttribute('width') || '0')
  const height = parseFloat(cloneFo.getAttribute('height') || '0')
  const inner = liveFo?.querySelector('span, div, p')
  const cs = inner ? getComputedStyle(inner) : null
  const fontSize = parseFloat(cs?.fontSize || '16')
  const lineHeight = fontSize * 1.2
  const startY = y + height / 2 - ((lines.length - 1) * lineHeight) / 2

  const svgText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
  svgText.setAttribute('x', String(x + width / 2))
  svgText.setAttribute('y', String(startY))
  svgText.setAttribute('text-anchor', 'middle')
  svgText.setAttribute('dominant-baseline', 'central')
  svgText.setAttribute('font-family', exportFontFamily)
  if (cs) {
    svgText.setAttribute('font-size', cs.fontSize)
    svgText.setAttribute('font-weight', cs.fontWeight)
    svgText.setAttribute('fill', cs.color)
  }

  lines.forEach((line, index) => {
    const tspan = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'tspan',
    )
    tspan.setAttribute('x', String(x + width / 2))
    tspan.setAttribute('dy', index === 0 ? '0' : String(lineHeight))
    tspan.setAttribute('font-family', exportFontFamily)
    tspan.textContent = line
    svgText.appendChild(tspan)
  })

  cloneFo.replaceWith(svgText)
}

function prepareSvgClone(svg: SVGSVGElement) {
  const clone = svg.cloneNode(true) as SVGSVGElement
  clone.removeAttribute('style')

  clone.querySelectorAll('text, tspan').forEach((el) => {
    el.setAttribute('font-family', exportFontFamily)
  })

  const liveFos = svg.querySelectorAll('foreignObject')
  clone.querySelectorAll('foreignObject').forEach((fo, i) => {
    replaceForeignObject(fo, liveFos[i])
  })

  const style = document.createElementNS('http://www.w3.org/2000/svg', 'style')
  style.textContent = `text, tspan { font-family: ${exportFontFamily} !important; }`
  clone.appendChild(style)

  return clone
}

export function serializeSvg(svg: SVGSVGElement) {
  const clone = prepareSvgClone(svg)

  const viewBox = svg.viewBox?.baseVal
  let width = 0
  let height = 0
  if (viewBox?.width && viewBox?.height) {
    width = viewBox.width
    height = viewBox.height
  } else {
    try {
      const box = svg.getBBox()
      width = box.width
      height = box.height
    } catch {
      width = svg.clientWidth || 800
      height = svg.clientHeight || 600
    }
  }

  clone.setAttribute('width', String(Math.ceil(width)))
  clone.setAttribute('height', String(Math.ceil(height)))
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')

  return {
    xml:
      '<?xml version="1.0" encoding="UTF-8"?>' +
      new XMLSerializer().serializeToString(clone),
    width,
    height,
  }
}

export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export async function downloadMermaidPng(svg: SVGSVGElement) {
  const { xml, width, height } = serializeSvg(svg)
  const svgBlob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' })
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`

  try {
    const image = new Image()
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve()
      image.onerror = reject
      image.src = url
    })

    const ratio = 2
    const exportCanvas = document.createElement('canvas')
    exportCanvas.width = Math.max(1, Math.ceil(width * ratio))
    exportCanvas.height = Math.max(1, Math.ceil(height * ratio))

    const ctx = exportCanvas.getContext('2d')
    if (!ctx) {
      triggerDownload(svgBlob, 'mermaid-diagram.svg')
      return
    }

    const background =
      getComputedStyle(document.documentElement)
        .getPropertyValue('--vp-c-bg')
        .trim() || '#ffffff'
    ctx.fillStyle = background
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height)
    ctx.drawImage(image, 0, 0, exportCanvas.width, exportCanvas.height)

    const png = await new Promise<Blob | null>((resolve) => {
      exportCanvas.toBlob(resolve, 'image/png')
    })
    if (png) {
      triggerDownload(png, 'mermaid-diagram.png')
    }
  } catch {
    triggerDownload(svgBlob, 'mermaid-diagram.svg')
  }
}
