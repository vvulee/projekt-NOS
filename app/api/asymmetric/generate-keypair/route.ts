import { NextResponse } from 'next/server';
import { generateKeyPair } from '@/lib/crypto-utils';

export async function GET() {
  try {
    const keyPair = generateKeyPair();
    return NextResponse.json(keyPair);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate keypair' }, { status: 500 });
  }
}
