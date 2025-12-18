import { useState, useEffect } from 'react';
import './TypeWriter.css';

interface TypeWriterProps {
    words: string[];
    speed?: number;
    delayBetweenWords?: number;
}

const TypeWriter = ({ words, speed = 100, delayBetweenWords = 1 }: TypeWriterProps) => {
    const [displayedText, setDisplayedText] = useState<string[]>([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (isComplete) return;

        const currentWord = words[currentWordIndex];

        if (currentCharIndex < currentWord.length) {
            // Still typing current word
            const timeout = setTimeout(() => {
                setDisplayedText(prev => {
                    const newText = [...prev];
                    newText[currentWordIndex] = currentWord.substring(0, currentCharIndex + 1);
                    return newText;
                });
                setCurrentCharIndex(prev => prev + 1);
            }, speed);

            return () => clearTimeout(timeout);
        } else if (currentWordIndex < words.length - 1) {
            // Move to next word
            const timeout = setTimeout(() => {
                setCurrentWordIndex(prev => prev + 1);
                setCurrentCharIndex(0);
            }, delayBetweenWords);

            return () => clearTimeout(timeout);
        } else {
            // All words complete
            setIsComplete(true);
        }
    }, [currentWordIndex, currentCharIndex, words, speed, delayBetweenWords, isComplete]);

    return (
        <h1 className="typewriter-container">
            {words.map((_, index) => (
                <span
                    key={index}
                    className={`typewriter-word ${displayedText[index] ? 'visible' : ''}`}
                >
                    {displayedText[index] || ''}
                    {index === currentWordIndex && !isComplete && (
                        <span className="typewriter-cursor">|</span>
                    )}
                </span>
            ))}
        </h1>
    );
};

export default TypeWriter;
