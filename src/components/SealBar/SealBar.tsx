import { useState } from 'react';
import { sealDocument, resolveByHash } from '../../services/api';
import './SealBar.css';

type TabType = 'seal' | 'resolve';
type ResultType = 'sealed' | 'resolved' | 'error' | null;

const SealBar = () => {
    const [activeTab, setActiveTab] = useState<TabType>('seal');
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resultValue, setResultValue] = useState<string | null>(null);
    const [resultType, setResultType] = useState<ResultType>(null);
    const [copySuccess, setCopySuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!inputValue.trim() || isLoading || resultType) return;

        setIsLoading(true);
        setErrorMessage(null);

        try {
            if (activeTab === 'seal') {
                // Backend'e gönder ve hash al
                const response = await sealDocument(inputValue);

                setResultValue(response.hash);
                setInputValue(response.hash);
                setResultType('sealed');
            } else if (activeTab === 'resolve') {
                // Backend'e gönder ve çözülmüş metni al
                const response = await resolveByHash(inputValue);

                if (response.found && response.record?.text) {
                    setResultValue(response.record.text);
                    setInputValue(response.record.text);
                    setResultType('resolved');
                } else {
                    // Hash bulunamadı
                    setErrorMessage(response.message || 'Hash not found');
                    setResultType('error');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Connection error. Please try again.');
            setResultType('error');
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

        // Kullanıcı yeni bir şey yazınca sonuç durumunu sıfırla
        if (resultType && newValue !== resultValue) {
            setResultType(null);
            setResultValue(null);
            setCopySuccess(false);
            setErrorMessage(null);
        }
    };

    const handleCopy = async () => {
        if (resultValue) {
            try {
                await navigator.clipboard.writeText(resultValue);
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
        setResultValue(null);
        setResultType(null);
        setCopySuccess(false);
        setErrorMessage(null);
    };

    // CSS class'ları belirle
    const getWrapperClass = () => {
        if (resultType === 'sealed') return 'seal-bar-input-wrapper sealed';
        if (resultType === 'resolved') return 'seal-bar-input-wrapper resolved';
        if (resultType === 'error') return 'seal-bar-input-wrapper error';
        return 'seal-bar-input-wrapper';
    };

    const getInputClass = () => {
        if (resultType === 'sealed') return 'seal-bar-input seal-result';
        if (resultType === 'resolved') return 'seal-bar-input resolve-result';
        if (resultType === 'error') return 'seal-bar-input error-result';
        return 'seal-bar-input';
    };

    const getCopyClass = () => {
        let base = 'seal-bar-copy';
        if (resultType === 'resolved') base += ' resolve-copy';
        if (copySuccess) base += ' success';
        return base;
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

            <div className={getWrapperClass()}>
                <input
                    type="text"
                    className={getInputClass()}
                    placeholder={
                        activeTab === 'seal'
                            ? 'Enter text to seal...'
                            : 'Enter hash to resolve...'
                    }
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    readOnly={resultType === 'sealed' || resultType === 'resolved'}
                />

                {/* Kopyalama butonu - başarılı sonuç varken göster */}
                {(resultType === 'sealed' || resultType === 'resolved') && (
                    <button
                        className={getCopyClass()}
                        onClick={handleCopy}
                        title={copySuccess ? 'Copied!' : 'Copy'}
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
                    disabled={!inputValue.trim() || isLoading || resultType === 'sealed' || resultType === 'resolved'}
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

            {/* Hata mesajı */}
            {errorMessage && (
                <div className="seal-bar-error">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export default SealBar;
