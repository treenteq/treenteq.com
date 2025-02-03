'use client';

import { useEffect, useRef } from 'react';

export default function BackgroundAnimation() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const particles: { x: number; y: number; dx: number; dy: number }[] =
            [];
        const particleCount = 50;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createParticle = () => {
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                dx: (Math.random() - 0.5) * 0.5,
                dy: (Math.random() - 0.5) * 0.5,
            };
        };

        const initParticles = () => {
            for (let i = 0; i < particleCount; i++) {
                particles.push(createParticle());
            }
        };

        const drawParticle = (p: { x: number; y: number }) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fill();
        };

        const drawLine = (
            p1: { x: number; y: number },
            p2: { x: number; y: number },
        ) => {
            const distance = Math.sqrt(
                Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2),
            );
            if (distance < 100) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(0, 0, 0, ${
                    0.1 * (1 - distance / 100)
                })`;
                ctx.stroke();
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p, i) => {
                p.x += p.dx;
                p.y += p.dy;

                if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

                drawParticle(p);

                for (let j = i + 1; j < particles.length; j++) {
                    drawLine(p, particles[j]);
                }
            });

            requestAnimationFrame(animate);
        };

        resizeCanvas();
        initParticles();
        animate();

        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 bg-gradient-to-br from-white to-gray-100"
        />
    );
}
