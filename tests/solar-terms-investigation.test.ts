import { calculateSaju } from '../src/utils/sajuCalculator';

// 절입시각 조사 테스트
describe('절입시각 조사 - 전문 사이트 기준', () => {
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

  // 월주 계산 함수 (절기 기준)
  function getMonthPillarWithSolarTerm(year: number, month: number, day: number, solarTermDay: number): string {
    // 입춘(2월 4일)을 기준으로 월주 계산
    const springStart = { month: 2, day: solarTermDay }; // 절입시각에 따라 조정
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

  test('1997년 5월 7일의 절기 상황을 분석해야 한다', () => {
    console.log('=== 1997년 5월 7일 절기 분석 ===');
    
    const targetYear = 1997;
    const targetMonth = 5;
    const targetDay = 7;
    
    // 1997년 주요 절기들 (대략적인 날짜)
    const solarTerms1997 = [
      { name: '입춘', month: 2, day: 4 },
      { name: '경칩', month: 3, day: 5 },
      { name: '청명', month: 4, day: 5 },
      { name: '입하', month: 5, day: 5 }, // 5월 5일 입하
      { name: '망종', month: 6, day: 6 },
    ];
    
    console.log('1997년 주요 절기들:');
    solarTerms1997.forEach(term => {
      const isAfter = (targetMonth > term.month) || (targetMonth === term.month && targetDay >= term.day);
      const marker = isAfter ? '✅' : '❌';
      console.log(`${marker} ${term.name}: ${term.month}월 ${term.day}일 ${isAfter ? '(이후)' : '(이전)'}`);
    });
    
    // 5월 7일은 입하(5월 5일) 이후
    console.log('\n5월 7일은 입하(5월 5일) 이후이므로 사월(巳月)입니다.');
    
    expect(solarTerms1997.length).toBeGreaterThan(0);
  });

  test('절입시각의 정확한 시점이 월주에 미치는 영향을 조사해야 한다', () => {
    console.log('\n=== 절입시각 정확도가 월주에 미치는 영향 ===');
    
    const targetYear = 1997;
    const targetMonth = 5;
    const targetDay = 7;
    
    // 입하 절입시각을 다양한 시점으로 가정
    const solarTermVariations = [
      { name: '고정 5월 5일', day: 5 },
      { name: '5월 4일 23시', day: 4 },
      { name: '5월 5일 01시', day: 5 },
      { name: '5월 5일 12시', day: 5 },
      { name: '5월 5일 23시', day: 5 },
      { name: '5월 6일 01시', day: 6 },
    ];
    
    console.log('입하 절입시각이 다른 시점일 때의 월주:');
    
    solarTermVariations.forEach(variation => {
      const monthPillar = getMonthPillarWithSolarTerm(targetYear, targetMonth, targetDay, variation.day);
      console.log(`${variation.name}: ${monthPillar}`);
    });
    
    expect(solarTermVariations.length).toBeGreaterThan(0);
  });

  test('1997년 5월 7일 전후 날짜들의 월주 변화를 확인해야 한다', () => {
    console.log('\n=== 1997년 5월 전후 월주 변화 ===');
    
    const targetYear = 1997;
    const targetMonth = 5;
    
    // 5월 1일부터 10일까지
    for (let day = 1; day <= 10; day++) {
      const monthPillar = getMonthPillarWithSolarTerm(targetYear, targetMonth, day, 5); // 입하 5월 5일 기준
      const isTargetDay = day === 7;
      const marker = isTargetDay ? '🎯' : '  ';
      
      console.log(`${marker} 5월 ${day}일: ${monthPillar}${isTargetDay ? ' ← 5월 7일' : ''}`);
    }
    
    console.log('\n월주가 바뀌는 시점을 확인했습니다.');
  });

  test('다양한 만세력 기준점과 절입시각 조합으로 기유를 찾아야 한다', () => {
    console.log('\n=== 만세력 + 절입시각 조합으로 기유 찾기 ===');
    
    const targetYear = 1997;
    const targetMonth = 5;
    const targetDay = 7;
    
    // 다양한 만세력 기준점들
    const calendarBases = [
      { name: '1900-01-31 경자', year: 1900, month: 1, day: 31, stemIndex: 6, branchIndex: 0 },
      { name: '1900-01-01', year: 1900, month: 1, day: 1, stemIndex: 0, branchIndex: 0 },
      { name: '1901-01-01', year: 1901, month: 1, day: 1, stemIndex: 1, branchIndex: 1 },
      { name: '1904-01-01', year: 1904, month: 1, day: 1, stemIndex: 0, branchIndex: 4 },
      { name: '1924-01-01', year: 1924, month: 1, day: 1, stemIndex: 0, branchIndex: 0 },
      { name: '1984-01-01', year: 1984, month: 1, day: 1, stemIndex: 0, branchIndex: 0 },
    ];
    
    // 다양한 절입시각
    const solarTermDays = [4, 5, 6];
    
    console.log('만세력 기준점 × 절입시각 조합:');
    
    let foundGiyu = false;
    
    calendarBases.forEach(base => {
      solarTermDays.forEach(solarDay => {
        // 일주 계산
        const dayPillar = getDayPillarWithBase(targetYear, targetMonth, targetDay, base.year, base.month, base.day, base.stemIndex, base.branchIndex);
        
        // 월주 계산
        const monthPillar = getMonthPillarWithSolarTerm(targetYear, targetMonth, targetDay, solarDay);
        
        const isGiyu = dayPillar === '기유';
        const marker = isGiyu ? '🎯' : '  ';
        
        if (isGiyu) {
          foundGiyu = true;
          console.log(`${marker} ${base.name} + 입하${solarDay}일: 일주=${dayPillar}, 월주=${monthPillar} (기유!)`);
        } else {
          console.log(`${marker} ${base.name} + 입하${solarDay}일: 일주=${dayPillar}, 월주=${monthPillar}`);
        }
      });
    });
    
    if (!foundGiyu) {
      console.log('\n❌ 만세력 + 절입시각 조합으로도 기유가 나오지 않습니다.');
      console.log('다른 요인을 고려해야 합니다.');
    } else {
      console.log('\n✅ 기유를 찾았습니다!');
    }
    
    expect(calendarBases.length).toBeGreaterThan(0);
  });

  // 일주 계산 함수 (다양한 기준점)
  function getDayPillarWithBase(year: number, month: number, day: number, baseYear: number, baseMonth: number, baseDay: number, baseStemIndex: number, baseBranchIndex: number): string {
    const baseDate = new Date(baseYear, baseMonth - 1, baseDay);
    const targetDate = new Date(year, month - 1, day);
    
    const timeDiff = targetDate.getTime() - baseDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    const dayStemIndex = (daysDiff + baseStemIndex) % 10;
    const dayBranchIndex = (daysDiff + baseBranchIndex) % 12;
    
    return TEN_STEMS[dayStemIndex] + TWELVE_BRANCHES[dayBranchIndex];
  }

  test('전문 사이트의 정확한 절입시각 데이터를 가정하고 테스트해야 한다', () => {
    console.log('\n=== 전문 사이트 절입시각 데이터 가정 테스트 ===');
    
    // 전문 사이트에서 사용할 수 있는 정확한 절입시각 데이터
    const preciseSolarTerms = [
      { year: 1997, month: 5, day: 5, hour: 0, minute: 0 },   // 입하 5월 5일 00:00
      { year: 1997, month: 5, day: 5, hour: 12, minute: 0 },  // 입하 5월 5일 12:00
      { year: 1997, month: 5, day: 5, hour: 23, minute: 59 }, // 입하 5월 5일 23:59
      { year: 1997, month: 5, day: 6, hour: 0, minute: 0 },   // 입하 5월 6일 00:00
    ];
    
    const targetYear = 1997;
    const targetMonth = 5;
    const targetDay = 7;
    const targetTime = new Date(targetYear, targetMonth - 1, targetDay, 12, 0);
    
    console.log('정확한 절입시각 데이터로 5월 7일 12시 분석:');
    
    preciseSolarTerms.forEach(term => {
      const termTime = new Date(term.year, term.month - 1, term.day, term.hour, term.minute);
      const isAfterTerm = targetTime >= termTime;
      
      console.log(`입하 ${term.month}월 ${term.day}일 ${term.hour.toString().padStart(2, '0')}:${term.minute.toString().padStart(2, '0')} ${isAfterTerm ? '이후' : '이전'}`);
    });
    
    console.log('\n5월 7일 12시는 모든 입하 시점 이후이므로 사월(巳月)입니다.');
    
    expect(preciseSolarTerms.length).toBeGreaterThan(0);
  });

  test('결론: 절입시각이 기유의 핵심 원인인지 종합 분석해야 한다', () => {
    console.log('\n=== 절입시각 조사 결론 ===');
    
    console.log('1. 절입시각의 중요성:');
    console.log('   - 전문 사이트: "태양의 정확한 위치를 파악하는 절입시각을 반영"');
    console.log('   - 우리: 고정된 날짜 기준 (5월 5일 입하)');
    console.log('   - 차이: 정확한 천문 계산 vs 근사치');
    
    console.log('\n2. 1997년 5월 7일 상황:');
    console.log('   - 입하(5월 5일) 이후');
    console.log('   - 사월(巳月)에 해당');
    console.log('   - 절입시각의 정확한 시점이 월주에 영향');
    
    console.log('\n3. 가능한 원인들:');
    console.log('   - 절입시각의 정확한 시점 (시간 단위)');
    console.log('   - 만세력 기준점의 미세한 차이');
    console.log('   - 지역 시차 + 절입시각의 복합적 영향');
    console.log('   - 전문 사이트만의 특별한 계산 방식');
    
    console.log('\n4. 결론:');
    console.log('   절입시각이 핵심 원인일 가능성이 높지만,');
    console.log('   단독으로는 기유가 나오지 않으므로');
    console.log('   다른 요인들과의 복합적 영향일 수 있습니다.');
    
    expect(true).toBe(true);
  });
});
