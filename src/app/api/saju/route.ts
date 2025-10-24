import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { UserInfo } from '@/types/saju';
import { calculateSaju, analyzeSaju, getDetailedSajuInfo } from '@/utils/sajuCalculator';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


export async function POST(request: NextRequest) {
  try {
    const userInfo: UserInfo = await request.json();
    
    console.log('사용자 정보:', userInfo);
    
    // 정확한 만세력 계산 (수학적 알고리즘 사용)
    const sajuResult = calculateSaju(
      userInfo.birthDate,
      userInfo.birthTime,
      userInfo.gender,
      userInfo.address
    );
    
    // 사진과 같은 상세 사주 정보 생성
    const detailedSaju = getDetailedSajuInfo(
      userInfo.birthDate,
      userInfo.birthTime,
      userInfo.gender,
      userInfo.address
    );
    
    console.log('계산된 사주:', sajuResult);
    console.log('상세 사주 정보:', detailedSaju);
    
    // 사주 분석
    const analysisResult = analyzeSaju(sajuResult);
    
    console.log('분석 결과:', analysisResult);
    
    // GPT-4o mini를 사용한 추가 분석 (선택적)
    const gptPrompt = `
다음 사주 정보를 바탕으로 더 상세한 분석을 해주세요.

**계산된 사주 정보:**
- 년주: ${sajuResult.year}
- 월주: ${sajuResult.month}
- 일주: ${sajuResult.day}
- 시주: ${sajuResult.hour}
- 일간: ${sajuResult.dayStem}
- 일지: ${sajuResult.dayBranch}
- 오행: ${sajuResult.fiveElement}
- 십신: ${sajuResult.tenGod}

**사용자 정보:**
- 생년월일: ${userInfo.birthDate}
- 출생시간: ${userInfo.birthTime}
- 성별: ${userInfo.gender}
- 출생지역: ${userInfo.address}

위 사주 정보를 바탕으로 더 상세한 성격 분석과 인생 조언을 제공해주세요.
`;

    let gptAnalysis = null;
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "당신은 전문적인 사주명리학자입니다. 제공된 정확한 사주 정보를 바탕으로 상세한 분석을 해주세요."
          },
          {
            role: "user",
            content: gptPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      });

      gptAnalysis = completion.choices[0]?.message?.content;
    } catch (gptError) {
      console.warn('GPT 분석 실패, 기본 분석만 사용:', gptError);
    }

    return NextResponse.json({
      status: 'success',
      saju: sajuResult,
      four_pillars: detailedSaju,
      analysis: {
        ...analysisResult,
        gptAnalysis: gptAnalysis
      },
      birth_date: userInfo.birthDate,
      birth_time: userInfo.birthTime,
      gender: userInfo.gender,
      birth_place: userInfo.address
    });

  } catch (error) {
    console.error('사주 분석 API 오류:', error);
    return NextResponse.json(
      {
        status: 'error',
        error: '사주 분석 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}
