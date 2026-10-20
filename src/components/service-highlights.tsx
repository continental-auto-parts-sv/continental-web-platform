type HighlightIcon = "shield" | "delivery" | "support";

const highlights: Array<{
  icon: HighlightIcon;
  firstLine: string;
  secondLine: string;
}> = [
  {
    icon: "shield",
    firstLine: "Repuestos originales",
    secondLine: "y aftermarket",
  },
  {
    icon: "delivery",
    firstLine: "Envíos a",
    secondLine: "todo el país",
  },
  {
    icon: "support",
    firstLine: "Asesoría",
    secondLine: "especializada",
  },
];

function ServiceIcon({ icon }: { icon: HighlightIcon }) {
  if (icon === "shield") {
    return (
      <svg
        className="service-icon service-icon-shield"
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        <path
          className="service-shield-outline"
          d="M24 5 39 11v11c0 10-6.1 17.1-15 21-8.9-3.9-15-11-15-21V11L24 5Z"
        />
        <path className="service-shield-check" d="m17.5 23.8 4.4 4.4 8.9-9.1" />
      </svg>
    );
  }

  if (icon === "delivery") {
    return (
      <svg
        className="service-icon service-icon-truck"
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        <path className="service-truck-road" d="M2 42h44" />
        <g className="service-truck-body">
          <path d="M5 10h24v24H5zM29 18h7l7 8v8H29z" />
          <path d="M33 18v9h10" />
          <g className="service-truck-wheel">
            <circle cx="13" cy="35" r="4" />
            <path d="M10 35h6" />
          </g>
          <g className="service-truck-wheel">
            <circle cx="36" cy="35" r="4" />
            <path d="M33 35h6" />
          </g>
        </g>
      </svg>
    );
  }

  return (
    <svg
      className="service-icon service-icon-support"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        className="service-support-gear"
        d="M12.2 2h-.4a2 2 0 0 0-2 2v.2a2 2 0 0 1-1 1.7l-.4.3a2 2 0 0 1-2 0l-.2-.1a2 2 0 0 0-2.7.7l-.2.4a2 2 0 0 0 .7 2.7l.2.1a2 2 0 0 1 1 1.7v.5a2 2 0 0 1-1 1.8l-.2.1a2 2 0 0 0-.7 2.7l.2.4a2 2 0 0 0 2.7.7l.2-.1a2 2 0 0 1 2 0l.4.3a2 2 0 0 1 1 1.7v.2a2 2 0 0 0 2 2h.4a2 2 0 0 0 2-2v-.2a2 2 0 0 1 1-1.7l.4-.3a2 2 0 0 1 2 0l.2.1a2 2 0 0 0 2.7-.7l.2-.4a2 2 0 0 0-.7-2.7l-.2-.1a2 2 0 0 1-1-1.8v-.5a2 2 0 0 1 1-1.7l.2-.1a2 2 0 0 0 .7-2.7l-.2-.4a2 2 0 0 0-2.7-.7l-.2.1a2 2 0 0 1-2 0l-.4-.3a2 2 0 0 1-1-1.7V4a2 2 0 0 0-2-2Z"
      />
      <circle className="service-support-hub" cx="12" cy="12" r="3" />
    </svg>
  );
}

export function ServiceHighlights() {
  return (
    <section
      className="service-highlights"
      aria-label="Beneficios del servicio"
    >
      <div className="container service-highlights-inner">
        {highlights.map((highlight) => (
          <div
            className={`service-highlight service-highlight-${highlight.icon}`}
            key={highlight.icon}
          >
            <ServiceIcon icon={highlight.icon} />
            <p>
              {highlight.firstLine}
              <br />
              {highlight.secondLine}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
