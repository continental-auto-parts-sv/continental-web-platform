"use client";

import Image from "next/image";
import { type CSSProperties, useRef } from "react";

export const brands = [
  "Volkswagen",
  "Audi",
  "SEAT",
  "Porsche",
  "Mercedes",
  "BMW",
] as const;

export type BrandName = (typeof brands)[number];

type Logo = {
  src: string;
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
};

export function BrandLogo({ name }: { name: BrandName }) {
  const logo = officialLogos[name];

  return (
    <span className={`brand brand-${name.toLowerCase()}`}>
      {logo ? (
        <Image
          {...logo}
          alt={name}
          sizes="120px"
          className="vehicle-brand-logo"
        />
      ) : (
        // No official SEAT artwork was supplied; keep its name as plain text.
        name
      )}
    </span>
  );
}

export function BrandMarquee({
  onChoose,
}: {
  onChoose: (name: BrandName) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  function setPlaybackRate(rate: number) {
    trackRef.current?.getAnimations().forEach((animation) => {
      animation.updatePlaybackRate(rate);
    });
  }

  return (
    <section className="brands" id="marcas" aria-label="Marcas de vehículos">
      <div className="container brands-inner">
        <p>
          Entendemos tu auto.
          <br />
          <strong>Nuestras marcas.</strong>
        </p>
        <div
          className="brand-marquee"
          style={{ "--brand-count": brands.length } as CSSProperties}
          onMouseEnter={() => setPlaybackRate(0)}
          onMouseLeave={() => setPlaybackRate(1)}
        >
          <div className="brand-track" ref={trackRef}>
            {[0, 1].map((copy) => (
              <div
                className="brand-group"
                key={copy}
                aria-hidden={copy === 1 ? true : undefined}
              >
                {brands.map((name) => (
                  <a
                    href="#consulta"
                    key={name}
                    tabIndex={copy === 1 ? -1 : 0}
                    onClick={() => onChoose(name)}
                  >
                    <BrandLogo name={name} />
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
