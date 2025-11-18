import { NextRequest, NextResponse } from 'next/server';
import { encryptAsymmetric } from '@/lib/crypto-utils';

export async function POST(request: NextRequest) {
  try {
    const { data, publicKey } = await request.json();

    if (!data || !publicKey) {
      return NextResponse.json({ error: 'Missing data or publicKey' }, { status: 400 });
    }

    const encrypted = encryptAsymmetric(data, publicKey);
    return NextResponse.json({ encrypted });
  } catch (error) {
    return NextResponse.json({ error: 'Encryption failed' }, { status: 500 });
  }
}
