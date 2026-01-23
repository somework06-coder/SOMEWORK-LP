export default function Footer({ settings = {} }) {
    const quote = settings.footer_quote || "Tools dan AI harusnya bikin hidup lebih simpel, bukan makin ribet.";

    return (
        <footer className="footer">
            <p className="footer-note">{quote}</p>
            <p className="footer-copyright">© Somework</p>
        </footer>
    );
}
