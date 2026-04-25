import { useRef, useEffect } from 'react';

type WaveStatus = 'idle' | 'real' | 'ai' | 'deepfake';

interface SineWaveProps {
  status?: WaveStatus;
  height?: number;
  className?: string;
}

export default function SineWave({ status = 'idle', height = 120, className = '' }: SineWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const phaseRef = useRef(0);
  const distortRef = useRef(0); // current distortion intensity (smoothed)

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    // Target distortion based on status
    const targetDistort = status === 'idle' || status === 'real' ? 0 : status === 'ai' ? 0.6 : 1.0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;

      ctx.clearRect(0, 0, W, H);

      // Smooth distortion transition
      distortRef.current += (targetDistort - distortRef.current) * 0.03;
      const d = distortRef.current;

      phaseRef.current += 0.025;
      const t = phaseRef.current;

      // Draw 3 layered sine waves with crimson multi-gradient
      const layers = [
        { amp: 50, freq: 0.008, speed: 1.0, alpha: 0.9, width: 3.5, colors: ['#dc143c', '#ff4564', '#b91c38'] },
        { amp: 35, freq: 0.012, speed: 1.4, alpha: 0.6, width: 2.5, colors: ['#ff6b81', '#e8415a', '#ff2e4d'] },
        { amp: 22, freq: 0.018, speed: 0.7, alpha: 0.35, width: 1.8, colors: ['#ff8fa3', '#f23d5c', '#cc1034'] },
      ];

      for (const layer of layers) {
        const grad = ctx.createLinearGradient(0, 0, W, 0);
        grad.addColorStop(0, layer.colors[0]);
        grad.addColorStop(0.5, layer.colors[1]);
        grad.addColorStop(1, layer.colors[2]);

        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = layer.width;
        ctx.globalAlpha = layer.alpha;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (let x = 0; x <= W; x += 1) {
          // Base sine
          let y = Math.sin(x * layer.freq + t * layer.speed) * layer.amp;

          // Distortion effects
          if (d > 0.01) {
            // High-frequency noise
            const noise = Math.sin(x * 0.08 + t * 3.5) * 12 * d;
            // Jagged spikes
            const spike = Math.sin(x * 0.15 + t * 5) * Math.sin(x * 0.03 + t * 2) * 25 * d;
            // Frequency warping
            const warp = Math.sin(x * layer.freq * (1 + d * 2) + t * layer.speed * 1.5) * layer.amp * d * 0.4;

            y += noise + spike + warp;
          }

          const py = H / 2 + y;

          if (x === 0) ctx.moveTo(x, py);
          else ctx.lineTo(x, py);
        }

        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Glow effect when distorted
      if (d > 0.1) {
        ctx.save();
        ctx.globalAlpha = d * 0.15;
        ctx.shadowColor = '#dc143c';
        ctx.shadowBlur = 30 * d;

        const glowGrad = ctx.createLinearGradient(0, H / 2 - 40, 0, H / 2 + 40);
        glowGrad.addColorStop(0, 'transparent');
        glowGrad.addColorStop(0.5, `rgba(220, 20, 60, ${d * 0.2})`);
        glowGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [status]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full pointer-events-none ${className}`}
      style={{ height }}
    />
  );
}
