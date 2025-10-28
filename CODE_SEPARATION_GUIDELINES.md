# 코드 분리 가이드라인

## 📋 개요
이 문서는 NextPMsang 프로젝트의 코드 분리 및 정리 가이드라인을 정의합니다.

## 🎯 목표
- 코드의 가독성 향상
- 재사용성 증대
- 유지보수성 개선
- 파일 크기 최적화

## 📁 파일 구조 규칙

### 1. 헬퍼 함수 분리
- **위치**: `src/utils/` 디렉토리
- **네이밍**: 기능별로 명확한 이름 사용
  - `sajuHelpers.ts`: 사주 관련 헬퍼 함수
  - `chatHelpers.ts`: 채팅 관련 헬퍼 함수
  - `validationHelpers.ts`: 검증 관련 헬퍼 함수

### 2. 컴포넌트 분리 기준
- **파일 크기**: 200줄 이상인 컴포넌트는 분리 고려
- **책임 분리**: 단일 책임 원칙 적용
- **재사용성**: 다른 곳에서도 사용 가능한 컴포넌트는 분리

### 3. 상수 분리
- **위치**: `src/types/` 또는 `src/constants/`
- **네이밍**: `*Constants.ts` 패턴 사용

## 🔧 분리 규칙

### 헬퍼 함수 분리 시
```typescript
// ❌ 잘못된 예: 컴포넌트 내부에 헬퍼 함수 정의
export default function MyComponent() {
  const helperFunction = () => { /* ... */ };
  // ...
}

// ✅ 올바른 예: 별도 파일로 분리
// src/utils/myHelpers.ts
export function helperFunction() { /* ... */ }

// src/components/MyComponent.tsx
import { helperFunction } from '@/utils/myHelpers';
```

### 컴포넌트 분리 시
```typescript
// ❌ 잘못된 예: 너무 긴 컴포넌트
export default function LongComponent() {
  // 300줄 이상의 코드...
}

// ✅ 올바른 예: 작은 단위로 분리
// src/components/LongComponent/Header.tsx
export function Header() { /* ... */ }

// src/components/LongComponent/Body.tsx
export function Body() { /* ... */ }

// src/components/LongComponent/index.tsx
export { Header, Body } from './Header';
export { Body } from './Body';
```

## 🚫 제거 대상

### 사용되지 않는 함수
- 다른 파일에서 import되지 않는 함수
- 컴포넌트 내부에서 정의되었지만 사용되지 않는 함수

### 사용되지 않는 컴포넌트
- 다른 컴포넌트에서 import되지 않는 컴포넌트
- 라우트에서 사용되지 않는 컴포넌트

### 사용되지 않는 import
- 실제로 사용되지 않는 import 문
- 중복된 import 문

## 📊 코드 품질 기준

### 파일 크기
- **컴포넌트**: 200줄 이하 권장
- **헬퍼 함수**: 100줄 이하 권장
- **타입 정의**: 50줄 이하 권장

### 함수 크기
- **일반 함수**: 20줄 이하 권장
- **컴포넌트 함수**: 50줄 이하 권장

### 복잡도
- **순환 복잡도**: 10 이하 권장
- **중첩 깊이**: 3단계 이하 권장

## 🔍 정리 체크리스트

### 정기적 정리 (주 1회)
- [ ] 사용되지 않는 함수 제거
- [ ] 사용되지 않는 import 제거
- [ ] 중복 코드 제거
- [ ] 파일 크기 확인

### 리팩토링 시 체크리스트
- [ ] 단일 책임 원칙 준수
- [ ] 재사용 가능한 코드 분리
- [ ] 적절한 네이밍 사용
- [ ] 타입 안정성 확보

## 🛠️ 도구 및 명령어

### 코드 분석 도구
```bash
# 사용되지 않는 import 찾기
npx eslint --ext .ts,.tsx src/ --fix

# 파일 크기 분석
find src -name "*.ts" -o -name "*.tsx" | xargs wc -l | sort -n

# 복잡도 분석
npx eslint --ext .ts,.tsx src/ --rule 'complexity: [2, 10]'
```

### 자동 정리 명령어
```bash
# 린트 자동 수정
npm run lint:fix

# 포맷팅
npm run format

# 타입 체크
npm run type-check
```

## 📝 예시

### Before (분리 전)
```typescript
// src/app/page.tsx (500줄)
export default function Page() {
  // 헬퍼 함수들 (50줄)
  function helper1() { /* ... */ }
  function helper2() { /* ... */ }
  
  // 메인 로직 (450줄)
  // ...
}
```

### After (분리 후)
```typescript
// src/utils/pageHelpers.ts (50줄)
export function helper1() { /* ... */ }
export function helper2() { /* ... */ }

// src/app/page.tsx (200줄)
import { helper1, helper2 } from '@/utils/pageHelpers';
export default function Page() {
  // 메인 로직만 (200줄)
  // ...
}
```

## 🎯 성과 지표

### 정량적 지표
- 평균 파일 크기 감소율
- 중복 코드 제거율
- 사용되지 않는 코드 제거율

### 정성적 지표
- 코드 가독성 향상
- 개발 속도 향상
- 버그 발생률 감소

---

**마지막 업데이트**: 2024년 12월
**담당자**: 개발팀
