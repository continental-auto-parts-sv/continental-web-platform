import type { Metadata } from "next";

import { HomeExperience } from "@/components/home-experience";

export const metadata: Metadata = {
  title: "Cotizar repuestos",
  description:
    "Selecciona tus repuestos y comparte los datos de tu vehículo para preparar tu consulta.",
};

export default function Page() {
  return <HomeExperience page="quote" />;
}
