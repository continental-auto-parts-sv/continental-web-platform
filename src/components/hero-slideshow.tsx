"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import "./hero-slideshow.css";

const slides = [
  {
    name: "Audi",
    file: "audi",
    alt: "Interior de un Audi con volante y tablero",
  },
  {
    name: "Volkswagen",
    file: "volkswagen",
    alt: "Volkswagen rojo en un campo",
  },
  {
    name: "SEAT",
    file: "seat",
    alt: "SEAT negro frente a un edificio industrial",
  },
  { name: "Porsche", file: "porsche", alt: "Porsche negro frente a un garaje" },
];

export function HeroSlideshow() {
  const controlsRef = useRef<HTMLDivElement>(null);
  const elapsedRef = useRef(0);
  const progressRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [visible, setVisible] = useState(true);
  const [loaded, setLoaded] = useState<number[]>([]);

  useEffect(() => {
    const controls = controlsRef.current;
    const hero = controls?.closest(".hero");
    if (!controls || !hero) return;

    function updateProximity(event: Event) {
      const pointer = event as PointerEvent;
      if (pointer.pointerType !== "mouse" || !controls) return;
      const bounds = controls.getBoundingClientRect();
      const distanceX = Math.max(
        bounds.left - pointer.clientX,
        0,
        pointer.clientX - bounds.right,
      );
      const distanceY = Math.max(
        bounds.top - pointer.clientY,
        0,
        pointer.clientY - bounds.bottom,
      );
      controls.dataset.near = String(Math.hypot(distanceX, distanceY) < 100);
    }

    function resetProximity() {
      if (controls) controls.dataset.near = "false";
    }

    hero.addEventListener("pointermove", updateProximity);
    hero.addEventListener("pointerleave", resetProximity);
    return () => {
      hero.removeEventListener("pointermove", updateProximity);
      hero.removeEventListener("pointerleave", resetProximity);
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(media.matches);
    const updateVisibility = () => setVisible(!document.hidden);
    updateMotion();
    updateVisibility();
    media.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      media.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (paused || reducedMotion || !visible || loaded.length < slides.length) {
      return;
    }
    let previousTime: number | null = null;
    let frame: number;

    function advance(time: number) {
      if (previousTime !== null) elapsedRef.current += time - previousTime;
      previousTime = time;
      const progress = Math.min(elapsedRef.current / 7000, 1);
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }
      if (progress >= 1) {
        elapsedRef.current = 0;
        setActive((index) => (index + 1) % slides.length);
        return;
      }
      frame = window.requestAnimationFrame(advance);
    }

    frame = window.requestAnimationFrame(advance);
    return () => window.cancelAnimationFrame(frame);
  }, [active, paused, reducedMotion, visible, loaded.length]);

  return (
    <>
      <div className="hero-slides">
        {slides.map((slide, index) => (
          <div
            className="hero-slide"
            data-active={active === index}
            aria-hidden={active !== index}
            key={slide.file}
          >
            <Image
              src={`/images/hero/${slide.file}.webp`}
              alt={slide.alt}
              fill
              priority={index === 0}
              loading={index === 0 ? undefined : "eager"}
              sizes="100vw"
              className={`hero-slide-image hero-slide-${slide.file}`}
              onLoad={() =>
                setLoaded((images) =>
                  images.includes(index) ? images : [...images, index],
                )
              }
            />
          </div>
        ))}
      </div>
      <div
        className="hero-slide-controls"
        ref={controlsRef}
        aria-label="Fotografías de vehículos"
      >
        <span className="hero-slide-indicator" aria-hidden="true">
          <span
            key={active}
            className="hero-slide-progress"
            ref={progressRef}
          />
        </span>
        {!reducedMotion && (
          <button
            type="button"
            className="hero-slide-toggle"
            aria-label={paused ? "Reanudar fotos" : "Pausar fotos"}
            onClick={() => setPaused(!paused)}
          >
            <span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span>
          </button>
        )}
      </div>
    </>
  );
}
