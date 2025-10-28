'use client';

import { useState } from 'react';
import { UserInfo, SajuResponse } from '@/types/saju';
import { DAY_STEM_ANALYSIS, ELEMENT_TRAITS, ELEMENT_ANALYSIS, DAY_STEM_DETAILED_ANALYSIS, convertHangulToHanja } from '@/types/sajuConstants';

interface PMResultPageProps {
  userInfo: UserInfo;
  sajuData: SajuResponse;
  onBackToChatbot: () => void;
  onDiagnoseAgain: () => void;
  onQuestionnaireTest: () => void;
  onPMBootcampApply: () => void;
}

export default function PMResultPage({ 
  userInfo, 
  sajuData, 
  onBackToChatbot, 
  onDiagnoseAgain, 
  onQuestionnaireTest, 
  onPMBootcampApply 
}: PMResultPageProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showDayStemText, setShowDayStemText] = useState(false);

  // 오행에 따른 배경색 반환 (강도 절반)
  const getElementColor = (element: string): string => {
    const colorMap: { [key: string]: string } = {
      '목': 'bg-green-100',      // 나무 - 연한 초록색
      '화': 'bg-red-100',        // 불 - 연한 빨간색
      '토': 'bg-orange-100',     // 흙 - 연한 주황색
      '금': 'bg-yellow-100',     // 금 - 연한 노란색
      '수': 'bg-blue-100'        // 물 - 연한 파란색
    };
    return colorMap[element] || 'bg-gray-100';
  };

  // 오행에 따른 테두리색 반환 (기존 진한 색상)
  const getElementBorderColor = (element: string): string => {
    const borderColorMap: { [key: string]: string } = {
      '목': 'border-green-300',      // 나무 - 진한 초록색 테두리
      '화': 'border-red-400',        // 불 - 진한 빨간색 테두리
      '토': 'border-orange-300',     // 흙 - 진한 주황색 테두리
      '금': 'border-yellow-300',     // 금 - 진한 노란색 테두리
      '수': 'border-blue-300'        // 물 - 진한 파란색 테두리
    };
    return borderColorMap[element] || 'border-gray-300';
  };

  // 오행 한자 반환
  const getElementHanja = (element: string): string => {
    const hanjaMap: { [key: string]: string } = {
      '목': '木',
      '화': '火',
      '토': '土',
      '금': '金',
      '수': '水'
    };
    return hanjaMap[element] || element;
  };

  // 오행에 따른 폰트 색상 반환 (테두리 색상과 동일)
  const getElementTextColor = (element: string): string => {
    const textColorMap: { [key: string]: string } = {
      '목': 'text-green-600',      // 나무 - 초록색 폰트
      '화': 'text-red-700',        // 불 - 빨간색 폰트
      '토': 'text-orange-600',     // 흙 - 주황색 폰트
      '금': 'text-yellow-600',     // 금 - 노란색 폰트
      '수': 'text-blue-600'        // 물 - 파란색 폰트
    };
    return textColorMap[element] || 'text-gray-600';
  };

  // 오행별 핵심 역량 반환
  const getElementTraits = (element: string): { emoji: string; trait: string }[] => {
    return ELEMENT_TRAITS[element] || [
      { emoji: '💜', trait: '안정성' },
      { emoji: '💬', trait: '신중함' },
      { emoji: '📚', trait: '책임감' },
      { emoji: '⚖️', trait: '균형감각' },
      { emoji: '💡', trait: '관리 능력' },
      { emoji: '👥', trait: '체계적 관리' }
    ];
  };

  // 사용자의 주요 오행 결정 (일간 기준)
  const getMainElement = (): string => {
    return sajuData.four_pillars?.day?.stem_element || '토';
  };

  // 사용자의 주요 성향 6개 가져오기
  const userTraits = getElementTraits(getMainElement());

  // 오행별 이미지 폴더명 매핑
  const getElementImageFolder = (element: string): string => {
    const folderMap: { [key: string]: string } = {
      '목': 'tree',
      '화': 'fire',
      '토': 'earth',
      '금': 'metal',
      '수': 'water'
    };
    return folderMap[element] || 'earth';
  };

  // 오행별 일러스트 이미지 매핑
  const getElementIllustration = (element: string): string => {
    const illustrationMap: { [key: string]: string } = {
      '수': 'water',
      '금': 'gold',
      '토': 'earth',
      '화': 'fire',
      '목': 'tree'
    };
    return illustrationMap[element] || 'earth';
  };

  const imageFolder = getElementImageFolder(getMainElement());
  const elementIllustration = getElementIllustration(getMainElement());

  // 오행별 분석 데이터 반환
  const getElementAnalysis = (element: string) => {
    return ELEMENT_ANALYSIS[element] || {
      elementName: '토(土)',
      elementEmoji: '⛰️',
      elementCharacter: '⛰️ 토(土): 안정·균형·운영의 에너지',
      analysis: '안정·균형·운영의 에너지를 가진 당신은 실행력과 책임감이 뛰어납니다.',
      workStyle: [
        '체계적 절차를 중시하는 환경에서 안정적인 성장을 추구합니다.'
      ],
      summary: '당신은 팀의 중심을 잡는 \'균형형 PM\'입니다.'
    };
  };

  // 일주 분석 데이터 반환
  const getDayStemAnalysis = (dayStem: string, dayBranch: string) => {
    const detailedAnalysis = DAY_STEM_DETAILED_ANALYSIS[dayStem] || '';
    
    return detailedAnalysis || '일간 분석을 통해 당신의 핵심 성향을 파악할 수 있습니다.';
  };

  // 사용자 분석 데이터
  const userAnalysis = getElementAnalysis(getMainElement());
  const dayStemAnalysis = getDayStemAnalysis(
    sajuData.four_pillars?.day?.stem || '기', 
    sajuData.four_pillars?.day?.branch || '유'
  );

  return (
    <div className="bg-white min-h-screen">
      {/* 메인 콘텐츠 카드 */}
      <div id="main-content-card" className="mx-4 bg-white rounded-2xl shadow-lg p-6 mb-4">
        
        {/* 일러스트레이션 섹션 */}
        <div id="illustration-section" className="text-center mb-6">
          <div className="relative inline-block">
            {/* 오행 일러스트 */}
            <img 
              src={`/images/saju/${elementIllustration}.png`} 
              alt={`${getMainElement()} 오행 일러스트`}
              className="h-[300px] w-auto mx-auto object-contain"
            />
          </div>
        </div>

        {/* 사주 분석 제목 */}
        <div id="saju-analysis-title" className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            당신의 사주에 따른 핵심 직무역량은?
          </h2>
        </div>

        {/* 사주 그리드 */}
        <div id="saju-grid" className="bg-[#FDFAFF] border border-[#F3E8FF] rounded-[32px] p-6 mb-8">
          {/* 헤더 라벨들 */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="text-center text-[#6B7280] font-medium">시(時)</div>
            <div className="text-center text-[#6B7280] font-medium">일(日)</div>
            <div className="text-center text-[#6B7280] font-medium">월(月)</div>
            <div className="text-center text-[#6B7280] font-medium">연(年)</div>
          </div>
          
          {/* 사주 블록들 */}
          <div className="grid grid-cols-4 gap-2">
            {/* 시(時) - Hour */}
            <div id="saju-hour-column" className="text-center">
              <div id="saju-hour-top" className={`${getElementColor(sajuData.four_pillars?.hour?.stem_element || '토')} ${getElementBorderColor(sajuData.four_pillars?.hour?.stem_element || '토')} border-2 ${getElementTextColor(sajuData.four_pillars?.hour?.stem_element || '토')} p-2 rounded-lg mb-1`}>
                <div className="font-semibold">{sajuData.four_pillars?.hour?.stem || '시간모름'}{sajuData.four_pillars?.hour?.stem ? `(${getElementHanja(sajuData.four_pillars?.hour?.stem_element || '토')})` : ''}</div>
                <div className="text-xs">{sajuData.four_pillars?.hour?.ten_god || 'X'}</div>
              </div>
              <div id="saju-hour-bottom" className={`${getElementColor(sajuData.four_pillars?.hour?.branch_element || '토')} ${getElementBorderColor(sajuData.four_pillars?.hour?.branch_element || '토')} border-2 ${getElementTextColor(sajuData.four_pillars?.hour?.branch_element || '토')} p-2 rounded-lg`}>
                <div className="font-semibold">{sajuData.four_pillars?.hour?.branch || '시간모름'}{sajuData.four_pillars?.hour?.branch ? `(${getElementHanja(sajuData.four_pillars?.hour?.branch_element || '토')})` : ''}</div>
                <div className="text-xs">{sajuData.four_pillars?.hour?.branch_ten_god || 'X'}</div>
              </div>
            </div>

            {/* 일(日) - Day */}
            <div id="saju-day-column" className="text-center">
              <div id="saju-day-top" className={`${getElementColor(sajuData.four_pillars?.day?.stem_element || '토')} ${getElementBorderColor(sajuData.four_pillars?.day?.stem_element || '토')} border-2 ${getElementTextColor(sajuData.four_pillars?.day?.stem_element || '토')} p-2 rounded-lg mb-1`}>
                <div className="font-semibold">{sajuData.four_pillars?.day?.stem || '기'}{sajuData.four_pillars?.day?.stem ? `(${getElementHanja(sajuData.four_pillars?.day?.stem_element || '토')})` : ''}</div>
                <div className="text-xs">{sajuData.four_pillars?.day?.ten_god || '비견'}</div>
              </div>
              <div id="saju-day-bottom" className={`${getElementColor(sajuData.four_pillars?.day?.branch_element || '토')} ${getElementBorderColor(sajuData.four_pillars?.day?.branch_element || '토')} border-2 ${getElementTextColor(sajuData.four_pillars?.day?.branch_element || '토')} p-2 rounded-lg`}>
                <div className="font-semibold">{sajuData.four_pillars?.day?.branch || '유'}{sajuData.four_pillars?.day?.branch ? `(${getElementHanja(sajuData.four_pillars?.day?.branch_element || '토')})` : ''}</div>
                <div className="text-xs">{sajuData.four_pillars?.day?.branch_ten_god || '식신'}</div>
              </div>
            </div>

            {/* 월(月) - Month */}
            <div id="saju-month-column" className="text-center">
              <div id="saju-month-top" className={`${getElementColor(sajuData.four_pillars?.month?.stem_element || '토')} ${getElementBorderColor(sajuData.four_pillars?.month?.stem_element || '토')} border-2 ${getElementTextColor(sajuData.four_pillars?.month?.stem_element || '토')} p-2 rounded-lg mb-1`}>
                <div className="font-semibold">{sajuData.four_pillars?.month?.stem || '을'}{sajuData.four_pillars?.month?.stem ? `(${getElementHanja(sajuData.four_pillars?.month?.stem_element || '토')})` : ''}</div>
                <div className="text-xs">{sajuData.four_pillars?.month?.ten_god || '편관'}</div>
              </div>
              <div id="saju-month-bottom" className={`${getElementColor(sajuData.four_pillars?.month?.branch_element || '토')} ${getElementBorderColor(sajuData.four_pillars?.month?.branch_element || '토')} border-2 ${getElementTextColor(sajuData.four_pillars?.month?.branch_element || '토')} p-2 rounded-lg`}>
                <div className="font-semibold">{sajuData.four_pillars?.month?.branch || '사'}{sajuData.four_pillars?.month?.branch ? `(${getElementHanja(sajuData.four_pillars?.month?.branch_element || '토')})` : ''}</div>
                <div className="text-xs">{sajuData.four_pillars?.month?.branch_ten_god || '정인'}</div>
              </div>
            </div>

            {/* 연(年) - Year */}
            <div id="saju-year-column" className="text-center">
              <div id="saju-year-top" className={`${getElementColor(sajuData.four_pillars?.year?.stem_element || '토')} ${getElementBorderColor(sajuData.four_pillars?.year?.stem_element || '토')} border-2 ${getElementTextColor(sajuData.four_pillars?.year?.stem_element || '토')} p-2 rounded-lg mb-1`}>
                <div className="font-semibold">{sajuData.four_pillars?.year?.stem || '정'}{sajuData.four_pillars?.year?.stem ? `(${getElementHanja(sajuData.four_pillars?.year?.stem_element || '토')})` : ''}</div>
                <div className="text-xs">{sajuData.four_pillars?.year?.ten_god || '편인'}</div>
              </div>
              <div id="saju-year-bottom" className={`${getElementColor(sajuData.four_pillars?.year?.branch_element || '토')} ${getElementBorderColor(sajuData.four_pillars?.year?.branch_element || '토')} border-2 ${getElementTextColor(sajuData.four_pillars?.year?.branch_element || '토')} p-2 rounded-lg`}>
                <div className="font-semibold">{sajuData.four_pillars?.year?.branch || '축'}{sajuData.four_pillars?.year?.branch ? `(${getElementHanja(sajuData.four_pillars?.year?.branch_element || '토')})` : ''}</div>
                <div className="text-xs">{sajuData.four_pillars?.year?.branch_ten_god || '비견'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 주요 성향 섹션 */}
        <div id="main-characteristics-section" className="mb-6">
          <h3 id="main-characteristics-heading" className="text-lg font-bold text-gray-800 mb-4">
            주요 성향
          </h3>
          <div id='main-characteristics-grid' className="grid grid-cols-3 gap-3">
            {/* 첫 번째 행 */}
            <div id="char-trait-1">
              <img src={`/images/${imageFolder}/성향1-1.png`} alt={userTraits[0]?.trait || '특성'} className="w-full h-auto rounded-lg" />
            </div>
            <div id="char-trait-2">
              <img src={`/images/${imageFolder}/성향1-2.png`} alt={userTraits[1]?.trait || '특성'} className="w-full h-auto rounded-lg" />
            </div>
            <div id="char-trait-3">
              <img src={`/images/${imageFolder}/성향1-3.png`} alt={userTraits[2]?.trait || '특성'} className="w-full h-auto rounded-lg" />
            </div>
            
            {/* 두 번째 행 */}
            <div id="char-trait-4">
              <img src={`/images/${imageFolder}/성향1-4.png`} alt={userTraits[3]?.trait || '특성'} className="w-full h-auto rounded-lg" />
            </div>
            <div id="char-trait-5">
              <img src={`/images/${imageFolder}/성향1-5.png`} alt={userTraits[4]?.trait || '특성'} className="w-full h-auto rounded-lg" />
            </div>
            <div id="char-trait-6">
              <img src={`/images/${imageFolder}/성향1-6.png`} alt={userTraits[5]?.trait || '특성'} className="w-full h-auto rounded-lg" />
            </div>
          </div>
        </div>

        {/* 성격 유형 섹션 */}
        <div id="personality-type-section" className="mb-6">
          <h3 id="personality-type-heading" className="text-lg font-bold text-gray-800 mb-4">
            당신의 성격 유형
          </h3>
          
          {/* 오행 분석 블록들 */}
          <div id="personality-analysis-1" className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-purple-200 text-purple-800 text-xs px-2 py-1 rounded">기질</span>
              <span className="text-sm font-medium text-gray-700">{userAnalysis.elementCharacter}</span>
            </div>
            <p className="text-sm text-gray-600">
              {userAnalysis.analysis}
            </p>
          </div>
          
          <div id="personality-analysis-2" className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-purple-200 text-purple-800 text-xs px-2 py-1 rounded">일간 분석</span>
              <button
                id="day-stem-analysis-tooltip-button"
                onMouseEnter={() => setShowDayStemText(true)}
                onMouseLeave={() => setShowDayStemText(false)}
                className="bg-white border border-gray-200 rounded-full shadow flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 transition-colors cursor-help"
              >
                <div className="w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  i
                </div>
                {showDayStemText ? (
                  <span className="text-purple-600 text-sm transition-all duration-300 overflow-hidden whitespace-nowrap max-w-[500px] opacity-100">
                    일간: '나' 자신을 나타내는 글자
                  </span>
                ) : (
                  <span className="text-purple-600 text-sm transition-all duration-300 opacity-100">
                    일간이란?
                  </span>
                )}
              </button>
              <span className="text-sm font-medium text-gray-700"></span>
            </div>
            <p id="day-stem-analysis-text" className="text-sm text-gray-600">
              {dayStemAnalysis}
            </p>
          </div>
          
          <div id="personality-analysis-3" className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-purple-200 text-purple-800 text-xs px-2 py-1 rounded">업무 유형</span>
              <span className="text-sm font-medium text-gray-700">잘 맞는 업무 스타일</span>
            </div>
            <div className="text-sm text-gray-600">
              {userAnalysis.workStyle.map((style, index) => (
                <p key={index} className={index > 0 ? 'mt-2' : ''}>
                  {style}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* 한줄 팁 섹션 */}
        <div 
          id="one-line-tip-section" 
          className="mb-6 p-3"
          style={{
            backgroundColor: 'var(--color-purple-50)',
            border: 'none',
            borderLeft: '8px solid var(--color-purple-200)',
            borderRadius: '0'
          }}
        >
          <h4 id="one-line-tip-heading" className="text-sm font-bold text-gray-800 mb-2">
            한줄 팁:
          </h4>
          <p id="one-line-tip-text" className="text-sm text-gray-600">
            {userAnalysis.summary}
          </p>
        </div>

        {/* 다시 진단하기 버튼 */}
        <div className="mb-6">
          <button 
            id="diagnose-again-button"
            onClick={onDiagnoseAgain}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors"
          >
            <span>←</span>
            다시 진단하기
          </button>
        </div>
      </div>

      {/* 하단 액션 버튼들 */}
      <div id="bottom-action-buttons" className="px-4 pb-6">
        <button 
          id="questionnaire-test-button"
          onClick={onQuestionnaireTest}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-4 px-4 rounded-lg flex items-center justify-center gap-2 mb-3 hover:scale-[1.02] hover:shadow-lg transition-all duration-200"
        >
          <span className="text-white">📚</span>
          문항 테스트
        </button>
        
        <button 
          id="pm-bootcamp-apply-button"
          onClick={onPMBootcampApply}
          className="w-full bg-gray-100 text-gray-700 font-semibold py-4 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
        >
          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">✓</span>
          </div>
          PM 부트캠프 신청하기
        </button>
      </div>
    </div>
  );
}
