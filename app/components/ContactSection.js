export default function ContactSection({ settings = {} }) {
    const whatsapp = settings.contact_whatsapp || "https://wa.me/628123456789";
    const email = settings.contact_email || "hello@somework.id";
    const threads = settings.contact_threads || "https://threads.net/@somework";
    const title = settings.contact_title || "Kerja Bareng";
    const subtitle = settings.contact_subtitle || "Ngobrol dulu aja.";

    return (
        <section id="contact" className="section section-alt">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">{title}</h2>
                    <p className="section-subtitle">{subtitle}</p>
                </div>

                <div className="contact-content">
                    <div className="services">
                        <ul className="services-list">
                            <li>Aplikasi &amp; internal tools</li>
                            <li>Business automation</li>
                            <li>Meta Ads setup &amp; optimasi</li>
                        </ul>
                    </div>

                    <div className="contact-buttons">
                        <a
                            href={whatsapp}
                            className="btn btn-primary"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            💬 WhatsApp
                        </a>
                        <a
                            href={`mailto:${email}`}
                            className="btn btn-secondary"
                        >
                            ✉️ Email
                        </a>
                        <a
                            href={threads}
                            className="btn btn-secondary"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            🧵 Threads
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
