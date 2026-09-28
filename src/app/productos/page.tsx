import type { Metadata } from "next";

import { HomeExperience } from "@/components/home-experience";

export const metadata: Metadata = { title: "Productos" };

export default function Page() {
  return <HomeExperience page="products" />;
}
