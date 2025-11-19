# Crypto Signatures App

Web aplikacija za kriptiranje i digitalne potpise izrađena u Next.js 14 s TypeScript-om.

## Opis projekta

Ova **file-based** aplikacija omogućava siguran rad s kriptografskim operacijama. Sve operacije rade s datotekama - nema copy/paste textarea polja. Podržava simetrično i asimetrično kriptiranje, digitalne potpise, i hash funkcije. Svi algoritmi se izvršavaju server-side koristeći Node.js built-in `crypto` modul.

## Tehnologije

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** za styling
- **Node.js crypto modul** za kriptografiju
- **FileReader API** za čitanje fileova
- **Blob API** za download fileova

## Pokretanje projekta lokalno

### 1. Instalacija dependencies

```bash
npm install
```

### 2. Development mode

```bash
npm run dev
```

Aplikacija će biti dostupna na [http://localhost:3000](http://localhost:3000)

### 3. Production build

```bash
npm run build
npm start
```

## Kako koristiti aplikaciju (File-based workflow)

### 1. Generiranje ključeva
1. Klikni **"Generiraj ključeve"**
2. Automatski će se preuzeti 3 datoteke:
   - `tajni_kljuc.txt` (AES-256 simetrični ključ)
   - `javni_kljuc.txt` (RSA javni ključ)
   - `privatni_kljuc.txt` (RSA privatni ključ)

### 2. Simetrično kriptiranje (AES-256-CBC)
1. Odaberi datoteku za kriptiranje
2. Odaberi `tajni_kljuc.txt`
3. Klikni **"Kriptiraj (AES-256)"**
4. Preuzmi `kriptirano.txt`

### 3. Simetrično dekriptiranje
1. Odaberi `kriptirano.txt`
2. Odaberi `tajni_kljuc.txt`
3. Klikni **"Dekriptiraj"**
4. Preuzmi `dekriptirano.txt`

### 4. Asimetrično kriptiranje (RSA-2048)
1. Odaberi datoteku za kriptiranje
2. Odaberi `javni_kljuc.txt`
3. Klikni **"Kriptiraj (RSA)"**
4. Preuzmi `kriptirano_rsa.txt`

### 5. Asimetrično dekriptiranje
1. Odaberi `kriptirano_rsa.txt`
2. Odaberi `privatni_kljuc.txt`
3. Klikni **"Dekriptiraj"**
4. Preuzmi `dekriptirano_rsa.txt`

### 6. Izračun sažetka (SHA-256)
1. Odaberi datoteku
2. Klikni **"Izračunaj Hash (SHA-256)"**
3. Preuzmi `sazetak.txt`

### 7. Digitalno potpisivanje
1. Odaberi datoteku za potpis
2. Odaberi `privatni_kljuc.txt`
3. Klikni **"Potpiši"**
4. Preuzmi `potpis.txt`

### 8. Provjera digitalnog potpisa
1. Odaberi originalnu datoteku
2. Odaberi `potpis.txt`
3. Odaberi `javni_kljuc.txt`
4. Klikni **"Provjeri potpis"**
5. Vidi rezultat: **POTPIS JE VALIDAN** ili **POTPIS NIJE VALIDAN**

## O projektu

Projekt izrađen za kolegij Napredni operacijski sustavi
