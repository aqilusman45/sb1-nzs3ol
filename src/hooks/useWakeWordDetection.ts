import { useState, useEffect, useCallback, useRef } from 'react';

interface UseWakeWordDetectionProps {
  wakeWord: string;
  onWakeWordDetected: () => void;
  enabled: boolean;
}

export const useWakeWordDetection = ({
  wakeWord,
  onWakeWordDetected,
  enabled
}: UseWakeWordDetectionProps) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<any>(null);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    if (!enabled) return;

    // Stop any existing recognition
    stopListening();

    // Add a small delay before starting new recognition
    timeoutRef.current = setTimeout(() => {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognitionRef.current = recognition;
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'aborted') {
          setError(`Speech recognition error: ${event.error}`);
          setIsListening(false);
          
          // Retry after a longer delay if still enabled
          if (enabled) {
            timeoutRef.current = setTimeout(startListening, 2000);
          }
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        // Only restart if still enabled and not stopped intentionally
        if (enabled && recognitionRef.current) {
          timeoutRef.current = setTimeout(startListening, 1000);
        }
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript.toLowerCase();
        
        if (transcript.includes(wakeWord.toLowerCase())) {
          stopListening();
          // Add a small delay before triggering wake word detection
          setTimeout(onWakeWordDetected, 500);
        }
      };

      try {
        recognition.start();
      } catch (err) {
        console.error('Recognition start error:', err);
        if (enabled) {
          timeoutRef.current = setTimeout(startListening, 2000);
        }
      }
    }, 500);
  }, [wakeWord, onWakeWordDetected, enabled, stopListening]);

  useEffect(() => {
    if (enabled) {
      startListening();
    } else {
      stopListening();
    }
    
    return () => {
      stopListening();
    };
  }, [enabled, startListening, stopListening]);

  return {
    isListening,
    error,
  };
};