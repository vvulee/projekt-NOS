import { NextRequest, NextResponse } from 'next/server';
import { decryptAsymmetric } from '@/lib/crypto-utils';

export async function POST(request: NextRequest) {
  try {
    const { encryptedData, privateKey } = await request.json();

    if (!encryptedData || !privateKey) {
      return NextResponse.json({ error: 'Missing encryptedData or privateKey' }, { status: 400 });
    }

    const decrypted = decryptAsymmetric(encryptedData, privateKey);
    return NextResponse.json({ decrypted });
  } catch (error) {
    return NextResponse.json({ error: 'Decryption failed' }, { status: 500 });
  }
}
