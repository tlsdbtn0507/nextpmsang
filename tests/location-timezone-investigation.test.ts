import { calculateSaju } from '../src/utils/sajuCalculator';

// 지역 시차 보정 조사 테스트
describe('지역 시차 보정 조사 - 전문 사이트 기준', () => {
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

  // 시간 보정 함수 (수동)
  function adjustTimeForTimezone(birthTime: string, adjustmentMinutes: number): string {
    const [hours, minutes] = birthTime.split(':').map(Number);
    let totalMinutes = hours * 60 + minutes + adjustmentMinutes;
    
    // 24시간 순환 처리
    if (totalMinutes < 0) totalMinutes += 24 * 60;
    if (totalMinutes >= 24 * 60) totalMinutes -= 24 * 60;
    
    const adjustedHours = Math.floor(totalMinutes / 60);
    const adjustedMinutes = totalMinutes % 60;
    
    return `${adjustedHours.toString().padStart(2, '0')}:${adjustedMinutes.toString().padStart(2, '0')}`;
  }

  test('전문 사이트 기준 지역 시차 보정으로 1997년 5월 7일 일주를 계산해야 한다', () => {
    const birthDate = '1997-05-07';
    const birthTime = '12:00';
    const gender = '남';

    console.log('=== 전문 사이트 기준 지역 시차 보정 테스트 ===');
    console.log('전문 사이트 FAQ: "서울이 도쿄보다 32분 늦게 뜨고 지기 때문에 보정된 시간을 보는 것이 정확"');
    
    // 다양한 시차 보정값 테스트
    const timezoneAdjustments = [
      { name: '현재 알고리즘 (-30분)', adjustment: -30 },
      { name: '전문 사이트 기준 (-32분)', adjustment: -32 },
      { name: '서울 정확한 시차 (-32분)', adjustment: -32 },
      { name: '더 큰 보정 (-35분)', adjustment: -35 },
      { name: '더 작은 보정 (-28분)', adjustment: -28 },
      { name: '보정 없음 (0분)', adjustment: 0 },
    ];

    timezoneAdjustments.forEach(adj => {
      const adjustedTime = adjustTimeForTimezone(birthTime, adj.adjustment);
      const sajuResult = calculateSaju(birthDate, adjustedTime, gender);
      const isGiyu = sajuResult.day === '기유';
      const marker = isGiyu ? '🎯' : '  ';
      
      console.log(`${marker} ${adj.name}: ${sajuResult.day} ${isGiyu ? '(기유!)' : ''} (보정된 시간: ${adjustedTime})`);
    });

    // -32분 보정으로 직접 계산
    const adjustedTime32 = adjustTimeForTimezone(birthTime, -32);
    const sajuResult32 = calculateSaju(birthDate, adjustedTime32, gender);
    const isGiyu32 = sajuResult32.day === '기유';
    
    console.log(`\n🎯 전문 사이트 기준 (-32분 보정): ${sajuResult32.day} ${isGiyu32 ? '(기유!)' : ''}`);
    console.log(`보정된 시간: ${adjustedTime32}`);

    expect(timezoneAdjustments.length).toBeGreaterThan(0);
  });

  test('서울의 정확한 경도 차이를 계산해야 한다', () => {
    console.log('\n=== 서울 vs 도쿄 경도 차이 계산 ===');
    
    // 경도 차이 계산
    const tokyoLongitude = 139.7; // 도쿄 경도
    const seoulLongitude = 126.9; // 서울 경도 (중심)
    const longitudeDifference = tokyoLongitude - seoulLongitude;
    
    // 경도 1도 = 4분의 시간 차이
    const timeDifferenceMinutes = longitudeDifference * 4;
    
    console.log(`도쿄 경도: ${tokyoLongitude}°`);
    console.log(`서울 경도: ${seoulLongitude}°`);
    console.log(`경도 차이: ${longitudeDifference}°`);
    console.log(`시간 차이: ${timeDifferenceMinutes}분`);
    console.log(`서울이 도쿄보다 ${timeDifferenceMinutes}분 늦게 뜨고 집니다`);
    
    // 우리 알고리즘과 비교
    console.log(`\n우리 알고리즘 서울 보정값: -30분`);
    console.log(`전문 사이트 기준 보정값: -${timeDifferenceMinutes}분`);
    console.log(`차이: ${Math.abs(-30 - (-timeDifferenceMinutes))}분`);
    
    expect(timeDifferenceMinutes).toBeCloseTo(32, 1);
  });

  test('다양한 시간대에서 1997년 5월 7일 일주를 확인해야 한다', () => {
    const birthDate = '1997-05-07';
    const gender = '남';

    console.log('\n=== 다양한 시간대별 일주 확인 ===');
    
    // 다양한 시간으로 테스트
    const testTimes = [
      '11:28', // -32분 보정
      '11:30', // -30분 보정 (현재)
      '11:32', // -28분 보정
      '11:35', // -25분 보정
      '12:00', // 보정 없음
    ];

    testTimes.forEach(time => {
      const sajuResult = calculateSaju(birthDate, time, gender);
      const isGiyu = sajuResult.day === '기유';
      const marker = isGiyu ? '🎯' : '  ';
      
      console.log(`${marker} ${time}: ${sajuResult.day} ${isGiyu ? '(기유!)' : ''}`);
    });

    expect(testTimes.length).toBeGreaterThan(0);
  });

  test('절입시각 보정도 함께 고려해야 한다', () => {
    console.log('\n=== 절입시각 보정 고려 ===');
    console.log('전문 사이트: "태양의 정확한 위치를 파악하는 절입시각을 반영"');
    
    // 1997년 5월 7일은 입하(5월 5일) 이후
    // 입하 절입시각이 정확히 언제인지에 따라 월주가 달라질 수 있음
    
    const birthDate = '1997-05-07';
    const birthTime = '11:28'; // -32분 보정된 시간
    const gender = '남';

    const sajuResult = calculateSaju(birthDate, birthTime, gender);
    
    console.log(`1997년 5월 7일 (${birthTime}):`);
    console.log(`  년주: ${sajuResult.year}`);
    console.log(`  월주: ${sajuResult.month}`);
    console.log(`  일주: ${sajuResult.day}`);
    console.log(`  시주: ${sajuResult.hour}`);
    
    const isGiyu = sajuResult.day === '기유';
    console.log(`\n기유인가? ${isGiyu ? 'YES! 🎉' : 'NO'}`);
    
    if (isGiyu) {
      console.log('🎯 성공! 지역 시차 보정(-32분)이 핵심이었습니다!');
    } else {
      console.log('다른 요인도 고려해야 할 것 같습니다.');
    }

    expect(sajuResult.day).toBeDefined();
  });

  test('서울 내 세부 지역별 정확한 경도 차이를 계산해야 한다', () => {
    console.log('\n=== 서울 내 세부 지역별 경도 차이 ===');
    
    const tokyoLongitude = 139.7;
    const seoulRegions = [
      { name: '강남구', longitude: 127.0 },
      { name: '강서구', longitude: 126.8 },
      { name: '서울 중심', longitude: 126.9 },
      { name: '서울 동쪽', longitude: 127.1 },
      { name: '서울 서쪽', longitude: 126.7 },
    ];

    seoulRegions.forEach(region => {
      const longitudeDifference = tokyoLongitude - region.longitude;
      const timeDifferenceMinutes = longitudeDifference * 4;
      
      console.log(`${region.name} (${region.longitude}°): ${timeDifferenceMinutes}분 보정 필요`);
    });

    expect(seoulRegions.length).toBeGreaterThan(0);
  });

  test('결론: 지역 시차 보정이 기유의 핵심 원인인지 확인해야 한다', () => {
    console.log('\n=== 결론: 지역 시차 보정 분석 ===');
    
    const birthDate = '1997-05-07';
    const gender = '남';

    // 현재 알고리즘
    const currentResult = calculateSaju(birthDate, '12:00', gender);
    console.log(`1. 현재 알고리즘 (12:00): ${currentResult.day}`);

    // -30분 보정 (현재)
    const adjustedTime30 = adjustTimeForTimezone('12:00', -30);
    const result30 = calculateSaju(birthDate, adjustedTime30, gender);
    console.log(`2. 현재 보정 (-30분, ${adjustedTime30}): ${result30.day}`);

    // -32분 보정 (전문 사이트 기준)
    const adjustedTime32 = adjustTimeForTimezone('12:00', -32);
    const result32 = calculateSaju(birthDate, adjustedTime32, gender);
    console.log(`3. 전문 사이트 기준 (-32분, ${adjustedTime32}): ${result32.day}`);

    const isGiyu32 = result32.day === '기유';
    console.log(`\n🎯 전문 사이트 기준으로 기유가 나오는가? ${isGiyu32 ? 'YES! 🎉' : 'NO'}`);

    if (isGiyu32) {
      console.log('\n✅ 결론: 지역 시차 보정이 핵심 원인이었습니다!');
      console.log('   - 서울이 도쿄보다 32분 늦게 뜨고 지기 때문');
      console.log('   - 우리는 -30분 보정을 사용했지만, -32분이 정확');
      console.log('   - 2분의 차이가 갑진 → 기유로 바뀌는 결과');
    } else {
      console.log('\n❌ 지역 시차 보정만으로는 기유가 나오지 않습니다.');
      console.log('   다른 요인(절입시각, 만세력 기준점 등)도 고려해야 합니다.');
    }

    expect(result32.day).toBeDefined();
  });
});
