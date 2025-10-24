// 정확한 만세력 계산 알고리즘

export interface SajuResult {
  year: string;      // 년주 (예: 정축)
  month: string;      // 월주 (예: 을사)
  day: string;        // 일주 (예: 기유)
  hour: string;       // 시주 (예: 을해)
  dayStem: string;    // 일간 (예: 기)
  dayBranch: string; // 일지 (예: 유)
  fiveElement: string; // 오행 (예: 토)
  tenGod: string;     // 십신 (예: 비견)
}

// 십간 (天干) - 10개
const TEN_STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];

// 십이지 (地支) - 12개
const TWELVE_BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

// 오행 매핑
const FIVE_ELEMENTS = {
  '갑': '목', '을': '목',
  '병': '화', '정': '화',
  '무': '토', '기': '토',
  '경': '금', '신': '금',
  '임': '수', '계': '수'
};

// 십신 (十神) 계산
const TEN_GODS = {
  '갑': { '갑': '비견', '을': '겁재', '병': '식신', '정': '상관', '무': '편재', '기': '정재', '경': '편관', '신': '정관', '임': '편인', '계': '정인' },
  '을': { '갑': '겁재', '을': '비견', '병': '상관', '정': '식신', '무': '정재', '기': '편재', '경': '정관', '신': '편관', '임': '정인', '계': '편인' },
  '병': { '갑': '편인', '을': '정인', '병': '비견', '정': '겁재', '무': '식신', '기': '상관', '경': '편재', '신': '정재', '임': '편관', '계': '정관' },
  '정': { '갑': '정인', '을': '편인', '병': '겁재', '정': '비견', '무': '상관', '기': '식신', '경': '정재', '신': '편재', '임': '정관', '계': '편관' },
  '무': { '갑': '편관', '을': '정관', '병': '편재', '정': '정재', '무': '비견', '기': '겁재', '경': '식신', '신': '상관', '임': '편인', '계': '정인' },
  '기': { '갑': '정관', '을': '편관', '병': '정재', '정': '편재', '무': '겁재', '기': '비견', '경': '상관', '신': '식신', '임': '정인', '계': '편인' },
  '경': { '갑': '편재', '을': '정재', '병': '편관', '정': '정관', '무': '편인', '기': '정인', '경': '비견', '신': '겁재', '임': '식신', '계': '상관' },
  '신': { '갑': '정재', '을': '편재', '병': '정관', '정': '편관', '무': '정인', '기': '편인', '경': '겁재', '신': '비견', '임': '상관', '계': '식신' },
  '임': { '갑': '식신', '을': '상관', '병': '편인', '정': '정인', '무': '편관', '기': '정관', '경': '편재', '신': '정재', '임': '비견', '계': '겁재' },
  '계': { '갑': '상관', '을': '식신', '병': '정인', '정': '편인', '무': '정관', '기': '편관', '경': '정재', '신': '편재', '임': '겁재', '계': '비견' }
};

// 절기 데이터 (2024년 기준, 실제로는 더 정확한 계산 필요)
const SOLAR_TERMS = [
  { name: '입춘', month: 2, day: 4 },
  { name: '경칩', month: 3, day: 5 },
  { name: '청명', month: 4, day: 5 },
  { name: '입하', month: 5, day: 5 },
  { name: '망종', month: 6, day: 6 },
  { name: '소서', month: 7, day: 7 },
  { name: '입추', month: 8, day: 8 },
  { name: '백로', month: 9, day: 8 },
  { name: '한로', month: 10, day: 8 },
  { name: '입동', month: 11, day: 7 },
  { name: '대설', month: 12, day: 7 },
  { name: '소한', month: 1, day: 6 }
];

// 윤년 계산
function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

