interface ChatHeaderProps {
  onClose?: () => void;
  isTransitioning?: boolean;
}

export default function ChatHeader({ onClose, isTransitioning = false }: ChatHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-4 flex items-center justify-between">
      <div className={`flex items-center gap-3 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <div className="text-2xl">✨</div>
        <div>
          <h1 className="text-lg font-bold">내가 PM이 될 상인가</h1>
          <p className="text-sm opacity-90">사주로 알아보는 PM 적성</p>
        </div>
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
        >
          ✕
        </button>
      )}
    </div>
  );
}
