import type { Metadata } from "next";

import { PromotionShell } from "@/components/promotion-shell";

export const metadata: Metadata = { title: "Aviso legal" };

export default function LegalNoticePage() {
  return (
    <PromotionShell>
      <div className="legal-page" />
    </PromotionShell>
  );
}
