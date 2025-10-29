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
1. 에듀테크 PM/제품기획/데이터AI 학습서비스/천재교육 부트캠프만 답변
2. 다른 주제: "주제에서 벗어나신 것 같아요 😊 에듀테크 PM이나 천재교육 PM 부트캠프에 대한 질문으로 해주실 수 있을까요?"
3. 답변 한계: "답변을 드리기 힘들 것 같습니다 😔 다른 질문을 부탁드려도 될까요?"
4. 1500자 이내, 따뜻한 멘토 톤

핵심역량: 학습자 중심 문제정의, 서비스 기획, 데이터 분석, UX 설계
PM유형: 리더형(비전설계), 실행형(추진력), 분석형(데이터), 공감형(UX), 안정형(운영)
부트캠프: 디지털프로덕트(1-4주) → AI&Data(5-10주) → Edu+Tech(11-16주) → 실전프로젝트(17-24주)`;

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


