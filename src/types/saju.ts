// 사주 관련 타입 정의

export interface UserInfo {
  birthDate: string; // YYYY-MM-DD 형식
  birthTime: string; // HH:MM 형식
  gender: '남' | '여';
  address: string; // 주소
}

export interface SajuRequest {
  birth_date: string;
  birth_time: string;
  gender: string;
  birth_place: string;
}

export interface SajuResponse {
  status: 'success' | 'error';
  birth_date?: string;
  gender?: string;
  birth_place?: string;
  five_element?: string;
  day_stem?: string;
  day_branch?: string;
  day_pillar?: string;
  four_pillars?: FourPillars;
  traits?: FiveElementTraits;
  error?: string;
}

export interface FourPillars {
  year: PillarData;
  month: PillarData;
  day: PillarData;
  hour: PillarData;
}

export interface PillarData {
  stem: string;           // 천간 (예: 기)
  branch: string;         // 지지 (예: 유)
  pillar: string;         // 기둥 (예: 기유)
  stem_hanja: string;     // 천간 한자 (예: 己)
  branch_hanja: string;   // 지지 한자 (예: 酉)
  ten_god: string;        // 천간 십성 (예: 비견)
  branch_ten_god?: string; // 지지 십성 (예: 식신)
  stem_element?: string;  // 천간 오행 (예: 토)
  branch_element?: string; // 지지 오행 (예: 금)
}

export interface FiveElementTraits {
  name: string;
  emoji: string;
  traits: string[];
  description: string;
  strengths: string;
  weaknesses: string;
}

export type FiveElement = '나무' | '불' | '흙' | '금' | '물';

export type Gender = '남' | '여';

