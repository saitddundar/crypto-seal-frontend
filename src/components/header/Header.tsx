import './Header.css';

const Header = () => {
    return (
        <header className="header">
            <div className="header-logo">
                <span className="header-logo-text">Crypto Seal</span>
            </div>
            <a
                href="https://github.com/saitddundar/crypto-seal-frontend"
                target="_blank"
                rel="noopener noreferrer"
                className="header-contribute-btn"
            >
                Contribute
            </a>
        </header>
    );
};

export default Header;
