import type { Metadata } from "next";

import { PromotionShell } from "@/components/promotion-shell";

export const metadata: Metadata = { title: "Privacidad" };

export default function PrivacyPage() {
  return (
    <PromotionShell>
      <div className="legal-page" />
    </PromotionShell>
  );
}
