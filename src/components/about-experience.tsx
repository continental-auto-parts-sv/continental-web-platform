"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import "./about-experience.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

const journey = [
  {
    verb: "Conocemos tu necesidad",
    detail:
      "Partimos de tu vehículo, lo que necesitas y el resultado que esperas.",
  },
  {
    verb: "Asesoramos con experiencia",
    detail:
      "Nuestro equipo aplica su conocimiento para recomendarte opciones de calidad.",
  },
  {
    verb: "Resolvemos contigo",
    detail:
      "Acompañamos tu decisión y damos seguimiento hasta completar la entrega.",
  },
];

const productStages = [
  { name: "Motor", image: "/images/categories/engine-dark.webp" },
  { name: "Frenos", image: "/images/categories/brake-dark.webp" },
  {
    name: "Suspensión",
    image: "/images/categories/suspension-dark.webp",
  },
];

export function AboutExperience() {
  const pageRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const motion = gsap.matchMedia();

      motion.add("(prefers-reduced-motion: no-preference)", () => {
        const productMedia = gsap.utils.toArray<HTMLElement>(
          ".story-product-media",
        );
        const journeySteps = gsap.utils.toArray<HTMLElement>(".story-step");

        gsap.set(journeySteps, { opacity: 0.28 });

        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".story-hero-kicker", { opacity: 0, y: 18, duration: 0.5 })
          .from(
            ".story-hero-title > span",
            { opacity: 0, yPercent: 75, stagger: 0.1, duration: 0.85 },
            "-=0.25",
          )
          .from(
            ".story-hero-summary, .story-scroll-cue",
            { opacity: 0, y: 24, stagger: 0.08, duration: 0.55 },
            "-=0.4",
          );

        gsap.fromTo(
          ".story-hero-image",
          { scale: 1.03, yPercent: 0 },
          {
            scale: 1.08,
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
              trigger: ".story-hero",
              start: "top top",
              end: "bottom top",
              scrub: 1.2,
            },
          },
        );

        gsap.to(".story-progress-fill", {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".story-journey-steps",
            start: "top 68%",
            end: "bottom 42%",
            scrub: 1,
          },
        });

        const productTimeline = gsap.timeline({
          defaults: {
            duration: 0.5,
            ease: "power1.inOut",
          },
          scrollTrigger: {
            trigger: ".story-journey-steps",
            start: "top 62%",
            end: "bottom 62%",
            scrub: 0.85,
          },
        });

        productTimeline
          .to(
            productMedia[0],
            { autoAlpha: 0, scale: 0.96, y: -10, rotation: -1.5 },
            0.45,
          )
          .to(
            productMedia[1],
            { autoAlpha: 1, scale: 1, y: 0, rotation: 0 },
            0.45,
          )
          .to(
            productMedia[1],
            { autoAlpha: 0, scale: 0.96, y: -10, rotation: -1.5 },
            1.55,
          )
          .to(
            productMedia[2],
            { autoAlpha: 1, scale: 1, y: 0, rotation: 0 },
            1.55,
          )
          .to(productMedia[2], { autoAlpha: 1, duration: 0.65 }, 2.05);

        journeySteps.forEach((step) => {
          gsap.to(step, {
            opacity: 1,
            duration: 0.55,
            ease: "power2.out",
            scrollTrigger: {
              trigger: step,
              start: "top 68%",
              toggleActions: "play none none reverse",
            },
          });
        });

        gsap.to(".story-product-stage", {
          y: -8,
          duration: 3.8,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });

        gsap.to(".story-ring", {
          rotation: 360,
          duration: 36,
          ease: "none",
          repeat: -1,
        });

        gsap.from(".story-manifesto-line", {
          opacity: 0,
          yPercent: 55,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".story-manifesto-copy",
            start: "top 72%",
            toggleActions: "play none none reverse",
          },
        });

        ScrollTrigger.refresh();
      });

      return () => motion.revert();
    },
    { scope: pageRef },
  );

  return (
    <article className="story-page" ref={pageRef}>
      <section className="story-hero">
        <Image
          className="story-hero-image"
          src="/images/hero/porsche.webp"
          alt="Porsche negro frente a un taller"
          fill
          priority
          sizes="100vw"
        />
        <div className="story-hero-shade" />
        <div className="container story-hero-content">
          <h1 className="story-hero-title page-display-title">
            <span>Tu auto tiene</span>
            <span>camino por</span>
            <span>
              delante<span className="story-period">.</span>
            </span>
          </h1>
          <p className="story-hero-summary">
            Especialistas en repuestos europeos de alta calidad para Volkswagen,
            Audi, SEAT y Porsche.
          </p>
          <a className="story-scroll-cue" href="#como-trabajamos">
            <span aria-hidden="true">↓</span> Así lo hacemos
          </a>
        </div>
        <p className="story-hero-side-note" aria-hidden="true">
          Volkswagen · Audi · SEAT · Porsche
        </p>
      </section>

      <section className="story-journey" id="como-trabajamos">
        <div className="container story-journey-layout">
          <div className="story-instrument-wrap">
            <div className="story-instrument" aria-hidden="true">
              <div className="story-product-stage">
                {productStages.map((product, index) => (
                  <div
                    className="story-product-media"
                    data-product-index={index}
                    key={product.name}
                  >
                    <Image
                      className="story-product-image"
                      src={product.image}
                      alt=""
                      fill
                      sizes="(max-width: 900px) 80vw, 38vw"
                    />
                  </div>
                ))}
              </div>
              <div className="story-instrument-shade" />
              <span className="story-ring" />
            </div>
          </div>

          <div className="story-journey-copy">
            <p className="eyebrow">SOBRE NOSOTROS</p>
            <h2>Repuestos europeos. Personas de confianza.</h2>
            <p className="story-about-copy">
              Somos especialistas en la venta de repuestos de alta calidad para
              las marcas Volkswagen, Audi, SEAT y Porsche. Queremos que cada
              cliente sienta la confianza y la comodidad de nuestro servicio,
              brindándole la mejor atención y asesoría al solicitar o cotizar su
              pieza. Nos preparamos constantemente para darle la atención que se
              merece.
            </p>
            <div className="story-journey-steps">
              <span className="story-progress" aria-hidden="true">
                <span className="story-progress-fill" />
              </span>
              {journey.map((item) => (
                <div className="story-step" key={item.verb}>
                  <h3>{item.verb}</h3>
                  <p>{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="story-manifesto">
        <div className="story-word-ribbon" aria-hidden="true">
          <div className="story-word-track">
            Integridad · Nuestra gente · Excelencia · Pasión
          </div>
        </div>
        <div className="container story-manifesto-layout">
          <div className="story-manifesto-copy">
            <h2>
              <span className="story-manifesto-line">Sabemos de europeos.</span>
              <span className="story-manifesto-line">Tu confianza</span>
              <span className="story-manifesto-line">
                es lo <em>primero</em>
              </span>
            </h2>
            <p>
              Nos apasiona el mundo de los repuestos europeos con altos
              estándares de calidad. Trabajamos para superar las expectativas de
              nuestros clientes con un servicio integral y un equipo capacitado,
              enfocado y motivado para ser líderes en la región.
            </p>
          </div>
          <Link className="story-cta" href="/contacto">
            <span>Cuéntanos qué manejas</span>
            <strong aria-hidden="true">↗</strong>
          </Link>
        </div>
      </section>
    </article>
  );
}
