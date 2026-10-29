"use client";

import Image from "next/image";
import { type CSSProperties } from "react";

export const brands = [
  "Volkswagen",
  "Audi",
  "SEAT",
  "Porsche",
  "Mercedes",
  "BMW",
  "MINI",
] as const;

export type BrandName = (typeof brands)[number];

type Logo = {
  src: string;
  darkSrc?: string;
  width: number;
  height: number;
};

const officialLogos: Partial<Record<BrandName, Logo>> = {
  Volkswagen: {
    src: "/images/brands/volkswagen.png",
    width: 2048,
    height: 2048,
  },
  Audi: {
    src: "/images/brands/audi.png",
    width: 3051,
    height: 1081,
  },
  Porsche: {
    src: "/images/brands/porsche.png",
    width: 2500,
    height: 2500,
  },
  Mercedes: {
    src: "/images/brands/mercedes.png",
    width: 1200,
    height: 1200,
  },
  BMW: {
    src: "/images/brands/bmw.png",
    width: 2500,
    height: 2500,
  },
  MINI: {
    src: "/images/brands/mini.png",
    darkSrc: "/images/brands/mini-dark.png",
    width: 3840,
    height: 2160,
  },
};

export function BrandLogo({ name }: { name: BrandName }) {
  const logo = officialLogos[name];

  return (
    <span className={`brand brand-${name.toLowerCase()}`}>
      {logo ? (
        <>
          <Image
            src={logo.src}
            width={logo.width}
            height={logo.height}
            alt={name}
            sizes="120px"
            className={`vehicle-brand-logo${
              logo.darkSrc ? " vehicle-brand-logo-light" : ""
            }`}
          />
          {logo.darkSrc ? (
            <Image
              src={logo.darkSrc}
              width={logo.width}
              height={logo.height}
              alt=""
              aria-hidden="true"
              sizes="120px"
              className="vehicle-brand-logo vehicle-brand-logo-dark"
            />
          ) : null}
        </>
      ) : (
        // No official SEAT artwork was supplied; keep its name as plain text.
        name
      )}
    </span>
  );
}

export function BrandMarquee() {
  return (
    <section className="brands" id="marcas" aria-label="Marcas de vehículos">
      <div className="container brands-inner">
        <p>Entendemos tu auto.</p>
        <div
          className="brand-marquee"
          style={{ "--brand-count": brands.length } as CSSProperties}
        >
          <div className="brand-track">
            {[0, 1].map((copy) => (
              <div
                className="brand-group"
                key={copy}
                aria-hidden={copy === 1 ? true : undefined}
              >
                {brands.map((name) => (
                  <BrandLogo name={name} key={name} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
