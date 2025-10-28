'use client';

import { useState, useEffect } from 'react';
import { QUESTIONS, TYPE_NAMES, TYPE_EMOJIS, QuestionnaireAnswer } from '@/types/questionnaireConstants';

interface QuestionnaireTestProps {
  onComplete: (results: number[], detailedAnswers?: any[]) => void;
  onBack: () => void;
}

export default function QuestionnaireTest({ onComplete, onBack }: QuestionnaireTestProps) {
  const [currentPhase, setCurrentPhase] = useState<'intro' | 'question'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [detailedAnswers, setDetailedAnswers] = useState<QuestionnaireAnswer[]>([]);
  const [showTooltip, setShowTooltip] = useState(false);

  // 세션스토리지에서 진행 상황 복원 (통합 객체에서)
  useEffect(() => {
    const pmResultData = sessionStorage.getItem('pmResult');
    
    if (pmResultData) {
      try {
        const parsed = JSON.parse(pmResultData);
        
        // 통합 객체에서 questionnaire 정보 가져오기
        const savedAnswers = parsed.questionnaireAnswers;
        const savedDetailedAnswers = parsed.questionnaireDetailedAnswers;
        const savedPhase = parsed.questionnairePhase;
        const savedQuestionIndex = parsed.questionnaireIndex;
        
        if (savedAnswers && Array.isArray(savedAnswers) && savedAnswers.length > 0) {
          setAnswers(savedAnswers);
          
          if (savedDetailedAnswers && Array.isArray(savedDetailedAnswers)) {
            setDetailedAnswers(savedDetailedAnswers);
          }
          
          // 시작하지 않았으면 intro, 시작했으면 question
          if (savedPhase === 'question') {
            setCurrentPhase('question');
            if (savedQuestionIndex !== undefined && savedQuestionIndex !== null) {
              setCurrentQuestionIndex(savedQuestionIndex);
            }
          }
        }
      } catch (error) {
        console.error('세션 복원 실패:', error);
      }
    }
  }, []);

  const handleStart = () => {
    setCurrentPhase('question');
    
    // 통합 객체에 저장
    const pmResultData = sessionStorage.getItem('pmResult');
    if (pmResultData) {
      const parsed = JSON.parse(pmResultData);
      parsed.questionnairePhase = 'question';
      parsed.questionnaireIndex = 0;
      sessionStorage.setItem('pmResult', JSON.stringify(parsed));
    }
  };

  const handleAnswer = (option: any) => {
    const currentQuestion = QUESTIONS[currentQuestionIndex];
    
    // 상세 답변 정보 생성
    const detailedAnswer: QuestionnaireAnswer = {
      questionId: currentQuestion.id,
      questionTitle: currentQuestion.title,
      questionText: currentQuestion.question,
      selectedType: option.type,
      selectedTypeName: option.name || '',
      selectedEmoji: option.emoji || '',
      selectedText: option.text || ''
    };
    
    const newAnswers = [...answers, option.type];
    const newDetailedAnswers = [...detailedAnswers, detailedAnswer];
    
    setAnswers(newAnswers);
    setDetailedAnswers(newDetailedAnswers);

    // 통합 객체에 답변 저장
    const pmResultData = sessionStorage.getItem('pmResult');
    if (pmResultData) {
      const parsed = JSON.parse(pmResultData);
      parsed.questionnaireAnswers = newAnswers;
      parsed.questionnaireDetailedAnswers = newDetailedAnswers;
      
      if (currentQuestionIndex < QUESTIONS.length - 1) {
        // 다음 질문으로 이동
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        parsed.questionnaireIndex = nextIndex;
      } else {
        // 테스트 완료
        parsed.questionnaireIndex = currentQuestionIndex + 1;
      }
      
      sessionStorage.setItem('pmResult', JSON.stringify(parsed));
    }

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      // 다음 질문으로 이동
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
    } else {
      // 테스트 완료 - 데이터 유지
      // 완료 콜백 호출 (타입 번호 배열과 상세 정보 모두 전달)
      onComplete(newAnswers, newDetailedAnswers);
    }
  };

  const handleBack = () => {
    if (currentPhase === 'question' && currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      const newAnswers = answers.slice(0, -1);
      const newDetailedAnswers = detailedAnswers.slice(0, -1);
      setAnswers(newAnswers);
      setDetailedAnswers(newDetailedAnswers);
      
      // 통합 객체에 수정된 답변 저장
      const pmResultData = sessionStorage.getItem('pmResult');
      if (pmResultData) {
        const parsed = JSON.parse(pmResultData);
        parsed.questionnaireAnswers = newAnswers;
        parsed.questionnaireDetailedAnswers = newDetailedAnswers;
        parsed.questionnaireIndex = prevIndex;
        sessionStorage.setItem('pmResult', JSON.stringify(parsed));
      }
    } else {
      // 이전 화면으로 돌아가기
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
                  <p className="font-bold text-purple-600 text-base mt-1">
                    당신만의 PM 스타일을 찾아드립니다.</p>
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
              onClick={() => handleAnswer(option)}
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

