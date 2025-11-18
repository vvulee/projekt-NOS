import { NextRequest, NextResponse } from 'next/server';
import { verifySignature } from '@/lib/crypto-utils';

export async function POST(request: NextRequest) {
  try {
    const { data, signature, publicKey } = await request.json();

    if (!data || !signature || !publicKey) {
      return NextResponse.json({ error: 'Missing data, signature, or publicKey' }, { status: 400 });
    }

    const valid = verifySignature(data, signature, publicKey);
    return NextResponse.json({ valid });
  } catch (error) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
