import { QUESTIONS, TYPE_NAMES, TYPE_EMOJIS } from '@/types/questionnaireConstants';

export interface QuestionnaireStats {
  [key: number]: number;
}

export interface PersonalityMatch {
  type: number;
  name: string;
  emoji: string;
  score: number;
  percentage: number;
}

/**
 * 문항 테스트 결과를 분석하여 각 성격 유형별 점수를 계산
 */
export function analyzeQuestionnaireResults(results: number[]): PersonalityMatch[] {
  const stats: QuestionnaireStats = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
  
  // 각 문항의 선택지에서 선택된 타입을 카운트
  results.forEach((answer) => {
    stats[answer] = (stats[answer] || 0) + 1;
  });
  
  // 총 문항 수
  const totalQuestions = QUESTIONS.length;
  
  // 각 성격 유형별 점수와 비율 계산
  const matches: PersonalityMatch[] = Object.keys(stats).map((key) => {
    const type = parseInt(key);
    const score = stats[type];
    const percentage = Math.round((score / totalQuestions) * 100);
    
    return {
      type,
      name: TYPE_NAMES[type],
      emoji: TYPE_EMOJIS[type],
      score,
      percentage
    };
  });
  
  // 점수 순으로 정렬
  return matches.sort((a, b) => b.score - a.score);
}

/**
 * 가장 높은 점수의 성격 유형 반환
 */
export function getPrimaryPersonalityType(matches: PersonalityMatch[]): PersonalityMatch {
  return matches[0];
}

/**
 * 사주 기질과 문항 테스트 성격 유형이 얼마나 일치하는지 계산
 */
export function calculateCompatibility(
  sajuElement: string,
  personalityType: number
): { compatibility: number; description: string } {
  // 오행 매핑
  const elementMap: { [key: string]: number[] } = {
    '목': [0, 4],  // 리더형, 공감형
    '화': [1, 4],  // 실행형, 공감형
    '토': [2],     // 안정형
    '금': [3],     // 분석형
    '수': [4, 0]   // 공감형, 리더형
  };
  
  const compatibleTypes = elementMap[sajuElement] || [];
  const isCompatible = compatibleTypes.includes(personalityType);
  
  if (isCompatible) {
    return {
      compatibility: 85,
      description: '당신의 선천적 기질과 후천적 성격이 잘 어울려요!'
    };
  } else {
    return {
      compatibility: 60,
      description: '다소 다른 방향이지만 함께하면 더 풍부한 시각을 가질 수 있어요.'
    };
  }
}

/**
 * 종합 분석 결과 생성
 */
export function generateComprehensiveAnalysis(
  sajuData: any,
  questionnaireResults: number[]
): {
  primaryPersonality: PersonalityMatch;
  allMatches: PersonalityMatch[];
  compatibility: { compatibility: number; description: string };
  recommendation: string;
} {
  const allMatches = analyzeQuestionnaireResults(questionnaireResults);
  const primaryPersonality = getPrimaryPersonalityType(allMatches);
  
  // 사주 일간 오행 가져오기
  const sajuElement = sajuData?.four_pillars?.day?.stem_element || '토';
  const compatibility = calculateCompatibility(sajuElement, primaryPersonality.type);
  
  // 추천 사항 생성
  const recommendation = generateRecommendation(primaryPersonality, sajuElement);
  
  return {
    primaryPersonality,
    allMatches,
    compatibility,
    recommendation
  };
}

/**
 * 개인별 추천 사항 생성
 */
function generateRecommendation(personality: PersonalityMatch, sajuElement: string): string {
  const recommendations: { [key: string]: string } = {
    '0': `${personality.emoji} ${personality.name} 성격의 당신은 큰 방향을 잡고 팀을 이끄는 데 강점이 있어요. 사주 기질(${sajuElement})과 결합하여 더욱 영향력 있는 PM이 될 거예요!`,
    '1': `${personality.emoji} ${personality.name} 성격의 당신은 빠른 실행과 피드백 루프에 강점이 있어요. 사주 기질(${sajuElement})과 함께하면 실행력 MAX인 PM이에요!`,
    '2': `${personality.emoji} ${personality.name} 성격의 당신은 체계적인 관리와 안정성에 강점이 있어요. 사주 기질(${sajuElement})과 결합하여 팀의 중심을 잡는 PM이 될 거예요!`,
    '3': `${personality.emoji} ${personality.name} 성격의 당신은 데이터와 근거 기반 판단에 강점이 있어요. 사주 기질(${sajuElement})과 함께하면 분석력 있는 PM이에요!`,
    '4': `${personality.emoji} ${personality.name} 성격의 당신은 공감과 소통에 강점이 있어요. 사주 기질(${sajuElement})과 결합하여 팀의 마음을 읽는 감각형 PM이에요!`
  };
  
  return recommendations[personality.type.toString()] || '당신만의 특별한 PM 스타일을 만들어가세요!';
}

