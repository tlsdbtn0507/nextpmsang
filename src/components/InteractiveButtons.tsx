interface InteractiveButtonsProps {
  onTestClick?: () => void;
  onIntroClick?: () => void;
}

export default function InteractiveButtons({ onTestClick, onIntroClick }: InteractiveButtonsProps) {
  return (
    <div className="flex gap-3 mb-6">
      <button
        onClick={onTestClick}
        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-3 px-4 rounded-full shadow-md hover:shadow-lg hover:scale-[1.02] hover:from-purple-700 hover:to-pink-600 transition-all duration-200"
      >
        PM 직무력 테스트
      </button>
      <button
        onClick={onIntroClick}
        className="flex-1 bg-white border-2 border-purple-200 text-purple-700 font-semibold py-3 px-4 rounded-full hover:border-purple-300 hover:bg-purple-50 hover:scale-[1.02] hover:text-purple-800 transition-all duration-200"
      >
        PM 직무 & 과정 소개
      </button>
    </div>
  );
}