// 절기 기준 월주 계산
function getMonthPillar(year: number, month: number, day: number): string {
  // 간단한 절기 계산 (실제로는 더 정확한 천문 계산 필요)
  const solarTerms = [
    { month: 2, day: 4 },   // 입춘
    { month: 3, day: 5 },   // 경칩
    { month: 4, day: 5 },   // 청명
    { month: 5, day: 5 },   // 입하
    { month: 6, day: 6 },   // 망종
    { month: 7, day: 7 },   // 소서
    { month: 8, day: 8 },   // 입추
    { month: 9, day: 8 },   // 백로
    { month: 10, day: 8 },  // 한로
    { month: 11, day: 7 },  // 입동
    { month: 12, day: 7 },  // 대설
    { month: 1, day: 6 }    // 소한
  ];

  // 입춘(2월 4일)을 기준으로 월주 계산
  const springStart = { month: 2, day: 4 };
  let monthIndex = 0;
  
  if (month > springStart.month || (month === springStart.month && day >= springStart.day)) {
    monthIndex = month - springStart.month;
  } else {
    monthIndex = month + 10 - springStart.month; // 이전 해의 월들
  }

  // 년간 기준 월간 계산
  const yearStemIndex = (year - 4) % 10; // 1900년이 경자년이므로
  const monthStemIndex = (yearStemIndex * 2 + monthIndex) % 10;
  const monthBranchIndex = (monthIndex + 2) % 12; // 인월부터 시작

  return TEN_STEMS[monthStemIndex] + TWELVE_BRANCHES[monthBranchIndex];
}

// 일주 계산 (1900년 1월 31일이 경자일 기준)
function getDayPillar(year: number, month: number, day: number): string {
  // 1900년 1월 31일을 기준으로 일진 계산
  const baseDate = new Date(1900, 0, 31); // 1900년 1월 31일 (경자일)
  const targetDate = new Date(year, month - 1, day);
  
  // 일수 차이 계산
  const timeDiff = targetDate.getTime() - baseDate.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  
  // 일간과 일지 계산
  const dayStemIndex = (daysDiff + 6) % 10; // 경자일이 6번째이므로
  const dayBranchIndex = (daysDiff + 0) % 12; // 자일이 0번째이므로
  
  return TEN_STEMS[dayStemIndex] + TWELVE_BRANCHES[dayBranchIndex];
}

// 시주 계산
function getHourPillar(dayStem: string, hour: number): string {
  const dayStemIndex = TEN_STEMS.indexOf(dayStem);
  const hourBranchIndex = Math.floor((hour + 1) / 2) % 12; // 자시(23-1시)부터 시작
  
  // 일간 기준 시간 계산
  const hourStemIndex = (dayStemIndex * 2 + hourBranchIndex) % 10;
  
  return TEN_STEMS[hourStemIndex] + TWELVE_BRANCHES[hourBranchIndex];
}

// 십신 계산
function getTenGod(dayStem: string, targetStem: string): string {
  // 타입 안전성을 위한 검증
  if (!(dayStem in TEN_GODS)) {
    return '비견';
  }
  
  const dayStemData = TEN_GODS[dayStem as keyof typeof TEN_GODS];
  if (!dayStemData || !(targetStem in dayStemData)) {
    return '비견';
  }
  
  return dayStemData[targetStem as keyof typeof dayStemData] || '비견';
}

// 천간 한자 변환
function getStemHanja(stem: string): string {
  const stemHanjaMap: { [key: string]: string } = {
    '갑': '甲', '을': '乙', '병': '丙', '정': '丁', '무': '戊',
    '기': '己', '경': '庚', '신': '辛', '임': '壬', '계': '癸'
  };
  return stemHanjaMap[stem] || stem;
}

// 지지 한자 변환
function getBranchHanja(branch: string): string {
  const branchHanjaMap: { [key: string]: string } = {
    '자': '子', '축': '丑', '인': '寅', '묘': '卯', '진': '辰', '사': '巳',
    '오': '午', '미': '未', '신': '申', '유': '酉', '술': '戌', '해': '亥'
  };
  return branchHanjaMap[branch] || branch;
}

// 지지에 숨어있는 천간 (지장간)
function getHiddenStems(branch: string): string[] {
  const hiddenStemsMap: { [key: string]: string[] } = {
    '자': ['계'], '축': ['기', '신', '계'], '인': ['갑', '병', '무'],
    '묘': ['을'], '진': ['을', '무', '계'], '사': ['병', '무', '경'],
    '오': ['정', '기'], '미': ['기', '정', '을'], '신': ['경', '임', '무'],
    '유': ['신'], '술': ['무', '신', '정'], '해': ['임', '갑']
  };
  return hiddenStemsMap[branch] || [];
}

