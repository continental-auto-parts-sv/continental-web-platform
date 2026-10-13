import type { Metadata } from "next";

import { ProductsExperience } from "@/components/products-experience";

export const metadata: Metadata = {
  title: "Productos",
  description:
    "Explora repuestos para línea liviana y transporte pesado, con marcas especializadas para cada tipo de vehículo.",
};

export default function Page() {
  return <ProductsExperience />;
}
