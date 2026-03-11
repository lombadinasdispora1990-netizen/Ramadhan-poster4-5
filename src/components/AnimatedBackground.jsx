import { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];
    let stars = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Floating particles (gold + emerald dust)
    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedY = -(Math.random() * 0.3 + 0.1);
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.fadeDir = Math.random() > 0.5 ? 1 : -1;
        this.fadeSpeed = Math.random() * 0.005 + 0.002;
        // Gold or emerald
        const isGold = Math.random() > 0.6;
        this.color = isGold 
          ? `rgba(212, 175, 55, ${this.opacity})` 
          : `rgba(16, 185, 129, ${this.opacity})`;
        this.isGold = isGold;
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.opacity += this.fadeDir * this.fadeSpeed;
        if (this.opacity > 0.6) this.fadeDir = -1;
        if (this.opacity < 0.05) this.fadeDir = 1;
        this.color = this.isGold 
          ? `rgba(212, 175, 55, ${Math.max(0, this.opacity)})` 
          : `rgba(16, 185, 129, ${Math.max(0, this.opacity)})`;
        if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
          this.reset();
          this.y = canvas.height + 10;
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    // Twinkling stars
    class Star {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height * 0.6; // Mostly upper half
        this.size = Math.random() * 1.2 + 0.3;
        this.opacity = Math.random() * 0.4;
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
        this.phase = Math.random() * Math.PI * 2;
      }
      update(time) {
        this.opacity = 0.1 + Math.sin(time * this.twinkleSpeed + this.phase) * 0.3;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, this.opacity)})`;
        ctx.fill();
      }
    }

    // Initialize
    const particleCount = Math.min(60, Math.floor(canvas.width * 0.04));
    const starCount = Math.min(80, Math.floor(canvas.width * 0.06));
    
    for (let i = 0; i < particleCount; i++) particles.push(new Particle());
    for (let i = 0; i < starCount; i++) stars.push(new Star());

    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time++;

      stars.forEach(s => { s.update(time); s.draw(); });
      particles.forEach(p => { p.update(); p.draw(); });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
};

export default AnimatedBackground;
