import type { Metadata } from "next";

import { AboutExperience } from "@/components/about-experience";
import { PromotionShell } from "@/components/promotion-shell";

export const metadata: Metadata = { title: "Quiénes somos" };

export default function AboutPage() {
  return (
    <PromotionShell>
      <AboutExperience />
    </PromotionShell>
  );
}
