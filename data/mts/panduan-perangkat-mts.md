---
judul: Panduan Penyusunan Perangkat Ajar MTs (CP, TP, ATP, Prota, Prosem, KKTP, Modul Ajar)
berlaku: skill perangkat ajar jenjang MTs
acuan: BSKAP 046/H/KR/2025; KDJ Pendis 9941/2025; KMA 1503/2025; KDJ Pendis 6077/2025 (KBC); Kaldik Kanwil Kemenag Jateng 2026/2027
---

# Panduan Penyusunan Perangkat Ajar MTs

## A. Prinsip Umum
1. **CP dikutip, bukan dibuat.** Teks CP selalu diambil persis dari file `cp-mts-*.md` sesuai `id` mapel dan fase. Jangan meringkas, mengganti kata, atau menambah CP.
2. **Fase:** Fase D = kelas VII, VIII, dan IX (BSKAP 046/2025 dan KMA 1503/2025). Seluruh CP Fase D dicapai pada akhir kelas IX, sehingga TP satu fase dibagi ke tiga kelas.
3. **Sumber CP madrasah:** PAI (Al-Qur'an Hadis, Akidah Akhlak, Fikih, SKI) dan Bahasa Arab selalu dari SK Dirjen Pendis 9941/2025, bukan dari CP PAI & Budi Pekerti BSKAP. Gunakan `cp-mts-pai-arab.md`.
4. **TP diturunkan dari CP 046/9941**, bukan dari daftar bab buku teks. Urutan bab buku boleh dipakai sebagai urutan ATP hanya bila materinya memang ada di CP.
5. Setiap dokumen memakai identitas yang sama dan kode TP yang sama.

## B. Tujuan Pembelajaran (TP)
- Format kode: `{FASE}.{nomor elemen}.{nomor TP}`, contoh `D.2.3` = Fase D, elemen ke-2, TP ke-3. Nomor elemen mengikuti urutan elemen di file CP.
- Rumusan: kata kerja operasional yang terukur + konten/materi + (bila perlu) konteks/kondisi. Contoh: "Menyelesaikan masalah kontekstual yang berkaitan dengan persamaan linear satu variabel."
- Satu TP berisi satu kompetensi utama. Hindari "memahami" yang tidak terukur bila ada kata kerja yang lebih operasional (menjelaskan, menganalisis, menerapkan, menyelesaikan, merancang, mempraktikkan, merefleksikan, dll.).
- Jumlah TP per elemen secukupnya agar seluruh kandungan CP elemen tersebut tercakup (cek setiap frasa CP punya TP).
- Elemen **Keterampilan Proses** (IPA, PAI, dll.) tidak dibuat TP terpisah secara mandiri; keterampilan proses diintegrasikan ke rumusan TP elemen pemahaman dan ke kegiatan pembelajaran. Elemen keterampilan bahasa/proses yang memang berdiri sendiri (misalnya Menyimak, Berbicara) tetap dibuatkan TP.
- Fase D: buat TP untuk **seluruh fase** (kelas VII, VIII, dan IX) dengan urutan dari yang mendasar ke yang kompleks. Isi `kelas` (VII/VIII/IX) bila yakin, misalnya mengikuti urutan bab buku teks kelas; jika dikosongkan, engine membagi TP menjadi tiga bagian berurutan menurut JP, lalu guru dapat memindahkan TP lewat **Atur TP**.
- Pastikan JP TP setiap kelas sesuai JP tersedia kelas itu (kelas IX lebih sedikit karena semester genap hanya 16 minggu efektif).

## C. Alur Tujuan Pembelajaran (ATP)
- ATP = urutan TP dari yang prasyarat/konkret ke yang kompleks/abstrak dalam satu fase. Urutan array `tp` di JSON adalah urutan ATP.
- Untuk tiap TP, isi `materi` (materi pokok ringkas), `jp` (alokasi JP intrakurikuler), `kbc` (1–3 kode Panca Cinta), dan `dpl` (2–4 kode DPL).
- `topik` (opsional) dipakai untuk mengelompokkan beberapa TP dalam satu topik/bab ATP.

## D. Alokasi Waktu, Prota, dan Prosem
- JP per minggu diambil dari `struktur-kurikulum-mts.md` (kolom `jp_minggu`, intrakurikuler saja). Kokurikuler tidak masuk Prota/Prosem.
- Minggu efektif diambil dari `kaldik-2026-2027.md` (6 hari sekolah). Kelas VII dan VIII: semester 1 = 18 minggu efektif, semester 2 = 19 minggu efektif. Kelas IX: semester 1 = 18, semester 2 = 16 (sampai akhir April 2027, sebelum Ujian Madrasah). 1 JP = 40 menit.
- JP tersedia per semester = minggu efektif × JP per minggu. Jumlah JP seluruh TP satu semester sebaiknya 80–90% dari JP tersedia; sisanya menjadi cadangan untuk asesmen sumatif, remedial, dan pengayaan.
- Contoh: Matematika kelas VII, 4 JP/minggu → semester 1 tersedia 72 JP, semester 2 tersedia 76 JP. Rencanakan TP sekitar 60–64 JP (semester 1) dan 64–68 JP (semester 2). Kelas IX semester 2: 16 × 4 = 64 JP.
- Engine menghitung Prota (rekap tahunan) dan Prosem (grid bulan–minggu) secara otomatis dari `jp` dan `semester` setiap TP.

## E. KKTP (Kriteria Ketercapaian Tujuan Pembelajaran)
- Pendekatan default: **interval nilai**. Guru dapat mengubah batas di dokumen.
- Batas ketuntasan default: **75** untuk kelas 1, 7, dan 10 (kelas awal jenjang); **76** untuk kelas lainnya.
- Interval default:

| KKTP 75 | KKTP 76 | Keterangan |
|---|---|---|
| 0–59 | 0–59 | Belum mencapai ketuntasan, remedial di seluruh bagian |
| 60–74 | 60–75 | Belum mencapai ketuntasan, remedial di bagian yang diperlukan |
| 75–89 | 76–89 | Sudah mencapai ketuntasan, tidak perlu remedial |
| 90–100 | 90–100 | Sudah mencapai ketuntasan, perlu pengayaan atau tantangan lebih |

- Setiap TP wajib diberi **4 deskriptor** (`kktp`), satu per interval, yang menggambarkan unjuk kerja murid secara konkret sesuai TP tersebut. Contoh untuk TP "Menyelesaikan masalah kontekstual yang berkaitan dengan persamaan linear satu variabel":
  1. Belum dapat menyusun persamaan dari masalah dan belum dapat menentukan penyelesaiannya.
  2. Dapat menyusun persamaan, tetapi masih keliru dalam langkah penyelesaian.
  3. Dapat menyusun persamaan dan menentukan penyelesaian dengan tepat pada masalah rutin.
  4. Dapat menyusun persamaan, menentukan penyelesaian, dan menafsirkan solusi pada masalah nonrutin/kontekstual.

## F. Modul Ajar (Rencana Pembelajaran Mendalam Berbasis Cinta)
Satuan modul ajar: **per topik/TP** (boleh beberapa TP yang satu topik, beberapa pertemuan). Struktur mengikuti contoh madrasah:

**Identitas**: satuan pendidikan, mapel, fase/kelas, semester, alokasi waktu (JP dan jumlah pertemuan), topik.

**I. Identifikasi**
1. Identifikasi Murid: karakteristik, pengetahuan awal, minat, kebutuhan belajar, dan konteks (misalnya madrasah berasrama, kelas putra/putri terpisah, ketersediaan gawai) **berdasarkan informasi dari guru**; jangan mengasumsikan konteks yang tidak disebutkan.
2. Identifikasi Materi: jenis pengetahuan (faktual, konseptual, prosedural, metakognitif), relevansi dengan kehidupan, dan tingkat kesulitan.
3. Dimensi Profil Lulusan: tabel 8 DPL, centang yang dikembangkan (2–4).
4. Topik Panca Cinta (KBC): tabel 5 topik, centang yang diinsersikan (1–3).
5. Materi Integrasi KBC: uraian singkat insersi per topik yang dicentang.

**II. Desain Pembelajaran**: CP (otomatis dari file CP sesuai elemen TP), lintas disiplin ilmu, TP, topik pembelajaran, praktik pedagogis (model dari `model-pedagogis.md` yang dipilih guru dari 2–3 usulan, tidak mengulang model di `riwayat_model`; ditambah metode/strategi pendukung), kemitraan pembelajaran, lingkungan pembelajaran, pemanfaatan digital/media.

**III. Pengalaman Belajar** (per pertemuan; kegiatan mengikuti sintaks model terpilih dan diberi label langkah sintaks)
- **Awal**: salam, doa, apersepsi kontekstual, penyampaian tujuan, motivasi. Tandai prinsip (berkesadaran/bermakna/menggembirakan).
- **Inti**: Memahami → Mengaplikasi → Merefleksi.
- **Penutup**: umpan balik, simpulan bersama, refleksi, doa/hamdalah.

**Lampiran I – Asesmen**
- Asesmen diagnostik/awal: pertanyaan pemantik, indikator jawaban, tindak lanjut.
- Asesmen formatif: lembar observasi sikap (aspek DPL + Panca Cinta, skala 1–4) dengan rubrik; rubrik unjuk kerja (skor 4/3/2/1) dan rumus nilai.
- Asesmen sumatif: soal/tugas yang selaras TP, disertai kunci/pedoman penskoran singkat.

**Lampiran II – LKPD** (tanpa kop): judul, identitas kelompok, petunjuk belajar bernuansa Panca Cinta, TP, aktivitas (langkah kerja, tabel pengamatan/isian, pertanyaan analisis), refleksi, penilaian diri kelompok.

## G. Gaya Bahasa
- Bahasa Indonesia baku, ringkas, operasional. Istilah regulasi: "murid" (boleh "santri" bila guru meminta konteks pesantren). Sesuaikan bahasa, contoh, dan tingkat kesulitan dengan usia murid MTs (sekitar 12–15 tahun).
- Untuk mapel Bahasa Arab dan PAI, istilah Arab ditulis dengan huruf Arab yang benar bila diperlukan.
