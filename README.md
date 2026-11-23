# Perangkat Ajar Madrasah

Engine dan data rujukan untuk skill Gemini **perangkat-ajar-ma**, **perangkat-ajar-mts**, dan **perangkat-ajar-mi**: menyusun CP, TP, ATP, Program Tahunan, Program Semester, KKTP, dan Modul Ajar (Pembelajaran Mendalam Berbasis Cinta) untuk Madrasah Aliyah (Fase E–F), Madrasah Tsanawiyah (Fase D), dan Madrasah Ibtidaiyah (Fase A–C). Jenjang RA menyusul; satu engine dipakai bersama.

## Struktur
```
mesin/mesin-perangkat.js        engine (render, hitung minggu efektif, kop, unduh Word/PDF/HTML)
data/kaldik-2026-2027.md        kalender & rincian minggu efektif (Kaldik Kanwil Kemenag Jateng 2026/2027)
data/kbc-pembelajaran-mendalam.md  Panca Cinta, DPL, prinsip PM (SK 6077/2025, KMA 1503/2025)
data/model-pedagogis.md         25 model praktik pedagogis berpusat murid (ringkasan 69 file PPT guru)
data/ma/cp-ma-umum-fase-e.md    CP mapel umum Fase E (BSKAP 046/H/KR/2025)
data/ma/cp-ma-umum-fase-f.md    CP mapel umum Fase F (BSKAP 046/H/KR/2025)
data/ma/cp-ma-pai-arab.md       CP PAI & Bahasa Arab MA reguler (SK Dirjen Pendis 9941/2025)
data/ma/cp-ma-keagamaan.md      CP MA Program Keagamaan (SK Dirjen Pendis 9941/2025)
data/ma/struktur-kurikulum-ma.md  JP per mapel per kelas (KMA 1503/2025)
data/ma/panduan-perangkat-ma.md   aturan penyusunan untuk skill MA
data/mts/cp-mts-umum-fase-d.md  CP mapel umum Fase D (BSKAP 046/H/KR/2025)
data/mts/cp-mts-pai-arab.md     CP PAI & Bahasa Arab MTs (SK Dirjen Pendis 9941/2025)
data/mts/struktur-kurikulum-mts.md  JP per mapel kelas VII–IX (KMA 1503/2025)
data/mts/panduan-perangkat-mts.md   aturan penyusunan untuk skill MTs
data/mi/cp-mi-umum-fase-a.md    CP mapel umum Fase A (BSKAP 046/H/KR/2025)
data/mi/cp-mi-umum-fase-b.md    CP mapel umum Fase B (BSKAP 046/H/KR/2025)
data/mi/cp-mi-umum-fase-c.md    CP mapel umum Fase C (BSKAP 046/H/KR/2025)
data/mi/cp-mi-pai-arab.md       CP PAI & Bahasa Arab MI Fase A–C (SK Dirjen Pendis 9941/2025)
data/mi/struktur-kurikulum-mi.md  JP per mapel kelas I–VI (KMA 1503/2025)
data/mi/panduan-perangkat-mi.md   aturan penyusunan untuk skill MI
skill/perangkat-ajar-ma/SKILL.md  instruksi skill Gemini MA
skill/perangkat-ajar-mts/SKILL.md instruksi skill Gemini MTs
skill/perangkat-ajar-mi/SKILL.md  instruksi skill Gemini MI
uji/                            halaman uji lokal (MA: Matematika X, Fikih X, Fisika XII, Informatika; MTs: Matematika VII/IX, Bahasa Arab VIII; MI: Matematika I, Bahasa Arab III, SKI VI)
```

## Alamat engine (dipakai skill)
- Utama (versi terkunci): `https://cdn.jsdelivr.net/gh/muflihan-ak/perangkat-ajar-madrasah@v1.6.0/mesin/mesin-perangkat.js`
- Cadangan (GitHub Pages): `https://muflihan-ak.github.io/perangkat-ajar-madrasah/mesin/mesin-perangkat.js`

