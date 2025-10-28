/**
 * 채팅 관련 헬퍼 함수들
 */

/**
 * 욕설 필터링 패턴들
 */
export const PROFANITY_PATTERNS: RegExp[] = [
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
  /(시발|씨발|씹|병신|좆|존나|개새끼|꺼져|병1신|ㅅㅂ|ㅈㄴ|ㅄ|개새|개같|개자식)/i,
];

/**
 * 텍스트에 욕설이 포함되어 있는지 확인
 */
export function containsProfanity(text: string): boolean {
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
