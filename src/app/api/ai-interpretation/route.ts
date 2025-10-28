import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: '프롬프트가 필요합니다.' },
        { status: 400 }
      );
    }
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `당신은 PM 전문가입니다. 
사용자의 정보를 바탕으로 제공된 PM_PERSONALITY_DATA를 참고하여 가장 유사한 성향을 찾아주세요.
간결하고 명확하게 응답하세요.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 200  // 비용 절감
    });
    
    const interpretation = completion.choices[0]?.message?.content || '';
    
    // 프롬프트 형식에 맞게 파싱
    let cleanInterpretation = interpretation;
    if (interpretation.includes('종합 해석:')) {
      cleanInterpretation = interpretation.split('종합 해석:')[1]?.trim() || interpretation;
    }
    
    return NextResponse.json({ interpretation: cleanInterpretation });
    
  } catch (error) {
    console.error('AI 해석 생성 오류:', error);
    return NextResponse.json(
      { error: 'AI 해석 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

