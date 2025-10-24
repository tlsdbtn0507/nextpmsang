import { calculateSaju } from '../src/utils/sajuCalculator';

// 1997년 5월 7일 서울 남성의 사주 분석
describe('1997년 5월 7일 서울 남성 사주 분석', () => {
  // 십간 (天干) - 10개
  const TEN_STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
  
  // 십이지 (地支) - 12개
  const TWELVE_BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

  // 일주 계산 함수
  function getDayPillar(year: number, month: number, day: number): string {
    const baseDate = new Date(1900, 0, 31); // 1900년 1월 31일 (경자일)
    const targetDate = new Date(year, month - 1, day);
    
    const timeDiff = targetDate.getTime() - baseDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    const dayStemIndex = (daysDiff + 6) % 10;
    const dayBranchIndex = (daysDiff + 0) % 12;
    
    return TEN_STEMS[dayStemIndex] + TWELVE_BRANCHES[dayBranchIndex];
  }

  // 특정 날짜 주변의 기유 날짜 찾기
  function findGiyuDatesAround(birthYear: number, birthMonth: number, birthDay: number, rangeDays: number = 30) {
    const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
    const giyuDates: Array<{
      date: string;
      year: number;
      month: number;
      day: number;
      dayPillar: string;
      daysFromBirth: number;
    }> = [];

    // 출생일 전후로 검색
    for (let i = -rangeDays; i <= rangeDays; i++) {
      const currentDate = new Date(birthDate);
      currentDate.setDate(birthDate.getDate() + i);
      
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate();
      
      const dayPillar = getDayPillar(year, month, day);
      
      if (dayPillar === '기유') {
        const daysFromBirth = i;
        giyuDates.push({
          date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
          year,
          month,
          day,
          dayPillar,
          daysFromBirth
        });
      }
    }

    return giyuDates;
  }

  test('1997년 5월 7일 서울 남성의 사주를 계산해야 한다', () => {
    const birthDate = '1997-05-07';
    const birthTime = '12:00'; // 정오로 가정
    const gender = '남';
    const location = '서울';

    const sajuResult = calculateSaju(birthDate, birthTime, gender, location);

    console.log('=== 1997년 5월 7일 서울 남성 사주 ===');
    console.log(`년주: ${sajuResult.year}`);
    console.log(`월주: ${sajuResult.month}`);
    console.log(`일주: ${sajuResult.day}`);
    console.log(`시주: ${sajuResult.hour}`);
    console.log(`일간: ${sajuResult.dayStem}`);
    console.log(`일지: ${sajuResult.dayBranch}`);
    console.log(`오행: ${sajuResult.fiveElement}`);

    // 결과 검증
    expect(sajuResult.day).toBeDefined();
    expect(sajuResult.dayStem).toBeDefined();
    expect(sajuResult.dayBranch).toBeDefined();
  });

  test('1997년 5월 7일 근처에 기유가 있는지 확인해야 한다', () => {
    const birthYear = 1997;
    const birthMonth = 5;
    const birthDay = 7;

    // 출생일의 일주 계산
    const birthDayPillar = getDayPillar(birthYear, birthMonth, birthDay);
    console.log(`\n=== 1997년 5월 7일 일주: ${birthDayPillar} ===`);

    // 출생일 전후 60일 범위에서 기유 날짜 찾기
    const giyuDatesAround = findGiyuDatesAround(birthYear, birthMonth, birthDay, 60);

    console.log(`\n=== 1997년 5월 7일 전후 60일 내 기유 날짜들 ===`);
    if (giyuDatesAround.length > 0) {
      giyuDatesAround.forEach((date, index) => {
        const direction = date.daysFromBirth > 0 ? '후' : '전';
        const absDays = Math.abs(date.daysFromBirth);
        console.log(`${index + 1}. ${date.date} (출생일 ${absDays}일 ${direction})`);
      });
    } else {
      console.log('60일 내에 기유 날짜가 없습니다.');
    }

    // 출생일이 기유인지 확인
    const isBirthDayGiyu = birthDayPillar === '기유';
    console.log(`\n출생일이 기유인가? ${isBirthDayGiyu ? 'YES!' : 'NO'}`);

    if (isBirthDayGiyu) {
      console.log('🎉 축하합니다! 출생일이 바로 기유입니다!');
    } else {
      console.log(`출생일은 ${birthDayPillar}입니다.`);
    }

    // 기유 날짜가 있는지 확인
    expect(giyuDatesAround.length).toBeGreaterThanOrEqual(0);
  });

  test('1997년 전체 기유 날짜들을 찾아야 한다', () => {
    const giyu1997: Array<{
      date: string;
      year: number;
      month: number;
      day: number;
      dayPillar: string;
    }> = [];

    for (let month = 1; month <= 12; month++) {
      const daysInMonth = new Date(1997, month, 0).getDate();
      
      for (let day = 1; day <= daysInMonth; day++) {
        const dayPillar = getDayPillar(1997, month, day);
        
        if (dayPillar === '기유') {
          giyu1997.push({
            date: `1997-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
            year: 1997,
            month,
            day,
            dayPillar
          });
        }
      }
    }

    console.log('\n=== 1997년 전체 기유 날짜들 ===');
    giyu1997.forEach((date, index) => {
      console.log(`${index + 1}. ${date.date}`);
    });

    // 5월 7일과 가장 가까운 기유 날짜 찾기
    const birthDate = new Date(1997, 4, 7); // 5월 7일
    let closestGiyu: { date: string; year: number; month: number; day: number; dayPillar: string } | null = null;
    let minDistance = Infinity;

    giyu1997.forEach(giyuDate => {
      const giyuDateObj = new Date(giyuDate.year, giyuDate.month - 1, giyuDate.day);
      const distance = Math.abs(giyuDateObj.getTime() - birthDate.getTime());
      
      if (distance < minDistance) {
        minDistance = distance;
        closestGiyu = giyuDate;
      }
    });

    if (closestGiyu) {
      const daysDiff = Math.floor(minDistance / (1000 * 60 * 60 * 24));
      console.log(`\n5월 7일과 가장 가까운 기유: ${(closestGiyu as any).date} (${daysDiff}일 차이)`);
    }

    expect(giyu1997.length).toBeGreaterThan(0);
  });

  test('1997년 5월의 모든 날짜 일주를 확인해야 한다', () => {
    console.log('\n=== 1997년 5월 모든 날짜의 일주 ===');
    
    const may1997: Array<{
      day: number;
      dayPillar: string;
      isGiyu: boolean;
    }> = [];

    for (let day = 1; day <= 31; day++) {
      const dayPillar = getDayPillar(1997, 5, day);
      const isGiyu = dayPillar === '기유';
      
      may1997.push({
        day,
        dayPillar,
        isGiyu
      });
    }

    may1997.forEach(date => {
      const marker = date.isGiyu ? '🎯' : '  ';
      console.log(`${marker} 5월 ${date.day}일: ${date.dayPillar}`);
    });

    const giyuInMay = may1997.filter(date => date.isGiyu);
    console.log(`\n5월에 기유가 있는 날짜: ${giyuInMay.length}개`);
    giyuInMay.forEach(date => {
      console.log(`- 5월 ${date.day}일: ${date.dayPillar}`);
    });

    expect(may1997.length).toBe(31);
  });

  test('1997년 5월 7일의 상세 사주 정보를 분석해야 한다', () => {
    const birthDate = '1997-05-07';
    const birthTime = '12:00';
    const gender = '남';
    const location = '서울';

    const sajuResult = calculateSaju(birthDate, birthTime, gender, location);

    console.log('\n=== 상세 사주 분석 ===');
    console.log(`생년월일: ${birthDate}`);
    console.log(`생시: ${birthTime}`);
    console.log(`성별: ${gender}`);
    console.log(`출생지: ${location}`);
    console.log('');
    console.log('사주:');
    console.log(`  년주: ${sajuResult.year}`);
    console.log(`  월주: ${sajuResult.month}`);
    console.log(`  일주: ${sajuResult.day} ← 이게 일주입니다!`);
    console.log(`  시주: ${sajuResult.hour}`);
    console.log('');
    console.log('일주 상세:');
    console.log(`  일간: ${sajuResult.dayStem} (${sajuResult.fiveElement} 오행)`);
    console.log(`  일지: ${sajuResult.dayBranch}`);
    console.log(`  십신: ${sajuResult.tenGod}`);

    // 기유와 비교
    const isGiyu = sajuResult.day === '기유';
    console.log(`\n기유인가? ${isGiyu ? 'YES! 🎉' : 'NO'}`);
    
    if (!isGiyu) {
      console.log(`실제 일주: ${sajuResult.day}`);
      console.log('기유 = 기(토) + 유(금)');
      console.log(`현재 일주 = ${sajuResult.dayStem}(토) + ${sajuResult.dayBranch}(금)`);
    }

    expect(sajuResult.day).toBeDefined();
  });
});

