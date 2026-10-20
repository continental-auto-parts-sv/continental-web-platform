"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { SpecialOrdersCallout } from "./special-orders-callout";

import "./about-experience.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

const journey = [
  {
    number: "01",
    title: "Entendemos lo que necesitas",
    detail:
      "Nos cuentas qué vehículo tienes y qué repuesto buscas. Revisamos contigo los detalles para orientarte hacia la pieza adecuada.",
    image: "/images/about/store-reception.webp",
    imageAlt: "Área de atención de Continental Auto Parts",
  },
  {
    number: "02",
    title: "Te asesoramos con experiencia",
    detail:
      "Aplicamos nuestro conocimiento en repuestos europeos para explicarte las opciones y ayudarte a elegir con confianza.",
    image: "/images/about/journey-guidance.webp",
    imageAlt: "Exhibición de marcas europeas en Continental Auto Parts",
  },
  {
    number: "03",
    title: "Damos seguimiento a tu compra",
    detail:
      "Te acompañamos desde la consulta hasta la entrega, resolviendo tus dudas y manteniéndote informado.",
    image: "/images/about/journey-followup.webp",
    imageAlt: "Recepción de Continental Auto Parts",
  },
];

const values = [
  {
    title: "Integridad",
    detail:
      "Te brindamos información clara y honesta para que tomes decisiones con confianza.",
  },
  {
    title: "Nuestra gente",
    detail:
      "Valoramos a nuestro equipo y promovemos su aprendizaje para atenderte cada día mejor.",
  },
  {
    title: "Excelencia",
    detail:
      "Cuidamos los detalles de nuestra atención y buscamos mejorar en cada consulta.",
  },
  {
    title: "Pasión",
    detail:
      "Nos apasiona el mundo automotriz y ponemos ese interés al servicio de tu vehículo.",
  },
];

