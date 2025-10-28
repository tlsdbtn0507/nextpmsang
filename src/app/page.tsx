'use client';

import { useState, useEffect, useRef } from 'react';
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

// 헬퍼 함수들
function getFiveElementKorean(element: string): string {
  const elementMap: { [key: string]: string } = {
    '목': '나무',
    '화': '불',
    '토': '흙',
    '금': '금',
    '수': '물'
  };
  return elementMap[element] || element;
}

function getTraitIcon(trait: string): string {
  const iconMap: { [key: string]: string } = {
    '안정성': '💜',
    '신중함': '💬',
    '책임감': '📚',
    '균형감각': '⚖️',
    '관리능력': '💡',
    '체계적관리': '⚙️',
    '리더십': '👑',
    '추진력': '🚀',
    '협력성': '🤝',
    '창의성': '🎨',
    '분석력': '📊',
    '소통능력': '💬'
  };
  return iconMap[trait] || '⭐';
}

// 각 기둥의 오행 계산
function getHourElement(hour: string): string {
  const stem = hour[0];
  const elementMap: { [key: string]: string } = {
    '갑': '목', '을': '목',
    '병': '화', '정': '화',
    '무': '토', '기': '토',
    '경': '금', '신': '금',
    '임': '수', '계': '수'
  };
  return elementMap[stem] || '토';
}

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
  const [currentStep, setCurrentStep] = useState<'welcome' | 'test' | 'result' | 'loading' | 'questionnaire' | 'final'>('welcome');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [questionnaireResults, setQuestionnaireResults] = useState<number[] | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const messageAreaRef = useRef<HTMLDivElement>(null);

  // 페이지 로드 시 세션스토리지 확인
  useEffect(() => {
    const pmResult = sessionStorage.getItem('pmResult');
    
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
          setCurrentStep('final');
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className={`w-full max-w-[480px] flex flex-col bg-white shadow-2xl rounded-[32px] overflow-hidden transition-all duration-500 ease-out relative ${
        currentStep === 'test' 
          ? 'h-[700px]' 
          : currentStep === 'result'
          ? 'h-[95vh]'
          : currentStep === 'loading'
          ? 'h-[95vh]'
          : currentStep === 'final'
          ? 'h-[95vh]'
          : 'h-[95vh]'
      }`}>
        {/* 챗봇 헤더 */}
        {currentStep !== 'questionnaire' && (
          <ChatHeader 
            onClose={currentStep !== 'welcome' ? handleClose : undefined} 
            isTransitioning={isTransitioning}
          />
        )}
        
        {/* 챗봇 메시지 영역 */}
        <div ref={messageAreaRef} className="flex-1 overflow-y-auto">
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
              />
            </div>
          )}
        </div>
        
        {/* 메시지 입력 - welcome 단계에서만 표시 */}
        {currentStep === 'welcome' && (
          <MessageInput 
            onSendMessage={handleSendMessage}
            disabled={isLoading}
          />
        )}
      </div>
    </div>
  );
}