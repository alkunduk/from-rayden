# Website "Untuk Raima" — Panduan Singkat

## Struktur folder

```
rayden-raima/
├── index.html
├── style.css
├── script.js
└── assets/
    └── audio.mp3   <-- kamu yang tambahkan sendiri
```

## Yang perlu kamu lakukan

1. Siapkan file musiknya: **LANY – 'Cause You Have To** dalam format MP3.
2. Beri nama file itu persis **`audio.mp3`**.
3. Taruh file tersebut di dalam folder **`assets/`** (folder ini sudah dibuat, tapi masih kosong — kamu tinggal isi).

Kalau nama file atau lokasinya beda, musik nggak akan muncul. Kalau kamu mau pakai judul lagu lain, edit teks di `index.html` pada bagian `<p class="player__title">`.

## Cara menjalankan di komputer kamu

Browser modern memblokir file lokal (audio, dsb.) kalau dibuka langsung lewat `file://`, jadi jalankan lewat local server kecil:

**Kalau ada Python terinstall (paling gampang):**
```
cd rayden-raima
python3 -m http.server 8000
```
Lalu buka `http://localhost:8000` di browser.

**Kalau pakai VS Code:** install extension "Live Server", klik kanan `index.html` → "Open with Live Server".

## Cara upload biar bisa dibuka Raima dari HP

Paling gampang pakai layanan hosting statis gratis, misalnya:
- **Netlify** (drag-and-drop folder `rayden-raima` ke netlify.com/drop)
- **Vercel** atau **GitHub Pages**

Setelah di-deploy, kamu tinggal kirim link-nya ke Raima.

## Alur website (buat referensi kamu)

1. **Opening** — amplop 3D, tap "Buka pesan ♡" → amplop kebuka, musik mulai.
2. **Intro** — dua kalimat pembuka muncul bertahap.
3. **Surat** — scroll per-card, setiap card muncul dengan animasi fade + 3D tilt, kalimat terakhir jadi highlight dengan glow.
4. **"Satu hal lagi..."** — pesan tambahan tersembunyi.
5. **Final card** — kartu penutup "For Raima 🤍" + tombol hati kecil yang meledak jadi hati-hati kecil kalau disentuh.

Semua teks pesan sudah dipertahankan persis seperti gaya penulisan kamu (nggak diformalin). Kalau ada kalimat yang mau kamu ubah, tinggal edit langsung di dalam `index.html`, dicari bagian `<article class="letter-card">`.

Semoga membantu, semoga juga Raima suka 🤍
