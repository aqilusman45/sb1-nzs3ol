import React from 'react';

interface TranscriptDisplayProps {
  transcript: string;
}

export const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ transcript }) => {
  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">Transcript</h2>
      <div className="min-h-[100px] bg-gray-50 rounded-md p-4">
        {transcript ? (
          <p className="text-gray-700">{transcript}</p>
        ) : (
          <p className="text-gray-400 italic">Start speaking to see the transcript...</p>
        )}
      </div>
    </div>
  );
};