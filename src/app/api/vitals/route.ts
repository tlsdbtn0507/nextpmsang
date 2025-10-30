import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // 서버 콘솔에 로깅 (Vercel에서는 Logs에서 확인 가능)
    console.log('[WebVitals]', data);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'invalid' }, { status: 400 });
  }
}


