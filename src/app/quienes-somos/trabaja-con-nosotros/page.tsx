import type { Metadata } from "next";

import { PromotionShell } from "@/components/promotion-shell";
import { RecruitmentForm } from "@/components/recruitment-form";

import "./work-with-us.css";

export const metadata: Metadata = {
  title: "Trabaja con nosotros",
  description:
    "Comparte tu perfil profesional para futuras oportunidades en Continental Auto Parts.",
};

export default function WorkWithUsPage() {
  return (
    <PromotionShell>
      <article className="careers-page">
        <section className="careers-hero" aria-labelledby="careers-title">
          <div className="container careers-hero-layout">
            <p className="eyebrow">Talento Continental</p>
            <h1 className="page-display-title" id="careers-title">
              Crece con <em>nosotros.</em>
            </h1>
            <p className="careers-hero-summary">
              Buscamos personas responsables, curiosas y apasionadas por brindar
              un servicio excepcional. Cuéntanos sobre ti y el área en la que te
              gustaría aportar.
            </p>
          </div>
        </section>

        <section
          className="careers-content"
          aria-labelledby="application-title"
        >
          <div className="container careers-layout">
            <aside className="careers-aside">
              <span className="careers-step" aria-hidden="true">
                01
              </span>
              <h2 id="application-title">Comparte tu perfil</h2>
              <p>
                Completa tus datos y adjunta tu currículum. Revisaremos los
                perfiles cuando exista una oportunidad compatible.
              </p>

              <div className="careers-file-guidance">
                <strong>Antes de adjuntar</strong>
                <ul>
                  <li>Formato PDF únicamente.</li>
                  <li>Peso máximo de 5 MB.</li>
                  <li>No incluyas información sensible innecesaria.</li>
                </ul>
              </div>
            </aside>

            <RecruitmentForm />
          </div>
        </section>
      </article>
    </PromotionShell>
  );
}
