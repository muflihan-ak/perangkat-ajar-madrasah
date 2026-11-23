---
judul: Panduan Penyusunan Perangkat Ajar RA (CP, TP, ATP, Prota, Prosem, Kriteria Capaian Perkembangan, Modul Ajar)
berlaku: skill perangkat ajar jenjang RA
acuan: KDJ Pendis 9941/2025 (CP RA Fase Fondasi); KMA 1503/2025; KDJ Pendis 6077/2025 (KBC); Kaldik Kanwil Kemenag Jateng 2026/2027
---

# Panduan Penyusunan Perangkat Ajar RA

## A. Prinsip Umum
1. **CP dikutip, bukan dibuat.** Teks CP diambil dari `cp-ra-fondasi.md` (id `fase-fondasi`). RA tidak memakai mata pelajaran; CP sudah memadukan PAI dan Bahasa Arab di elemen Nilai Agama dan Budi Pekerti.
2. **Fase Fondasi** dibagi ke dua kelompok: **Kelompok A** (usia 4–5 tahun) dan **Kelompok B** (usia 5–6 tahun).
3. Pembelajaran melalui **bermain bermakna**, holistik-integratif: satu kegiatan main dapat menyentuh beberapa elemen sekaligus.
4. Tidak ada nilai angka. Ketercapaian dinyatakan dengan **BB, MB, BSH, BSB**.

## B. Tujuan Pembelajaran (TP)
- Kode: `FD.{nomor elemen}.{nomor TP}`. Nomor elemen: 1 = Nilai Agama dan Budi Pekerti; 2 = Jati Diri; 3 = Dasar-Dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni. Contoh `FD.1.3`.
- Turunkan TP dari setiap butir CP pada ketiga elemen, untuk Kelompok A dan Kelompok B. TP Kelompok B lebih kompleks/mandiri daripada TP Kelompok A pada butir CP yang sama.
- Rumusan memakai kata kerja yang dapat diamati pada anak: menyebutkan, menunjukkan, menirukan, melafalkan, mempraktikkan, membiasakan, mengelompokkan, membilang, menceritakan, membuat, bermain bersama.
- Isi `kelas` setiap TP dengan `A` atau `B`.
- `jp` tidak dipakai di RA. Ganti dengan `minggu` (perkiraan jumlah minggu TP dikembangkan) bila perlu; boleh dikosongkan.

## C. Alur Tujuan Pembelajaran (ATP)
- Urutan array `tp` adalah urutan ATP, dari yang dekat dengan anak ke yang lebih luas (diri → keluarga → madrasah → lingkungan → alam dan negara).
- Isi `kbc` (1–3 kode Panca Cinta) dan `dpl` (2–4 kode DPL) untuk setiap TP.

## D. Topik Mingguan, Prota, dan Prosem
- Prota dan Prosem RA disusun per **topik mingguan**, bukan per JP. Data topik ditulis di `topik_ra`.
- Setiap topik berisi: `nama`, `subtopik` (daftar, satu per minggu bila topik lebih dari satu minggu), `minggu` (jumlah minggu), `semester` (1/2), dan `tp_kode` (TP yang dikembangkan pada topik itu).
- Jumlah minggu topik per semester = jumlah minggu efektif semester itu (semester 1: 18 minggu, semester 2: 19 minggu). Engine menempatkan topik berurutan ke minggu efektif dan menandai minggu libur.
- Contoh topik (sesuaikan dengan RA): Aku Hamba Allah; Diriku; Keluargaku; Madrasahku; Lingkunganku; Makananku; Binatang Ciptaan Allah; Tanaman Ciptaan Allah; Kendaraan; Pekerjaan; Air, Udara, dan Api; Alam Semesta; Negaraku Indonesia; Hari Besar Islam (Maulid, Isra Mikraj, Ramadan, Idul Fitri).
- Setiap TP Kelompok tersebut sebaiknya muncul minimal pada satu topik dalam setahun.

## E. Kriteria Capaian Perkembangan (pengganti KKTP)
- Setiap TP diberi **4 deskriptor** (`kktp`) secara berurutan:
  1. **BB** – Belum Berkembang: anak belum menunjukkan perilaku walaupun dengan bantuan.
  2. **MB** – Mulai Berkembang: anak mulai menunjukkan perilaku dengan bantuan/contoh guru.
  3. **BSH** – Berkembang Sesuai Harapan: anak menunjukkan perilaku secara mandiri dan konsisten.
  4. **BSB** – Berkembang Sangat Baik: anak menunjukkan perilaku secara mandiri dan membantu/mencontohkan kepada teman.
- Deskriptor ditulis konkret sesuai TP. Contoh untuk TP "Melafalkan doa sebelum dan sesudah makan": BB = belum melafalkan doa walaupun dibimbing; MB = melafalkan doa dengan dituntun guru; BSH = melafalkan doa sendiri dengan lancar sebelum dan sesudah makan; BSB = melafalkan doa sendiri dan mengingatkan teman untuk berdoa.

## F. Modul Ajar RA (satu topik mingguan)
**Identitas**: satuan pendidikan, kelompok, semester, topik dan subtopik, alokasi waktu (jumlah hari × menit per hari), guru.

**I. Identifikasi**
1. Identifikasi Murid: karakteristik anak, minat, kebutuhan, dan konteks dari guru (jumlah anak, kelompok putra/putri, sarana main). Jangan mengarang konteks.
2. Identifikasi Materi: kegiatan main dan konsep yang dikenalkan, kaitannya dengan kehidupan anak.
3. Dimensi Profil Lulusan (2–4) dan Topik Panca Cinta (1–3), dengan uraian integrasi KBC.

**II. Desain Pembelajaran**: CP (otomatis dari elemen TP), TP, model pembelajaran PAUD (dari `model-pedagogis-ra.md`, dipilih guru dari 2–3 usulan), kemitraan dengan orang tua, lingkungan main (penataan ruang/sentra/sudut), media dan alat permainan edukatif (APE).

**III. Pengalaman Belajar (per hari)**
- Jumlah hari = hari sekolah RA (input guru; umumnya 6 hari).
- Setiap hari: **Pembukaan** (penyambutan, doa, hafalan surat pendek/doa harian, lingkaran pagi, pijakan sebelum main), **Inti** (kegiatan main sesuai sintaks model), **Recalling** (anak menceritakan kembali), **Penutup** (makan bersama, pesan moral, doa pulang).
- Kegiatan yang mewakili langkah sintaks diberi label sintaks.

**Lampiran I – Asesmen** (tanpa nilai angka)
- **Ceklis**: indikator dari TP minggu ini, dicentang BB/MB/BSH/BSB per anak.
- **Catatan anekdot**: momen penting yang diamati (kegiatan, fokus pengamatan).
- **Hasil karya**: karya yang dikumpulkan dan aspek yang diamati.
- **Foto berseri**: rangkaian kegiatan yang didokumentasikan dan aspek perkembangannya.

**Lampiran II – Lembar Kegiatan Anak (LKA)**: 1–2 kegiatan bergambar (mewarnai, menjiplak, menempel, menghubungkan gambar, menghitung gambar), perintah sangat singkat yang **dibacakan guru**, ruang luas untuk berkarya. Tidak ada tabel isian.

## G. Gaya Bahasa
- Bahasa Indonesia baku dan hangat. Sebut murid sebagai "anak" atau "murid".
- Lafal doa, surat pendek, dan kosa kata Arab ditulis dengan huruf Arab yang benar beserta artinya.