// 지역시 보정 (한국 표준시 기준)
function adjustForTimezone(birthTime: string, location: string): string {
  // 한국 주요 도시의 경도별 보정값 (분 단위)
  // 한국 표준시: 동경 135도 기준
  // 경도 1도 차이 = 4분의 시간 차이
  const longitudeAdjustments: { [key: string]: number } = {
    '서울': -30,    // 127.5° - 135° = -7.5° × 4분 = -30분
    '부산': -24,    // 129.0° - 135° = -6° × 4분 = -24분
    '대구': -26,    // 128.6° - 135° = -6.4° × 4분 = -26분
    '인천': -28,    // 126.6° - 135° = -8.4° × 4분 = -34분 → -28분
    '광주': -32,    // 126.9° - 135° = -8.1° × 4분 = -32분
    '대전': -30,    // 127.4° - 135° = -7.6° × 4분 = -30분
    '울산': -24,    // 129.3° - 135° = -5.7° × 4분 = -23분 → -24분
    '세종': -30,    // 127.3° - 135° = -7.7° × 4분 = -31분 → -30분
    '제주': -36,    // 126.5° - 135° = -8.5° × 4분 = -34분 → -36분
    '경기': -30,    // 서울과 유사한 경도
    '강원': -28,    // 128.0° - 135° = -7° × 4분 = -28분
    '충북': -30,    // 127.5° - 135° = -7.5° × 4분 = -30분
    '충남': -30,    // 127.4° - 135° = -7.6° × 4분 = -30분
    '전북': -32,    // 127.0° - 135° = -8° × 4분 = -32분
    '전남': -32,    // 126.8° - 135° = -8.2° × 4분 = -33분 → -32분
    '경북': -26,    // 128.6° - 135° = -6.4° × 4분 = -26분
    '경남': -24,    // 128.9° - 135° = -6.1° × 4분 = -24분
  };

  const adjustment = longitudeAdjustments[location] || 0;
  const [hours, minutes] = birthTime.split(':').map(Number);
  
  // 분 단위로 계산하여 더 정확한 보정
  let totalMinutes = hours * 60 + minutes + adjustment;
  
  // 24시간 순환 처리
  if (totalMinutes < 0) totalMinutes += 24 * 60;
  if (totalMinutes >= 24 * 60) totalMinutes -= 24 * 60;
  
  const adjustedHours = Math.floor(totalMinutes / 60);
  const adjustedMinutes = totalMinutes % 60;
  
  return `${adjustedHours.toString().padStart(2, '0')}:${adjustedMinutes.toString().padStart(2, '0')}`;
}

// 메인 사주 계산 함수
export function calculateSaju(
  birthDate: string, 
  birthTime: string, 
  gender: string, 
  location: string
): SajuResult {
  const [year, month, day] = birthDate.split('-').map(Number);
  
  // 지역시 보정
  const adjustedTime = adjustForTimezone(birthTime, location);
  const [hours, minutes] = adjustedTime.split(':').map(Number);
  
  // 년주 계산
  const yearStemIndex = (year - 4) % 10; // 1900년이 경자년
  const yearBranchIndex = (year - 4) % 12;
  const yearStem = TEN_STEMS[yearStemIndex];
  const yearBranch = TWELVE_BRANCHES[yearBranchIndex];
  const yearPillar = yearStem + yearBranch;
  
  // 월주 계산
  const monthPillar = getMonthPillar(year, month, day);
  const monthStem = monthPillar[0];
  const monthBranch = monthPillar[1];
  
  // 일주 계산
  const dayPillar = getDayPillar(year, month, day);
  const dayStem = dayPillar[0];
  const dayBranch = dayPillar[1];
  
  // 시주 계산
  const hourPillar = getHourPillar(dayStem, hours);
  const hourStem = hourPillar[0];
  const hourBranch = hourPillar[1];
  
  // 오행 계산
  const fiveElement = FIVE_ELEMENTS[dayStem as keyof typeof FIVE_ELEMENTS] || '토';
  
  // 십신 계산 (일간 기준)
  const tenGod = getTenGod(dayStem, dayStem);
  
  return {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
    dayStem,
    dayBranch,
    fiveElement,
    tenGod
  };
}

