'use client';

import React, { useEffect, useRef, useState } from 'react';
import { containsProfanity, scrollToBottom, validateMessageLength } from '@/utils/chatHelpers';
import { markdownToHtml } from '@/utils/markdownParser';

interface ChatPanelProps {
  onClose?: () => void;
  messages?: { role: 'user' | 'assistant'; content: string }[];
  onMessagesChange?: (next: { role: 'user' | 'assistant'; content: string }[]) => void;
}

export default function ChatPanel({ onClose, messages: externalMessages, onMessagesChange }: ChatPanelProps) {
  const handleClose = () => {
    if (onClose) onClose();
  };
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>(externalMessages || []);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottomElement = () => {
    scrollToBottom(bodyRef.current);
  };

  // 초기 렌더 후 최신 메시지로 스크롤
  useEffect(() => {
    if (externalMessages && externalMessages.length > 0) {
      setMessages(externalMessages);
    }
  }, []); // mount시 한 번만

  // 메시지 변경 시 부모로 동기화 (렌더 단계 외부에서 안전하게 실행)
  useEffect(() => {
    if (onMessagesChange) {
      onMessagesChange(messages);
    }
  }, [messages, onMessagesChange]);

  // 초기 스크롤 및 메시지 변경 시 최신 메시지로 스크롤
  useEffect(() => {
    scrollToBottomElement();
  }, []);
  
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottomElement();
    }
  }, [messages.length]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isSending) return;
    if (containsProfanity(text)) {
      alert('부적절한 표현이 포함되어 있어 전송할 수 없습니다.');
      return;
    }
    if (!validateMessageLength(text)) {
      alert('글자수 제한을 지켜주세요!');
      return;
    }

    const next = [...messages, { role: 'user' as const, content: text }];
    setMessages(next);
    setInput('');
    setIsSending(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      const reply = data?.content || '죄송해요, 잠시 후 다시 시도해주세요.';
      setMessages((prev) => [...prev, { role: 'assistant' as const, content: reply }]);
      setTimeout(scrollToBottomElement, 100);
    } catch (e) {
      setMessages((prev) => [...prev, { role: 'assistant' as const, content: '오류가 발생했어요. 잠시 후 다시 시도해주세요.' }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div id="chat-panel" className="flex flex-col min-h-full">
      {/* 헤더 (세션 삭제 없이 onClose만 호출) */}
      <div id="chat-header" className="sticky top-0 z-10 px-4 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white">
        <div id="chat-header-inner" className="flex items-center gap-3">
          <div id="chat-header-icon" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <span id="chat-header-emoji" className="text-xl">🔮</span>
          </div>
          <div id="chat-header-texts">
            <div id="chat-header-title" className="text-base font-bold">내가 PM이 될 상인가</div>
            <div id="chat-header-subtitle" className="text-xs opacity-90">사주로 알아보는 PM 적성</div>
          </div>
          <button 
            id="chat-header-close"
            onClick={handleClose}
            className="ml-auto text-white hover:text-gray-200 transition-colors"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>
      </div>
      {/* 본문 영역 (기존 카드 셸에 탑재) */}
      <div
        id="chat-body"
        ref={bodyRef}
        className="flex-1 min-h-0 p-4 space-y-3 overflow-y-auto"
      >
        {/* 안내 메시지 버블 */}
        <div id="chat-guide-bubble" className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <p id="chat-guide-text" className="text-sm text-gray-800 leading-6">
            오 테스트를 다 잘 보셨네요 어떠셨나요<br/>
            에듀테크 PM에 관심이 생기셨나요?<br/>
            그러시다면 신청해보시는건 어떤가요
          </p>
        </div>

		{/* 대화 내용은 추천 칩들 아래로 이동 */}

        {/* CTA 버튼 2개 */}
        <div id="chat-cta-buttons" className="flex items-center gap-3">
          <a
            id="chat-apply-btn"
            href="#"
            className="flex-1 text-center bg-purple-600 text-white text-sm font-semibold py-2 px-3 rounded-full hover:opacity-95"
          >
            에듀테크 PM신청하러 가기
          </a>
          <a
            id="chat-bootcamp-link"
            href="#"
            className="text-xs text-purple-700 bg-purple-50 border border-purple-200 font-semibold py-2 px-3 rounded-full hover:bg-purple-100"
          >
            부트캠프 페이지로 이동
          </a>
        </div>

        {/* 추가 질문 안내 버블 */}
        <div id="chat-moreq-bubble" className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <p id="chat-moreq-text" className="text-sm text-gray-800 leading-6">
            혹시 더 궁금하신게 있으시면 채팅을 통해<br/>
            저랑 더 대화해 보시겠어요?
          </p>
        </div>

		{/* 추천 질문 칩들 */}
        <div id="chat-suggested-chips" className="space-y-2" style={{display: 'flex', flexDirection: 'column'}}>
          {[
            '🌿 에듀테크 PM이란?',
            '📍 주요 역할이 궁금해요.',
            '🧠 필요한 역량이 궁금해요.',
            '🧩 에듀테크 PM이 주로 다루는 서비스가 궁금해요.',
            '🎯 에듀테크 PM이 배울 수 있는 점이 궁금해요.',
          ].map((label, idx) => (
            <button
              id={`chat-chip-${idx+1}`}
              key={`chip-${idx}`}
              className="w-fit max-w-full text-left bg-fuchsia-600 text-white text-sm font-semibold py-2 px-4 rounded-full hover:brightness-95"
            >
              {label}
            </button>
          ))}
        </div>

		{/* 대화 내용 (추천 칩들 아래) */}
		<div id="chat-messages" className="space-y-2">
		  {messages.map((m, idx) => (
			<div
			  key={`msg-${idx}`}
			  className={
				m.role === 'user'
				  ? 'ml-auto w-fit max-w-[80%] bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white rounded-2xl px-4 py-2 break-words'
				  : 'mr-auto w-fit max-w-[85%] bg-gradient-to-r from-white to-gray-50 border border-gray-200 text-gray-800 rounded-2xl px-4 py-2 break-words'
			  }
			>
			  {m.role === 'user' ? (
				<span className="text-sm whitespace-pre-wrap">{m.content}</span>
			  ) : (
				<div 
				  className="text-sm prose prose-sm max-w-none"
				  dangerouslySetInnerHTML={{ __html: markdownToHtml(m.content) }}
				/>
			  )}
			</div>
		  ))}
		  
		  {/* 로딩 애니메이션 */}
		  {isSending && (
			<div className="mr-auto w-fit max-w-[85%] bg-gradient-to-r from-white to-gray-50 border border-gray-200 text-gray-800 rounded-2xl px-4 py-2 break-words">
			  <div className="flex items-center gap-2">
				<div className="flex space-x-1">
				  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
				  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
				  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
				</div>
				<span className="text-sm text-gray-500">답변 생성 중...</span>
			  </div>
			</div>
		  )}
		</div>
      </div>

      {/* 입력창 */}
      <div id="chat-input-bar" className="border-t border-gray-200 p-3">
        <div id="chat-input-wrapper" className="flex items-end gap-2 rounded-full border border-gray-200 px-3 py-2 bg-white" style={{ paddingTop: 12, paddingBottom: 12, display: 'flex', flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
          <textarea
            id="chat-text-input"
            aria-label="메시지를 입력하세요"
            placeholder="Shift+Enter로 줄바꿈, Enter로 전송"
            className="flex-1 outline-none text-sm placeholder:text-gray-400 leading-5 max-h-40 min-h-[1.5rem] resize-none overflow-y-auto"
            style={{ color: 'black', height: '1rem', marginLeft: '1rem', fontSize: '1rem' }}
            value={input}
            onChange={(e) => {
              const next = e.target.value;
              if (!validateMessageLength(next)) {
                alert('글자수 제한을 지켜주세요!');
                return;
              }
              setInput(next);
            }}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={(e) => { setIsComposing(false); setInput(e.currentTarget.value); }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (e.shiftKey || isComposing) {
                  // 줄바꿈 허용 (기본 동작 유지)
                  return;
                }
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button id="chat-send-button" disabled={isSending} onClick={() => { sendMessage(); }} className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 disabled:opacity-60" aria-label="전송">
            <svg id="chat-send-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-5 h-5">
              <path id="chat-send-path-1" d="M22 2L11 13"/>
              <path id="chat-send-path-2" d="M22 2L15 22L11 13L2 9L22 2Z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}


