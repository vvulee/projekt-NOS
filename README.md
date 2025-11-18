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

## Deploy na Vercel

### Opcija 1: Vercel CLI

```bash
npm install -g vercel
vercel
```

### Opcija 2: Vercel Dashboard

1. Pushaj kod na GitHub
2. Idi na [vercel.com](https://vercel.com)
3. Klikni "New Project"
4. Importaj GitHub repository
5. Klikni "Deploy"

Vercel će automatski detektirati Next.js projekt i konfigurirati build settings.

## Struktura projekta

```
/app
  /api                    - Backend API routes
    /generate-keys        - Generiranje ključeva
    /encrypt-symmetric    - Simetrično kriptiranje
    /decrypt-symmetric    - Simetrično dekriptiranje
    /encrypt-asymmetric   - Asimetrično kriptiranje
    /decrypt-asymmetric   - Asimetrično dekriptiranje
    /sign                 - Digitalno potpisivanje
    /verify               - Verifikacija potpisa
    /hash                 - Hash funkcija
  page.tsx                - File-based UI
  layout.tsx              - Root layout
  globals.css             - Globalni stilovi
/lib
  crypto-utils.ts         - Kriptografske funkcije
  download-utils.ts       - Download funkcionalnost
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
5. Vidi rezultat: **✅ POTPIS JE VALIDAN** ili **❌ POTPIS NIJE VALIDAN**

**Napomena**: Provjera detektira bilo kakvu promjenu u originalnoj datoteci ili potpisu!

## Korišteni algoritmi

### Simetrično kriptiranje
- **Algoritam**: AES-256-CBC
- **Ključ**: 256-bit (32 byte) hex string
- **IV**: 128-bit (16 byte) random za svako kriptiranje
- **Format outputa**: `IV:enkriptirani_podatak` (hex)

### Asimetrično kriptiranje
- **Algoritam**: RSA-2048
- **Padding**: OAEP s SHA-256
- **Veličina ključa**: 2048 bit
- **Format outputa**: Base64 string
- **Limit podataka**: ~190 znakova (zbog RSA limitacije)

### Hash funkcija
- **Algoritam**: SHA-256
- **Output**: 256-bit (64 znaka) hex string
- **Jednosmjeran**: Nemoguće rekonstruirati original iz hasha

### Digitalni potpis
- **Algoritam**: RSA + SHA-256
- **Format**: Base64
- **Metoda**: PKCS#1 v1.5
- **Proces**: Hash(data) -> Sign(hash, privateKey)
- **Verifikacija**: Verify(hash, signature, publicKey)

## Sigurnosne napomene

- **Privatni ključevi** se generiraju na serveru i nikad ne bi trebali biti podijeljeni
- **AES ključevi** su nasumično generirani koristeći `crypto.randomBytes()`
- **RSA padding** koristi OAEP za zaštitu protiv chosen-ciphertext napada
- **Sve operacije** se izvršavaju server-side
- **File-based pristup** eliminira rizik od slučajnog copy/paste kriptiranih podataka
- **Nema perzistencije** - ništa se ne sprema na server

## Prednosti file-based pristupa

1. **Sigurnost**: Nema rizika od nenamjernog dijeljenja ključeva kroz clipboard
2. **Organizacija**: Sve je u datotekama s jasnim imenima
3. **Audibilnost**: Lako pratiti koje datoteke su korištene
4. **Portabilnost**: Datoteke se mogu lako premjestiti, arhivirati
5. **Batch operacije**: Moguće automatizirati s skriptama

## Error Handling

Aplikacija uključuje:
- User-friendly error poruke
- Automatsko čišćenje file inputa nakon operacija
- Loading states na svim operacijama
- Validacija postojanja fileova prije operacija
- Try-catch blokovi sa detaljnim error porukama

## Browser kompatibilnost

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Zahtjeva podršku za FileReader API i Blob API

## Autor

Projekt izrađen za kolegij Napredni operacijski sustavi
