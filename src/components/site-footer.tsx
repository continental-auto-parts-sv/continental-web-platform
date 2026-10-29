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
                <strong>Canales de atención</strong>
                <small>Conoce cómo comunicarte con nosotros</small>
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
            <div className="footer-social-block">
              <nav className="footer-socials" aria-label="Redes sociales">
                <a
                  href="https://www.facebook.com/continentalautopartssv"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24">
                    <path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v8h4v-8h3l1-4h-4V9c0-.7.3-1 1-1Z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/continentalautopartssv/?hl=es"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" className="social-dot" />
                  </svg>
                </a>
                <a
                  href="https://wa.me/50378401749"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24">
                    <path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.4-4.7a8.5 8.5 0 1 1 16.1-4.2Z" />
                    <path d="M8.4 7.7c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.5l.7 1.7c.1.3 0 .5-.2.7l-.6.7c-.2.2-.1.4 0 .6.7 1.2 1.6 2.1 2.8 2.7.2.1.4.2.6 0l.8-1c.2-.2.4-.3.7-.2l1.8.8c.3.1.5.3.5.5 0 .3-.1 1.4-.8 2-.6.6-1.5.8-2.4.6-1.1-.2-2.8-.8-4.8-2.6-1.6-1.5-2.7-3.4-3-4.5-.3-.9 0-1.6.3-2Z" />
                  </svg>
                </a>
              </nav>
            </div>
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
