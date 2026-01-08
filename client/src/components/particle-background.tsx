import { useMemo } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
}

export default function ParticleBackground() {
  const particles = useMemo(() => {
    const colors = [
      'rgba(168, 85, 247, 0.6)',  // purple
      'rgba(59, 130, 246, 0.6)',   // blue
      'rgba(236, 72, 153, 0.6)',   // pink
      'rgba(139, 92, 246, 0.5)',   // violet
    ];
    
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5,
      duration: Math.random() * 4 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `radial-gradient(circle, ${particle.color} 0%, transparent 70%)`,
            boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            willChange: 'transform',
          }}
        />
      ))}
      
      {/* Larger glow orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
    </div>
  );
}
