import { useState } from 'react';
import './SealBar.css';

type TabType = 'seal' | 'resolve';

interface SealBarProps {
    onSeal?: (text: string) => Promise<string>; // Backend'den hash döner
    onResolve?: (hash: string) => Promise<void>;
}

// Mock hash servisi - backend hazır olunca gerçek API ile değiştirilecek
const mockHashService = async (text: string): Promise<string> => {
    // Simüle edilmiş gecikme
    await new Promise(resolve => setTimeout(resolve, 800));

    // Basit bir mock hash oluştur (gerçek hash backend'den gelecek)
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
};

const SealBar = ({ onSeal, onResolve }: SealBarProps) => {
    const [activeTab, setActiveTab] = useState<TabType>('seal');
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hashedValue, setHashedValue] = useState<string | null>(null);
    const [isHashed, setIsHashed] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const handleSubmit = async () => {
        if (!inputValue.trim() || isLoading || isHashed) return;

        setIsLoading(true);
        try {
            if (activeTab === 'seal') {
                // Backend'e gönder ve hash al
                let hash: string;
                if (onSeal) {
                    hash = await onSeal(inputValue);
                } else {
                    // Mock servis kullan (backend yoksa)
                    hash = await mockHashService(inputValue);
                }

                // Hash'i göster
                setHashedValue(hash);
                setInputValue(hash);
                setIsHashed(true);
            } else if (activeTab === 'resolve' && onResolve) {
                await onResolve(inputValue);
                setInputValue('');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);

        // Kullanıcı yeni bir şey yazınca hash durumunu sıfırla
        if (isHashed && newValue !== hashedValue) {
            setIsHashed(false);
            setHashedValue(null);
            setCopySuccess(false);
        }
    };

    const handleCopy = async () => {
        if (hashedValue) {
            try {
                await navigator.clipboard.writeText(hashedValue);
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
            } catch (err) {
                console.error('Copy failed:', err);
            }
        }
    };

    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
        setInputValue('');
        setHashedValue(null);
        setIsHashed(false);
        setCopySuccess(false);
    };

    return (
        <div className="seal-bar-container">
            <div className="seal-bar-tabs">
                <button
                    className={`seal-bar-tab ${activeTab === 'seal' ? 'active' : ''}`}
                    onClick={() => handleTabChange('seal')}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Seal
                </button>
                <button
                    className={`seal-bar-tab ${activeTab === 'resolve' ? 'active' : ''}`}
                    onClick={() => handleTabChange('resolve')}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    Resolve
                </button>
            </div>

            <div className={`seal-bar-input-wrapper ${isHashed ? 'hashed' : ''}`}>
                <input
                    type="text"
                    className={`seal-bar-input ${isHashed ? 'hash-result' : ''}`}
                    placeholder={
                        activeTab === 'seal'
                            ? 'Enter text to seal...'
                            : 'Enter hash to resolve...'
                    }
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    readOnly={isHashed}
                />

                {/* Kopyalama butonu - sadece hash varken göster */}
                {isHashed && (
                    <button
                        className={`seal-bar-copy ${copySuccess ? 'success' : ''}`}
                        onClick={handleCopy}
                        title={copySuccess ? 'Copied!' : 'Copy hash'}
                    >
                        {copySuccess ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                        )}
                    </button>
                )}

                <button
                    className="seal-bar-submit"
                    onClick={handleSubmit}
                    disabled={!inputValue.trim() || isLoading || isHashed}
                >
                    {isLoading ? (
                        <div className="seal-bar-spinner" />
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
};

export default SealBar;
