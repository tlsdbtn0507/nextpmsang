interface ChatBubbleProps {
  message: string;
  isBot?: boolean;
  timestamp?: string;
}

export default function ChatBubble({ message, isBot = true, timestamp }: ChatBubbleProps) {
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl transition-all duration-200 hover:scale-[1.02] ${
        isBot 
          ? 'bg-white border border-gray-200 text-gray-800 hover:shadow-sm' 
          : 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-md'
      }`}>
        <p className="text-sm leading-relaxed">{message}</p>
        {timestamp && (
          <p className={`text-xs mt-1 ${isBot ? 'text-gray-500' : 'text-white opacity-70'}`}>
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
}
