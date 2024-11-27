import React from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';

interface ControlPanelProps {
  isListening: boolean;
  onStart: () => void;
  onStop: () => void;
  error: string | null;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isListening,
  onStart,
  onStop,
  error,
}) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={isListening ? onStop : onStart}
        className={`p-4 rounded-full transition-all ${
          isListening
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
        disabled={!!error}
      >
        {isListening ? (
          <MicOff className="w-8 h-8 text-white" />
        ) : (
          <Mic className="w-8 h-8 text-white" />
        )}
      </button>
      {error && (
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}
      <p className="text-sm text-gray-600">
        {isListening ? 'Tap to stop' : 'Tap to start'} listening
      </p>
    </div>
  );
};