'use client';

import { useState } from 'react';
import { UserInfo, SajuResponse } from '@/types/saju';
import { DAY_STEM_ANALYSIS, ELEMENT_TRAITS, ELEMENT_ANALYSIS, convertHangulToHanja } from '@/types/sajuConstants';

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

  // 사주 정보를 콘솔에 출력
  console.log('=== 사주 정보 ===');
  console.log('사용자 정보:', userInfo);
  console.log('사주 데이터:', sajuData);
  
  if (sajuData.four_pillars) {
    console.log('사주팔자 정보:');
    console.log('- 시(時):', sajuData.four_pillars.hour);
    console.log('- 일(日):', sajuData.four_pillars.day);
    console.log('- 월(月):', sajuData.four_pillars.month);
    console.log('- 연(年):', sajuData.four_pillars.year);
    
    // 일주 정보 상세 출력
    console.log('=== 일주 정보 ===');
    console.log('일간(천간):', sajuData.four_pillars.day?.stem);
    console.log('일지(지지):', sajuData.four_pillars.day?.branch);
    console.log('일간 오행:', sajuData.four_pillars.day?.stem_element);
    console.log('일지 오행:', sajuData.four_pillars.day?.branch_element);
    console.log('일주 조합:', `${sajuData.four_pillars.day?.stem}${sajuData.four_pillars.day?.branch}`);
  }

  if (sajuData.traits) {
    console.log('오행 특성:', sajuData.traits);
  }

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

  // 오행별 분석 데이터 반환
  const getElementAnalysis = (element: string) => {
    return ELEMENT_ANALYSIS[element] || {
      elementName: '토(土)',
      elementEmoji: '⛰️',
      analysis: '안정·균형·운영의 에너지를 가진 당신은 실행력과 책임감이 뛰어납니다.',
      workStyle: '체계적 절차를 중시하는 환경에서 안정적인 성장을 추구합니다.',
      summary: '당신은 팀의 중심을 잡는 \'균형형 PM\'입니다.'
    };
  };

  // 일주 분석 데이터 반환
  const getDayStemAnalysis = (dayStem: string, dayBranch: string) => {
    const hangulDayStemKey = `${dayStem}${dayBranch}`;
    const hanjaDayStemKey = convertHangulToHanja(hangulDayStemKey);
    
    console.log('=== 일주 분석 디버깅 ===');
    console.log('일간:', dayStem);
    console.log('일지:', dayBranch);
    console.log('한글 일주 키:', hangulDayStemKey);
    console.log('한자 일주 키:', hanjaDayStemKey);
    console.log('일주 분석 데이터 존재 여부:', !!DAY_STEM_ANALYSIS[hanjaDayStemKey]);
    console.log('사용 가능한 일주 키들:', Object.keys(DAY_STEM_ANALYSIS).slice(0, 10)); // 처음 10개만 표시
    
    return DAY_STEM_ANALYSIS[hanjaDayStemKey] || '일간 분석을 통해 당신의 핵심 성향을 파악할 수 있습니다.';
  };

  // 사용자 분석 데이터
  const userAnalysis = getElementAnalysis(getMainElement());
  const dayStemAnalysis = getDayStemAnalysis(
    sajuData.four_pillars?.day?.stem || '기', 
    sajuData.four_pillars?.day?.branch || '유'
  );

  return (
    <div className="bg-white min-h-screen">
      {/* 네비게이션 버튼들 */}
      <div id="navigation-buttons" className="p-4">
        <button 
          id="back-to-chatbot-button"
          onClick={onBackToChatbot}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors"
        >
          <span>←</span>
          챗봇으로 돌아가기
        </button>
      </div>

      {/* 메인 콘텐츠 카드 */}
      <div id="main-content-card" className="mx-4 bg-white rounded-2xl shadow-lg p-6 mb-4">
        
        {/* 일러스트레이션 섹션 */}
        <div id="illustration-section" className="text-center mb-6">
          <div className="relative inline-block">
            {/* 귀여운 북극곰 일러스트 */}
            <div className="w-32 h-32 mx-auto relative">
              {/* 북극곰 몸체 */}
              <div className="absolute inset-0 bg-white rounded-full border-4 border-gray-300"></div>
              {/* 귀 */}
              <div className="absolute top-2 left-2 w-6 h-6 bg-white rounded-full border-2 border-gray-300"></div>
              <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full border-2 border-gray-300"></div>
              {/* 눈 */}
              <div className="absolute top-8 left-6 w-2 h-2 bg-black rounded-full"></div>
              <div className="absolute top-8 right-6 w-2 h-2 bg-black rounded-full"></div>
              {/* 코 */}
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-black rounded-full"></div>
              {/* 볼 홍조 */}
              <div className="absolute top-10 left-4 w-3 h-3 bg-pink-300 rounded-full opacity-70"></div>
              <div className="absolute top-10 right-4 w-3 h-3 bg-pink-300 rounded-full opacity-70"></div>
              {/* 웨이브 손 */}
              <div className="absolute top-16 right-0 w-6 h-6 bg-white rounded-full border-2 border-gray-300 transform rotate-12"></div>
            </div>
            
            {/* 물방울 아이콘들 */}
            <div className="absolute top-4 left-8 w-4 h-4 bg-blue-200 rounded-full opacity-60"></div>
            <div className="absolute top-8 right-8 w-3 h-3 bg-blue-200 rounded-full opacity-60"></div>
            <div className="absolute top-12 left-4 w-2 h-2 bg-blue-200 rounded-full opacity-60"></div>
            <div className="absolute top-16 right-4 w-3 h-3 bg-blue-200 rounded-full opacity-60"></div>
            
            {/* 배경 그라데이션 */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-pink-100 rounded-full opacity-30 -z-10"></div>
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
            <div id="char-trait-1" className="bg-pink-50 border border-pink-200 rounded-lg p-3 text-center" style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingTop: '6px', paddingBottom: '6px'}}>
              <div className="text-2xl mb-1">{userTraits[0]?.emoji || '💜'}</div>
              <div className="text-[11px] font-medium text-gray-700">{userTraits[0]?.trait || '안정성'}</div>
            </div>
            <div id="char-trait-2" className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center" style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingTop: '6px', paddingBottom: '6px'}}>
              <div className="text-2xl mb-1">{userTraits[1]?.emoji || '💬'}</div>
              <div className="text-[11px] font-medium text-gray-700">{userTraits[1]?.trait || '신중함'}</div>
            </div>
            <div id="char-trait-3" className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center" style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingTop: '6px', paddingBottom: '6px'}}>
              <div className="text-2xl mb-1">{userTraits[2]?.emoji || '📚'}</div>
              <div className="text-[11px] font-medium text-gray-700">{userTraits[2]?.trait || '책임감'}</div>
            </div>
            
            {/* 두 번째 행 */}
            <div id="char-trait-4" className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center" style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingTop: '6px', paddingBottom: '6px'}}>
              <div className="text-2xl mb-1">{userTraits[3]?.emoji || '⚖️'}</div>
              <div className="text-[11px] font-medium text-gray-700">{userTraits[3]?.trait || '균형감각'}</div>
            </div>
            <div id="char-trait-5" className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center" style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingTop: '6px', paddingBottom: '6px'}}>
              <div className="text-2xl mb-1">{userTraits[4]?.emoji || '💡'}</div>
              <div className="text-[11px] font-medium text-gray-700">{userTraits[4]?.trait || '관리능력'}</div>
            </div>
            <div id="char-trait-6" className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center" style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingTop: '6px', paddingBottom: '6px'}}>
              <div className="text-2xl mb-1">{userTraits[5]?.emoji || '👥'}</div>
              <div className="text-[11px] font-medium text-gray-700">{userTraits[5]?.trait || '체계적관리'}</div>
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
              <span className="bg-purple-200 text-purple-800 text-xs px-2 py-1 rounded">오행</span>
              <span className="text-sm font-medium text-gray-700">{userAnalysis.elementName} 분석</span>
            </div>
            <p className="text-sm text-gray-600">
              {userAnalysis.analysis}
            </p>
          </div>
          
          <div id="personality-analysis-2" className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-purple-200 text-purple-800 text-xs px-2 py-1 rounded">일주</span>
              <span className="text-sm font-medium text-gray-700">일주 분석</span>
            </div>
            <p className="text-sm text-gray-600">
              {dayStemAnalysis}
            </p>
          </div>
          
          <div id="personality-analysis-3" className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-purple-200 text-purple-800 text-xs px-2 py-1 rounded">업무스타일</span>
              <span className="text-sm font-medium text-gray-700">잘 맞는 업무 스타일</span>
            </div>
            <p className="text-sm text-gray-600">
              {userAnalysis.workStyle}
            </p>
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
