/**
 * 채팅 관련 헬퍼 함수들
 */

/**
 * 욕설 필터링 패턴들
 */
export const PROFANITY_PATTERNS: RegExp[] = [
  // 영어 욕설
  /fuck/i,
  /shit/i,
  /bitch/i,
  /asshole/i,
  /bastard/i,
  /dick/i,
  /cunt/i,
  /motherfucker/i,
  /fucker/i,
  /retard/i,
  
  // 한국어 욕설 - 기본형
  /(시발|씨발|씹|병신|좆|존나|개새끼|꺼져|병1신|ㅅㅂ|ㅈㄴ|ㅄ|개새|개같|개자식)/i,
  
  // 병신 변형들
  /(븅신|뵹신|병싄|병씐|ㅂㅅ|ㅄㅅ|ㅂㅇㅅ|비융신|븨융신|비융씐|븨융씐|비융새끼|븨융새끼|병시나|병시낭|병시니)/i,
  
  // 시발 변형들 (시발점 제외)
  /(^^ㅣ발|씝빨|시바|씨바|ㅅㅣ발|ㅆㅣ발|ㅅㅣㅂㅏㄹ)/i,
  
  // 년, 놈 관련
  /(년|놈|ㅇㅕㄴ|ㄴㅗㅁ)/i,
  
  // 새끼 관련
  /(새기|^ㅐ끼|ㅅㅐ끼|ㅅㅐㄲㅣ|새ㅋㅣ)/i,
  
  // 배설물 관련
  /(똥|방구|오줌|설사|뿡|뿌직|빠직|ㅃㅇ|ㅃㅜㅈㅣㄱ|ㅃㅏㅈㅣㄱ)/i,
  
  // 기타 변형들
  /(꺼져|꺼ㅈㅓ|ㄲㅓㅈㅓ)/i,
  /(미친|미ㅊㅣㄴ|ㅁㅣㅊㅣㄴ)/i,
  
  // 애미, 애비 관련
  /(애미|애비|ㅇㅐㅁㅣ|ㅇㅐㅂㅣ|애미야|애비야)/i,
  
  // 느금마 관련
  /(느금마|느금|느그엄마|느그어머니|느그|ㄴㅡㄱㅡㅁㅏ|ㄴㅡㄱㅡㅁ|ㄴㅡㄱㅡ)/i,
];

/**
 * 정상적인 단어들 (욕설로 오인될 수 있는 단어들)
 */
const EXCEPTION_WORDS = [
  '시발점', '시발점이', '시발점을', '시발점에', '시발점으로',
  '새기다', '새기는', '새겨', '새긴', '새김',
  '똥강아지', '똥개', '똥통', '똥차', '똥배',
  '방구석', '방구리', '방구지',
  '오줌소리', '오줌통', '오줌싸개',
  '설사약', '설사제', '설사중',
];

/**
 * 텍스트에 욕설이 포함되어 있는지 확인
 */
export function containsProfanity(text: string): boolean {
  // 먼저 예외 단어들을 확인
  const hasException = EXCEPTION_WORDS.some(word => text.includes(word));
  if (hasException) {
    // 예외 단어가 있으면 해당 부분을 제거하고 다시 검사
    let filteredText = text;
    EXCEPTION_WORDS.forEach(word => {
      filteredText = filteredText.replace(new RegExp(word, 'gi'), '');
    });
    return PROFANITY_PATTERNS.some((pattern) => pattern.test(filteredText));
  }
  
  return PROFANITY_PATTERNS.some((pattern) => pattern.test(text));
}

/**
 * 스크롤을 맨 아래로 이동
 */
export function scrollToBottom(element: HTMLElement | null): void {
  if (element) {
    element.scrollTop = element.scrollHeight;
  }
}

/**
 * 메시지 길이 검증 (최대 54자)
 */
export function validateMessageLength(text: string): boolean {
  return text.length <= 54;
}
