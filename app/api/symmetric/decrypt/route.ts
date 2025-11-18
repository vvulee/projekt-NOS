import { NextRequest, NextResponse } from 'next/server';
import { decryptSymmetric } from '@/lib/crypto-utils';

export async function POST(request: NextRequest) {
  try {
    const { encryptedData, key } = await request.json();

    if (!encryptedData || !key) {
      return NextResponse.json({ error: 'Missing encryptedData or key' }, { status: 400 });
    }

    const decrypted = decryptSymmetric(encryptedData, key);
    return NextResponse.json({ decrypted });
  } catch (error) {
    return NextResponse.json({ error: 'Decryption failed' }, { status: 500 });
  }
}
