import { NextRequest, NextResponse } from 'next/server';
import { signData } from '@/lib/crypto-utils';

export async function POST(request: NextRequest) {
  try {
    const { data, privateKey } = await request.json();

    if (!data || !privateKey) {
      return NextResponse.json({ error: 'Missing data or privateKey' }, { status: 400 });
    }

    const signature = signData(data, privateKey);
    return NextResponse.json({ signature });
  } catch (error) {
    return NextResponse.json({ error: 'Signing failed' }, { status: 500 });
  }
}
