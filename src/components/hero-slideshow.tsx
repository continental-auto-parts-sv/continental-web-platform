"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";

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

const timeFormatter = new Intl.DateTimeFormat("es-SV", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const dateFormatter = new Intl.DateTimeFormat("es-SV", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

const accessibilityChangeEvent = "continental-dev-accessibility-change";

export function HeroSlideshow() {
  const controlsRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const closingRef = useRef(false);
  const elapsedRef = useRef(0);
  const exitTimerRef = useRef<number | null>(null);
  const idleTimerRef = useRef<number | null>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const reducedMotionRef = useRef(true);
  const viewerRef = useRef<HTMLDivElement>(null);
  const wheelExitDistanceRef = useRef(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [visible, setVisible] = useState(true);
  const [loaded, setLoaded] = useState<number[]>([]);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerClosing, setViewerClosing] = useState(false);
  const [viewerControlsVisible, setViewerControlsVisible] = useState(true);
  const [now, setNow] = useState(() => new Date());

  const selectSlide = useCallback((index: number) => {
    const nextIndex = (index + slides.length) % slides.length;
    elapsedRef.current = 0;
    activeRef.current = nextIndex;
    setActive(nextIndex);
  }, []);

  const closeViewer = useCallback(() => {
    if (closingRef.current) return;

    const hero = openButtonRef.current?.closest<HTMLElement>(".hero");
    const viewer = viewerRef.current;

    if (hero && viewer) {
      const bounds = hero.getBoundingClientRect();
      viewer.style.setProperty(
        "--wallpaper-target-top",
        `${Math.max(0, bounds.top)}px`,
      );
      viewer.style.setProperty(
        "--wallpaper-target-right",
        `${Math.max(0, window.innerWidth - bounds.right)}px`,
      );
      viewer.style.setProperty(
        "--wallpaper-target-bottom",
        `${Math.max(0, window.innerHeight - bounds.bottom)}px`,
      );
      viewer.style.setProperty(
        "--wallpaper-target-left",
        `${Math.max(0, bounds.left)}px`,
      );
    }

    closingRef.current = true;
    setViewerClosing(true);
    document.body.classList.add("wallpaper-viewer-exiting");

    const exitDuration = reducedMotionRef.current ? 180 : 840;

    exitTimerRef.current = window.setTimeout(() => {
      setViewerOpen(false);
      setViewerClosing(false);
      closingRef.current = false;
      wheelExitDistanceRef.current = 0;
      document.body.classList.remove("wallpaper-viewer-exiting");
    }, exitDuration);
  }, []);

  const revealViewerControls = useCallback(() => {
    setViewerControlsVisible(true);

    if (idleTimerRef.current !== null) {
      window.clearTimeout(idleTimerRef.current);
    }

    idleTimerRef.current = window.setTimeout(() => {
      setViewerControlsVisible(false);
    }, 4000);
  }, []);

  const openViewer = useCallback(() => {
    closingRef.current = false;
    wheelExitDistanceRef.current = 0;
    setNow(new Date());
    setPaused(false);
    setViewerClosing(false);
    revealViewerControls();
    setViewerOpen(true);
  }, [revealViewerControls]);

  const handleViewerWheel = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      revealViewerControls();

      if (closingRef.current || event.ctrlKey || event.deltaY === 0) return;

      if (event.deltaY < 0) {
        wheelExitDistanceRef.current = 0;
        return;
      }

      const deltaScale =
        event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? window.innerHeight
            : 1;
      wheelExitDistanceRef.current += Math.abs(event.deltaY) * deltaScale;

      if (wheelExitDistanceRef.current >= 90) {
        closeViewer();
      }
    },
    [closeViewer, revealViewerControls],
  );

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
    const updateMotion = (event?: Event) => {
      const previewEnabled =
        event instanceof CustomEvent && typeof event.detail === "number"
          ? Boolean(event.detail & 1)
          : document.querySelector<HTMLElement>(".home-page")?.dataset
              .reducedMotion === "true";
      const shouldReduceMotion = media.matches || previewEnabled;

      reducedMotionRef.current = shouldReduceMotion;
      setReducedMotion(shouldReduceMotion);
    };
    const updateVisibility = () => setVisible(!document.hidden);
    updateMotion();
    updateVisibility();
    media.addEventListener("change", updateMotion);
    window.addEventListener(accessibilityChangeEvent, updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      media.removeEventListener("change", updateMotion);
      window.removeEventListener(accessibilityChangeEvent, updateMotion);
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
        selectSlide(activeRef.current + 1);
        return;
      }
      frame = window.requestAnimationFrame(advance);
    }

    frame = window.requestAnimationFrame(advance);
    return () => window.cancelAnimationFrame(frame);
  }, [active, paused, reducedMotion, selectSlide, visible, loaded.length]);

  useEffect(() => {
    if (!viewerOpen) return;

    const openButton = openButtonRef.current;
    const previousOverflow = document.body.style.overflow;
    const updateTime = () => setNow(new Date());
    const clock = window.setInterval(updateTime, 1000);
    document.body.style.overflow = "hidden";
    document.body.classList.add("wallpaper-viewer-open");
    viewerRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      revealViewerControls();

      if (event.key === "Escape") {
        closeViewer();
        return;
      }

      if (event.key === "ArrowLeft") {
        selectSlide(activeRef.current - 1);
        return;
      }

      if (event.key === "ArrowRight") {
        selectSlide(activeRef.current + 1);
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = Array.from(
        viewerRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
      const first = focusable[0];
      const last = focusable.at(-1);

      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearInterval(clock);
      if (idleTimerRef.current !== null) {
        window.clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
      if (exitTimerRef.current !== null) {
        window.clearTimeout(exitTimerRef.current);
        exitTimerRef.current = null;
      }
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove(
        "wallpaper-viewer-open",
        "wallpaper-viewer-exiting",
      );
      document.removeEventListener("keydown", handleKeyDown);
      openButton?.focus();
    };
  }, [closeViewer, revealViewerControls, selectSlide, viewerOpen]);

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
      <button
        ref={openButtonRef}
        type="button"
        className="wallpaper-open"
        aria-haspopup="dialog"
        aria-label="Abrir vista de fondos"
        onClick={openViewer}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" />
        </svg>
        <span>Vista</span>
      </button>
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
      {viewerOpen &&
        createPortal(
          <div
            className="wallpaper-viewer"
            ref={viewerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Vista de fondos de pantalla"
            data-controls-visible={viewerControlsVisible}
            data-exiting={viewerClosing}
            tabIndex={-1}
            onPointerMove={revealViewerControls}
            onPointerDown={revealViewerControls}
            onWheel={handleViewerWheel}
          >
            <div className="wallpaper-stage" aria-live="polite">
              {slides.map((slide, index) => (
                <div
                  className="wallpaper-slide"
                  data-active={active === index}
                  aria-hidden={active !== index}
                  key={slide.file}
                >
                  <Image
                    src={`/images/hero/${slide.file}.webp`}
                    alt={active === index ? slide.alt : ""}
                    fill
                    sizes="100vw"
                    className={`wallpaper-image wallpaper-${slide.file}`}
                  />
                </div>
              ))}
              <div className="wallpaper-vignette" aria-hidden="true" />
            </div>

            <div className="wallpaper-topbar">
              <div className="wallpaper-identity">
                <Image
                  src="/images/brands/continental-horizontal-dark.png"
                  alt="Continental Auto Parts"
                  width={226}
                  height={64}
                  className="wallpaper-logo"
                  priority
                />
                <div className="wallpaper-clock">
                  <time dateTime={now.toISOString()}>
                    {timeFormatter.format(now)}
                  </time>
                  <span>{dateFormatter.format(now)}</span>
                </div>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                className="wallpaper-close"
                aria-label="Cerrar vista de fondos"
                onClick={closeViewer}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <button
              type="button"
              className="wallpaper-arrow wallpaper-arrow-previous"
              aria-label="Foto anterior"
              onClick={() => selectSlide(active - 1)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m15 5-7 7 7 7" />
              </svg>
            </button>
            <button
              type="button"
              className="wallpaper-arrow wallpaper-arrow-next"
              aria-label="Foto siguiente"
              onClick={() => selectSlide(active + 1)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m9 5 7 7-7 7" />
              </svg>
            </button>

            <div className="wallpaper-footer">
              <div className="wallpaper-caption">
                <span>
                  {String(active + 1).padStart(2, "0")} /{" "}
                  {String(slides.length).padStart(2, "0")}
                </span>
                <strong>{slides[active].name}</strong>
              </div>
              {!reducedMotion && (
                <button
                  type="button"
                  className="wallpaper-pause"
                  aria-label={paused ? "Reanudar fotos" : "Pausar fotos"}
                  onClick={() => setPaused(!paused)}
                >
                  <span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span>
                  {paused ? "Reanudar" : "Pausar"}
                </button>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
