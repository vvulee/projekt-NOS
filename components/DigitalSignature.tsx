'use client';

import { useState } from 'react';

export default function DigitalSignature() {
  const [data, setData] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [signature, setSignature] = useState('');
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);

  const generateKeyPair = async () => {
    const response = await fetch('/api/asymmetric/generate-keypair');
    const data = await response.json();
    setPublicKey(data.publicKey);
    setPrivateKey(data.privateKey);
  };

  const sign = async () => {
    const response = await fetch('/api/signature/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, privateKey }),
    });
    const result = await response.json();
    setSignature(result.signature);
    setVerificationResult(null);
  };

  const verify = async () => {
    const response = await fetch('/api/signature/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, signature, publicKey }),
    });
    const result = await response.json();
    setVerificationResult(result.valid);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Digitalni potpis</h2>

      <div>
        <button
          onClick={generateKeyPair}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Generiraj par ključeva
        </button>
      </div>

      {publicKey && (
        <div>
          <label className="block text-sm font-medium mb-1">Javni ključ:</label>
          <textarea
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-800 font-mono text-xs"
            rows={4}
          />
        </div>
      )}

      {privateKey && (
        <div>
          <label className="block text-sm font-medium mb-1">Privatni ključ:</label>
          <textarea
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-800 font-mono text-xs"
            rows={4}
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Podaci za potpisivanje:</label>
        <textarea
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="w-full p-2 border rounded bg-white dark:bg-gray-900"
          rows={3}
          placeholder="Unesite podatke..."
        />
      </div>

      <button
        onClick={sign}
        disabled={!data || !privateKey}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
      >
        Potpiši
      </button>

      {signature && (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">Digitalni potpis:</label>
            <textarea
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-800 font-mono text-xs"
              rows={4}
            />
          </div>

          <button
            onClick={verify}
            disabled={!signature || !data || !publicKey}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400"
          >
            Verificiraj potpis
          </button>
        </>
      )}

      {verificationResult !== null && (
        <div className={`p-4 rounded ${verificationResult ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
          <p className="font-semibold">
            {verificationResult ? '✓ Potpis je validan' : '✗ Potpis nije validan'}
          </p>
        </div>
      )}
    </div>
  );
}
