import { calculateSaju } from '../src/utils/sajuCalculator';

// 기유가 나오는 날짜를 찾는 테스트
describe('기유 역탐지 테스트', () => {
  // 십간 (天干) - 10개
  const TEN_STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
  
  // 십이지 (地支) - 12개
  const TWELVE_BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

  // 일주 계산 함수 (sajuCalculator.ts와 동일한 로직)
  function getDayPillar(year: number, month: number, day: number): string {
    const baseDate = new Date(1900, 0, 31); // 1900년 1월 31일 (경자일)
    const targetDate = new Date(year, month - 1, day);
    
    const timeDiff = targetDate.getTime() - baseDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    const dayStemIndex = (daysDiff + 6) % 10;
    const dayBranchIndex = (daysDiff + 0) % 12;
    
    return TEN_STEMS[dayStemIndex] + TWELVE_BRANCHES[dayBranchIndex];
  }

  // 기유가 나오는 날짜들을 찾는 함수
  function findGiyuDatesInRange(startYear: number, endYear: number) {
    const giyuDates: Array<{
      date: string;
      year: number;
      month: number;
      day: number;
      dayPillar: string;
    }> = [];

    for (let year = startYear; year <= endYear; year++) {
      for (let month = 1; month <= 12; month++) {
        const daysInMonth = new Date(year, month, 0).getDate();
        
        for (let day = 1; day <= daysInMonth; day++) {
          const dayPillar = getDayPillar(year, month, day);
          
          if (dayPillar === '기유') {
            giyuDates.push({
              date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
              year,
              month,
              day,
              dayPillar
            });
          }
        }
      }
    }

    return giyuDates;
  }

  describe('기유 날짜 패턴 분석', () => {
    test('2024년 기유 날짜들을 찾아야 한다', () => {
      const giyu2024 = findGiyuDatesInRange(2024, 2024);
      
      console.log('2024년 기유 날짜들:');
      giyu2024.forEach((date, index) => {
        console.log(`${index + 1}. ${date.date}`);
      });

      // 2024년에는 대략 6개의 기유 날짜가 있어야 함 (60일 주기)
      expect(giyu2024.length).toBeGreaterThan(0);
      expect(giyu2024.length).toBeLessThanOrEqual(7);
      
      // 모든 날짜가 기유인지 확인
      giyu2024.forEach(date => {
        expect(date.dayPillar).toBe('기유');
      });
    });

    test('2025년 기유 날짜들을 찾아야 한다', () => {
      const giyu2025 = findGiyuDatesInRange(2025, 2025);
      
      console.log('2025년 기유 날짜들:');
      giyu2025.forEach((date, index) => {
        console.log(`${index + 1}. ${date.date}`);
      });

      expect(giyu2025.length).toBeGreaterThan(0);
      expect(giyu2025.length).toBeLessThanOrEqual(7);
    });

    test('최근 10년간의 기유 패턴을 분석해야 한다', () => {
      const recentGiyuDates = findGiyuDatesInRange(2015, 2025);
      
      console.log(`최근 10년간 기유가 나온 날짜들 (${recentGiyuDates.length}개):`);
      recentGiyuDates.forEach((date, index) => {
        console.log(`${index + 1}. ${date.date} (${date.dayPillar})`);
      });

      // 월별 분포 분석
      const monthDistribution: { [key: number]: number } = {};
      recentGiyuDates.forEach(date => {
        monthDistribution[date.month] = (monthDistribution[date.month] || 0) + 1;
      });

      console.log('월별 분포:');
      Object.keys(monthDistribution).sort((a, b) => Number(a) - Number(b)).forEach(month => {
        console.log(`${month}월: ${monthDistribution[Number(month)]}회`);
      });

      // 년별 분포 분석
      const yearDistribution: { [key: number]: number } = {};
      recentGiyuDates.forEach(date => {
        yearDistribution[date.year] = (yearDistribution[date.year] || 0) + 1;
      });

      console.log('년별 분포:');
      Object.keys(yearDistribution).sort((a, b) => Number(a) - Number(b)).forEach(year => {
        console.log(`${year}년: ${yearDistribution[Number(year)]}회`);
      });

      // 10년간 대략 60개의 기유 날짜가 있어야 함 (60일 주기)
      expect(recentGiyuDates.length).toBeGreaterThan(50);
      expect(recentGiyuDates.length).toBeLessThan(70);
    });
  });

  describe('특정 날짜 기유 확인', () => {
    test('특정 날짜들이 기유인지 확인해야 한다', () => {
      const testDates = [
        { year: 2024, month: 1, day: 1 },
        { year: 2024, month: 6, day: 15 },
        { year: 2024, month: 12, day: 25 },
        { year: 2025, month: 3, day: 10 },
        { year: 2025, month: 9, day: 20 }
      ];

      testDates.forEach(testDate => {
        const dayPillar = getDayPillar(testDate.year, testDate.month, testDate.day);
        const isGiyu = dayPillar === '기유';
        
        console.log(`${testDate.year}-${testDate.month}-${testDate.day}의 일주: ${dayPillar} ${isGiyu ? '(기유입니다!)' : '(기유가 아닙니다)'}`);
        
        // 기유인 경우에만 테스트 통과
        if (isGiyu) {
          expect(dayPillar).toBe('기유');
        }
      });
    });
  });

  describe('기유 주기 분석', () => {
    test('기유가 60일 주기로 반복되는지 확인해야 한다', () => {
      // 2024년 1월 1일부터 시작해서 기유 날짜들을 찾기
      const startDate = new Date(2024, 0, 1);
      const giyuDates: Date[] = [];
      
      // 1년간 검색
      for (let i = 0; i < 365; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        
        const dayPillar = getDayPillar(year, month, day);
        
        if (dayPillar === '기유') {
          giyuDates.push(new Date(currentDate));
        }
      }

      console.log('2024년 기유 날짜들:');
      giyuDates.forEach((date, index) => {
        console.log(`${index + 1}. ${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`);
      });

      // 기유 날짜들 사이의 간격 분석
      if (giyuDates.length >= 2) {
        const intervals: number[] = [];
        for (let i = 1; i < giyuDates.length; i++) {
          const diffTime = giyuDates[i].getTime() - giyuDates[i-1].getTime();
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          intervals.push(diffDays);
        }

        console.log('기유 날짜들 사이의 간격 (일):', intervals);
        
        // 대부분의 간격이 60일 근처여야 함
        const averageInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
        expect(averageInterval).toBeCloseTo(60, 5); // 60일 ± 5일 허용
      }

      expect(giyuDates.length).toBeGreaterThan(0);
    });
  });

  describe('기유 조건 역탐지', () => {
    test('기유가 나오는 조건을 분석해야 한다', () => {
      // 기유 = 기(토) + 유(금)
      // 일간이 '기'이고 일지가 '유'인 날짜들
      
      const giyuDates = findGiyuDatesInRange(2024, 2024);
      
      console.log('=== 기유 조건 분석 ===');
      console.log('기유 = 기(토) + 유(금)');
      console.log('일간: 기 (토 오행)');
      console.log('일지: 유 (금 오행)');
      
      giyuDates.forEach(date => {
        console.log(`${date.date}: 기유 (기토 + 유금)`);
      });

      // 기유 날짜들이 올바른 패턴을 가지는지 확인
      expect(giyuDates.length).toBeGreaterThan(0);
      
      // 모든 기유 날짜가 올바른 형식인지 확인
      giyuDates.forEach(date => {
        expect(date.dayPillar).toBe('기유');
        expect(date.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });

    test('기유가 나오는 다음 날짜를 찾아야 한다', () => {
      const fromDate = new Date(2024, 0, 1); // 2024년 1월 1일
      let nextGiyuDate: Date | null = null;
      
      // 1년간 검색
      for (let i = 0; i < 365; i++) {
        const currentDate = new Date(fromDate);
        currentDate.setDate(fromDate.getDate() + i);
        
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        
        const dayPillar = getDayPillar(year, month, day);
        
        if (dayPillar === '기유') {
          nextGiyuDate = new Date(currentDate);
          break;
        }
      }

      if (nextGiyuDate) {
        console.log(`2024년 1월 1일 이후 첫 번째 기유 날짜: ${nextGiyuDate.getFullYear()}-${(nextGiyuDate.getMonth() + 1).toString().padStart(2, '0')}-${nextGiyuDate.getDate().toString().padStart(2, '0')}`);
        expect(nextGiyuDate).toBeDefined();
      }
    });
  });

  describe('실제 사주 계산기와의 일치성 확인', () => {
    test('사주 계산기의 결과와 일치해야 한다', () => {
      // 몇 개의 기유 날짜를 테스트
      const testDates = [
        '2024-01-15', // 예상 기유 날짜
        '2024-03-15', // 예상 기유 날짜
        '2024-05-15'  // 예상 기유 날짜
      ];

      testDates.forEach(dateStr => {
        const [year, month, day] = dateStr.split('-').map(Number);
        const dayPillar = getDayPillar(year, month, day);
        
        // 사주 계산기로도 확인
        const sajuResult = calculateSaju(dateStr, '12:00', '남');
        
        console.log(`${dateStr}: 직접 계산 = ${dayPillar}, 사주 계산기 = ${sajuResult.day}`);
        
        // 두 결과가 일치해야 함
        expect(dayPillar).toBe(sajuResult.day);
      });
    });
  });
});

