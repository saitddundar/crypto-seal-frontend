import { useState } from 'react';
import './SealBar.css';

type TabType = 'seal' | 'resolve';

interface SealBarProps {
    onSeal?: (text: string) => Promise<void>;
    onResolve?: (hash: string) => Promise<void>;
}

const SealBar = ({ onSeal, onResolve }: SealBarProps) => {
    const [activeTab, setActiveTab] = useState<TabType>('seal');
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!inputValue.trim() || isLoading) return;

        setIsLoading(true);
        try {
            if (activeTab === 'seal' && onSeal) {
                await onSeal(inputValue);
            } else if (activeTab === 'resolve' && onResolve) {
                await onResolve(inputValue);
            }
            setInputValue('');
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

    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
        setInputValue('');
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

            <div className="seal-bar-input-wrapper">
                <input
                    type="text"
                    className="seal-bar-input"
                    placeholder={
                        activeTab === 'seal'
                            ? 'Enter text to seal...'
                            : 'Enter hash to resolve...'
                    }
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                />
                <button
                    className="seal-bar-submit"
                    onClick={handleSubmit}
                    disabled={!inputValue.trim() || isLoading}
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
