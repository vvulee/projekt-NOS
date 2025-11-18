import { NextRequest, NextResponse } from 'next/server';
import { decryptHybrid } from '@/lib/crypto-utils';

export async function POST(request: NextRequest) {
  try {
    const { encrypted, privateKey } = await request.json();

    if (!encrypted || !privateKey) {
      return NextResponse.json({ error: 'Missing encrypted data or privateKey' }, { status: 400 });
    }

    const decrypted = decryptHybrid(encrypted, privateKey);
    return NextResponse.json({ decrypted });
  } catch (error) {
    return NextResponse.json({ error: 'Decryption failed' }, { status: 500 });
  }
}
