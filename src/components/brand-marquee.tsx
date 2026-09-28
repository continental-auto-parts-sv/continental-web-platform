"use client";

import { useRef } from "react";
import Image from "next/image";

export const brands = ["Volkswagen", "Audi", "SEAT", "Porsche"];

const officialLogos: Record<
  string,
  { src: string; width: number; height: number }
> = {
  Volkswagen: {
    src: "/images/brands/volkswagen.png",
    width: 2048,
    height: 2048,
  },
  Audi: { src: "/images/brands/audi.png", width: 3051, height: 1081 },
  Porsche: { src: "/images/brands/porsche.png", width: 2500, height: 2500 },
};

export function BrandLogo({ name }: { name: string }) {
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
  onChoose: (name: string) => void;
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
          <strong>Compartimos tu pasión.</strong>
        </p>
        <div
          className="brand-marquee"
          onMouseEnter={() => setPlaybackRate(0.25)}
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
