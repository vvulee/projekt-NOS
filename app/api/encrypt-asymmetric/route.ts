import { NextRequest, NextResponse } from 'next/server';
import { encryptHybrid } from '@/lib/crypto-utils';

export async function POST(request: NextRequest) {
  try {
    const { data, publicKey } = await request.json();

    if (!data || !publicKey) {
      return NextResponse.json({ error: 'Missing data or publicKey' }, { status: 400 });
    }

    const encrypted = encryptHybrid(data, publicKey);
    return NextResponse.json({ encrypted });
  } catch (error) {
    return NextResponse.json({ error: 'Encryption failed' }, { status: 500 });
  }
}
