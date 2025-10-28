'use client';

interface LoadingScreenProps {
  isVisible: boolean;
  message?: string;
  subMessage?: string;
}

export default function LoadingScreen({ isVisible, message, subMessage }: LoadingScreenProps) {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-white flex flex-col items-center justify-center z-50">
        {/* 로딩 스피너 */}
        <div className="relative mb-6">
          {/* 외부 원 */}
          <div className="w-32 h-32 border-4 border-purple-200 rounded-full animate-spin">
            <div className="w-full h-full border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
          </div>
          
          {/* 내부 아이콘 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl animate-pulse">🔮</span>
          </div>
        </div>

      {/* 로딩 텍스트 */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {message || 'AI로 사주 검색하는 중'}
        </h3>
        
        {/* 점 애니메이션 */}
        <div className="flex items-center justify-center gap-1">
          <span className="text-purple-500 text-lg">.</span>
          <span className="text-purple-500 text-lg animate-bounce" style={{ animationDelay: '0.1s' }}>.</span>
          <span className="text-purple-500 text-lg animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
        </div>
      </div>

      {/* 추가 로딩 메시지 */}
      {subMessage && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-2">
            {subMessage}
          </p>
        </div>
      )}
    </div>
  );
}

