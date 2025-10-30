'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import ChatHeader from '@/components/ChatHeader';
import ChatBubble from '@/components/ChatBubble';
import InteractiveButtons from '@/components/InteractiveButtons';
import MessageInput from '@/components/MessageInput';
import PMDiagnosisForm from '@/components/PMDiagnosisForm';
import PMResultPage from '@/components/PMResultPage';
import QuestionnaireTest from '@/components/QuestionnaireTest';
import FinalResultPage from '@/components/FinalResultPage';
import LoadingScreen from '@/components/LoadingScreen';
import { UserInfo } from '@/types/saju';
import { getFiveElementKorean, getTraitIcon, getHourElement } from '@/utils/sajuHelpers';

// ChatPanel은 chat 단계에서만 필요하므로 동적 임포트로 분리해 초기 번들을 줄인다
const ChatPanel = dynamic(() => import('@/components/ChatPanel'), { ssr: false });

function getMonthElement(month: string): string {
  const stem = month[0];
  const elementMap: { [key: string]: string } = {
    '갑': '목', '을': '목',
    '병': '화', '정': '화',
    '무': '토', '기': '토',
    '경': '금', '신': '금',
    '임': '수', '계': '수'
  };
  return elementMap[stem] || '토';
}

function getYearElement(year: string): string {
  const stem = year[0];
  const elementMap: { [key: string]: string } = {
    '갑': '목', '을': '목',
    '병': '화', '정': '화',
    '무': '토', '기': '토',
    '경': '금', '신': '금',
    '임': '수', '계': '수'
  };
  return elementMap[stem] || '토';
}

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<'welcome' | 'test' | 'result' | 'loading' | 'questionnaire' | 'final' | 'chat'>('welcome');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [questionnaireResults, setQuestionnaireResults] = useState<number[] | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const messageAreaRef = useRef<HTMLDivElement>(null);

  // 페이지 로드 시 세션스토리지 확인
  useEffect(() => {
    const pmResult = sessionStorage.getItem('pmResult');
    const savedStep = sessionStorage.getItem('appStep');
    
    if (pmResult) {
      try {
        const parsed = JSON.parse(pmResult);
        
        // 기존 산발적으로 저장된 questionnaire 정보를 pmResult에 통합 (마이그레이션)
        if (parsed.userInfo && parsed.sajuData) {
          const questionnairePhase = sessionStorage.getItem('questionnairePhase');
          const questionnaireAnswers = sessionStorage.getItem('questionnaireAnswers');
          const questionnaireDetailedAnswers = sessionStorage.getItem('questionnaireDetailedAnswers');
          const questionnaireIndex = sessionStorage.getItem('questionnaireIndex');
          
          // 산발적으로 저장된 데이터가 pmResult에 없으면 통합
          if (!parsed.questionnaireAnswers && questionnaireAnswers) {
            parsed.questionnaireAnswers = JSON.parse(questionnaireAnswers);
          }
          if (!parsed.questionnaireDetailedAnswers && questionnaireDetailedAnswers) {
            parsed.questionnaireDetailedAnswers = JSON.parse(questionnaireDetailedAnswers);
          }
          if (!parsed.questionnairePhase && questionnairePhase) {
            parsed.questionnairePhase = questionnairePhase;
          }
          if (!parsed.questionnaireIndex && questionnaireIndex) {
            parsed.questionnaireIndex = parseInt(questionnaireIndex);
          }
          
          // 통합된 데이터를 다시 저장
          sessionStorage.setItem('pmResult', JSON.stringify(parsed));
        }
        
        setUserInfo(parsed.userInfo);
        setAnalysisResult(parsed.sajuData);
        
        // 문항 테스트 완료 여부 확인
        // questionnaireCompleted가 true이거나 questionnaireResults의 길이가 5를 넘으면 완료된 것으로 간주
        const isCompleted = parsed.questionnaireCompleted || 
                           (parsed.questionnaireResults && parsed.questionnaireResults.length > 5);
        
        if (parsed.questionnaireResults && isCompleted) {
          setQuestionnaireResults(parsed.questionnaireResults);
          // 마지막 저장된 단계가 chat이면 chat부터 보여준다
          if (savedStep === 'chat') {
            setCurrentStep('chat');
          } else {
            setCurrentStep('final');
          }
        } 
        // questionnairePhase가 'question'이고 아직 완료되지 않은 경우
        else if (parsed.questionnairePhase === 'question' && !isCompleted) {
          setCurrentStep('questionnaire');
        } 
        else {
          setCurrentStep('result');
        }
      } catch (error) {
        sessionStorage.removeItem('pmResult');
      }
    }
    setIsInitialized(true);
  }, []);

  const handleFormSubmit = async (userInfo: UserInfo) => {
    setIsLoading(true);
    setUserInfo(userInfo);
    
    // 로딩 화면으로 전환
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep('loading');
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
    
    try {
      // 실제 API 호출
      const response = await fetch('/api/saju', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'API 호출에 실패했습니다.');
      }
      
      setAnalysisResult(result);
      
      // 세션스토리지에 결과 저장
      const savedData = {
        userInfo,
        sajuData: result
      };
      sessionStorage.setItem('pmResult', JSON.stringify(savedData));
      
      // 결과 페이지로 전환
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep('result');
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 300);
      
    } catch (error) {
      setAnalysisResult({
        status: 'error',
        error: error instanceof Error ? error.message : '분석 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.stack : undefined
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
  };

  const handleTestClick = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep('test');
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  const handlePreview = () => {
    // 미리보기 로직
  };

  const handleIntroClick = () => {
    // PM 직무 & 과정 소개 로직
  };

  const handleSendMessage = (message: string) => {
    // 여기에 메시지 처리 로직 추가
  };

  const handleClose = () => {
    // 세션스토리지 초기화 (통합 객체 전체 제거)
    sessionStorage.removeItem('pmResult');
    sessionStorage.removeItem('appStep');
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep('welcome');
      setAnalysisResult(null);
      setUserInfo(null);
      setQuestionnaireResults(null);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  // 결과 페이지 관련 핸들러들
  const handleBackToChatbot = () => {
    // 세션스토리지 초기화 (통합 객체 전체 제거)
    sessionStorage.removeItem('pmResult');
    sessionStorage.removeItem('appStep');
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep('welcome');
      setAnalysisResult(null);
      setUserInfo(null);
      setQuestionnaireResults(null);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  const handleDiagnoseAgain = () => {
    // 세션스토리지 초기화 (통합 객체 전체 제거)
    sessionStorage.removeItem('pmResult');
    sessionStorage.removeItem('appStep');
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep('test');
      setAnalysisResult(null);
      setUserInfo(null);
      setQuestionnaireResults(null);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  const handleQuestionnaireTest = () => {
    // 세션스토리지에 현재 결과 저장 (통합 객체로 저장)
    if (userInfo && analysisResult) {
      const existingData = sessionStorage.getItem('pmResult');
      const baseData = existingData ? JSON.parse(existingData) : {};
      
      sessionStorage.setItem('pmResult', JSON.stringify({
        ...baseData,
        userInfo,
        sajuData: analysisResult
      }));
    }
    
    // 스크롤을 최상단으로 부드럽게 이동
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      // 스크롤 완료 후 페이지 전환 (약 500ms 후)
      setTimeout(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentStep('questionnaire');
          setTimeout(() => {
            setIsTransitioning(false);
          }, 50);
        }, 300);
      }, 500);
    } else {
      // ref가 없는 경우 바로 전환
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep('questionnaire');
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 300);
    }
  };

  const handleQuestionnaireComplete = (results: number[], detailedAnswers?: any[]) => {
    setQuestionnaireResults(results);
    
    // 테스트 결과를 세션스토리지에 저장 (통합 객체에 추가)
    const pmResultData = sessionStorage.getItem('pmResult');
    if (pmResultData) {
      const parsed = JSON.parse(pmResultData);
      // 모든 questionnaire 정보를 통합 객체에 저장
      parsed.questionnaireResults = results;
      parsed.questionnaireDetailedAnswers = detailedAnswers || [];
      parsed.questionnaireCompleted = true;
      parsed.questionnairePhase = 'completed';
      sessionStorage.setItem('pmResult', JSON.stringify(parsed));
    }
    
    // 산발적으로 저장된 데이터 정리 (이제는 pmResult에 통합되었으므로)
    sessionStorage.removeItem('questionnaireAnswers');
    sessionStorage.removeItem('questionnaireDetailedAnswers');
    sessionStorage.removeItem('questionnairePhase');
    sessionStorage.removeItem('questionnaireIndex');
    
    // 종합 결과 페이지로 이동
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep('final');
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  const handleQuestionnaireBack = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep('result');
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  const handlePMBootcampApply = () => {
    // PM 부트캠프 신청 로직 구현
  };

  // 대화 상태(부모 보존)
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant' | 'faq' | 'followup'; content: string; label?: string; answer?: string; availableQuestions?: string[] }[]>([]);


  const handleOpenChat = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep('chat');
      sessionStorage.setItem('appStep', 'chat');
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  const handleBackToFinal = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep('final');
      sessionStorage.setItem('appStep', 'final');
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className={`w-full max-w-[480px] flex flex-col min-h-0 bg-white shadow-2xl rounded-[32px] overflow-hidden transition-all duration-500 ease-out relative ${
        currentStep === 'test' 
          ? 'h-[700px]' 
          : currentStep === 'result'
          ? 'h-[95vh]'
          : currentStep === 'loading'
          ? 'h-[95vh]'
          : currentStep === 'final'
          ? 'h-[95vh]'
          : currentStep === 'chat'
          ? 'h-[95vh]'
          : currentStep === 'questionnaire'
          ? 'h-[95vh]'
          : 'h-[95vh]'
      }`}>
        {/* 챗봇 헤더 */}
        {currentStep !== 'questionnaire' && currentStep !== 'chat' && (
          <ChatHeader 
            onClose={currentStep !== 'welcome' ? handleClose : undefined} 
            isTransitioning={isTransitioning}
            currentStep={currentStep}
          />
        )}
        
        {/* 챗봇 메시지 영역 (chat 단계 제외) */}
        {currentStep !== 'chat' && (
          <div ref={messageAreaRef} 
          // className="flex-1 overflow-y-auto"
          className={`${currentStep === 'questionnaire' ? '' : 'flex-1 overflow-y-auto '}`}
          >
          {currentStep === 'welcome' && (
            <div className={`p-4 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
              <ChatBubble 
                message="안녕하세요! 🔮 사주로 알아보는 PM 적성 분석사입니다."
                isBot={true}
              />
              <ChatBubble 
                message="당신의 사주팔자를 통해 에듀테크 PM으로서의 숨겨진 재능과 운명을 찾아드릴게요!"
                isBot={true}
              />
              <InteractiveButtons 
                onTestClick={handleTestClick}
                onIntroClick={handleIntroClick}
              />
            </div>
          )}
          
          {currentStep === 'test' && (
            <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
              <PMDiagnosisForm 
                onSubmit={handleFormSubmit}
                onPreview={handlePreview}
                isLoading={isLoading}
                isTransitioning={isTransitioning}
              />
            </div>
          )}
          
          {currentStep === 'loading' && (
            <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
              <LoadingScreen isVisible={true} />
            </div>
          )}
          
          {currentStep === 'result' && analysisResult && userInfo && (
            <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
              <PMResultPage 
                userInfo={userInfo}
                sajuData={analysisResult}
                onBackToChatbot={handleBackToChatbot}
                onDiagnoseAgain={handleDiagnoseAgain}
                onQuestionnaireTest={handleQuestionnaireTest}
                onPMBootcampApply={handlePMBootcampApply}
              />
            </div>
          )}
          
          {currentStep === 'questionnaire' && (
            <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
              <QuestionnaireTest 
                onComplete={handleQuestionnaireComplete}
                onBack={handleQuestionnaireBack}
              />
            </div>
          )}
          
          {currentStep === 'final' && analysisResult && userInfo && questionnaireResults && (
            <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
              <FinalResultPage 
                userInfo={userInfo}
                sajuData={analysisResult}
                questionnaireResults={questionnaireResults}
                onPMBootcampApply={handlePMBootcampApply}
                onOpenChat={handleOpenChat}
                skipLoading={true}
              />
            </div>
          )}
          </div>
        )}

        {/* chat 단계는 독립 레이아웃로 렌더 (입력창 포함) */}
        {currentStep === 'chat' && (
          <div className={`flex flex-col flex-1 min-h-0 overflow-hidden transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            <ChatPanel
              onClose={handleBackToFinal}
              messages={chatMessages}
              onMessagesChange={setChatMessages}
            />
          </div>
        )}
        
        {/* 메시지 입력 - welcome 단계에서만 표시 */}
        {currentStep === 'welcome' && (
          <MessageInput 
            onSendMessage={handleSendMessage}
            disabled={isLoading}
            tooltipMessage={"사주 검사를 완료하면 채팅이 가능합니다!"}
          />
        )}
      </div>
    </div>
  );
}