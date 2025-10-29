'use client';

import React, { useEffect, useRef, useState } from 'react';
import { containsProfanity, scrollToBottom, validateMessageLength } from '@/utils/chatHelpers';
import { markdownToHtml } from '@/utils/markdownParser';
import { FAQ_QUESTIONS, FAQ_ANSWERS } from '@/utils/chatFaq';

interface ChatPanelProps {
  onClose?: () => void;
  messages?: { role: 'user' | 'assistant' | 'faq' | 'followup'; content: string; label?: string; answer?: string; availableQuestions?: string[] }[];
  onMessagesChange?: (next: { role: 'user' | 'assistant' | 'faq' | 'followup'; content: string; label?: string; answer?: string; availableQuestions?: string[] }[]) => void;
}

export default function ChatPanel({ onClose, messages: externalMessages, onMessagesChange }: ChatPanelProps) {
  const handleClose = () => {
    if (onClose) onClose();
  };
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant' | 'faq' | 'followup'; content: string; label?: string; answer?: string; availableQuestions?: string[] }[]>(externalMessages || []);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [chatLimit, setChatLimit] = useState<null | number>(null);
  const [usedFaqQuestions, setUsedFaqQuestions] = useState<string[]>([]);
  const [isFaqLoading, setIsFaqLoading] = useState(false);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottomElement = () => {
    if (bodyRef.current) {
      bodyRef.current.scrollTo({
        top: bodyRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const isChatLimit = localStorage.getItem('chatLimit');
    if (!isChatLimit) {
      localStorage.setItem('chatLimit', '2');
      setChatLimit(2);
    } else {
      setChatLimit(parseInt(isChatLimit));
    }
  }, []);

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
  
  //채팅 제한 체크
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottomElement();
    }
  }, [messages.length]);

  const handleChatLimit = () => {
    if (chatLimit === null || chatLimit <= 0){
        localStorage.setItem('chatLimit', '0');
        setChatLimit(0);
        return false;
    } 
    setChatLimit((prev) => prev ? prev - 1 : 0);
    localStorage.setItem('chatLimit', chatLimit.toString());
    return true;
  };

  const checkIsInputValid = (text: string) => {
    
    if (!text || isSending) return;
    if (containsProfanity(text)) {
      alert('부적절한 표현이 포함되어 있어 전송할 수 없습니다.');
      return false;
    }
    if (!validateMessageLength(text)) {
      alert('글자수 제한을 지켜주세요!');
      return false;
    }
    return true;
  }

  const fetchChat = async (messages: { role: 'user' | 'assistant' | 'faq' | 'followup'; content: string; label?: string; answer?: string; availableQuestions?: string[] }[]) => {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
    const data = await res.json();
    return data?.content || '죄송해요, 잠시 후 다시 시도해주세요.';
  }

  const sendOverToChatter = () => {
    // 상담사 연결 기능 (추후 구현)
  };

  const handleMessage = async () => {
    const text = input.trim();

    if (!checkIsInputValid(text)) {
      return;
    }

    // 사용자 메시지를 화면에 즉시 추가
    const userMessage = { role: 'user' as const, content: text };
    const next = [...messages, userMessage];
    setMessages(next);
    setInput('');

    // 채팅 횟수 체크 - 제한된 경우 API 호출하지 않음
    if (!handleChatLimit()) {
      // 채팅 횟수 초과 시 메시지 버블로 안내
      const limitMessage = {
        role: 'assistant' as const,
        content: '사용가능한 채팅 횟수를 초과 하셨습니다. \'추가 안내를 원하신다면 아래에 상담사 연결 버튼을 클릭해주세요\''
      };
      setMessages((prev) => [...prev, limitMessage]);
      setTimeout(scrollToBottomElement, 100);
      return;
    }

    setIsSending(true);
    
    try {
      // API에는 입력값만 전송 (기존 대화 내역 제외)
      const reply = await fetchChat([userMessage]);
      setMessages((prev) => [...prev, { role: 'assistant' as const, content: reply }]);
      setTimeout(scrollToBottomElement, 100);
    } catch (e) {
      setMessages((prev) => [...prev, { role: 'assistant' as const, content: '오류가 발생했어요. 잠시 후 다시 시도해주세요.' }]);
    } finally {
      setIsSending(false);
    }
  };

  const handleFaqBtns = (label: string) => {
    const answer = FAQ_ANSWERS[label];
    if (answer) {
      console.log(`[FAQ] ${label}:`, answer);
      generateFaqBubbles(answer, label);
      // 사용한 FAQ 질문 추가
      setUsedFaqQuestions((prev) => [...prev, label]);
    } else {
      console.log(`[FAQ] ${label}: 답변이 없습니다.`);
    }
  };

  // FAQ 말풍선 생성: 단계별 딜레이와 로딩 애니메이션
  const generateFaqBubbles = async (answer: string, label: string) => {
    // 1단계: 질문 말풍선 즉시 표시
    const questionMessage = { role: 'faq' as const, content: '', label, answer: '' };
    setMessages((prev) => [...prev, questionMessage]);
    setIsFaqLoading(true);
    
    // 2단계: 1000ms 후 답변 표시
    setTimeout(() => {
      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (updated[lastIndex] && updated[lastIndex].role === 'faq') {
          updated[lastIndex] = { ...updated[lastIndex], answer };
        }
        return updated;
      });
      setIsFaqLoading(false);
      
      // 답변 표시 후 스크롤 실행
      setTimeout(scrollToBottomElement, 100);
      
      // 3단계: 1000ms 후 추가 안내를 messages에 영구 추가
      setTimeout(() => {
        const availableQuestions = getAvailableFaqQuestions();
        if (availableQuestions.length > 0) {
          const followupMessage = {
            role: 'followup' as const,
            content: '추가로 궁금하신 사항이 있나요?',
            availableQuestions
          };
          setMessages((prev) => [...prev, followupMessage]);
        }
        setTimeout(scrollToBottomElement, 200);
      }, 1000);
    }, 1000);
    
    setTimeout(scrollToBottomElement, 50);
  };

  // 사용하지 않은 FAQ 질문들만 필터링
  const getAvailableFaqQuestions = () => {
    return FAQ_QUESTIONS.filter(question => !usedFaqQuestions.includes(question));
  };

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .smooth-scroll {
          scroll-behavior: smooth;
        }
      `}</style>
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
        className="flex-1 min-h-0 p-4 space-y-3 overflow-y-auto smooth-scroll"
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
          {FAQ_QUESTIONS.map((label, idx) => (
            <button
              id={`chat-chip-${idx+1}`}
              key={`chip-${idx}`}
              onClick={() => handleFaqBtns(label)}
              className="w-fit max-w-full text-left bg-fuchsia-600 text-white text-sm font-semibold py-2 px-4 rounded-full hover:brightness-95"
            >
              {label}
            </button>
          ))}
        </div>

		{/* 대화 내용 (추천 칩들 아래) */}
		<div id="chat-messages" className="space-y-2">
		  {messages.map((m, idx) => (
			<React.Fragment key={`msg-${idx}`}>
			  {m.role === 'faq' ? (
				/* FAQ 메시지 */
				<>
				  <div
					className="ml-auto w-fit max-w-[80%] rounded-2xl px-4 py-2 break-words"
					style={{ backgroundColor: '#EEE9FF', border: '1px solid #D5CFFF' ,color: 'black' }}
				  >
					<span className="text-sm whitespace-pre-wrap">{m.label}</span>
				  </div>
				  
				  {/* 답변 블록 */}
				  {m.answer ? (
					<div className="mr-auto w-fit max-w-[85%] rounded-2xl px-4 py-2 break-words border border-gray-200 bg-white">
					  <div className="text-sm prose prose-sm max-w-none" style={{color: 'black'}}>
						{m.answer}
					  </div>
					</div>
				  ) : (
					/* 로딩 애니메이션 */
					<div className="mr-auto w-fit max-w-[85%] rounded-2xl px-4 py-2 break-words border border-gray-200 bg-white">
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
				</>
			  ) : m.role === 'followup' ? (
				/* 추가 질문 안내 메시지 */
				<>
				  <div className="mr-auto w-fit max-w-[85%] rounded-2xl px-4 py-2 break-words border border-gray-200 bg-white">
					<div className="text-sm text-gray-800">
					  {m.content}
					</div>
				  </div>
				  <div 
					className="space-y-2 transition-all duration-700 ease-out"
					style={{display:'flex', flexDirection: 'column'}}
				  >
					{m.availableQuestions?.map((label, faqIdx) => (
					  <button
						key={`followup-faq-${faqIdx}`}
						onClick={() => handleFaqBtns(label)}
						className="w-fit max-w-full text-left bg-fuchsia-600 text-white text-sm font-semibold py-2 px-4 rounded-full hover:brightness-95 transition-all duration-300 hover:scale-105"
						style={{
							animationDelay: `${faqIdx * 100}ms`,
							animation: 'fadeInUp 0.6s ease-out forwards'
						}}
					  >
						{label}
					  </button>
					))}
				  </div>
				</>
			  ) : (
				/* 일반 채팅 메시지 */
				<>
				  <div
					className={
					  m.role === 'user'
						? 'ml-auto w-fit max-w-[80%] rounded-2xl px-4 py-2 break-words'
						: 'mr-auto w-fit max-w-[85%] bg-gradient-to-r from-white to-gray-50 border border-gray-200 text-gray-800 rounded-2xl px-4 py-2 break-words'
					}
					style={m.role === 'user' ? { backgroundColor: '#EEE9FF', border: '1px solid #D5CFFF', color: 'black' } : {}}
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
				  
				  {/* 채팅 횟수 초과 메시지인 경우 상담사 연결 버튼 추가 */}
				  {m.role === 'assistant' && m.content.includes('사용가능한 채팅 횟수를 초과') && (
					<div className="mt-2">
					  <button
						onClick={sendOverToChatter}
						className="w-fit max-w-full text-left bg-fuchsia-600 text-white text-sm font-semibold py-2 px-4 rounded-full hover:brightness-95 transition-all duration-300 hover:scale-105"
					  >
						상담사 연결
					  </button>
					</div>
				  )}
				</>
			  )}
			</React.Fragment>
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
                handleMessage();
              }
            }}
          />
          <button id="chat-send-button" disabled={isSending} onClick={() => { handleMessage(); }} className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 disabled:opacity-60" aria-label="전송">
            <svg id="chat-send-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-5 h-5">
              <path id="chat-send-path-1" d="M22 2L11 13"/>
              <path id="chat-send-path-2" d="M22 2L15 22L11 13L2 9L22 2Z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
    </>
  );
}


