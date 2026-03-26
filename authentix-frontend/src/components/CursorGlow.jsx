import { useEffect, useRef } from 'react'

/**
 * Antigravity-style confetti particles.
 * Tiny colorful dots & dashes scattered behind page content.
 * Positioned absolute within main content area (never in navbar).
 */
export default function CursorGlow() {
  const canvasRef = useRef(null)
  const prevMouseRef = useRef({ x: -100, y: -100 })
  const particlesRef = useRef([])
  const animRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const main = canvas.parentElement

    const resize = () => {
      canvas.width = main.clientWidth
      canvas.height = main.scrollHeight || main.clientHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Observe DOM changes that affect height (page transitions)
    const observer = new MutationObserver(resize)
    observer.observe(main, { childList: true, subtree: true })

    const colors = [
      '#4263EB', '#364FC7', '#5C7CFA',
      '#20C997', '#12B886',
      '#FAB005', '#F59F00',
      '#FF6B6B', '#E64980',
      '#9382FA', '#7048E8',
    ]

    const onMove = (e) => {
      // Get position relative to main content area
      const rect = main.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top + main.scrollTop

      // Only spawn if cursor is within the main content area
      if (e.clientY < rect.top || e.clientY > rect.bottom) return

      const dx = x - prevMouseRef.current.x
      const dy = y - prevMouseRef.current.y
      const speed = Math.sqrt(dx * dx + dy * dy)
      prevMouseRef.current = { x, y }

      const count = Math.min(Math.floor(speed * 0.4) + 1, 8)

      for (let i = 0; i < count; i++) {
        const spread = 80 + Math.random() * 120
        const angle = Math.random() * Math.PI * 2
        const color = colors[Math.floor(Math.random() * colors.length)]
        const isDash = Math.random() > 0.5

        particlesRef.current.push({
          x: x + Math.cos(angle) * spread * Math.random(),
          y: y + Math.sin(angle) * spread * Math.random(),
          vx: (Math.random() - 0.5) * 0.3,
          vy: 0.2 + Math.random() * 0.5,
          size: isDash ? 1 : (Math.random() * 2.5 + 1),
          length: isDash ? (3 + Math.random() * 6) : 0,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.03,
          color,
          alpha: 0.5 + Math.random() * 0.4,
          life: 1,
          decay: 0.003 + Math.random() * 0.004,
          isDash,
        })
      }

      if (particlesRef.current.length > 500) {
        particlesRef.current = particlesRef.current.slice(-500)
      }
    }

    window.addEventListener('mousemove', onMove)

    const draw = () => {
      // Resize canvas to match current content height
      const newH = main.scrollHeight || main.clientHeight
      if (canvas.height !== newH) canvas.height = newH
      if (canvas.width !== main.clientWidth) canvas.width = main.clientWidth

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const alive = []
      for (const p of particlesRef.current) {
        p.x += p.vx
        p.y += p.vy
        p.life -= p.decay
        p.rotation += p.rotSpeed

        if (p.life <= 0 || p.y > canvas.height + 20) continue
        alive.push(p)

        const a = p.alpha * p.life
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.globalAlpha = a

        if (p.isDash) {
          ctx.beginPath()
          ctx.moveTo(-p.length / 2, 0)
          ctx.lineTo(p.length / 2, 0)
          ctx.strokeStyle = p.color
          ctx.lineWidth = p.size
          ctx.lineCap = 'round'
          ctx.stroke()
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, p.size, 0, Math.PI * 2)
          ctx.fillStyle = p.color
          ctx.fill()
        }

        ctx.restore()
      }
      particlesRef.current = alive

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      observer.disconnect()
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: 0 }}
    />
  )
}
