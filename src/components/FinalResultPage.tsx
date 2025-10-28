'use client';

import { useState, useEffect } from 'react';
import { UserInfo, SajuResponse } from '@/types/saju';
import { generateComprehensiveAnalysis, PersonalityMatch } from '@/utils/questionnaireAnalyzer';
import { ELEMENT_ANALYSIS, PM_PERSONALITY_DATA, KEYWORD_EMOJIS } from '@/types/sajuConstants';
import LoadingScreen from '@/components/LoadingScreen';
import InfoTooltip from '@/components/InfoTooltip';

interface FinalResultPageProps {
  userInfo: UserInfo;
  sajuData: SajuResponse;
  questionnaireResults: number[];
  onPMBootcampApply: () => void;
  onOpenChat?: () => void;
  skipLoading?: boolean;
}

export default function FinalResultPage({ 
  userInfo, 
  sajuData, 
  questionnaireResults, 
  onPMBootcampApply,
  onOpenChat,
  skipLoading = false
}: FinalResultPageProps) {
  const [isLoading, setIsLoading] = useState(!skipLoading);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [aiInterpretation, setAiInterpretation] = useState<string>('');
  const [matchedPersonalityType, setMatchedPersonalityType] = useState<string>('');

  useEffect(() => {
    const generateFinalAnalysis = async () => {
      try {
        // 세션 고정값 확인 (있으면 이를 우선 사용)
        const pmResultRaw = sessionStorage.getItem('pmResult');
        const parsedPmResult = pmResultRaw ? JSON.parse(pmResultRaw) : null;
        
        // 1단계: 기본 분석 결과 생성
        const result = generateComprehensiveAnalysis(sajuData, questionnaireResults);
        setAnalysisResult(result);
        
        // 세션에 최종 매칭값이 있으면 그대로 사용하고 종료
        const cachedFinal = parsedPmResult?.finalAnalysis;
        if (cachedFinal?.matchedPersonalityType) {
          setMatchedPersonalityType(cachedFinal.matchedPersonalityType);
          if (cachedFinal.aiInterpretation) setAiInterpretation(cachedFinal.aiInterpretation);
          setIsLoading(false);
          return;
        }
        
        // 2단계: AI 유형 매칭
        const pmType = result.primaryPersonality.name;
        const elementAnalysis = ELEMENT_ANALYSIS[sajuData.four_pillars?.day?.stem_element || '토'];
        const elementCharacter = elementAnalysis.elementCharacter;
        
        // 간소화된 프롬프트 (비용 절감)
        const prompt = `사용자의 PM 유형(${pmType})과 타고난 기질(${elementCharacter})을 바탕으로 가장 유사한 성향을 선택하세요.

선택지: 리더형, 실행형, 분석형, 공감형, 안정형

출력: "가장 비슷한 유형: [성향명]"
이유(50자 내외):`;
        
        // API 호출
        const response = await fetch('/api/ai-interpretation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
        });
        
        if (response.ok) {
          const data = await response.json();
          const interpretation = data.interpretation || '';
          console.log('=== AI 매칭 결과 ===');
          console.log(interpretation);
          
          // AI 반환 결과에서 유형 추출
          const personalityMatch = interpretation.match(/리더형|실행형|분석형|공감형|안정형/);
          if (personalityMatch) {
            const matchedType = personalityMatch[0];
            setMatchedPersonalityType(matchedType);
            console.log('=== 매칭된 성향 데이터 ===');
            console.log('성향:', matchedType);
            console.log(PM_PERSONALITY_DATA[matchedType as keyof typeof PM_PERSONALITY_DATA]);
          }
          
          setAiInterpretation(interpretation);

          // 세션에 캐시
          try {
            const latestRaw = sessionStorage.getItem('pmResult');
            const latest = latestRaw ? JSON.parse(latestRaw) : {};
            latest.finalAnalysis = {
              matchedPersonalityType: personalityMatch ? personalityMatch[0] : '',
              aiInterpretation: interpretation,
              computedAt: Date.now(),
            };
            sessionStorage.setItem('pmResult', JSON.stringify(latest));
          } catch {}
        } else {
          setAiInterpretation('');
        }
      } catch (error) {
        console.error('분석 중 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    generateFinalAnalysis();
  }, [sajuData, questionnaireResults]);

  // 로딩 중
  if (!analysisResult) {
    if (skipLoading) return null;
    return (
      <LoadingScreen 
        isVisible={true}
        message="최종 결과 산출하는 중"
        subMessage="종합 분석을 준비하고 있습니다"
      />
    );
  }

  // 주요 성격 유형
  const primaryPersonality = analysisResult.primaryPersonality;

  // 사주 기질 정보
  const mainElement = sajuData.four_pillars?.day?.stem_element || '토';
  const elementAnalysis = ELEMENT_ANALYSIS[mainElement];

  // PM 유형에 따른 이미지 선택 (AI 매칭 결과 우선)
  const getPersonalityImage = (personalityName: string): string => {
    const imageMap: { [key: string]: string } = {
      '리더형': '/images/result/리더형.png',
      '실행형': '/images/result/실행형.png',
      '안정형': '/images/result/안정형.png',
      '분석형': '/images/result/분석형.png',
      '공감형': '/images/result/공감형.png'
    };
    return imageMap[personalityName] || '/images/result/안정형.png';
  };

  // AI 매칭 결과 우선, 없으면 기본값
  const displayPersonalityType = matchedPersonalityType || primaryPersonality.name;
  const personalityImage = getPersonalityImage(displayPersonalityType);
  
  // PM 성격별 설명 가져오기 (AI 매칭 결과 우선, 없으면 기본값)
  const personalityDescription = matchedPersonalityType 
    ? PM_PERSONALITY_DATA[matchedPersonalityType as keyof typeof PM_PERSONALITY_DATA]?.description || ''
    : PM_PERSONALITY_DATA[primaryPersonality.name as keyof typeof PM_PERSONALITY_DATA]?.description || '';

  // 종합 분석 가져오기 (AI 매칭 결과 우선, 없으면 기본값)
  const comprehensiveAnalysisText = matchedPersonalityType 
    ? PM_PERSONALITY_DATA[matchedPersonalityType as keyof typeof PM_PERSONALITY_DATA]?.comprehensiveAnalysis || ''
    : PM_PERSONALITY_DATA[primaryPersonality.name as keyof typeof PM_PERSONALITY_DATA]?.comprehensiveAnalysis || '';

  // 강점 커리큘럼 가져오기 (AI 매칭 결과 우선, 없으면 기본값)
  const strengthCurriculum = matchedPersonalityType 
    ? PM_PERSONALITY_DATA[matchedPersonalityType as keyof typeof PM_PERSONALITY_DATA]?.strengthCurriculum
    : PM_PERSONALITY_DATA[primaryPersonality.name as keyof typeof PM_PERSONALITY_DATA]?.strengthCurriculum;

  // 약점 커리큘럼 가져오기 (AI 매칭 결과 우선, 없으면 기본값)
  const weaknessCurriculum = matchedPersonalityType 
    ? PM_PERSONALITY_DATA[matchedPersonalityType as keyof typeof PM_PERSONALITY_DATA]?.weaknessCurriculum
    : PM_PERSONALITY_DATA[primaryPersonality.name as keyof typeof PM_PERSONALITY_DATA]?.weaknessCurriculum;

  // 강점과 약점 가져오기 (AI 매칭 결과 우선, 없으면 기본값)
  const personalityStrengths = matchedPersonalityType 
    ? PM_PERSONALITY_DATA[matchedPersonalityType as keyof typeof PM_PERSONALITY_DATA]?.strengths || []
    : PM_PERSONALITY_DATA[primaryPersonality.name as keyof typeof PM_PERSONALITY_DATA]?.strengths || [];

  const personalityWeaknesses = matchedPersonalityType 
    ? PM_PERSONALITY_DATA[matchedPersonalityType as keyof typeof PM_PERSONALITY_DATA]?.weaknesses || []
    : PM_PERSONALITY_DATA[primaryPersonality.name as keyof typeof PM_PERSONALITY_DATA]?.weaknesses || [];

  return (
    <div id="final-result-page" className="bg-white min-h-screen pb-6">
      {/* 헤더 영역 */}
      <div id="header" className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-500 z-10">
      </div>

      {/* 일러스트 영역 */}
      <div 
        id="hero-section" 
        className="text-center py-0 mx-auto w-[90%]"
      >
        <div id="hero-circle" className="mx-auto flex items-center justify-center relative z-10">
          <img 
            id="hero-icon" 
            src={personalityImage} 
            alt={`${primaryPersonality.name} 일러스트`}
            className="object-contain relative z-10"
            style={{ width: '400px', height: '400px' }}
          />
        </div>
      </div>

      {/* PM 유형 요약 */}
      <div id="pm-type-summary-wrapper" className="px-4 mb-6 flex justify-center">
        <div 
          id="pm-type-summary" 
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 text-center font-semibold shadow-lg inline-block"
          style={{ borderRadius: '40px' }}
        >
          {personalityDescription}
        </div>
      </div>

      {/* 핵심 강점 */}
      <div 
        id="strengths-section" 
        className="mb-6"
        style={{
          backgroundColor: '#EDFDF5',
          borderRadius: '16px',
          padding: '16px',
          marginLeft: '20px',
          marginRight: '20px'
        }}
      >
        <h3 id="strengths-title" className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span id="strengths-icon" className="text-green-500">🏆</span> 핵심 강점
        </h3>
        <div id="strengths-grid" className="grid grid-cols-2 gap-2">
          {personalityStrengths.map((strength, index) => (
            <div key={`strength-${index}`} id={`strength-${index + 1}`} className="bg-white rounded-lg px-3 py-3 flex items-center gap-2">
              <span id={`strength-${index + 1}-icon`}>{KEYWORD_EMOJIS[strength] || '💪'}</span>
              <span id={`strength-${index + 1}-text`} className="text-sm font-medium text-black">{strength}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 나의 약점 */}
      <div 
        id="weaknesses-section" 
        className="mb-6"
        style={{
          backgroundColor: '#FEF3F7',
          borderRadius: '16px',
          padding: '16px',
          marginLeft: '20px',
          marginRight: '20px'
        }}
      >
        <h3 id="weaknesses-title" className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span id="weaknesses-icon" className="text-red-500">❓</span> 나의 약점
        </h3>
        <div id="weaknesses-grid" className="grid grid-cols-2 gap-2">
          {personalityWeaknesses.map((weakness, index) => (
            <div key={`weakness-${index}`} id={`weakness-${index + 1}`} className="bg-white rounded-lg px-3 py-3 flex items-center gap-2">
              <span id={`weakness-${index + 1}-icon`}>{KEYWORD_EMOJIS[weakness] || '⚠️'}</span>
              <span id={`weakness-${index + 1}-text`} className="text-sm font-medium text-black">{weakness}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 당신의 종합적 PM력 분석 */}
      <div 
        id="comprehensive-analysis-section" 
        className="mb-6"
        style={{
          backgroundColor: '#F3E8FF',
          borderRadius: '16px',
          padding: '16px',
          marginLeft: '20px',
          marginRight: '20px'
        }}
      >
        <h3 id="comprehensive-analysis-title" className="text-lg font-bold text-gray-800 mb-3">
          당신의 종합적 PM력 분석
        </h3>
        
        {/* 나의 타고난 기질 */}
        <div id="innate-temperament" className="bg-purple-100 rounded-lg py-3 pr-4">
          <div id="innate-temperament-label" className="text-sm font-bold mb-1" style={{ color: '#6B21A8' }}>나의 타고난 기질</div>
          <div id="innate-temperament-value" className="text-sm font-bold text-gray-600">{elementAnalysis.elementCharacter}</div>
        </div>

        {/* 나의 PM 유형 */}
        <div id="pm-type" className="bg-purple-100 rounded-lg py-3 pr-4">
          <div id="pm-type-label" className="text-sm font-bold mb-1" style={{ color: '#6B21A8' }}>나의 PM 유형</div>
          <div id="pm-type-value" className="text-sm font-bold text-gray-600">
            {matchedPersonalityType 
              ? PM_PERSONALITY_DATA[matchedPersonalityType as keyof typeof PM_PERSONALITY_DATA]?.description || primaryPersonality.emoji + ' ' + primaryPersonality.name
              : primaryPersonality.emoji + ' ' + primaryPersonality.name
            }
          </div>
        </div>

        {/* 종합 풀이 */}
        <div id="comprehensive-interpretation" className="bg-purple-100 rounded-lg py-3 pr-4">
          <div id="comprehensive-interpretation-header" className="text-sm font-bold mb-1 flex items-center gap-2" style={{ color: '#6B21A8' }}>
            <span id="comprehensive-interpretation-icon">ℹ️</span> 종합 풀이
            <InfoTooltip 
              tooltip="AI를 이용해 기질과 유형을 분석한 풀이입니다."
              label="종합 풀이란?"
              colorClass="text-purple-600"
              placement="top"
            />
          </div>
          <div id="comprehensive-interpretation-content" className="text-sm font-bold text-gray-600">
            <span id="ai-interpretation-text">{comprehensiveAnalysisText || '분석 중입니다...'}</span>
          </div>
        </div>
      </div>

      {/* 성향 분석 기반 커리큘럼 */}
      <div id="curriculum-section" className="px-4 mb-6">
        <h3 id="curriculum-title" className="text-lg font-bold text-gray-800 mb-3">
          성향 분석 기반 커리큘럼
        </h3>
        
        {/* 강점 발휘 커리큘럼 */}
        <div id="strength-curriculum" className="bg-green-100 border border-green-300 rounded-lg px-4 py-3 mb-3">
          <div id="strength-curriculum-label" className="text-base font-bold mb-2" style={{ color: '#166534' }}>강점 발휘 커리큘럼 분야</div>
          <div id="strength-curriculum-name" className="text-sm font-semibold" style={{ color: '#166534' }}>
            {strengthCurriculum?.title }
          </div>
          <span id="strength-curriculum-list" className="text-xs text-gray-600 block mt-2">
            {strengthCurriculum?.description || 'Agile 개발 프로세스 실무, 요구사항 정의와 실행, 리더십과 실행력 조화'}
          </span>
        </div>

        {/* 약점 보완 커리큘럼 */}
        <div id="weakness-curriculum" className="bg-red-100 border border-red-300 rounded-lg px-4 py-3 mb-3">
          <div id="weakness-curriculum-label" className="text-base font-bold mb-2" style={{ color: '#E62023' }}>약점 보완 커리큘럼 분야</div>
          <div id="weakness-curriculum-name" className="text-sm font-semibold" style={{ color: '#E62023' }}>
            {weaknessCurriculum?.title || '디지털 프로덕트 이해 / Edu + Tech'}
          </div>
          <span id="weakness-curriculum-list" className="text-xs text-gray-600 block mt-2">
            {weaknessCurriculum?.description || '프로덕트 컨셉과 서비스 관리, 장기 전략 수립, 고객 문제 발견과 기회 창출'}
          </span>
        </div>
      </div>

      {/* 당신의 추천 유형 */}
      <div id="recommended-types-section" className="px-4 mb-6">
        <h3 id="recommended-types-title" className="text-lg font-bold text-gray-800 mb-3">
          당신의 추천 유형
        </h3>
        
        <div id="recommended-types-list" className="space-y-3 bg-blue-50 border border-blue-200 rounded-lg p-2">
          <div 
            id="recommended-type-1" 
            className="rounded-lg p-2"
            style={{ backgroundColor: '#DBEAFE' }}
          >
            <div id="recommended-type-1-name" className="text-sm font-bold mb-1" style={{ color: '#1E40AF' }}>운영 PM</div>
            <div id="recommended-type-1-description" className="text-xs text-gray-600">안정적 운영을 위한 프로세스 관리형 PM</div>
          </div>
          <div 
            id="recommended-type-2" 
            className="rounded-lg p-2"
            style={{ backgroundColor: '#DBEAFE' }}
          >
            <div id="recommended-type-2-name" className="text-sm font-bold mb-1" style={{ color: '#1E40AF' }}>성장형 PM</div>
            <div id="recommended-type-2-description" className="text-xs text-gray-600">사용자 증가와 전환율 책임의 성장 중심 PM</div>
          </div>
          <div 
            id="recommended-type-3" 
            className="rounded-lg p-2"
            style={{ backgroundColor: '#DBEAFE' }}
          >
            <div id="recommended-type-3-name" className="text-sm font-bold mb-1" style={{ color: '#1E40AF' }}>제품 전략형 PM</div>
            <div id="recommended-type-3-description" className="text-xs text-gray-600">비전과 로드맵을 수립하는 전략형 PM</div>
          </div>
        </div>
      </div>



      {/* 하단 버튼들 */}
      <div id="bottom-buttons" className="px-4 space-y-3">
        <button 
          id="bootcamp-view-btn"
          onClick={onOpenChat}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-4 px-4 rounded-lg hover:scale-[1.02] hover:shadow-lg transition-all duration-200"
        >
          AI 챗봇으로 이동
        </button>

      </div>
    </div>
  );
}

