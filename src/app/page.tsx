'use client';

import { useState } from 'react';
import ChatHeader from '@/components/ChatHeader';
import ChatBubble from '@/components/ChatBubble';
import InteractiveButtons from '@/components/InteractiveButtons';
import MessageInput from '@/components/MessageInput';
import PMDiagnosisForm from '@/components/PMDiagnosisForm';
import PMResultPage from '@/components/PMResultPage';
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
  const [currentStep, setCurrentStep] = useState<'welcome' | 'test' | 'result' | 'loading'>('welcome');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      console.log('사용자 정보:', userInfo);
      
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
      
      console.log('API 응답 결과:', result);
      setAnalysisResult(result);
      
      // 결과 페이지로 전환
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep('result');
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 300);
      
    } catch (error) {
      console.error('분석 중 오류 발생:', error);
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
    console.log('미리보기 클릭');
  };

  const handleIntroClick = () => {
    // PM 직무 & 과정 소개 로직
    console.log('PM 직무 & 과정 소개 클릭');
  };

  const handleSendMessage = (message: string) => {
    console.log('사용자 메시지:', message);
    // 여기에 메시지 처리 로직 추가
  };

  const handleClose = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep('welcome');
      setAnalysisResult(null);
      setUserInfo(null);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  // 결과 페이지 관련 핸들러들
  const handleBackToChatbot = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep('welcome');
      setAnalysisResult(null);
      setUserInfo(null);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  const handleDiagnoseAgain = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep('test');
      setAnalysisResult(null);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  const handleQuestionnaireTest = () => {
    console.log('문항 테스트 클릭');
    // 문항 테스트 로직 구현
  };

  const handlePMBootcampApply = () => {
    console.log('PM 부트캠프 신청 클릭');
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
          : 'h-[95vh]'
      }`}>
        {/* 챗봇 헤더 */}
        <ChatHeader 
          onClose={currentStep !== 'welcome' ? handleClose : undefined} 
          isTransitioning={isTransitioning}
        />
        
        {/* 챗봇 메시지 영역 */}
        <div className="flex-1 overflow-y-auto">
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