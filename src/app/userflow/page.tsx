'use client';

import { useEffect, useRef } from 'react';

export default function UserFlowPage() {
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMermaid = async () => {
      const mermaid = (await import('mermaid')).default;
      mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        themeVariables: {
          primaryColor: '#8B5CF6',
          primaryTextColor: '#1F2937',
          primaryBorderColor: '#7C3AED',
          lineColor: '#6B7280',
          sectionBkgColor: '#F3F4F6',
          altSectionBkgColor: '#E5E7EB',
          gridColor: '#D1D5DB',
          secondaryColor: '#EC4899',
          tertiaryColor: '#F59E0B'
        }
      });
      
      if (mermaidRef.current) {
        const definition = `
          graph TD
            A[사용자 접속] --> B[Welcome 화면]
            B --> C{사주 검사<br/>시작?}
            C -->|Yes| D[사주 정보 입력<br/>PMDiagnosisForm]
            C -->|No| E[채팅 시작<br/>ChatPanel]
            
            D --> F[생년월일시<br/>성별 입력]
            F --> G[사주 계산 API<br/>/api/saju]
            G --> H[Loading 화면]
            H --> I[사주 결과<br/>PMResultPage]
            
            I --> J{다음 선택}
            J -->|채팅으로 돌아가기| E
            J -->|다시 검사| D
            J -->|성향 테스트| K[QuestionnaireTest]
            J -->|부트캠프 신청| L[외부 링크]
            
            K --> M[성향 질문<br/>6개 문항]
            M --> N[성향 분석 완료]
            N --> O[최종 결과<br/>FinalResultPage]
            
            O --> P{최종 선택}
            P -->|부트캠프 신청| L
            P -->|채팅 시작| E
            
            E --> Q[AI 채팅<br/>/api/chat]
            Q --> R[FAQ 질문들]
            R --> S[추천 질문 선택]
            S --> T[AI 답변 생성]
            T --> U[채팅 제한<br/>2회 후 상담사 연결]
            
            style A fill:#8B5CF6,stroke:#7C3AED,stroke-width:2px,color:#fff
            style B fill:#EC4899,stroke:#DB2777,stroke-width:2px,color:#fff
            style D fill:#F59E0B,stroke:#D97706,stroke-width:2px,color:#fff
            style I fill:#10B981,stroke:#059669,stroke-width:2px,color:#fff
            style K fill:#3B82F6,stroke:#2563EB,stroke-width:2px,color:#fff
            style O fill:#8B5CF6,stroke:#7C3AED,stroke-width:2px,color:#fff
            style E fill:#EC4899,stroke:#DB2777,stroke-width:2px,color:#fff
            style Q fill:#10B981,stroke:#059669,stroke-width:2px,color:#fff
        `;
        // Mermaid v10+: render는 Promise를 반환합니다.
        const { svg } = await mermaid.render('userflow-diagram', definition, mermaidRef.current);
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = svg;
        }
      }
    };

    loadMermaid();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            내가 PM이 될 상인가 - 유저플로우
          </h1>
          <p className="text-lg text-gray-600">
            사주 기반 PM 적성 검사 및 에듀테크 PM 부트캠프 안내 서비스
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div ref={mermaidRef} className="flex justify-center items-center min-h-[600px]">
            <div className="text-gray-500">다이어그램 로딩 중...</div>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-purple-600 mb-3">주요 기능</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• 사주 기반 PM 적성 분석</li>
              <li>• 성향 테스트 (6문항)</li>
              <li>• AI 채팅 상담</li>
              <li>• 에듀테크 PM 부트캠프 안내</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-pink-600 mb-3">기술 스택</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Next.js 14 (App Router)</li>
              <li>• TypeScript</li>
              <li>• Tailwind CSS</li>
              <li>• OpenAI GPT-4o-mini</li>
              <li>• Mermaid.js</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-blue-600 mb-3">API 엔드포인트</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• /api/saju - 사주 계산</li>
              <li>• /api/chat - AI 채팅</li>
              <li>• /api/ai-interpretation - 결과 해석</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">플로우 설명</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-purple-600 mb-2">1. 사주 검사 플로우</h4>
              <p className="text-gray-600 text-sm">
                사용자가 생년월일시와 성별을 입력하면 사주를 계산하고 PM 적성을 분석합니다. 
                결과를 바탕으로 성향 테스트를 진행할 수 있습니다.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-pink-600 mb-2">2. 채팅 상담 플로우</h4>
              <p className="text-gray-600 text-sm">
                AI와 실시간 채팅으로 에듀테크 PM 관련 질문을 할 수 있습니다. 
                FAQ 질문들을 통해 부트캠프 정보를 얻을 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