// 사진과 같은 구조의 상세 사주 정보 생성
export function getDetailedSajuInfo(
  birthDate: string, 
  birthTime: string, 
  gender: string, 
  location: string
) {
  const [year, month, day] = birthDate.split('-').map(Number);
  
  // 지역시 보정
  const adjustedTime = adjustForTimezone(birthTime, location);
  const [hours, minutes] = adjustedTime.split(':').map(Number);
  
  // 각 기둥의 천간과 지지 계산
  const yearStemIndex = (year - 4) % 10;
  const yearBranchIndex = (year - 4) % 12;
  const yearStem = TEN_STEMS[yearStemIndex];
  const yearBranch = TWELVE_BRANCHES[yearBranchIndex];
  
  const monthPillar = getMonthPillar(year, month, day);
  const monthStem = monthPillar[0];
  const monthBranch = monthPillar[1];
  
  const dayPillar = getDayPillar(year, month, day);
  const dayStem = dayPillar[0];
  const dayBranch = dayPillar[1];
  
  const hourPillar = getHourPillar(dayStem, hours);
  const hourStem = hourPillar[0];
  const hourBranch = hourPillar[1];
  
  // 각 천간과 지지의 십성 계산 (일간 기준)
  const getStemTenGod = (stem: string) => getTenGod(dayStem, stem);
  const getBranchTenGod = (branch: string) => {
    // 지지의 십성은 지지에 숨어있는 천간을 기준으로 계산
    const hiddenStems = getHiddenStems(branch);
    return hiddenStems.map(stem => getTenGod(dayStem, stem));
  };
  
  // 오행 정보
  const getElement = (stem: string) => FIVE_ELEMENTS[stem as keyof typeof FIVE_ELEMENTS] || '토';
  
  return {
    hour: {
      stem: hourStem,
      branch: hourBranch,
      pillar: hourStem + hourBranch,
      stem_hanja: getStemHanja(hourStem),
      branch_hanja: getBranchHanja(hourBranch),
      ten_god: getStemTenGod(hourStem),
      branch_ten_god: getBranchTenGod(hourBranch)[0],
      stem_element: getElement(hourStem),
      branch_element: getElement(getHiddenStems(hourBranch)[0])
    },
    day: {
      stem: dayStem,
      branch: dayBranch,
      pillar: dayStem + dayBranch,
      stem_hanja: getStemHanja(dayStem),
      branch_hanja: getBranchHanja(dayBranch),
      ten_god: getStemTenGod(dayStem),
      branch_ten_god: getBranchTenGod(dayBranch)[0],
      stem_element: getElement(dayStem),
      branch_element: getElement(getHiddenStems(dayBranch)[0])
    },
    month: {
      stem: monthStem,
      branch: monthBranch,
      pillar: monthStem + monthBranch,
      stem_hanja: getStemHanja(monthStem),
      branch_hanja: getBranchHanja(monthBranch),
      ten_god: getStemTenGod(monthStem),
      branch_ten_god: getBranchTenGod(monthBranch)[0],
      stem_element: getElement(monthStem),
      branch_element: getElement(getHiddenStems(monthBranch)[0])
    },
    year: {
      stem: yearStem,
      branch: yearBranch,
      pillar: yearStem + yearBranch,
      stem_hanja: getStemHanja(yearStem),
      branch_hanja: getBranchHanja(yearBranch),
      ten_god: getStemTenGod(yearStem),
      branch_ten_god: getBranchTenGod(yearBranch)[0],
      stem_element: getElement(yearStem),
      branch_element: getElement(getHiddenStems(yearBranch)[0])
    }
  };
}

