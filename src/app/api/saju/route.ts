import { NextRequest, NextResponse } from 'next/server';
import { UserInfo } from '@/types/saju';
import { calculateSaju, analyzeSaju, getDetailedSajuInfo } from '@/utils/sajuCalculator';


export async function POST(request: NextRequest) {
  try {
    const userInfo: UserInfo = await request.json();
    
    // 정확한 만세력 계산 (수학적 알고리즘 사용)
    const sajuResult = calculateSaju(
      userInfo.birthDate,
      userInfo.birthTime,
      userInfo.gender
    );
    
    // 사진과 같은 상세 사주 정보 생성
    const detailedSaju = getDetailedSajuInfo(
      userInfo.birthDate,
      userInfo.birthTime,
      userInfo.gender
    );
    
    // 사주 분석
    const analysisResult = analyzeSaju(sajuResult);

    return NextResponse.json({
      status: 'success',
      saju: sajuResult,
      four_pillars: detailedSaju,
      analysis: analysisResult,
      birth_date: userInfo.birthDate,
      birth_time: userInfo.birthTime,
      gender: userInfo.gender
    });

  } catch (error) {
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
