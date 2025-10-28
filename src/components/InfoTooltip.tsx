'use client';

import { useState } from 'react';

interface InfoTooltipProps {
  infoText: string;
  buttonText: string;
  bgColor?: string;
}

export default function InfoTooltip({ infoText, buttonText, bgColor = 'purple-600' }: InfoTooltipProps) {
  const [showText, setShowText] = useState(false);

  return (
    <button
      onMouseEnter={() => setShowText(true)}
      onMouseLeave={() => setShowText(false)}
      className={`bg-white border border-gray-200 rounded-full shadow flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 transition-colors cursor-help`}
    >
      <div className={`w-4 h-4 bg-${bgColor} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
        i
      </div>
      {showText ? (
        <span className={`text-${bgColor} text-sm transition-all duration-300 overflow-hidden whitespace-nowrap max-w-[500px] opacity-100`}>
          {infoText}
        </span>
      ) : (
        <span className={`text-${bgColor} text-sm transition-all duration-300 opacity-100`}>
          {buttonText}
        </span>
      )}
    </button>
  );
}

