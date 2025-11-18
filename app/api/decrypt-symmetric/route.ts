import { NextRequest, NextResponse } from 'next/server';
import { decryptSymmetric } from '@/lib/crypto-utils';

export async function POST(request: NextRequest) {
  try {
    const { encrypted, key } = await request.json();

    if (!encrypted || !key) {
      return NextResponse.json({ error: 'Missing encrypted data or key' }, { status: 400 });
    }

    const decrypted = decryptSymmetric(encrypted, key);
    return NextResponse.json({ decrypted });
  } catch (error) {
    return NextResponse.json({ error: 'Decryption failed' }, { status: 500 });
  }
}
