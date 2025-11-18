'use client';

import { useState } from 'react';

export default function AsymmetricEncryption() {
  const [plaintext, setPlaintext] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [encrypted, setEncrypted] = useState('');
  const [decrypted, setDecrypted] = useState('');

  const generateKeyPair = async () => {
    const response = await fetch('/api/asymmetric/generate-keypair');
    const data = await response.json();
    setPublicKey(data.publicKey);
    setPrivateKey(data.privateKey);
  };

  const encrypt = async () => {
    const response = await fetch('/api/asymmetric/encrypt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: plaintext, publicKey }),
    });
    const data = await response.json();
    setEncrypted(data.encrypted);
  };

  const decrypt = async () => {
    const response = await fetch('/api/asymmetric/decrypt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ encryptedData: encrypted, privateKey }),
    });
    const data = await response.json();
    setDecrypted(data.decrypted);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Asimetrično kriptiranje (RSA)</h2>

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
        <label className="block text-sm font-medium mb-1">Tekst za kriptiranje:</label>
        <textarea
          value={plaintext}
          onChange={(e) => setPlaintext(e.target.value)}
          className="w-full p-2 border rounded bg-white dark:bg-gray-900"
          rows={3}
          placeholder="Unesite tekst (max 190 znakova)..."
        />
      </div>

      <button
        onClick={encrypt}
        disabled={!plaintext || !publicKey}
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
              rows={4}
            />
          </div>

          <button
            onClick={decrypt}
            disabled={!encrypted || !privateKey}
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
