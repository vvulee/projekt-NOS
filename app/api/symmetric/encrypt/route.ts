import { NextRequest, NextResponse } from 'next/server';
import { encryptSymmetric } from '@/lib/crypto-utils';

export async function POST(request: NextRequest) {
  try {
    const { data, key } = await request.json();

    if (!data || !key) {
      return NextResponse.json({ error: 'Missing data or key' }, { status: 400 });
    }

    const encrypted = encryptSymmetric(data, key);
    return NextResponse.json({ encrypted });
  } catch (error) {
    return NextResponse.json({ error: 'Encryption failed' }, { status: 500 });
  }
}
