import type { Metadata } from "next";

import { HomeExperience } from "@/components/home-experience";

export const metadata: Metadata = { title: "Contacto" };

export default function Page() {
  return <HomeExperience page="contact" />;
}
