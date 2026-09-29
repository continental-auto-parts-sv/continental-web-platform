import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PromotionShell } from "@/components/promotion-shell";

export const metadata: Metadata = { title: "Quiénes somos" };

export default function AboutPage() {
  return (
    <PromotionShell>
      <div className="about-page">
        <section className="about-hero">
          <Image
            className="about-hero-image"
            src="/images/hero/audi.webp"
            alt="Interior de un automóvil Audi"
            fill
            priority
            sizes="100vw"
          />
          <div className="about-hero-shade" />
          <div className="container about-hero-content">
            <p className="eyebrow">QUIÉNES SOMOS</p>
            <h1>
              Tu europeo,
              <br />
              <em>en buenas manos.</em>
            </h1>
            <p>
              Repuestos europeos y una atención que empieza por entender lo que
              realmente necesita tu vehículo.
            </p>
          </div>
          <span className="about-hero-caption">
            Volkswagen · Audi · SEAT · Porsche
          </span>
        </section>

        <section className="container about-story">
          <div>
            <p className="eyebrow">CONTINENTAL AUTO PARTS · EL SALVADOR</p>
            <h2>
              Más que partes,
              <br />
              <span>confianza en cada trayecto.</span>
            </h2>
          </div>
          <div className="about-story-copy">
            <p>
              Nos especializamos en repuestos para Volkswagen, Audi, SEAT y
              Porsche. Combinamos conocimiento del vehículo con una atención
              cercana para ayudarte a encontrar la pieza adecuada.
            </p>
            <p>
              Marca, modelo y año son nuestro punto de partida. Desde ahí,
              revisamos contigo la necesidad y orientamos tu consulta de
              compatibilidad y disponibilidad.
            </p>
            <Link className="text-link" href="/productos">
              Conoce nuestras categorías <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>

        <section className="about-direction" aria-label="Misión y visión">
          <div className="container about-direction-grid">
            <article>
              <span className="about-number">01</span>
              <p className="eyebrow">NUESTRA MISIÓN</p>
              <h2>Hacer más simple encontrar la pieza correcta.</h2>
              <p>
                Brindar una atención personalizada y clara, apoyada en el
                conocimiento de nuestro equipo y en una selección enfocada en
                vehículos europeos.
              </p>
            </article>
            <article>
              <span className="about-number">02</span>
              <p className="eyebrow">NUESTRA VISIÓN</p>
              <h2>Ser una referencia para quienes cuidan su europeo.</h2>
              <p>
                Crecer con un servicio confiable, una oferta de calidad y una
                experiencia que acompañe a cada cliente antes y después de su
                elección.
              </p>
            </article>
          </div>
        </section>

        <section className="container about-values">
          <div className="about-values-heading">
            <div>
              <p className="eyebrow">LO QUE NOS GUÍA</p>
              <h2>Valores que se notan en el servicio.</h2>
            </div>
            <p>
              No son palabras decorativas. Son la manera en que queremos
              responder en cada consulta, recomendación y seguimiento.
            </p>
          </div>
          <div className="about-values-grid">
            <article>
              <span>01</span>
              <h3>Integridad</h3>
              <p>Orientación honesta y expectativas claras desde el inicio.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Nuestra gente</h3>
              <p>Conocimiento compartido y trato cercano en cada consulta.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Excelencia</h3>
              <p>Atención al detalle, desde la búsqueda hasta la entrega.</p>
            </article>
            <article>
              <span>04</span>
              <h3>Pasión</h3>
              <p>
                Entusiasmo por los autos y por resolver bien cada necesidad.
              </p>
            </article>
          </div>
        </section>

        <section className="about-method">
          <div className="container about-method-grid">
            <div className="about-method-heading">
              <p className="eyebrow">NUESTRA FORMA DE TRABAJAR</p>
              <h2>Escuchar primero. Orientar mejor.</h2>
            </div>
            <ol>
              <li>
                <span>01</span>
                <div>
                  <h3>Entendemos tu necesidad</h3>
                  <p>Qué manejas, qué buscas y qué necesitas resolver.</p>
                </div>
              </li>
              <li>
                <span>02</span>
                <div>
                  <h3>Revisamos la compatibilidad</h3>
                  <p>Organizamos la consulta con los datos de tu vehículo.</p>
                </div>
              </li>
              <li>
                <span>03</span>
                <div>
                  <h3>Te acompañamos en la elección</h3>
                  <p>Una recomendación clara para que avances con confianza.</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        <section className="container about-cta">
          <div>
            <p className="eyebrow">HABLEMOS DE TU AUTO</p>
            <h2>Cuéntanos qué manejas. Empecemos por ahí.</h2>
          </div>
          <Link className="button" href="/contacto">
            Preparar mi consulta <span aria-hidden="true">↗</span>
          </Link>
        </section>
      </div>
    </PromotionShell>
  );
}
