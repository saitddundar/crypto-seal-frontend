import Footer from '../../components/Footer';
import Header from '../../components/header/Header';
import SealBar from '../../components/SealBar';
import './MainPage.css';

const MainPage = () => {
    // Backend API calls
    const handleSeal = async (text: string) => {
        console.log('Sealing text:', text);
        // TODO: Backend call
        // const response = await fetch('/api/seal', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ text }),
        // });
        // return await response.json();

        // Simulated delay for demo
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert(`Text sealed: ${text}`);
    };

    const handleResolve = async (hash: string) => {
        console.log('Resolving hash:', hash);
        // TODO: Backend call
        // const response = await fetch(`/api/resolve/${hash}`);
        // return await response.json();

        // Simulated delay for demo
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert(`Hash resolved: ${hash}`);
    };

    return (
        <div className="main-page">
            <Header />
            <div className="main-content">
                <div className="hero-section">
                    <h1 className="slogan">
                        <span>Simple.</span>
                        <span>Secure.</span>
                        <span>Fast.</span>
                    </h1>
                    <p className="hero-description">
                        Create an undeniable timeline of truth. Seal your digital assets on the chain and verify their existence forever, backed by the mathematical certainty of cryptography.
                    </p>
                </div>

                <div className="seal-section">
                    <SealBar onSeal={handleSeal} onResolve={handleResolve} />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default MainPage;
