import { NextResponse } from 'next/server';
import { generateKeys } from '@/lib/crypto-utils';

export async function POST() {
  try {
    const keys = generateKeys();
    return NextResponse.json(keys);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate keys' }, { status: 500 });
  }
}
