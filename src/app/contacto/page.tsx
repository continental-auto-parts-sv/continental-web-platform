import type { Metadata } from "next";

import { ContactExperience } from "@/components/contact-experience";
import { PromotionShell } from "@/components/promotion-shell";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Conoce los canales oficiales de Continental Auto Parts y comunícate con nuestro equipo en El Salvador.",
};

export default function Page() {
  return (
    <PromotionShell>
      <ContactExperience />
    </PromotionShell>
  );
}
