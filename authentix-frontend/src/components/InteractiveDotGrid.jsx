import { useEffect, useRef, useCallback } from 'react'

/**
 * Interactive dot grid background — Antigravity-style.
 * Dots subtly react to cursor proximity with scale and opacity changes.
 */
export default function InteractiveDotGrid({ className = '' }) {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const animRef = useRef(null)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const { width, height } = canvas
    const spacing = 40
    const cols = Math.ceil(width / spacing)
    const rows = Math.ceil(height / spacing)
    const mouse = mouseRef.current
    const maxDist = 150

    ctx.clearRect(0, 0, width, height)

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * spacing + spacing / 2
        const y = r * spacing + spacing / 2
        const dx = mouse.x - x
        const dy = mouse.y - y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const proximity = Math.max(0, 1 - dist / maxDist)

        const baseRadius = 1.2
        const radius = baseRadius + proximity * 3
        const alpha = 0.08 + proximity * 0.35

        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(66, 99, 235, ${alpha})`
        ctx.fill()

        // Draw connection lines between nearby excited dots
        if (proximity > 0.2) {
          for (let nr = Math.max(0, r - 1); nr <= Math.min(rows - 1, r + 1); nr++) {
            for (let nc = Math.max(0, c - 1); nc <= Math.min(cols - 1, c + 1); nc++) {
              if (nr === r && nc === c) continue
              const nx = nc * spacing + spacing / 2
              const ny = nr * spacing + spacing / 2
              const ndx = mouse.x - nx
              const ndy = mouse.y - ny
              const ndist = Math.sqrt(ndx * ndx + ndy * ndy)
              const nProximity = Math.max(0, 1 - ndist / maxDist)
              if (nProximity > 0.15) {
                const lineAlpha = Math.min(proximity, nProximity) * 0.3
                ctx.beginPath()
                ctx.moveTo(x, y)
                ctx.lineTo(nx, ny)
                ctx.strokeStyle = `rgba(66, 99, 235, ${lineAlpha})`
                ctx.lineWidth = 0.5
                ctx.stroke()
              }
            }
          }
        }
      }
    }

    animRef.current = requestAnimationFrame(draw)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const parent = canvas.parentElement
      canvas.width = parent?.clientWidth || window.innerWidth
      canvas.height = parent?.clientHeight || window.innerHeight
    }

    const handleMouse = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 }
    }

    resize()
    window.addEventListener('resize', resize)
    canvas.addEventListener('mousemove', handleMouse)
    canvas.addEventListener('mouseleave', handleMouseLeave)
    animRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', handleMouse)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [draw])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-auto ${className}`}
      style={{ zIndex: 0 }}
    />
  )
}
