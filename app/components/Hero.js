import Image from "next/image";

export default function Hero({ settings = {} }) {
    const name = settings.hero_name || "Althur";
    const tagline = settings.hero_tagline || "Meta Ads marketer yang suka ngoding & bikin tools pake AI.";
    const description = settings.hero_description || "Gue sharing hal-hal praktis soal AI coding, Facebook Ads, automation, dan internal tools. Halaman ini isinya resource yang udah dikurasi — simpel, berguna, tanpa basa-basi.";

    return (
        <section className="hero">
            <div className="container hero-content">
                <div className="hero-logo">
                    <Image
                        src="/logo.png"
                        alt="Somework Logo"
                        width={80}
                        height={80}
                        priority
                    />
                </div>
                <h1 className="hero-heading">Hi, Gue {name}.</h1>
                <p className="hero-subheading">{tagline}</p>
                <p className="hero-description">{description}</p>

                <a href="#free-resources" className="scroll-indicator">
                    <span className="scroll-arrow">↓</span>
                    <span>Scroll ke bawah</span>
                </a>
            </div>
        </section>
    );
}
