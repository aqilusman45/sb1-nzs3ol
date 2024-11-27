import React, { useEffect, useState } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';

function App() {
  const { transcript, isListening, startListening, stopListening, hasSupport } = useSpeechRecognition();
  const [messages, setMessages] = useState<string[]>([]);
  const [isWakeWordDetected, setIsWakeWordDetected] = useState(false);

  useEffect(() => {
    if (hasSupport) {
      startListening();
    }
  }, [hasSupport, startListening]);

  useEffect(() => {
    if (transcript.toLowerCase().includes('hey victoria')) {
      setIsWakeWordDetected(true);
      const newMessage = transcript.toLowerCase().replace('hey victoria', '').trim();
      if (newMessage) {
        setMessages(prev => [...prev, newMessage]);
      }
    }
  }, [transcript]);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!hasSupport) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <p className="text-red-500">
            Speech recognition is not supported in your browser.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Voice Assistant</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleToggleListening}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-5 h-5" />
                    <span>Stop Listening</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                    <span>Start Listening</span>
                  </>
                )}
              </button>
              {isWakeWordDetected && (
                <Volume2 className="w-6 h-6 text-blue-500 animate-pulse" />
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600">Current transcript:</p>
            <p className="text-gray-800 mt-1">{transcript || 'Waiting for speech...'}</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Conversation History</h2>
            {messages.length === 0 ? (
              <p className="text-gray-600 italic">Say "Hey Victoria" to start...</p>
            ) : (
              <div className="space-y-2">
                {messages.map((message, index) => (
                  <div key={index} className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-gray-800">{message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Instructions</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Click the "Start Listening" button to begin voice recognition</li>
            <li>Say "Hey Victoria" to activate the assistant</li>
            <li>Your messages will be continuously transcribed</li>
            <li>Click "Stop Listening" to pause voice recognition</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;