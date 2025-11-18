'use client';

import { useState, useRef } from 'react';
import { downloadTextFile } from '@/lib/download-utils';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<boolean | null>(null);

  const [openSection, setOpenSection] = useState<number | null>(null);

  const [previewSymmetricEncrypt, setPreviewSymmetricEncrypt] = useState('');
  const [previewSymmetricDecrypt, setPreviewSymmetricDecrypt] = useState('');
  const [previewHybridEncrypt, setPreviewHybridEncrypt] = useState('');
  const [previewHybridDecrypt, setPreviewHybridDecrypt] = useState('');
  const [previewHash, setPreviewHash] = useState('');
  const [previewSignature, setPreviewSignature] = useState('');

  const fileInputRefs = {
    encryptSymmetric: useRef<HTMLInputElement>(null),
    encryptSymmetricKey: useRef<HTMLInputElement>(null),
    decryptSymmetric: useRef<HTMLInputElement>(null),
    decryptSymmetricKey: useRef<HTMLInputElement>(null),
    encryptHybrid: useRef<HTMLInputElement>(null),
    encryptHybridKey: useRef<HTMLInputElement>(null),
    decryptHybrid: useRef<HTMLInputElement>(null),
    decryptHybridKey: useRef<HTMLInputElement>(null),
    hash: useRef<HTMLInputElement>(null),
    signFile: useRef<HTMLInputElement>(null),
    signKey: useRef<HTMLInputElement>(null),
    verifyFile: useRef<HTMLInputElement>(null),
    verifySignature: useRef<HTMLInputElement>(null),
    verifyKey: useRef<HTMLInputElement>(null),
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const toggleSection = (section: number) => {
    setOpenSection(openSection === section ? null : section);
  };

  const clearInputs = (refs: React.RefObject<HTMLInputElement>[]) => {
    refs.forEach(ref => {
      if (ref.current) {
        ref.current.value = '';
      }
    });
  };

  const handleGenerateKeys = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/generate-keys', { method: 'POST' });
      if (!response.ok) throw new Error('Greška pri generiranju ključeva');
      const data = await response.json();

      downloadTextFile(data.symmetricKey, 'tajni_kljuc.txt');
      await new Promise(resolve => setTimeout(resolve, 100));
      downloadTextFile(data.publicKey, 'javni_kljuc.txt');
      await new Promise(resolve => setTimeout(resolve, 100));
      downloadTextFile(data.privateKey, 'privatni_kljuc.txt');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nepoznata greška');
    } finally {
      setLoading(false);
    }
  };

  const handleEncryptSymmetric = async () => {
    setLoading(true);
    setError('');
    setPreviewSymmetricEncrypt('');
    try {
      const fileInput = fileInputRefs.encryptSymmetric.current;
      const keyInput = fileInputRefs.encryptSymmetricKey.current;

      if (!fileInput?.files?.[0]) throw new Error('Odaberite datoteku za kriptiranje');
      if (!keyInput?.files?.[0]) throw new Error('Odaberite tajni_kljuc.txt');

      const fileContent = await readFileAsText(fileInput.files[0]);
      const keyContent = await readFileAsText(keyInput.files[0]);

      const response = await fetch('/api/encrypt-symmetric', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: fileContent, key: keyContent.trim() }),
      });

      if (!response.ok) throw new Error('Greška pri kriptiranju');
      const data = await response.json();

      setPreviewSymmetricEncrypt(data.encrypted);
      downloadTextFile(data.encrypted, 'kriptirano.txt');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nepoznata greška');
    } finally {
      setLoading(false);
    }
  };

  const handleDecryptSymmetric = async () => {
    setLoading(true);
    setError('');
    setPreviewSymmetricDecrypt('');
    try {
      const fileInput = fileInputRefs.decryptSymmetric.current;
      const keyInput = fileInputRefs.decryptSymmetricKey.current;

      if (!fileInput?.files?.[0]) throw new Error('Odaberite kriptirano.txt');
      if (!keyInput?.files?.[0]) throw new Error('Odaberite tajni_kljuc.txt');

      const fileContent = await readFileAsText(fileInput.files[0]);
      const keyContent = await readFileAsText(keyInput.files[0]);

      const response = await fetch('/api/decrypt-symmetric', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ encrypted: fileContent.trim(), key: keyContent.trim() }),
      });

      if (!response.ok) throw new Error('Greška pri dekriptiranju');
      const data = await response.json();

      setPreviewSymmetricDecrypt(data.decrypted);
      downloadTextFile(data.decrypted, 'dekriptirano.txt');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nepoznata greška');
    } finally {
      setLoading(false);
    }
  };

  const handleEncryptHybrid = async () => {
    setLoading(true);
    setError('');
    setPreviewHybridEncrypt('');
    try {
      const fileInput = fileInputRefs.encryptHybrid.current;
      const keyInput = fileInputRefs.encryptHybridKey.current;

      if (!fileInput?.files?.[0]) throw new Error('Odaberite datoteku za kriptiranje');
      if (!keyInput?.files?.[0]) throw new Error('Odaberite javni_kljuc.txt');

      const fileContent = await readFileAsText(fileInput.files[0]);
      const keyContent = await readFileAsText(keyInput.files[0]);

      const response = await fetch('/api/encrypt-asymmetric', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: fileContent, publicKey: keyContent }),
      });

      if (!response.ok) throw new Error('Greška pri hibridnom kriptiranju');
      const data = await response.json();

      setPreviewHybridEncrypt(data.encrypted);
      downloadTextFile(data.encrypted, 'kriptirano_hibridno.txt');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nepoznata greška');
    } finally {
      setLoading(false);
    }
  };

  const handleDecryptHybrid = async () => {
    setLoading(true);
    setError('');
    setPreviewHybridDecrypt('');
    try {
      const fileInput = fileInputRefs.decryptHybrid.current;
      const keyInput = fileInputRefs.decryptHybridKey.current;

      if (!fileInput?.files?.[0]) throw new Error('Odaberite kriptirano_hibridno.txt');
      if (!keyInput?.files?.[0]) throw new Error('Odaberite privatni_kljuc.txt');

      const fileContent = await readFileAsText(fileInput.files[0]);
      const keyContent = await readFileAsText(keyInput.files[0]);

      const response = await fetch('/api/decrypt-asymmetric', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ encrypted: fileContent.trim(), privateKey: keyContent }),
      });

      if (!response.ok) throw new Error('Greška pri hibridnom dekriptiranju');
      const data = await response.json();

      setPreviewHybridDecrypt(data.decrypted);
      downloadTextFile(data.decrypted, 'dekriptirano_hibridno.txt');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nepoznata greška');
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateHash = async () => {
    setLoading(true);
    setError('');
    setPreviewHash('');
    try {
      const fileInput = fileInputRefs.hash.current;

      if (!fileInput?.files?.[0]) throw new Error('Odaberite datoteku');

      const fileContent = await readFileAsText(fileInput.files[0]);

      const response = await fetch('/api/hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: fileContent }),
      });

      if (!response.ok) throw new Error('Greška pri hashiranju');
      const data = await response.json();

      setPreviewHash(data.hash);
      downloadTextFile(data.hash, 'sazetak.txt');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nepoznata greška');
    } finally {
      setLoading(false);
    }
  };

  const handleSign = async () => {
    setLoading(true);
    setError('');
    setPreviewSignature('');
    try {
      const fileInput = fileInputRefs.signFile.current;
      const keyInput = fileInputRefs.signKey.current;

      if (!fileInput?.files?.[0]) throw new Error('Odaberite datoteku za potpis');
      if (!keyInput?.files?.[0]) throw new Error('Odaberite privatni_kljuc.txt');

      const fileContent = await readFileAsText(fileInput.files[0]);
      const keyContent = await readFileAsText(keyInput.files[0]);

      const response = await fetch('/api/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: fileContent, privateKey: keyContent }),
      });

      if (!response.ok) throw new Error('Greška pri potpisivanju');
      const data = await response.json();

      setPreviewSignature(data.signature);
      downloadTextFile(data.signature, 'potpis.txt');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nepoznata greška');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setError('');
    setVerificationStatus(null);
    try {
      const fileInput = fileInputRefs.verifyFile.current;
      const signatureInput = fileInputRefs.verifySignature.current;
      const keyInput = fileInputRefs.verifyKey.current;

      if (!fileInput?.files?.[0]) throw new Error('Odaberite originalnu datoteku');
      if (!signatureInput?.files?.[0]) throw new Error('Odaberite potpis.txt');
      if (!keyInput?.files?.[0]) throw new Error('Odaberite javni_kljuc.txt');

      const fileContent = await readFileAsText(fileInput.files[0]);
      const signatureContent = await readFileAsText(signatureInput.files[0]);
      const keyContent = await readFileAsText(keyInput.files[0]);

      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: fileContent,
          signature: signatureContent.trim(),
          publicKey: keyContent,
        }),
      });

      if (!response.ok) throw new Error('Greška pri provjeri potpisa');
      const data = await response.json();

      setVerificationStatus(data.valid);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nepoznata greška');
    } finally {
      setLoading(false);
    }
  };

  const AccordionSection = ({
    sectionNumber,
    title,
    description,
    children
  }: {
    sectionNumber: number;
    title: string;
    description: string;
    children: React.ReactNode;
  }) => {
    const isOpen = openSection === sectionNumber;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4 overflow-hidden">
        <button
          onClick={() => toggleSection(sectionNumber)}
          className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {sectionNumber}. {title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {description}
            </p>
          </div>
          <svg
            className={`w-6 h-6 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            {children}
          </div>
        )}
      </div>
    );
  };

  const PreviewBox = ({ content }: { content: string }) => {
    if (!content) return null;

    return (
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Pregled rezultata:
        </label>
        <textarea
          value={content}
          readOnly
          className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-mono text-xs"
          style={{ maxHeight: '300px', minHeight: '100px' }}
          rows={8}
        />
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-800 dark:text-gray-100">
          Kriptiranje i Digitalni Potpis
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
          Klikni na sekciju za prikaz opcija
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg">
            {error}
          </div>
        )}

        <AccordionSection
          sectionNumber={1}
          title="Generiranje ključeva"
          description="Generiraj RSA par ključeva (2048-bit) i AES simetrični ključ (256-bit)"
        >
          <button
            onClick={handleGenerateKeys}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {loading ? 'Generiranje...' : 'Generiraj ključeve'}
          </button>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
            Automatski će se preuzeti 3 datoteke: tajni_kljuc.txt, javni_kljuc.txt, privatni_kljuc.txt
          </p>
        </AccordionSection>

        <AccordionSection
          sectionNumber={2}
          title="Simetrično kriptiranje (AES-256-CBC)"
          description="Kriptiraj datoteku koristeći AES-256-CBC algoritam"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Odaberi datoteku za kriptiranje:
              </label>
              <input
                ref={fileInputRefs.encryptSymmetric}
                type="file"
                className="block w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 focus:outline-none p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Odaberi tajni_kljuc.txt:
              </label>
              <input
                ref={fileInputRefs.encryptSymmetricKey}
                type="file"
                accept=".txt"
                className="block w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 focus:outline-none p-2"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleEncryptSymmetric}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading ? 'Kriptiranje...' : 'Kriptiraj (AES-256)'}
              </button>
              <button
                onClick={() => {
                  clearInputs([fileInputRefs.encryptSymmetric, fileInputRefs.encryptSymmetricKey]);
                  setPreviewSymmetricEncrypt('');
                }}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Očisti
              </button>
            </div>

            <PreviewBox content={previewSymmetricEncrypt} />
          </div>
        </AccordionSection>

        <AccordionSection
          sectionNumber={3}
          title="Simetrično dekriptiranje (AES-256-CBC)"
          description="Dekriptiraj kriptiranu datoteku"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Odaberi kriptirano.txt:
              </label>
              <input
                ref={fileInputRefs.decryptSymmetric}
                type="file"
                accept=".txt"
                className="block w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 focus:outline-none p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Odaberi tajni_kljuc.txt:
              </label>
              <input
                ref={fileInputRefs.decryptSymmetricKey}
                type="file"
                accept=".txt"
                className="block w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 focus:outline-none p-2"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleDecryptSymmetric}
                disabled={loading}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
              >
                {loading ? 'Dekriptiranje...' : 'Dekriptiraj'}
              </button>
              <button
                onClick={() => {
                  clearInputs([fileInputRefs.decryptSymmetric, fileInputRefs.decryptSymmetricKey]);
                  setPreviewSymmetricDecrypt('');
                }}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Očisti
              </button>
            </div>

            <PreviewBox content={previewSymmetricDecrypt} />
          </div>
        </AccordionSection>

        <AccordionSection
          sectionNumber={4}
          title="Hibridno kriptiranje (RSA + AES)"
          description="Kriptiraj datoteku bilo koje veličine koristeći hibridni algoritam"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Odaberi datoteku za kriptiranje:
              </label>
              <input
                ref={fileInputRefs.encryptHybrid}
                type="file"
                className="block w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 focus:outline-none p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Odaberi javni_kljuc.txt:
              </label>
              <input
                ref={fileInputRefs.encryptHybridKey}
                type="file"
                accept=".txt"
                className="block w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 focus:outline-none p-2"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleEncryptHybrid}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading ? 'Kriptiranje...' : 'Kriptiraj (Hibridno: RSA + AES)'}
              </button>
              <button
                onClick={() => {
                  clearInputs([fileInputRefs.encryptHybrid, fileInputRefs.encryptHybridKey]);
                  setPreviewHybridEncrypt('');
                }}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Očisti
              </button>
            </div>

            <PreviewBox content={previewHybridEncrypt} />
          </div>
        </AccordionSection>

        <AccordionSection
          sectionNumber={5}
          title="Hibridno dekriptiranje (RSA + AES)"
          description="Dekriptiraj hibridno kriptiranu datoteku s privatnim ključem"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Odaberi kriptirano_hibridno.txt:
              </label>
              <input
                ref={fileInputRefs.decryptHybrid}
                type="file"
                accept=".txt"
                className="block w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 focus:outline-none p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Odaberi privatni_kljuc.txt:
              </label>
              <input
                ref={fileInputRefs.decryptHybridKey}
                type="file"
                accept=".txt"
                className="block w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 focus:outline-none p-2"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleDecryptHybrid}
                disabled={loading}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
              >
                {loading ? 'Dekriptiranje...' : 'Dekriptiraj'}
              </button>
              <button
                onClick={() => {
                  clearInputs([fileInputRefs.decryptHybrid, fileInputRefs.decryptHybridKey]);
                  setPreviewHybridDecrypt('');
                }}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Očisti
              </button>
            </div>

            <PreviewBox content={previewHybridDecrypt} />
          </div>
        </AccordionSection>

        <AccordionSection
          sectionNumber={6}
          title="Izračun sažetka (SHA-256)"
          description="Izračunaj SHA-256 hash od datoteke"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Odaberi datoteku:
              </label>
              <input
                ref={fileInputRefs.hash}
                type="file"
                className="block w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 focus:outline-none p-2"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCalculateHash}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading ? 'Računanje...' : 'Izračunaj Hash (SHA-256)'}
              </button>
              <button
                onClick={() => {
                  clearInputs([fileInputRefs.hash]);
                  setPreviewHash('');
                }}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Očisti
              </button>
            </div>

            <PreviewBox content={previewHash} />
          </div>
        </AccordionSection>

        <AccordionSection
          sectionNumber={7}
          title="Digitalno potpisivanje (RSA-SHA256)"
          description="Potpiši datoteku digitalnim potpisom koristeći privatni ključ"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Odaberi datoteku za potpis:
              </label>
              <input
                ref={fileInputRefs.signFile}
                type="file"
                className="block w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 focus:outline-none p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Odaberi privatni_kljuc.txt:
              </label>
              <input
                ref={fileInputRefs.signKey}
                type="file"
                accept=".txt"
                className="block w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 focus:outline-none p-2"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSign}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading ? 'Potpisivanje...' : 'Potpiši'}
              </button>
              <button
                onClick={() => {
                  clearInputs([fileInputRefs.signFile, fileInputRefs.signKey]);
                  setPreviewSignature('');
                }}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Očisti
              </button>
            </div>

            <PreviewBox content={previewSignature} />
          </div>
        </AccordionSection>

        <AccordionSection
          sectionNumber={8}
          title="Provjera digitalnog potpisa"
          description="Provjeri valjanost digitalnog potpisa - detektira promjene u datoteci ili potpisu"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Odaberi originalnu datoteku:
              </label>
              <input
                ref={fileInputRefs.verifyFile}
                type="file"
                className="block w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 focus:outline-none p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Odaberi potpis.txt:
              </label>
              <input
                ref={fileInputRefs.verifySignature}
                type="file"
                accept=".txt"
                className="block w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 focus:outline-none p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Odaberi javni_kljuc.txt:
              </label>
              <input
                ref={fileInputRefs.verifyKey}
                type="file"
                accept=".txt"
                className="block w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 focus:outline-none p-2"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleVerify}
                disabled={loading}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
              >
                {loading ? 'Provjera...' : 'Provjeri potpis'}
              </button>
              <button
                onClick={() => {
                  clearInputs([fileInputRefs.verifyFile, fileInputRefs.verifySignature, fileInputRefs.verifyKey]);
                  setVerificationStatus(null);
                }}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Očisti
              </button>
            </div>

            {verificationStatus !== null && (
              <div
                className={`p-6 rounded-lg text-center font-bold text-xl ${
                  verificationStatus
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                }`}
              >
                {verificationStatus ? '✅ POTPIS JE VALIDAN' : '❌ POTPIS NIJE VALIDAN'}
              </div>
            )}
          </div>
        </AccordionSection>
      </div>
    </main>
  );
}
