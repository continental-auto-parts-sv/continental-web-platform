import "./contact-experience.css";

const address =
  "29 Calle Poniente y 21 Avenida Norte N.º 1204, Col. Layco, San Salvador, El Salvador, C. A.";
const mapEmbedUrl =
  "https://www.google.com/maps?q=13.7144028,-89.2009462&z=17&output=embed";
const mapSearchUrl =
  "https://www.google.com/maps/place/Fremarca,+sadecv/" +
  "@13.714408,-89.2035211,17z/data=!3m1!4b1!4m6!3m5!" +
  "1s0x8f6331437e41fb81:0x5c932374b31a88b2!8m2!" +
  "3d13.7144028!4d-89.2009462!16s%2Fg%2F11ltx6b1kp?hl=es";

export function ContactExperience() {
  return (
    <article className="contact-page">
      <section className="contact-section" aria-labelledby="contact-title">
        <div className="container">
          <header className="contact-heading">
            <h1 className="page-display-title" id="contact-title">
              Hablemos
            </h1>
          </header>

          <div className="contact-layout">
            <dl className="contact-details">
              <div className="contact-detail contact-detail-email">
                <dt>Correo electrónico</dt>
                <dd>
                  <a href="mailto:atencionalcliente@fremarca.com">
                    atencionalcliente@fremarca.com
                  </a>
                </dd>
              </div>

              <div className="contact-detail">
                <dt>Teléfonos</dt>
                <dd className="contact-link-list">
                  <a href="tel:+50322351667">(+503) 2235-1667</a>
                  <a href="tel:+50322252564">(+503) 2225-2564</a>
                </dd>
              </div>

              <div className="contact-detail">
                <dt>WhatsApp</dt>
                <dd>
                  <a
                    href="https://wa.me/50378401749"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    (+503) 7840-1749
                  </a>
                </dd>
              </div>

              <div className="contact-detail contact-detail-hours">
                <dt>Horarios de atención</dt>
                <dd>
                  <span>
                    <strong>Lunes a viernes</strong>
                    8:00 a. m. – 5:30 p. m.
                  </span>
                  <span>
                    <strong>Sábados</strong>
                    8:00 a. m. – 4:00 p. m.
                  </span>
                  <span>
                    <strong>Domingos</strong>
                    Cerrado
                  </span>
                </dd>
              </div>
            </dl>

            <section
              className="contact-location"
              aria-labelledby="location-title"
            >
              <div className="contact-map">
                <iframe
                  title="Ubicación de Continental Auto Parts"
                  src={mapEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="contact-address">
                <div>
                  <p className="contact-address-label" id="location-title">
                    Ubicación
                  </p>
                  <address>{address}</address>
                </div>
                <a
                  href={mapSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir en Maps <span aria-hidden="true">↗</span>
                </a>
              </div>
            </section>
          </div>
        </div>
      </section>
    </article>
  );
}
