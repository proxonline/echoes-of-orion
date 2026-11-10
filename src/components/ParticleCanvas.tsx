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
  glowColor: string;
  alpha: number;
  baseAlpha: number;
  pulseSpeed: number;
  pulsePhase: number;
  type: 'ember' | 'spectral' | 'ash';
  depth: number; // 0.2 to 1.0 for parallax
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
      // Normalized between -1 and 1
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Particle count by quality
    const counts = {
      Low: 35,
      Medium: 75,
      High: 140,
      Cinematic: 220,
    };
    const particleCount = counts[graphicsQuality] || 140;

    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const randType = Math.random();
      let type: 'ember' | 'spectral' | 'ash' = 'ash';
      let color = 'rgba(160, 170, 185, ';
      let glowColor = 'rgba(160, 170, 185, 0)';
      let size = Math.random() * 2 + 1;

      if (randType < 0.35) {
        // Glowing fire ember
        type = 'ember';
        const isWarmGold = Math.random() > 0.5;
        color = isWarmGold ? 'rgba(245, 175, 65, ' : 'rgba(235, 75, 45, ';
        glowColor = isWarmGold ? 'rgba(245, 175, 65, 0.4)' : 'rgba(235, 75, 45, 0.4)';
        size = Math.random() * 2.5 + 1.2;
      } else if (randType < 0.70) {
        // Ethereal pale-blue spectral echo particle
        type = 'spectral';
        color = 'rgba(125, 230, 255, ';
        glowColor = 'rgba(70, 200, 255, 0.5)';
        size = Math.random() * 3 + 1.5;
      } else {
        // Drifting burnt ash
        type = 'ash';
        color = 'rgba(130, 135, 145, ';
        glowColor = 'transparent';
        size = Math.random() * 1.8 + 0.8;
      }

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.4) * 0.4,
        vy: type === 'ember' ? -(Math.random() * 0.7 + 0.3) : -(Math.random() * 0.3 + 0.1),
        size,
        color,
        glowColor,
        alpha: Math.random() * 0.7 + 0.2,
        baseAlpha: Math.random() * 0.6 + 0.3,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
        type,
        depth: Math.random() * 0.8 + 0.2,
      });
    }

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      // Smooth mouse parallax damping
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Wave motion for spectral echoes
        let sway = 0;
        if (p.type === 'spectral') {
          sway = Math.sin(time * 0.0015 + p.pulsePhase) * 0.4;
        }

        p.x += (p.vx + sway) * (dt * 60);
        p.y += p.vy * (dt * 60);

        // Alpha pulsing
        p.pulsePhase += p.pulseSpeed;
        p.alpha = p.baseAlpha + Math.sin(p.pulsePhase) * 0.25;
        p.alpha = Math.max(0.05, Math.min(1, p.alpha));

        // Wrap around boundaries
        if (p.y < -20) {
          p.y = height + 10;
          p.x = Math.random() * width;
        } else if (p.y > height + 20) {
          p.y = -10;
          p.x = Math.random() * width;
        }

        if (p.x < -20) p.x = width + 10;
        else if (p.x > width + 20) p.x = -10;

        // Apply Parallax offset
        const parallaxX = mouseRef.current.x * p.depth * 25;
        const parallaxY = mouseRef.current.y * p.depth * 18;

        const drawX = p.x + parallaxX;
        const drawY = p.y + parallaxY;

        ctx.save();

        if (p.type === 'spectral' || p.type === 'ember') {
          // Glow halo
          ctx.shadowBlur = p.type === 'spectral' ? 12 : 8;
          ctx.shadowColor = p.glowColor;
        }

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
