'use client';

import { useState } from 'react';

interface InfoTooltipProps {
  label: string;          // 버튼에 보일 기본 라벨
  tooltip: string;        // 툴팁 내용
  colorClass?: string;    // 텍스트/아이콘 색상 (tailwind 클래스)
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

export default function InfoTooltip({ label, tooltip, colorClass = 'text-purple-600', placement = 'top' }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);

  const tooltipPosition = (() => {
    switch (placement) {
      case 'bottom':
        return 'top-full mt-2 left-1/2 -translate-x-1/2';
      case 'left':
        return 'right-full mr-2 top-1/2 -translate-y-1/2';
      case 'right':
        return 'left-full ml-2 top-1/2 -translate-y-1/2';
      case 'top':
      default:
        return 'bottom-full mb-2 left-1/2 -translate-x-1/2';
    }
  })();

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="bg-white border border-gray-200 rounded-full shadow flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 transition-colors cursor-help"
      >
        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 bg-purple-600`}>
          i
        </div>
        <span className={`text-sm ${colorClass}`}>{label}</span>
      </button>

      {open && (
        <div
          className={`absolute ${tooltipPosition} z-50 max-w-[500px]`}
        >
          <div className="bg-white border border-gray-200 shadow-lg rounded-md px-3 py-2 text-xs text-gray-700 whitespace-nowrap">
            {tooltip}
          </div>
        </div>
      )}
    </div>
  );
}

