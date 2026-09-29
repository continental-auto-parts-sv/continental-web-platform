import { ContinentalLogo } from "./continental-logo";

export function SiteFooter({ topHref = "#contenido" }: { topHref?: string }) {
  return (
    <footer>
      <div className="container">
        <div className="footer-main">
          <ContinentalLogo />
          <p>
            Tu auto nos mueve.
            <br />
            Compromiso contigo.
          </p>
          <a href={topHref} className="text-link">
            Volver arriba ↑
          </a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Continental Auto Parts SV.</span>
          <span>Volkswagen · Audi · SEAT · Porsche</span>
          <span>Hecho para seguir adelante.</span>
        </div>
      </div>
    </footer>
  );
}
