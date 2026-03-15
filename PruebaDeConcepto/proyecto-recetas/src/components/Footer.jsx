import './Footer.css';

const Footer = () => {
    return (
        <footer className="imperial-footer">
            <div className="footer-vessel">
                <section className="footer-info">
                    <h4>RECETAS APP <span className="pulsing-gear">🔍</span></h4>
                    <p>© {new Date().getFullYear()} — Ingeniería DAW2</p>
                </section>

                <section className="footer-links">
                    <ul>
                        <li><a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a></li>
                        <li><a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a></li>
                    </ul>
                </section>

                <section className="footer-contacto">
                    <p className="steam-text">Contacto: info@mireceta.com</p>
                </section>
            </div>
            <div className="footer-bottom-bar"></div>
        </footer>
    );
};

export default Footer;