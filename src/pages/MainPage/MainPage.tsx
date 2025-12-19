import Footer from '../../components/Footer';
import Header from '../../components/header/Header';
import SealBar from '../../components/SealBar';
import TypeWriter from '../../components/TypeWriter';
import './MainPage.css';

const MainPage = () => {
    // Backend API calls - şimdilik SealBar'ın kendi mock servislerini kullanıyoruz
    // Backend hazır olunca bu fonksiyonları aktifleştir:
    // const handleSeal = async (text: string): Promise<string> => {
    //     const response = await fetch('/api/seal', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ text }),
    //     });
    //     const data = await response.json();
    //     return data.hash;
    // };

    // const handleResolve = async (hash: string): Promise<string> => {
    //     const response = await fetch(`/api/resolve/${hash}`);
    //     const data = await response.json();
    //     return data.text;
    // };

    return (
        <div className="main-page">
            <Header />
            <div className="main-content">
                <div className="hero-section">
                    <TypeWriter
                        words={['Simple.', 'Secure.', 'Fast.']}
                        speed={120}
                        delayBetweenWords={400}
                    />

                </div>

                <div className="seal-section">
                    <SealBar />
                </div>
                <p className="hero-description">
                    Crypto Seal is an open-source cryptographic sealing tool that lets you encrypt, timestamp, and prove the authenticity of digital assets without trust, intermediaries, or complexity.                    </p>
            </div>
            <Footer />
        </div>
    );
};

export default MainPage;
