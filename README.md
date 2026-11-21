# Perangkat Ajar Madrasah

Engine dan data rujukan untuk skill Gemini **perangkat-ajar-ma**: menyusun CP, TP, ATP, Program Tahunan, Program Semester, KKTP, dan Modul Ajar (Pembelajaran Mendalam Berbasis Cinta) untuk Madrasah Aliyah. Jenjang MTs, MI, dan RA menyusul dengan pola yang sama.

## Struktur
```
mesin/mesin-perangkat.js        engine (render, hitung minggu efektif, kop, unduh Word/PDF/HTML)
data/kaldik-2026-2027.md        kalender & rincian minggu efektif (Kaldik Kanwil Kemenag Jateng 2026/2027)
data/kbc-pembelajaran-mendalam.md  Panca Cinta, DPL, prinsip PM (SK 6077/2025, KMA 1503/2025)
data/ma/cp-ma-umum-fase-e.md    CP mapel umum Fase E (BSKAP 046/H/KR/2025)
data/ma/cp-ma-umum-fase-f.md    CP mapel umum Fase F (BSKAP 046/H/KR/2025)
data/ma/cp-ma-pai-arab.md       CP PAI & Bahasa Arab MA reguler (SK Dirjen Pendis 9941/2025)
data/ma/cp-ma-keagamaan.md      CP MA Program Keagamaan (SK Dirjen Pendis 9941/2025)
data/ma/struktur-kurikulum-ma.md  JP per mapel per kelas (KMA 1503/2025)
data/ma/panduan-perangkat-ma.md   aturan penyusunan untuk skill
skill/perangkat-ajar-ma/SKILL.md  instruksi skill Gemini
uji/                            halaman uji lokal (Matematika X, Fikih X, Fisika XII)
```

## Alamat engine (dipakai skill)
- Utama (versi terkunci): `https://cdn.jsdelivr.net/gh/muflihan-ak/perangkat-ajar-madrasah@v1.0.0/mesin/mesin-perangkat.js`
- Cadangan (GitHub Pages): `https://muflihan-ak.github.io/perangkat-ajar-madrasah/mesin/mesin-perangkat.js`

Engine memuat berkas `data/*.md` dari tag yang sama (`@v1.0.0`), dengan GitHub Pages sebagai cadangan. Bila engine atau data berubah, rilis tag baru (misalnya `v1.0.1`), ubah konstanta `VERSI` di engine, lalu perbarui alamat di SKILL.md. Tag yang sudah dirilis jangan diubah.

## Format data .md
- Mapel: `## [id|FASE] Nama Mapel`, contoh `## [matematika|E] Matematika`
- Elemen: `### Elemen: Nama Elemen`, lalu teks CP (paragraf, `- ` daftar, `**tebal**`)
- Struktur JP: tabel `| id | mapel | intra_tahun | kokurikuler_tahun | jp_minggu |` di bawah `## Kelas X|XI|XII`
- Minggu efektif: tabel `| sem | bulan | minggu_ke | senin | sabtu | hari_efektif | efektif | keterangan |`

## Uji lokal
```
python -m http.server 8765
# buka http://localhost:8765/uji/uji-matematika-x.html
```
Halaman uji memakai `PERANGKAT.data_base = '../data/'` sehingga data dibaca dari folder lokal.

## Catatan sumber
- Teks Arab pada CP Bahasa Arab (SK 9941/2025) disalin ulang secara manual dari halaman PDF, karena ekstraksi teks PDF merusak ligatur Arab.
- KMA 1503/2025 dan Kaldik Jateng berupa PDF hasil pindai; angka JP dan tanggal ditranskripsi dari gambar halaman dan diperiksa ulang.
