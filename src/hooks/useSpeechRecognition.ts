import { useEffect, useState, useCallback } from 'react';

export const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      
      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          finalTranscript += event.results[i][0].transcript;
        }
        setTranscript(finalTranscript);
      };

      recognitionInstance.onend = () => {
        // Automatically restart if we're still supposed to be listening
        if (isListening) {
          recognitionInstance.start();
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        // Restart on error unless it's an abort
        if (event.error !== 'aborted' && isListening) {
          setTimeout(() => {
            recognitionInstance.start();
          }, 1000);
        }
      };

      setRecognition(recognitionInstance);
    }
  }, [isListening]);

  const startListening = useCallback(() => {
    if (recognition) {
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('Failed to start recognition:', error);
      }
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
      setTranscript('');
    }
  }, [recognition]);

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    hasSupport: !!recognition
  };
};