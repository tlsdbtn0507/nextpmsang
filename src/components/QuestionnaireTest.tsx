'use client';

import { useState } from 'react';
import { QUESTIONS, TYPE_NAMES, TYPE_EMOJIS } from '@/types/questionnaireConstants';

interface QuestionnaireTestProps {
  onComplete: (results: number[]) => void;
  onBack: () => void;
}

export default function QuestionnaireTest({ onComplete, onBack }: QuestionnaireTestProps) {
  const [currentPhase, setCurrentPhase] = useState<'intro' | 'question'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleStart = () => {
    setCurrentPhase('question');
  };

  const handleAnswer = (type: number) => {
    const newAnswers = [...answers, type];
    setAnswers(newAnswers);

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      // 다음 질문으로 이동
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 테스트 완료
      onComplete(newAnswers);
    }
  };

  const handleBack = () => {
    if (currentPhase === 'question' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setAnswers(answers.slice(0, -1));
    } else {
      onBack();
    }
  };

  // 소개 화면
  if (currentPhase === 'intro') {
    return (
      <div className="bg-white min-h-screen">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <div>
                <div className="text-white font-bold text-lg">내가 PM이 될 상인가</div>
                <div className="text-white/80 text-sm">사주로 알아보는 PM 적성</div>
              </div>
            </div>
            <button 
              onClick={onBack}
              className="text-white text-2xl font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6" >
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">
                🌟 사주 오행 기반
                <br />
                후천적 기질형 PM 테스트
              </h2>
              <div className="relative inline-block">
                <p className="text-gray-600 inline-flex items-center">
                  당신이 일할 때 어떤 스타일인지 알아보세요.
                  <button
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="ml-2 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-help"
                  >
                    i
                  </button>
                </p>
                {showTooltip && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-64 bg-gray-800 text-white text-xs rounded-lg py-2 px-3 shadow-lg z-50">
                    <div className="text-center">
                      프로덕트 매니저에 대한 전문 지식이 없어도<br />
                      쉽게 답할 수 있습니다!
                    </div>
                    {/* 화살표 */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                      <div className="border-4 border-transparent border-t-gray-800"></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-base">
                <div className="flex flex-col items-center space-y-1 text-gray-700">
                  <p className="text-base"><strong>⚙️</strong> 사주로 본 선천적 기질</p>
                  <span className="text-2xl">+</span>
                  <p className="text-base"><strong>💡</strong> 후천적으로 만들어진 일하는 방식</p>
                  <span className="text-2xl transform rotate-90">=</span>
                  <p className="font-bold text-purple-600 text-base mt-1">당신만의 PM(프로덕트 매니저) 스타일을 찾아드립니다.</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                각 문항에서 가장 나다운 선택지 하나를 골라주세요.
              </p>
            </div>
          </div>

          {/* 시작 버튼 */}
          <div className="flex justify-center">
            <button
              onClick={handleStart}
              className="w-1/2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-4 px-4 rounded-lg hover:scale-[1.02] hover:shadow-lg transition-all duration-200"
            >
              문항 시작하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 질문 화면
  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const questionNumber = currentQuestionIndex + 1;

  return (
    <div className="bg-white min-h-screen">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>
            <div>
              <div className="text-white font-bold text-lg">내가 PM이 될 상인가</div>
              <div className="text-white/80 text-sm">사주로 알아보는 PM 적성</div>
            </div>
          </div>
          <button 
            onClick={onBack}
            className="text-white text-2xl font-bold"
          >
            ✕
          </button>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="px-4 py-6">
        {/* 질문 카드 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6" style={{ border: '1px solid #E5E5E5' }}>
          <div className="mb-3">
            <span className="font-bold text-purple-600">[{questionNumber}/{QUESTIONS.length}] {currentQuestion.title}</span>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {currentQuestion.question}
          </p>
        </div>

        {/* 선택지 */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option.type)}
              className="w-full bg-white rounded-2xl shadow p-4 text-left hover:shadow-md transition-all"
              style={{ border: '1px solid #E5E5E5' }}
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">{String.fromCharCode(65 + index)}.</span>
                <span className="text-gray-700">{option.text}</span>
              </div>
              {/* 유형 이름 숨김 */}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

