/**
 * 사주 관련 헬퍼 함수들
 */

/**
 * 오행을 한국어로 변환
 */
export function getFiveElementKorean(element: string): string {
  const elementMap: { [key: string]: string } = {
    '목': '나무',
    '화': '불',
    '토': '흙',
    '금': '금',
    '수': '물'
  };
  return elementMap[element] || element;
}

/**
 * 특성에 따른 아이콘 반환
 */
export function getTraitIcon(trait: string): string {
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

/**
 * 시간대별 오행 계산
 */
export function getHourElement(hour: string): string {
  const stem = hour[0];
  const elementMap: { [key: string]: string } = {
    '갑': '목', '을': '목',
    '병': '화', '정': '화',
    '무': '토', '기': '토',
    '경': '금', '신': '금',
    '임': '수', '계': '수'
  };
  return elementMap[stem] || '';
}
