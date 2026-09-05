import React, { useState, useEffect } from 'react';

interface StreamingMessageProps {
  content: string;
  isStreaming?: boolean;
  speedMs?: number;
  onComplete?: () => void;
  className?: string;
}

export const StreamingMessage: React.FC<StreamingMessageProps> = ({
  content,
  isStreaming = false,
  speedMs = 18,
  onComplete,
  className = '',
}) => {
  const [displayedText, setDisplayedText] = useState<string>(isStreaming ? '' : content);
  const [isTyping, setIsTyping] = useState<boolean>(isStreaming);

  useEffect(() => {
    if (!isStreaming) {
      setDisplayedText(content);
      setIsTyping(false);
      return;
    }

    setDisplayedText('');
    setIsTyping(true);
    let index = 0;

    const interval = setInterval(() => {
      index += 2; // reveal by chunks of 2 characters for natural typing rhythm
      if (index >= content.length) {
        setDisplayedText(content);
        setIsTyping(false);
        clearInterval(interval);
        onComplete?.();
      } else {
        setDisplayedText(content.slice(0, index));
      }
    }, speedMs);

    return () => clearInterval(interval);
  }, [content, isStreaming, speedMs]);

  return (
    <span className={`inline ${className}`}>
      <span className="whitespace-pre-line">{displayedText}</span>
      {isTyping && (
        <span className="inline-block w-1.5 h-3.5 bg-amber-400 mr-1 align-middle animate-pulse rounded-sm shadow-[0_0_8px_#d4af37]" />
      )}
    </span>
  );
};
