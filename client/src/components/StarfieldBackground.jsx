import { useEffect, useRef } from "react";

export default function StarfieldBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
    });

    if (!context) {
      return undefined;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let centerX = width / 2;
    let centerY = height / 2;
    let animationFrame = 0;
    let lastFrameTime = 0;
    let scrollProgress = 0;

    const pointer = {
      x: 0,
      y: 0,
      smoothX: 0,
      smoothY: 0,
    };

    const colors = [
      "174, 246, 207",
      "95, 230, 160",
      "234, 255, 242",
      "247, 201, 72",
    ];

    const starCount =
      width < 640 ? 280 : width < 1024 ? 450 : 700;

    const stars = Array.from({ length: starCount }, () => ({
      x: (Math.random() - 0.5) * width * 1.8,
      y: (Math.random() - 0.5) * height * 1.8,
      z: Math.random() * width + 1,
      previousZ: 0,
      size: 0.35 + Math.random() * 1.25,
      color: colors[Math.floor(Math.random() * colors.length)],
      phase: Math.random() * Math.PI * 2,
    }));

    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      centerX = width / 2;
      centerY = height / 2;

      const pixelRatio = 1;

      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
      );
    }

    function updateScroll() {
      const maximumScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      scrollProgress =
        maximumScroll > 0
          ? Math.min(window.scrollY / maximumScroll, 1)
          : 0;
    }

    function handlePointerMove(event) {
      pointer.x =
        (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y =
        (event.clientY / window.innerHeight - 0.5) * 2;
    }

    function resetStar(star) {
      star.x = (Math.random() - 0.5) * width * 1.8;
      star.y = (Math.random() - 0.5) * height * 1.8;
      star.z = width;
      star.previousZ = star.z;
    }

    function drawBackground(time) {
      const gradient = context.createRadialGradient(
        width * 0.72,
        height * 0.2,
        0,
        width * 0.72,
        height * 0.2,
        Math.max(width, height)
      );

      gradient.addColorStop(0, "#173a66");
      gradient.addColorStop(0.35, "#0a1830");
      gradient.addColorStop(1, "#050914");

      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      const glow = context.createRadialGradient(
        width * 0.15,
        height * 0.85,
        0,
        width * 0.15,
        height * 0.85,
        width * 0.75
      );

      glow.addColorStop(
        0,
        `rgba(95, 230, 160, ${
          0.06 + Math.sin(time * 0.0004) * 0.015
        })`
      );
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");

      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);
    }

    function animate(time) {
      animationFrame = window.requestAnimationFrame(animate);

      if (time - lastFrameTime < 1000 / 45) {
        return;
      }

      lastFrameTime = time;

      pointer.smoothX +=
        (pointer.x - pointer.smoothX) * 0.035;
      pointer.smoothY +=
        (pointer.y - pointer.smoothY) * 0.035;

      drawBackground(time);

      const speed = reducedMotion
        ? 0.25
        : 1.2 + scrollProgress * 4.5;

      const perspective = Math.min(width, height) * 0.95;
      const offsetX = pointer.smoothX * 24;
      const offsetY = pointer.smoothY * 18;

      context.save();
      context.globalCompositeOperation = "lighter";

      for (const star of stars) {
        star.previousZ = star.z;
        star.z -= speed;

        if (star.z < 1) {
          resetStar(star);
        }

        const scale = perspective / star.z;
        const previousScale =
          perspective / Math.max(star.previousZ, 1);

        const x =
          star.x * scale + centerX + offsetX;
        const y =
          star.y * scale + centerY + offsetY;

        const previousX =
          star.x * previousScale + centerX + offsetX;
        const previousY =
          star.y * previousScale + centerY + offsetY;

        if (
          x < -100 ||
          x > width + 100 ||
          y < -100 ||
          y > height + 100
        ) {
          resetStar(star);
          continue;
        }

        const distanceFactor =
          1 - Math.min(star.z / width, 1);

        const twinkle =
          0.55 +
          Math.sin(time * 0.002 + star.phase) * 0.25;

        const alpha = Math.max(
          0.12,
          distanceFactor * twinkle
        );

        const lineWidth =
          star.size + distanceFactor * 1.2;

        context.beginPath();
        context.moveTo(previousX, previousY);
        context.lineTo(x, y);
        context.strokeStyle = `rgba(${star.color}, ${alpha})`;
        context.lineWidth = lineWidth;
        context.stroke();

        context.beginPath();
        context.arc(
          x,
          y,
          Math.max(0.45, lineWidth * 0.7),
          0,
          Math.PI * 2
        );
        context.fillStyle = `rgba(${star.color}, ${
          Math.min(alpha + 0.18, 1)
        })`;
        context.fill();
      }

      context.restore();
    }

    resizeCanvas();
    updateScroll();
    animationFrame = window.requestAnimationFrame(animate);

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("scroll", updateScroll, {
      passive: true,
    });
    window.addEventListener(
      "pointermove",
      handlePointerMove,
      { passive: true }
    );

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-screen w-screen"
    />
  );
}
