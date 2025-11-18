import { NextResponse } from 'next/server';
import { generateSymmetricKey } from '@/lib/crypto-utils';

export async function GET() {
  try {
    const key = generateSymmetricKey();
    return NextResponse.json({ key });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate key' }, { status: 500 });
  }
}
