import type { Metadata } from "next";
import Link from "next/link";

import { PromotionShell } from "@/components/promotion-shell";

export const metadata: Metadata = { title: "Quiénes somos" };

export default function AboutPage() {
  return (
    <PromotionShell>
      <section className="section container about-page">
        <p className="eyebrow">CONTINENTAL AUTO PARTS · EL SALVADOR</p>
        <h1 className="page-title">Tu auto nos mueve.</h1>
        <p className="about-description">
          Repuestos para Volkswagen, Audi, SEAT y Porsche. Un espacio para
          encontrar la pieza que necesitas y preparar tu consulta con los datos
          de tu vehículo.
        </p>
        <div className="about-panels">
          <article>
            <h2>Entendemos tu auto.</h2>
            <p>
              La marca, el modelo y el año son el punto de partida. Cuéntanos
              qué manejas para consultar compatibilidad y disponibilidad.
            </p>
            <Link className="text-link" href="/contacto">
              Hablemos de tu auto <span aria-hidden="true">↗</span>
            </Link>
          </article>
          <article>
            <h2>Cada pieza cuenta.</h2>
            <p>
              Motor, frenos, suspensión, filtros y lubricantes. Encuentra el
              punto de partida para tu próximo mantenimiento.
            </p>
            <Link className="text-link" href="/productos">
              Explorar productos <span aria-hidden="true">↗</span>
            </Link>
          </article>
        </div>
      </section>
    </PromotionShell>
  );
}