// 사주 분석 함수
export function analyzeSaju(saju: SajuResult): {
  personality: string;
  characteristics: string[];
  strengths: string[];
  weaknesses: string[];
  lifeAdvice: string;
  compatibility: string;
  emoji: string;
} {
  const { dayStem, fiveElement } = saju;
  
  // 일간별 성격 분석
  const personalityMap: { [key: string]: any } = {
    '갑': {
      personality: '대장군형 - 리더십이 강하고 추진력이 뛰어남',
      characteristics: ['리더십', '추진력', '책임감', '정의감'],
      strengths: ['강한 의지력', '리더십', '추진력', '정의감'],
      weaknesses: ['고집', '성급함', '완고함'],
      emoji: '🌳'
    },
    '을': {
      personality: '꽃나무형 - 유연하고 적응력이 뛰어남',
      characteristics: ['유연성', '적응력', '소통능력', '협력성'],
      strengths: ['유연한 사고', '적응력', '소통능력', '협력성'],
      weaknesses: ['우유부단', '의지력 부족'],
      emoji: '🌸'
    },
    '병': {
      personality: '태양형 - 열정적이고 활발함',
      characteristics: ['열정', '활발함', '표현력', '에너지'],
      strengths: ['강한 열정', '활발함', '표현력', '에너지'],
      weaknesses: ['성급함', '인내심 부족', '감정 기복'],
      emoji: '☀️'
    },
    '정': {
      personality: '달형 - 섬세하고 예술적 감각이 뛰어남',
      characteristics: ['섬세함', '예술성', '감성', '직관력'],
      strengths: ['섬세한 감각', '예술적 재능', '감성', '직관력'],
      weaknesses: ['감정적', '완벽주의', '변덕'],
      emoji: '🌙'
    },
    '무': {
      personality: '산형 - 안정적이고 신뢰할 수 있음',
      characteristics: ['안정성', '신뢰성', '인내심', '책임감'],
      strengths: ['안정성', '신뢰성', '인내심', '책임감'],
      weaknesses: ['보수적', '변화 저항', '완고함'],
      emoji: '🏔️'
    },
    '기': {
      personality: '흙형 - 포용력이 크고 중재 능력이 뛰어남',
      characteristics: ['포용력', '중재능력', '협력성', '안정성'],
      strengths: ['포용력', '중재능력', '협력성', '안정성'],
      weaknesses: ['우유부단', '의지력 부족', '소극적'],
      emoji: '🌍'
    },
    '경': {
      personality: '쇠형 - 강인하고 원칙적임',
      characteristics: ['강인함', '원칙성', '정확성', '완벽주의'],
      strengths: ['강인한 의지', '원칙성', '정확성', '완벽주의'],
      weaknesses: ['완고함', '유연성 부족', '냉정함'],
      emoji: '⚔️'
    },
    '신': {
      personality: '보석형 - 세련되고 완벽함',
      characteristics: ['세련됨', '완벽함', '정확성', '미적 감각'],
      strengths: ['세련된 감각', '완벽함', '정확성', '미적 감각'],
      weaknesses: ['완벽주의', '유연성 부족', '냉정함'],
      emoji: '💎'
    },
    '임': {
      personality: '바다형 - 지혜롭고 포용력이 큼',
      characteristics: ['지혜', '포용력', '적응력', '소통능력'],
      strengths: ['지혜', '포용력', '적응력', '소통능력'],
      weaknesses: ['우유부단', '의지력 부족', '변덕'],
      emoji: '🌊'
    },
    '계': {
      personality: '이슬형 - 순수하고 깨끗함',
      characteristics: ['순수함', '깨끗함', '직관력', '감성'],
      strengths: ['순수함', '깨끗함', '직관력', '감성'],
      weaknesses: ['감정적', '완벽주의', '변덕'],
      emoji: '💧'
    }
  };

  const analysis = personalityMap[dayStem] || personalityMap['기'];
  
  return {
    ...analysis,
    lifeAdvice: `${dayStem}일간의 특성을 살려 ${fiveElement} 오행의 에너지를 균형있게 활용하세요.`,
    compatibility: `${dayStem}일간은 ${fiveElement} 오행과 상생하는 오행과 좋은 궁합을 이룹니다.`
  };
}

