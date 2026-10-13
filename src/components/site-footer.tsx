import Link from "next/link";

import { ContinentalLogo } from "./continental-logo";

export function SiteFooter({ topHref = "#contenido" }: { topHref?: string }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <ContinentalLogo />
            <p>
              Repuestos europeos. Más que partes,
              <br />
              confianza en cada trayecto.
            </p>
          </div>

          <section className="footer-column" aria-labelledby="footer-contact">
            <h2 id="footer-contact">Contáctanos</h2>
            <Link className="footer-contact-link" href="/contacto">
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M21 15.5a3 3 0 0 1-3 3H8l-5 3v-15a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3Z" />
                <path d="M8 9h8M8 13h5" />
              </svg>
              <span>
                <strong>Hablemos de tu auto</strong>
                <small>Cuéntanos qué repuesto necesitas</small>
              </span>
              <span aria-hidden="true">↗</span>
            </Link>
            <p className="footer-location">
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              Atención en El Salvador
            </p>
          </section>

          <nav className="footer-column" aria-labelledby="footer-explore">
            <h2 id="footer-explore">Explora</h2>
            <div className="footer-links">
              <Link href="/promociones">Promociones</Link>
              <Link href="/productos">Productos</Link>
              <Link href="/quienes-somos">Quiénes somos</Link>
              <Link href="/blog">Blog</Link>
            </div>
          </nav>
        </div>
      </div>

      <div className="footer-bottom-band">
        <div className="container footer-bottom">
          <p className="footer-copyright">
            <span>© {new Date().getFullYear()} Continental Auto Parts SV.</span>
          </p>
          <nav className="footer-legal" aria-label="Información legal">
            <Link href="/privacidad">Privacidad</Link>
            <Link href="/aviso-legal">Aviso legal</Link>
          </nav>
          <a href={topHref} className="footer-top-link">
            Volver arriba <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
