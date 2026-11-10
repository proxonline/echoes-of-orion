import React, { useEffect, useRef } from 'react';

interface ParticleCanvasProps {
  graphicsQuality?: 'Low' | 'Medium' | 'High' | 'Cinematic';
  enableParallax?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  baseAlpha: number;
  pulseSpeed: number;
  pulsePhase: number;
  type: 'ember' | 'ash' | 'wisp';
  depth: number;
}

export const ParticleCanvas: React.FC<ParticleCanvasProps> = ({
  graphicsQuality = 'High',
  enableParallax = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!enableParallax) return;
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Particle count by quality tier
    const counts = {
      Low: 25,
      Medium: 55,
      High: 90,
      Cinematic: 140,
    };
    const particleCount = counts[graphicsQuality] || 90;

    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const randType = Math.random();
      let type: 'ember' | 'ash' | 'wisp' = 'ash';
      let color = 'rgba(150, 155, 165, ';
      let size = Math.random() * 1.5 + 0.8;

      if (randType < 0.3) {
        // Burnt wood ember (subtle warm amber/crimson, natural not neon)
        type = 'ember';
        color = Math.random() > 0.5 ? 'rgba(215, 125, 45, ' : 'rgba(195, 75, 40, ';
        size = Math.random() * 2 + 1;
      } else if (randType < 0.45) {
        // Faint moonlight silver wisp
        type = 'wisp';
        color = 'rgba(210, 220, 230, ';
        size = Math.random() * 2.2 + 1.2;
      } else {
        // Natural drifting ash
        type = 'ash';
        color = 'rgba(130, 135, 142, ';
        size = Math.random() * 1.6 + 0.6;
      }

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.45) * 0.35,
        vy: type === 'ember' ? -(Math.random() * 0.5 + 0.2) : -(Math.random() * 0.25 + 0.08),
        size,
        color,
        alpha: Math.random() * 0.5 + 0.15,
        baseAlpha: Math.random() * 0.4 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
        type,
        depth: Math.random() * 0.7 + 0.3,
      });
    }

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      // Smooth mouse parallax damping
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        let sway = 0;
        if (p.type === 'wisp' || p.type === 'ember') {
          sway = Math.sin(time * 0.0012 + p.pulsePhase) * 0.3;
        }

        p.x += (p.vx + sway) * (dt * 60);
        p.y += p.vy * (dt * 60);

        p.pulsePhase += p.pulseSpeed;
        p.alpha = p.baseAlpha + Math.sin(p.pulsePhase) * 0.18;
        p.alpha = Math.max(0.04, Math.min(0.8, p.alpha));

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        } else if (p.y > height + 10) {
          p.y = -10;
          p.x = Math.random() * width;
        }

        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;

        const parallaxX = mouseRef.current.x * p.depth * 20;
        const parallaxY = mouseRef.current.y * p.depth * 14;

        const drawX = p.x + parallaxX;
        const drawY = p.y + parallaxY;

        ctx.save();
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.beginPath();
        ctx.arc(drawX, drawY, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [graphicsQuality, enableParallax]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10 w-full h-full"
    />
  );
};
