interface InteractiveButtonsProps {
  onTestClick?: () => void;
  onIntroClick?: () => void;
}

export default function InteractiveButtons({ onTestClick, onIntroClick }: InteractiveButtonsProps) {
  return (
    <div className="flex justify-start gap-3 mb-6">
      <button
        onClick={onTestClick}
        className="w-[30vh] bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-3 px-4 rounded-full shadow-md hover:shadow-lg hover:scale-[1.02] hover:from-purple-700 hover:to-pink-600 transition-all duration-200"
      >
        PM 직무력 테스트
      </button>
    </div>
  );
}
