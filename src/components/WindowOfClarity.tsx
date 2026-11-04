import { useEffect, useRef, useState } from "react";

// Two renderings of the same source image. The base is gently desaturated;
// a soft elliptical window reveals the warmer color following a fine pointer.
// Bounded to the image, behind content, non-interactive, and disabled for
// touch / reduced-motion (full warm image shown instead).

const SRC =
  "https://images.unsplash.com/photo-1687975648605-fce6f1310256?w=1400&h=1600&fit=crop&auto=format&q=80";

const REVEAL = 300; // px diameter of the reveal window on desktop

export function WindowOfClarity({ className = "" }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const maskRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const pos = useRef({ x: -9999, y: -9999 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fine && !reduced);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const wrap = wrapRef.current;
    const mask = maskRef.current;
    if (!wrap || !mask) return;

    let visible = true;
    const io = new IntersectionObserver(
      ([e]) => (visible = e.isIntersecting),
      { threshold: 0 },
    );
    io.observe(wrap);

    const apply = () => {
      rafRef.current = null;
      const { x, y } = pos.current;
      // Elliptical window, slightly wider than tall, echoing the sweeping curve.
      mask.style.setProperty(
        "-webkit-mask-image",
        `radial-gradient(${REVEAL}px ${REVEAL * 0.82}px at ${x}px ${y}px, #000 0%, #000 46%, rgba(0,0,0,0.35) 68%, transparent 100%)`,
      );
      mask.style.setProperty(
        "mask-image",
        `radial-gradient(${REVEAL}px ${REVEAL * 0.82}px at ${x}px ${y}px, #000 0%, #000 46%, rgba(0,0,0,0.35) 68%, transparent 100%)`,
      );
    };

    const onMove = (e: PointerEvent) => {
      if (!visible) return;
      const rect = wrap.getBoundingClientRect();
      pos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      mask.style.opacity = "1";
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      if (mask) mask.style.opacity = "0";
    };

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    return () => {
      io.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled]);

  return (
    <div
      ref={wrapRef}
      className={`relative overflow-hidden bg-charcoal ${className}`}
      aria-hidden
    >
      {/* Base rendering: readable, gently desaturated warm image */}
      <img
        src={SRC}
        alt=""
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: enabled ? "saturate(0.7) brightness(0.94)" : "none" }}
      />
      {/* Warm rendering revealed through the pointer window */}
      {enabled && (
        <div
          ref={maskRef}
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: 0 }}
        >
          <img
            src={SRC}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ filter: "saturate(1.12) brightness(1.03) contrast(1.02)" }}
          />
        </div>
      )}
      {/* Subtle inner framing echoing the monogram's sweep */}
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-ivory/10" />
    </div>
  );
}