Engine memuat berkas `data/*.md` dari tag yang sama (`@v1.6.0`), dengan GitHub Pages sebagai cadangan. Bila engine atau data berubah, rilis tag baru (misalnya `v1.0.1`), ubah konstanta `VERSI` di engine, lalu perbarui alamat di SKILL.md. Tag yang sudah dirilis jangan diubah.

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

## Riwayat versi
- **v1.6.0** — Dukungan jenjang **MI Fase A–C** (kelas I–VI): CP umum Fase A–C (8/10/11 mapel, BSKAP 046; 137 paragraf terverifikasi sama dengan sumber), CP PAI & Bahasa Arab MI (SK 9941; 124 paragraf terverifikasi; teks Arab Bahasa Arab ditranskripsi dari citra halaman), struktur kurikulum MI (KMA 1503 Tabel 1–5), panduan MI (termasuk kelas rendah), dan skill `perangkat-ajar-mi`. Engine memuat berkas `data/mi/`; pembagian TP dua kelas per fase, kelas akhir VI, 1 JP = 35 menit.
- **v1.5.0** — Dukungan jenjang **MTs Fase D** (kelas VII–IX): data CP umum Fase D (17 mapel, BSKAP 046), CP PAI & Bahasa Arab MTs (SK 9941; teks Arab Bahasa Arab ditranskripsi dari citra halaman), struktur kurikulum MTs (KMA 1503 Tabel 6–8), panduan MTs, dan skill `perangkat-ajar-mts`. Engine: pembagian TP satu fase ke tiga kelas (VII/VIII/IX) atau dua kelas (XI/XII), kelas akhir IX dihitung sampai akhir April, label kelas VII–IX, 1 JP = 40 menit, peringatan bila kelas tidak sesuai jenjang. Perbaikan: kolom Kelas di dokumen TP kini selalu terisi meski Gemini tidak mengisi `kelas`.
- **v1.4.0** — Hasil edit guru tersimpan per dokumen (otomatis di browser, dipulihkan saat file dibuka lagi) dan dapat disimpan ke dalam file lewat **Simpan Hasil Edit**; **Kembalikan Asli** membatalkan suntingan. Unggah/Hapus Kop tidak lagi menghapus hasil edit. Perubahan KKTP/JP/Minggu Efektif/Atur TP meminta konfirmasi bila menyusun ulang dokumen yang sudah diedit, dan pengaturan ikut tersimpan. Ulangan harian setelah TP (`ulangan_jp`, Atur TP) tampil di Prota dan Prosem. Tabel identitas Modul Ajar dirapikan (kolom judul 17%). Perbaikan: mengetik lalu langsung pindah tab tidak lagi merusak pembagian halaman.
- **v1.3.1** — Kelas dinormalisasi (`11`, `Kelas XI`, `XI IPA` → XI); fase selalu diturunkan dari kelas; peringatan bila kelas kosong, fase tidak cocok, atau kode TP berawalan fase lain (data kelas lain terbawa). SKILL: aturan percakapan baru = data baru.
- **v1.3.0** — Pola Canvas terpisah: satu Canvas "Perangkat Ajar" (CP–KKTP) dan satu Canvas baru per Modul Ajar (`Modul Ajar NN – Mapel Kelas – Topik`), field `nama_dokumen` untuk judul dan nama berkas unduhan. Peringatan otomatis untuk elemen di luar CP fase, model di luar basis data, JP berbeda dari KMA 1503, dan lebih dari satu modul dalam satu Canvas. Alias field (`nomor`→`ke`, `judul`→`fokus`), rubrik sikap 4 level, level kognitif soal sumatif. LKPD di Lampiran II versi ringkas untuk dicetak.
- **v1.2.1** — Tab per modul, pemetaan JP mapel MAPK, perbaikan daftar Arab RTL.
- **v1.2.0** — Basis data 25 model pedagogis dan label sintaks.
- **v1.1.x** — Paginator A4 dan unduhan PDF per lembar.
- **v1.0.0** — Rilis awal.
