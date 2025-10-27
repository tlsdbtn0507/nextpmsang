import { calculateSaju } from '../src/utils/sajuCalculator';

describe('월간 정확도 테스트', () => {
  test('1997-05-07의 월주는 을사여야 한다', () => {
    const result = calculateSaju('1997-05-07', '12:00', '남', '서울');
    
    console.log('\n=== 1997-05-07 월주 테스트 ===');
    console.log(`월주: ${result.month}`);
    console.log(`월의 천간: ${result.month[0]}`);
    console.log(`기대값: 을`);
    
    expect(result.month[0]).toBe('을');
  });
  
  test('1997-08-28의 월주는 무술이어야 한다', () => {
    const result = calculateSaju('1997-08-28', '12:00', '남', '서울');
    
    console.log('\n=== 1997-08-28 월주 테스트 ===');
    console.log(`월주: ${result.month}`);
    console.log(`월의 천간: ${result.month[0]}`);
    console.log(`기대값: 무`);
    
    expect(result.month[0]).toBe('무');
  });
});


