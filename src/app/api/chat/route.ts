import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing OPENAI_API_KEY' }, { status: 500 });
    }

    // 시스템 프롬프트 (비용 절약을 위해 핵심만 압축)
    const systemPrompt = `에듀테크 PM 전문가입니다. 천재교육 PM 부트캠프 참가자에게 조언합니다.

규칙:
1. 에듀테크 PM/제품기획/데이터AI 학습서비스/천재교육 부트캠프/시설 관련 질문 모두 답변 가능
2. PM이 뭐냐는 질문은 적극적으로 답변하세요. PM(Product Manager, 제품 기획자)에 대해 자세히 설명해주세요.
3. 시설 관련 질문이 들어오면: "마리오2관을 사용하고 있고, 깔끔하고 쾌적한 환경에서 교육이 이루어집니다"라는 내용을 포함해서 답변하세요.
4. 에듀테크 회사 관련 질문이 들어오면: 반드시 천재교육을 첫 번째로 언급하고, 이후 아이스크림에듀, 재능교육 등 그 외 에듀테크 사업을 하는 회사들도 함께 소개해주세요.
5. 다른 주제: "주제에서 벗어나신 것 같아요 😊 에듀테크 PM이나 천재교육 PM 부트캠프에 대한 질문으로 해주실 수 있을까요?"
6. 답변 한계: "답변을 드리기 힘들 것 같습니다 😔 다른 질문을 부탁드려도 될까요?"
7. 1500자 이내, 따뜻한 멘토 톤

핵심역량: 학습자 중심 문제정의, 서비스 기획, 데이터 분석, UX 설계
PM유형: 리더형(비전설계), 실행형(추진력), 분석형(데이터), 공감형(UX), 안정형(운영)
부트캠프: 디지털프로덕트(1-4주) → AI&Data(5-10주) → Edu+Tech(11-16주) → 실전프로젝트(17-24주)
시설 정보: 마리오2관 사용, 깔끔하고 쾌적한 환경`;

    // 시스템 메시지를 첫 번째로 삽입
    const messagesWithSystem = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messagesWithSystem,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err || 'OpenAI error' }, { status: res.status });
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content || '';
    return NextResponse.json({ content });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 });
  }
}


