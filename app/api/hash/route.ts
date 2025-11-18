import { NextRequest, NextResponse } from 'next/server';
import { hashData } from '@/lib/crypto-utils';

export async function POST(request: NextRequest) {
  try {
    const { data, algorithm } = await request.json();

    if (!data) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    const hash = hashData(data, algorithm || 'sha256');
    return NextResponse.json({ hash });
  } catch (error) {
    return NextResponse.json({ error: 'Hashing failed' }, { status: 500 });
  }
}
