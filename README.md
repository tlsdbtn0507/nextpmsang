# 🌟 NextPMsang - 사주 기반 PM 성향 분석 앱

**NextPMsang**은 전통 사주학을 기반으로 Product Manager(PM)의 성향과 역량을 분석하는 웹 애플리케이션입니다. 출생 정보를 입력하면 정확한 만세력 계산을 통해 개인의 PM 스타일과 강점을 파악할 수 있습니다.

## 🎯 주요 기능

### 📊 **사주 기반 PM 성향 분석**
- **정확한 만세력 계산**: 1900년 1월 31일 경자일 기준의 정밀한 일주 계산
- **오행별 PM 스타일**: 목(비전형), 화(에너지형), 토(균형형), 금(분석형), 수(감각형)
- **일주별 특성 분석**: 60가지 일주에 따른 개별화된 PM 역량 분석

### 🗺️ **지역시 보정**
- **정밀한 경도 보정**: 서울 25개 구별 세밀한 시간 보정
- **한국 표준시 기준**: 동경 135도 기준의 정확한 지역시 계산

### 🎨 **직관적인 UI/UX**
- **모던한 디자인**: Tailwind CSS 기반의 반응형 디자인
- **채팅형 인터페이스**: 대화형 사주 분석 경험
- **실시간 계산**: 즉시 결과 확인 가능

## 🛠️ 기술 스택

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Testing**: Jest, ts-jest
- **Deployment**: Vercel (예정)

## 🚀 시작하기

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 테스트 실행
npm test

# 테스트 커버리지 확인
npm run test:coverage
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 📁 프로젝트 구조

```
src/
├── app/                 # Next.js App Router
│   ├── api/saju/       # 사주 계산 API
│   └── page.tsx        # 메인 페이지
├── components/         # React 컴포넌트
│   ├── PMResultPage.tsx    # 결과 페이지
│   ├── PMDiagnosisForm.tsx # 진단 폼
│   └── ...
├── utils/              # 유틸리티 함수
│   └── sajuCalculator.ts   # 사주 계산 로직
└── types/              # TypeScript 타입 정의
    ├── saju.ts
    └── sajuConstants.ts

tests/                  # Jest 테스트 파일
├── giyu-reverse.test.ts        # 기유 역탐지 테스트
├── 1997-birthday-analysis.test.ts # 특정 날짜 분석 테스트
└── giyu-investigation.test.ts  # 원인 조사 테스트
```

## 🧪 테스트

### 알고리즘 정확성 검증
- **기유 역탐지 테스트**: 60일 주기 일주 계산 검증
- **특정 날짜 분석**: 1997년 5월 7일 등 실제 사례 검증
- **만세력 비교**: 다양한 기준점으로 계산 정확성 확인

```bash
# 전체 테스트 실행
npm test

# 특정 테스트 실행
npm test tests/giyu-reverse.test.ts

# 테스트 커버리지
npm run test:coverage
```

## 📊 사주 계산 알고리즘

### 만세력 기준
- **기준일**: 1900년 1월 31일 (경자일)
- **계산 방식**: 일수 차이 기반 정밀 계산
- **주기**: 60일 주기로 정확한 일주 반복

### 지역시 보정
```typescript
// 서울 주요 지역 경도 보정값 (분 단위)
const longitudeAdjustments = {
  '서울': -30,    // 127.5° - 135° = -7.5° × 4분
  '강남구': -30,  // 127.0° 기준
  '강서구': -32,  // 126.8° 기준
  // ... 25개 구별 세밀한 보정
};
```

## 🎨 PM 성향 분석

### 오행별 PM 스타일
- **🌳 목(木)**: 비전 제시형 - 로드맵 설계자형 PM
- **🔥 화(火)**: 에너지형 - 실행력으로 제품을 움직이는 PM  
- **⛰️ 토(土)**: 균형형 - 팀의 중심을 잡는 PM
- **⚔️ 금(金)**: 분석형 - 데이터가 말할 때 움직이는 PM
- **💧 수(水)**: 감각형 - 유저의 마음을 읽는 PM

## 🔧 개발 환경 설정

### 필수 요구사항
- Node.js 18+
- npm 또는 yarn

### 환경 변수
```bash
# .env.local (필요시)
OPENAI_API_KEY=your_api_key_here
```

## 📈 향후 계획

- [ ] 더 정밀한 절기 계산 알고리즘
- [ ] 월주, 시주 분석 기능 확장
- [ ] PM 팀 궁합 분석 기능
- [ ] 개인화된 커리어 조언 시스템

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.

---

**NextPMsang**으로 당신만의 PM 성향을 발견해보세요! 🌟
