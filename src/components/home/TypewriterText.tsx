import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
}

export function TypewriterText({ text, speed = 25, className = '' }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text) {
      setDisplayedText('');
      setIsComplete(true);
      return;
    }

    setDisplayedText('');
    setIsComplete(false);
    
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <p className={`text-sm text-foreground ${className}`}>
      {displayedText}
      {!isComplete && <span className="animate-pulse text-primary">|</span>}
    </p>
  );
}
