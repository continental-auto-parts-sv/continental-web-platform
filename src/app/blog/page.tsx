import type { Metadata } from "next";

import { PromotionShell } from "@/components/promotion-shell";

export const metadata: Metadata = { title: "Blog" };

export default function BlogPage() {
  return (
    <PromotionShell>
      <section className="section container about-page">
        <p className="eyebrow">CONSEJOS PARA TU AUTO</p>
        <h1 className="page-title">Blog.</h1>
        <p className="about-description">
          Próximamente encontrarás guías de mantenimiento, compatibilidad y
          cuidado para tu vehículo europeo.
        </p>
      </section>
    </PromotionShell>
  );
}
