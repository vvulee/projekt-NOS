'use client';

import { useState } from 'react';

export default function SymmetricEncryption() {
  const [plaintext, setPlaintext] = useState('');
  const [key, setKey] = useState('');
  const [encrypted, setEncrypted] = useState('');
  const [decrypted, setDecrypted] = useState('');

  const generateKey = async () => {
    const response = await fetch('/api/symmetric/generate-key');
    const data = await response.json();
    setKey(data.key);
  };

  const encrypt = async () => {
    const response = await fetch('/api/symmetric/encrypt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: plaintext, key }),
    });
    const data = await response.json();
    setEncrypted(data.encrypted);
  };

  const decrypt = async () => {
    const response = await fetch('/api/symmetric/decrypt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ encryptedData: encrypted, key }),
    });
    const data = await response.json();
    setDecrypted(data.decrypted);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Simetrično kriptiranje (AES-256)</h2>

      <div>
        <button
          onClick={generateKey}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Generiraj ključ
        </button>
      </div>

      {key && (
        <div>
          <label className="block text-sm font-medium mb-1">Ključ:</label>
          <textarea
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-800 font-mono text-xs"
            rows={2}
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Tekst za kriptiranje:</label>
        <textarea
          value={plaintext}
          onChange={(e) => setPlaintext(e.target.value)}
          className="w-full p-2 border rounded bg-white dark:bg-gray-900"
          rows={3}
          placeholder="Unesite tekst..."
        />
      </div>

      <button
        onClick={encrypt}
        disabled={!plaintext || !key}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
      >
        Kriptiraj
      </button>

      {encrypted && (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">Kriptirani tekst:</label>
            <textarea
              value={encrypted}
              onChange={(e) => setEncrypted(e.target.value)}
              className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-800 font-mono text-xs"
              rows={3}
            />
          </div>

          <button
            onClick={decrypt}
            disabled={!encrypted || !key}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400"
          >
            Dekriptiraj
          </button>
        </>
      )}

      {decrypted && (
        <div>
          <label className="block text-sm font-medium mb-1">Dekriptirani tekst:</label>
          <textarea
            value={decrypted}
            readOnly
            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-800"
            rows={3}
          />
        </div>
      )}
    </div>
  );
}
