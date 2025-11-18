'use client';

import { useState } from 'react';

export default function HashFunction() {
  const [data, setData] = useState('');
  const [algorithm, setAlgorithm] = useState<'sha256' | 'sha512' | 'md5'>('sha256');
  const [hash, setHash] = useState('');

  const generateHash = async () => {
    const response = await fetch('/api/hash', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, algorithm }),
    });
    const result = await response.json();
    setHash(result.hash);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Hash funkcije</h2>

      <div>
        <label className="block text-sm font-medium mb-1">Algoritam:</label>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value as 'sha256' | 'sha512' | 'md5')}
          className="px-4 py-2 border rounded bg-white dark:bg-gray-900"
        >
          <option value="sha256">SHA-256</option>
          <option value="sha512">SHA-512</option>
          <option value="md5">MD5</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Podaci za hashiranje:</label>
        <textarea
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="w-full p-2 border rounded bg-white dark:bg-gray-900"
          rows={3}
          placeholder="Unesite podatke..."
        />
      </div>

      <button
        onClick={generateHash}
        disabled={!data}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
      >
        Generiraj Hash
      </button>

      {hash && (
        <div>
          <label className="block text-sm font-medium mb-1">Hash:</label>
          <textarea
            value={hash}
            readOnly
            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-800 font-mono text-xs"
            rows={2}
          />
        </div>
      )}
    </div>
  );
}