export function AboutExperience() {
  const pageRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const motion = gsap.matchMedia();

      motion.add(
        {
          desktop: "(min-width: 901px)",
          mobile: "(max-width: 900px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { desktop, mobile, reduceMotion } = context.conditions as {
            desktop: boolean;
            mobile: boolean;
            reduceMotion: boolean;
          };

          if (reduceMotion) return;

          gsap
            .timeline({ defaults: { ease: "power3.out" } })
            .from(".story-hero-title-line", {
              autoAlpha: 0,
              yPercent: 90,
              stagger: 0.08,
              duration: 0.85,
            })
            .from(
              ".story-hero-summary, .story-scroll-cue",
              { autoAlpha: 0, y: 24, stagger: 0.08, duration: 0.55 },
              "-=0.42",
            );

          gsap.to(".story-hero-image", {
            scale: 1.09,
            yPercent: 7,
            ease: "none",
            scrollTrigger: {
              trigger: ".story-hero",
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          });

          gsap.to(".story-hero-copy", {
            yPercent: -12,
            autoAlpha: 0.25,
            ease: "none",
            scrollTrigger: {
              trigger: ".story-hero",
              start: "45% center",
              end: "bottom top",
              scrub: 1,
            },
          });

          const introPoints =
            gsap.utils.toArray<HTMLElement>(".story-intro-point");

          if (desktop) {
            const introMarkers = gsap.utils.toArray<HTMLElement>(
              ".story-intro-marker",
            );

            gsap.set(introPoints.slice(1), { autoAlpha: 0, y: 44 });

            const introTimeline = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: ".story-intro",
                start: "top top",
                end: () => `+=${window.innerHeight * 1.8}`,
                pin: ".story-intro-layout",
                scrub: 0.45,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });

            introTimeline.to({}, { duration: 0.5 });

            introPoints.slice(1).forEach((point, index) => {
              const previous = index;
              const current = index + 1;
              const at = 0.65 + index * 1.15;

              introTimeline
                .to(
                  introPoints[previous],
                  { autoAlpha: 0, y: -36, duration: 0.4 },
                  at,
                )
                .fromTo(
                  point,
                  { autoAlpha: 0, y: 44 },
                  { autoAlpha: 1, y: 0, duration: 0.52 },
                  at + 0.12,
                )
                .to(
                  introMarkers[previous],
                  { opacity: 0.35, scale: 0.72, duration: 0.35 },
                  at,
                )
                .to(
                  introMarkers[current],
                  { opacity: 1, scale: 1, duration: 0.42 },
                  at + 0.12,
                )
                .to(
                  ".story-intro-progress-fill",
                  {
                    scaleY: current / (introPoints.length - 1),
                    duration: 0.52,
                  },
                  at + 0.12,
                );
            });

            introTimeline.to({}, { duration: 0.5 });
          }

          if (mobile) {
            introPoints.forEach((point) => {
              gsap.from(point, {
                autoAlpha: 0,
                y: 40,
                duration: 0.72,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: point,
                  start: "top 84%",
                  toggleActions: "play none none reverse",
                },
              });
            });
          }

          gsap.utils
            .toArray<HTMLElement>(".story-copy-reveal")
            .forEach((element) => {
              gsap.from(element, {
                autoAlpha: 0,
                y: 54,
                duration: 0.85,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: element,
                  start: "top 84%",
                  toggleActions: "play none none reverse",
                },
              });
            });

          if (desktop) {
            const panels = gsap.utils.toArray<HTMLElement>(
              ".story-journey-panel",
            );
            const scenes = gsap.utils.toArray<HTMLElement>(
              ".story-journey-scene",
            );

            gsap.set(panels.slice(1), { autoAlpha: 0, y: 46 });
            gsap.set(scenes.slice(1), { autoAlpha: 0, scale: 1.04 });

            const journeyTimeline = gsap.timeline({
              defaults: { ease: "power2.inOut", duration: 0.55 },
              scrollTrigger: {
                trigger: ".story-journey",
                start: "top top",
                end: () => `+=${window.innerHeight * 2.6}`,
                pin: ".story-journey-stage",
                scrub: 0.55,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });

            journeyTimeline.to({}, { duration: 0.55 });

            panels.slice(1).forEach((panel, index) => {
              const previous = index;
              const current = index + 1;
              const at = 0.8 + index * 1.15;

              journeyTimeline
                .to(
                  panels[previous],
                  { autoAlpha: 0, y: -40, duration: 0.42 },
                  at,
                )
                .to(
                  scenes[previous],
                  { autoAlpha: 0, scale: 0.96, duration: 0.48 },
                  at,
                )
                .fromTo(
                  panel,
                  { autoAlpha: 0, y: 44 },
                  { autoAlpha: 1, y: 0, duration: 0.55 },
                  at + 0.16,
                )
                .fromTo(
                  scenes[current],
                  { autoAlpha: 0, scale: 1.05 },
                  { autoAlpha: 1, scale: 1, duration: 0.62 },
                  at + 0.12,
                )
                .to(
                  ".story-journey-progress-fill",
                  { scaleX: (current + 1) / panels.length, duration: 0.62 },
                  at + 0.12,
                );
            });

            journeyTimeline.to({}, { duration: 0.65 });
          }

          gsap.from(".story-commitment-line", {
            autoAlpha: 0,
            yPercent: 70,
            stagger: 0.1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".story-commitment-title",
              start: "top 76%",
              toggleActions: "play none none reverse",
            },
          });

          const valueCards = gsap.utils.toArray<HTMLElement>(".story-value");

          if (desktop) {
            const valuesViewport = document.querySelector<HTMLElement>(
              ".story-values-viewport",
            );
            const valuesTrack =
              document.querySelector<HTMLElement>(".story-values-list");

            if (valuesViewport && valuesTrack) {
              const horizontalDistance = () =>
                Math.max(
                  0,
                  valuesTrack.scrollWidth - valuesViewport.clientWidth,
                );

              const valuesTimeline = gsap.timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                  trigger: ".story-values",
                  start: "top 80px",
                  end: () =>
                    `+=${Math.max(
                      horizontalDistance(),
                      window.innerHeight * 0.75,
                    )}`,
                  pin: ".story-values-stage",
                  scrub: 0.55,
                  anticipatePin: 1,
                  invalidateOnRefresh: true,
                },
              });

              valuesTimeline
                .to(valuesTrack, { x: () => -horizontalDistance() }, 0)
                .to(".story-values-progress-fill", { scaleX: 1 }, 0);

              valueCards.forEach((card) => {
                gsap.fromTo(
                  card,
                  { opacity: 0.58, scale: 0.94 },
                  {
                    opacity: 1,
                    scale: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                      containerAnimation: valuesTimeline,
                      trigger: card,
                      start: "left 88%",
                      end: "center 62%",
                      scrub: true,
                    },
                  },
                );
              });
            }
          }

          if (mobile) {
            gsap.from(valueCards, {
              autoAlpha: 0,
              x: 48,
              stagger: 0.08,
              duration: 0.68,
              ease: "power3.out",
              scrollTrigger: {
                trigger: ".story-values-list",
                start: "top 88%",
                toggleActions: "play none none reverse",
              },
            });
          }
        },
      );

      let scrollFrame = 0;
      const resetScrollPosition = () => {
        const root = document.documentElement;
        const previousScrollBehavior = root.style.scrollBehavior;

        root.style.scrollBehavior = "auto";
        window.scrollTo(0, 0);
        root.style.scrollBehavior = previousScrollBehavior;
        ScrollTrigger.refresh();
      };

      const refreshFrame = window.requestAnimationFrame(() => {
        scrollFrame = window.requestAnimationFrame(resetScrollPosition);
      });

      return () => {
        window.cancelAnimationFrame(refreshFrame);
        window.cancelAnimationFrame(scrollFrame);
        motion.revert();
      };
    },
    { scope: pageRef },
  );

  return (
    <article className="story-page" ref={pageRef}>
      <section className="story-hero">
        <figure className="story-hero-frame">
          <Image
            className="story-hero-image"
            src="/images/about/store-reception.webp"
            alt="Área de atención de Continental Auto Parts"
            fill
            loading="eager"
            priority
            sizes="100vw"
          />
          <span className="story-hero-scrim" />
        </figure>

        <div className="story-hero-glow" aria-hidden="true" />
        <div className="container story-hero-shell">
          <div className="story-hero-copy">
            <h1 className="story-hero-title">
              <span className="story-hero-title-line">Repuestos europeos.</span>
              <span className="story-hero-title-line story-hero-title-accent">
                Personas de confianza.
              </span>
            </h1>
            <p className="story-hero-summary">
              Conocimiento técnico y atención cercana para ayudarte a encontrar
              la pieza adecuada para tu vehículo.
            </p>
            <a className="story-scroll-cue" href="#nuestra-historia">
              <span aria-hidden="true">↓</span>
              <span>Descubre nuestra historia</span>
            </a>
          </div>
        </div>
      </section>

      <section className="story-intro" id="nuestra-historia">
        <div className="container story-intro-layout">
          <div className="story-intro-stage">
            <div className="story-intro-progress" aria-hidden="true">
              <span className="story-intro-progress-fill" />
              <i className="story-intro-marker" />
              <i className="story-intro-marker" />
              <i className="story-intro-marker" />
            </div>

            <div className="story-intro-copy">
              <p className="story-intro-point story-intro-lead">
                En Continental Auto Parts nos especializamos en la venta de
                repuestos de alta calidad para Volkswagen, Audi, SEAT, BMW,
                Mercedes Benz, Mini Cooper y Porsche.
              </p>
              <p className="story-intro-point">
                Combinamos conocimiento técnico y atención cercana para ayudarte
                a encontrar la pieza adecuada para tu vehículo.
              </p>
              <p className="story-intro-point">
                Sabemos que cada consulta merece tiempo y atención. Por eso,
                escuchamos lo que necesitas, te orientamos con claridad y te
                acompañamos durante tu compra.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="story-journey" id="como-te-acompanamos">
        <div className="story-journey-stage">
          <div className="container story-journey-shell">
            <header className="story-journey-header">
              <h2>Así te acompañamos</h2>
            </header>

            <div className="story-journey-visual" aria-hidden="true">
              <div className="story-journey-scene story-scene-vehicle">
                <Image
                  src="/images/about/store-reception.webp"
                  alt=""
                  fill
                  sizes="(max-width: 900px) 90vw, 44vw"
                />
                <div className="story-scene-shade" />
                <span className="story-focus-ring" />
              </div>

              <div className="story-journey-scene story-scene-guidance">
                <Image
                  src="/images/about/journey-guidance.webp"
                  alt=""
                  fill
                  sizes="(max-width: 900px) 90vw, 44vw"
                />
                <div className="story-scene-shade" />
              </div>

              <div className="story-journey-scene story-scene-followup">
                <Image
                  src="/images/about/journey-followup.webp"
                  alt=""
                  fill
                  sizes="(max-width: 900px) 90vw, 44vw"
                />
                <div className="story-scene-shade" />
              </div>
            </div>

            <div className="story-journey-copy">
              {journey.map((item) => (
                <article className="story-journey-panel" key={item.number}>
                  <div className="story-panel-media">
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      sizes="(max-width: 900px) calc(100vw - 48px), 1px"
                    />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>

            <div className="story-journey-progress" aria-hidden="true">
              <span className="story-journey-progress-fill" />
            </div>
          </div>
        </div>
      </section>

      <section className="story-commitment">
        <div className="container story-commitment-layout">
          <h2 className="story-commitment-title">
            <span className="story-commitment-line">Nuestra especialidad</span>
            <span className="story-commitment-line">es europea.</span>
            <span className="story-commitment-line story-commitment-accent">
              Nuestro compromiso es contigo.
            </span>
          </h2>
          <p className="story-commitment-copy story-copy-reveal">
            Trabajamos para que encontrar el repuesto que necesitas sea una
            experiencia clara y sencilla. Nos preparamos constantemente para
            brindarte una asesoría útil y un servicio en el que puedas confiar.
          </p>
        </div>
      </section>

      <section className="story-values">
        <div className="story-values-stage">
          <div className="container story-values-layout">
            <div className="story-values-heading">
              <h2>Nuestros valores</h2>
            </div>

            <div className="story-values-viewport">
              <div
                className="story-values-list"
                aria-label="Valores de Continental Auto Parts"
                role="list"
                tabIndex={0}
              >
                {values.map((value) => (
                  <article
                    className="story-value"
                    key={value.title}
                    role="listitem"
                  >
                    {/*<span className="story-value-letter" aria-hidden="true">*/}
                    {/*  {value.title.charAt(0)}*/}
                    {/*</span>*/}
                    <div className="story-value-copy">
                      <h3>{value.title}</h3>
                      <p>{value.detail}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="story-values-progress" aria-hidden="true">
              <span className="story-values-progress-fill" />
            </div>
          </div>
        </div>
      </section>

      <SpecialOrdersCallout />
    </article>
  );
}
