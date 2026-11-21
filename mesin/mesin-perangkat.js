/*!
 * Mesin Perangkat Ajar Madrasah v1.2.0
 * CP · TP · ATP · Prota · Prosem · KKTP · Modul Ajar (Pembelajaran Mendalam Berbasis Cinta)
 * Data: window.PERANGKAT (ditulis skill Gemini). Rujukan CP/JP/Kaldik: berkas .md di folder data/.
 * Repo: github.com/muflihan-ak/perangkat-ajar-madrasah
 */
(function () {
  'use strict';
  var VERSI = '1.2.0';
  var REPO = 'muflihan-ak/perangkat-ajar-madrasah';
  var DATA_BASES = [
    'https://cdn.jsdelivr.net/gh/' + REPO + '@v' + VERSI + '/data/',
    'https://' + REPO.split('/')[0] + '.github.io/' + REPO.split('/')[1] + '/data/'
  ];
  var HTML2PDF = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';

  var P = window.PERANGKAT;
  if (!P) { document.body.innerHTML = '<p style="font-family:sans-serif;padding:20px">Data <code>window.PERANGKAT</code> tidak ditemukan.</p>'; return; }

  /* ---------------- util ---------------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function arr(x) { return Array.isArray(x) ? x : (x == null || x === '' ? [] : [x]); }
  function inl(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<i>$1</i>'); }
  function md(txt) {
    var out = [], list = null;
    String(txt || '').split('\n').forEach(function (l) {
      var t = l.trim();
      if (!t) { if (list) { out.push('<ul>' + list.join('') + '</ul>'); list = null; } return; }
      if (/^- /.test(t)) { (list = list || []).push('<li dir="auto">' + inl(t.slice(2)) + '</li>'); return; }
      if (list) { out.push('<ul>' + list.join('') + '</ul>'); list = null; }
      out.push('<p dir="auto">' + inl(t) + '</p>');
    });
    if (list) out.push('<ul>' + list.join('') + '</ul>');
    return out.join('');
  }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { } }
  var ROMAWI = { '1': 'I', '2': 'II' };
  var KELAS_TXT = { 'X': 'X (Sepuluh)', 'XI': 'XI (Sebelas)', 'XII': 'XII (Dua Belas)' };
  var BULAN_ORDER = ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'];
  var KBC = { 1: 'Cinta Allah dan Rasul-Nya', 2: 'Cinta Ilmu', 3: 'Cinta Lingkungan', 4: 'Cinta Diri dan Sesama Manusia', 5: 'Cinta Tanah Air' };
  var DPL = { 1: 'Keimanan & Ketakwaan terhadap Tuhan YME', 2: 'Kewargaan', 3: 'Penalaran Kritis', 4: 'Kreativitas', 5: 'Kolaborasi', 6: 'Kemandirian', 7: 'Kesehatan', 8: 'Komunikasi' };
  function num(x) { var n = parseInt(String(x).replace(/\D/g, ''), 10); return isNaN(n) ? null : n; }

  /* ---------------- normalisasi data ---------------- */
  var I = P.identitas = P.identitas || {};
  P.jenjang = (P.jenjang || 'MA').toUpperCase();
  P.pengaturan = P.pengaturan || {};
  P.tp = arr(P.tp);
  P.modul_ajar = arr(P.modul_ajar);
  I.kelas = String(I.kelas || 'X').toUpperCase().replace(/\s/g, '');
  I.fase = String(I.fase || (I.kelas === 'X' ? 'E' : 'F')).toUpperCase();
  I.program = (I.program || 'reguler').toLowerCase();
  I.kepala = I.kepala || {}; I.guru = I.guru || {};
  var KLS_AWAL = { 'I': 1, '1': 1, 'VII': 1, '7': 1, 'X': 1, '10': 1 };
  if (P.pengaturan.kktp == null) P.pengaturan.kktp = KLS_AWAL[I.kelas] ? 75 : 76;
  var kopKey = 'perangkat-kop-' + (I.madrasah || 'umum');
  P.kop = P.kop || lsGet(kopKey) || '';

  /* ---------------- pemuatan data .md ---------------- */
  function fetchText(name) {
    var bases = (P.data_base ? [P.data_base] : []).concat(DATA_BASES), i = 0;
    return new Promise(function (res, rej) {
      (function next() {
        if (i >= bases.length) return rej(new Error('Gagal memuat ' + name));
        fetch(bases[i++] + name).then(function (r) { if (!r.ok) throw 0; return r.text(); }).then(res).catch(next);
      })();
    });
  }
  function parseCP(text, map) {
    var parts = text.split(/\n(?=## \[)/);
    parts.forEach(function (p) {
      var m = p.match(/^## \[([^|\]]+)\|([A-F])\]\s*(.+)/);
      if (!m) return;
      var body = p.slice(m[0].length);
      var els = body.split(/\n(?=### Elemen: )/), intro = els.shift();
      intro = intro.split(/\n(?=# )/)[0].trim();
      map[m[1] + '|' + m[2]] = {
        id: m[1], fase: m[2], nama: m[3].trim(), intro: intro,
        elemen: els.map(function (e) {
          var mm = e.match(/^### Elemen: (.+)/); var t = e.slice(mm[0].length).split(/\n(?=# )/)[0];
          return { nama: mm[1].trim(), teks: t.trim() };
        })
      };
    });
  }
  function parseStruktur(text) {
    var res = {};
    text.split(/\n(?=## )/).forEach(function (sec) {
      var m = sec.match(/^## Kelas (\w+)/); if (!m) return;
      var k = m[1]; res[k] = {};
      sec.split('\n').forEach(function (l) {
        var c = l.split('|').map(function (x) { return x.trim(); });
        if (c.length >= 7 && /^[a-z0-9-]+$/.test(c[1]) && c[1] !== 'id') res[k][c[1]] = { nama: c[2], intra: +c[3], koku: +c[4], jpm: +c[5] };
      });
    });
    return res;
  }
  function parseKaldik(text) {
    var weeks = [], batas = (text.match(/batas_genap_kelas_akhir:\s*(\S+)/) || [])[1];
    text.split('\n').forEach(function (l) {
      var c = l.split('|').map(function (x) { return x.trim(); });
      if (c.length >= 9 && /^[12]$/.test(c[1]) && /^\d{4}-/.test(c[4])) weeks.push({ sem: c[1], bulan: c[2], ke: +c[3], senin: c[4], sabtu: c[5], he: +c[6], ef: c[7] === 'ya', ket: c[8] });
    });
    return { weeks: weeks, batas: batas };
  }

  var CP = {}, STR = {}, KAL = { weeks: [] }, GAGAL = [], MODEL = {};
  function parseModel(text) {
    text.split(/\n(?=## \[)/).forEach(function (p) {
      var m = p.match(/^## \[([a-z0-9-]+)\]\s*(.+)/); if (!m) return;
      var sx = (p.split(/\n### Sintaks[^\n]*\n/)[1] || '').split(/\n### /)[0];
      MODEL[m[1]] = { nama: m[2].trim(), sintaks: sx.split('\n').filter(function (l) { return /^\d+\./.test(l.trim()); }).map(function (l) { return l.trim().replace(/^\d+\.\s*/, ''); }) };
    });
  }
  function loadAll() {
    var j = P.jenjang.toLowerCase();
    var cpFiles = j === 'ma' ? ['ma/cp-ma-umum-fase-' + I.fase.toLowerCase() + '.md', 'ma/cp-ma-pai-arab.md', 'ma/cp-ma-keagamaan.md'] : [];
    var jobs = cpFiles.map(function (f) { return fetchText(f).then(function (t) { parseCP(t, CP); }).catch(function () { GAGAL.push(f); }); });
    jobs.push(fetchText(j + '/struktur-kurikulum-' + j + '.md').then(function (t) { STR = parseStruktur(t); }).catch(function () { GAGAL.push('struktur'); }));
    if (P.modul_ajar.length) jobs.push(fetchText('model-pedagogis.md').then(parseModel).catch(function () { GAGAL.push('model-pedagogis'); }));
    jobs.push(fetchText('kaldik-2026-2027.md').then(function (t) { KAL = parseKaldik(t); }).catch(function () { GAGAL.push('kaldik'); }));
    return Promise.all(jobs);
  }

  /* ---------------- perhitungan ---------------- */
  function cpMapel() {
    var id = I.mapel_id;
    return CP[id + '|' + I.fase] || (P.cp_cadangan || null);
  }
  function jpMinggu() {
    if (P.pengaturan.jp_minggu) return +P.pengaturan.jp_minggu;
    var s = STR[I.kelas] && STR[I.kelas][I.mapel_id];
    return s ? s.jpm : 2;
  }
  function weeksFor(sem) {
    var ov = P.pengaturan.minggu || {};
    var akhir = I.kelas === 'XII' && sem === '2' && KAL.batas;
    return KAL.weeks.filter(function (w) { return w.sem === sem; }).map(function (w) {
      var ef = w.ef, ket = w.ket;
      if (akhir && w.senin > KAL.batas) { ef = false; ket = ket || 'Kelas akhir: persiapan/pelaksanaan UM'; }
      if (ov[w.senin] != null) { ef = !!ov[w.senin]; if (!ef && !ket) ket = 'Diatur guru'; }
      return { sem: w.sem, bulan: w.bulan, ke: w.ke, senin: w.senin, he: w.he, ef: ef, ket: ket };
    });
  }
  function efektif(sem) { return weeksFor(sem).filter(function (w) { return w.ef; }).length; }
  function tpKelas() {
    var list = P.tp;
    if (I.fase === 'F') {
      var tot = list.reduce(function (a, t) { return a + (+t.jp || 0); }, 0), acc = 0;
      list.forEach(function (t) { if (!t.kelas) { t.kelas = acc < tot / 2 ? 'XI' : 'XII'; } acc += (+t.jp || 0); t._auto = true; });
      return list.filter(function (t) { return String(t.kelas).toUpperCase() === I.kelas; });
    }
    return list;
  }
  function assignSemester(list) {
    var cap1 = efektif('1') * jpMinggu(), cap2 = efektif('2') * jpMinggu(), tot = list.reduce(function (a, t) { return a + (+t.jp || 0); }, 0), acc = 0;
    var lim = tot * cap1 / ((cap1 + cap2) || 1);
    list.forEach(function (t) { if (!t.semester) t.semester = acc < lim ? 1 : 2; acc += (+t.jp || 0); });
    return list;
  }
  function TPk() { return assignSemester(tpKelas()); }
  function tpSem(s) { return TPk().filter(function (t) { return String(t.semester) === String(s); }); }
  function elemenIndex(nama) {
    var cp = cpMapel(); if (!cp) return -1;
    var n = String(nama || '').toLowerCase();
    for (var i = 0; i < cp.elemen.length; i++) if (cp.elemen[i].nama.toLowerCase() === n) return i;
    for (i = 0; i < cp.elemen.length; i++) if (cp.elemen[i].nama.toLowerCase().indexOf(n) >= 0 || n.indexOf(cp.elemen[i].nama.toLowerCase()) >= 0) return i;
    return -1;
  }
  function kktpBands() {
    var K = +P.pengaturan.kktp || 75, a = K > 60 ? 60 : Math.max(1, K - 10), c = K < 90 ? 90 : Math.min(100, Math.round(K + (100 - K) / 2));
    var b = [[0, a - 1], [a, K - 1], [K, c - 1], [c, 100]];
    if (c > 100 || c <= K) b = [[0, a - 1], [a, K - 1], [K, 100]];
    return b;
  }
  var KKTP_KET = ['Belum mencapai ketuntasan, remedial di seluruh bagian', 'Belum mencapai ketuntasan, remedial di bagian yang diperlukan', 'Sudah mencapai ketuntasan, tidak perlu remedial', 'Sudah mencapai ketuntasan, perlu pengayaan atau tantangan lebih'];

  /* ---------------- komponen dokumen ---------------- */
  function kop() { return '<div class="kop">' + (P.kop ? '<img src="' + P.kop + '" alt="Kop" style="width:100%;height:' + (KOP_R ? Math.round(680 * KOP_R) + 'px' : 'auto') + '">' : '<div class="kop-kosong no-print">[ Kop madrasah belum diunggah — klik "Unggah Kop" ]</div>') + '</div>'; }
  function judul(t, sub) { return '<h1 class="judul">' + esc(t) + '</h1>' + (sub ? '<h2 class="subjudul">' + esc(sub) + '</h2>' : ''); }
  function semTxt(s) { return s == '1' ? 'I (Ganjil)' : s == '2' ? 'II (Genap)' : 'I (Ganjil) dan II (Genap)'; }
  function idTable(opt) {
    opt = opt || {};
    var rows = [['Satuan Pendidikan', I.madrasah], ['Mata Pelajaran', I.mapel_nama || (cpMapel() || {}).nama], ['Fase / Kelas', I.fase + ' / ' + (KELAS_TXT[I.kelas] || I.kelas)], ['Semester', semTxt(opt.sem || (opt.tahunan ? '' : I.semester))], ['Tahun Pelajaran', I.tahun_pelajaran]];
    if (opt.extra) rows = rows.concat(opt.extra);
    return '<table class="identitas">' + rows.map(function (r) { return '<tr><td class="lbl">' + esc(r[0]) + '</td><td class="sep">:</td><td>' + esc(r[1] || '') + '</td></tr>'; }).join('') + '</table>';
  }
  function ttd() {
    var kp = I.kepala, g = I.guru, lab = function (x) { return esc((x.label_nip || 'NIP') + '. ' + (x.nip || '-')); };
    return '<table class="ttd"><tr><td><br>Mengetahui,<br>Kepala ' + esc(I.madrasah || 'Madrasah') + '<div class="ttd-ruang"></div><b><u>' + esc(kp.nama || '..............................') + '</u></b><br>' + lab(kp) +
      '</td><td>' + esc(I.tempat || '..........') + ', ' + esc(I.tanggal || '..........') + '<br>Guru Mata Pelajaran<br>' + esc(I.mapel_nama || '') + '<div class="ttd-ruang"></div><b><u>' + esc(g.nama || '..............................') + '</u></b><br>' + lab(g) + '</td></tr></table>';
  }
  function kbcCodes(t) { return arr(t.kbc).map(num).filter(Boolean); }
  function dplCodes(t) { return arr(t.dpl).map(num).filter(Boolean); }

  /* ---- 1. CP ---- */
  function docCP() {
    var cp = cpMapel(); var h = kop() + judul('Capaian Pembelajaran', (I.mapel_nama || '') + ' — Fase ' + I.fase) + idTable({ tahunan: true });
    if (!cp) return h + '<p class="peringatan">CP untuk id mapel "' + esc(I.mapel_id) + '" Fase ' + esc(I.fase) + ' tidak ditemukan pada berkas data. Periksa id mapel.</p>';
    h += '<p class="sumber">Sumber: ' + esc(/mapk|^(al-quran-hadis|akidah-akhlak|fikih|ski|bahasa-arab)$/.test(cp.id) ? 'Keputusan Dirjen Pendis Nomor 9941 Tahun 2025' : 'Keputusan Kepala BSKAP Nomor 046/H/KR/2025') + '</p>';
    if (cp.intro) h += md(cp.intro);
    h += '<table class="grid"><thead><tr><th style="width:7%">No</th><th style="width:25%">Elemen</th><th>Capaian Pembelajaran</th></tr></thead><tbody>';
    cp.elemen.forEach(function (e, i) { h += '<tr><td class="c">' + (i + 1) + '</td><td><b>' + esc(e.nama) + '</b></td><td>' + md(e.teks) + '</td></tr>'; });
    return h + '</tbody></table>' + ttd();
  }
  /* ---- 2. TP ---- */
  function docTP() {
    var cp = cpMapel(), F = I.fase === 'F', nc = F ? 5 : 4;
    var h = kop() + judul('Tujuan Pembelajaran', (I.mapel_nama || '') + ' — Fase ' + I.fase) + idTable({ tahunan: true });
    var groups = {}, order = [];
    P.tp.forEach(function (t) { var k = t.elemen || '-'; if (!groups[k]) { groups[k] = []; order.push(k); } groups[k].push(t); });
    h += '<table class="grid"><thead><tr><th style="width:6%" rowspan="2">No</th><th rowspan="2">Tujuan Pembelajaran</th>' + (F ? '<th rowspan="2" style="width:9%">Kelas</th>' : '') + '<th colspan="2" style="width:16%">Semester</th></tr><tr><th style="width:8%">I</th><th style="width:8%">II</th></tr></thead><tbody>';
    var no = 0;
    order.forEach(function (k, gi) {
      var ei = elemenIndex(k), cpt = cp && ei >= 0 ? cp.elemen[ei].teks : '', lab = 'Elemen ' + (gi + 1) + ': ' + k;
      h += '<tr class="grup" data-label="' + esc(lab) + '"><td colspan="' + nc + '"><b>' + esc(lab) + '</b>' + (cpt ? '<div class="kecil cp-el"><i>Capaian Pembelajaran:</i> ' + md(cpt) + '</div>' : '') + '</td></tr>';
      groups[k].forEach(function (t) {
        no++;
        var mine = !F || t.kelas === I.kelas;
        h += '<tr><td class="c">' + no + '</td><td><b>' + esc(t.kode || '') + '</b> ' + esc(t.tp) + '</td>' + (F ? '<td class="c">' + esc(t.kelas || '') + '</td>' : '') +
          '<td class="c">' + (String(t.semester) === '1' && mine ? '✓' : '') + '</td><td class="c">' + (String(t.semester) === '2' && mine ? '✓' : '') + '</td></tr>';
      });
    });
    h += '</tbody></table>';
    if (F) h += '<p class="kecil">Kolom semester diisi untuk TP kelas ' + esc(I.kelas) + '. TP kelas lain pada Fase F ditampilkan sebagai keterangan alur fase.</p>';
    return h + ttd();
  }
  /* ---- 3. ATP ---- */
  function docATP() {
    var list = TPk(), h = kop() + judul('Alur Tujuan Pembelajaran (ATP)', (I.mapel_nama || '') + ' — Fase ' + I.fase + ' Kelas ' + I.kelas) + idTable({ tahunan: true });
    h += '<table class="grid"><thead><tr><th style="width:5%">No</th><th style="width:10%">Kode</th><th>Alur Tujuan Pembelajaran</th><th style="width:22%">Materi Pokok</th><th style="width:7%">JP</th><th style="width:7%">Sem</th><th style="width:10%">Topik KBC</th></tr></thead><tbody>';
    var topik = null;
    list.forEach(function (t, i) {
      if (t.topik && t.topik !== topik) { topik = t.topik; h += '<tr class="grup"><td colspan="7"><b>' + esc(topik) + '</b></td></tr>'; }
      h += '<tr><td class="c">' + (i + 1) + '</td><td class="c">' + esc(t.kode || '') + '</td><td>' + esc(t.tp) + '</td><td>' + esc(t.materi || '') + '</td><td class="c">' + esc(t.jp || '') + '</td><td class="c">' + (ROMAWI[t.semester] || '') + '</td><td class="c">' + kbcCodes(t).join(', ') + '</td></tr>';
    });
    h += '</tbody></table><p class="kecil"><b>Keterangan Topik KBC:</b> ' + Object.keys(KBC).map(function (k) { return k + ' = ' + KBC[k]; }).join('; ') + '.</p>';
    return h + ttd();
  }
  /* ---- tabel minggu efektif ---- */
  function tabelMinggu(sem) {
    var w = weeksFor(sem), by = {}, ord = [];
    w.forEach(function (x) { if (!by[x.bulan]) { by[x.bulan] = { n: 0, e: 0, ket: [] }; ord.push(x.bulan); } by[x.bulan].n++; if (x.ef) by[x.bulan].e++; else if (x.ket && by[x.bulan].ket.indexOf(x.ket) < 0) by[x.bulan].ket.push(x.ket); });
    var tn = 0, te = 0, h = '<table class="grid"><thead><tr><th style="width:6%">No</th><th>Bulan</th><th style="width:14%">Jumlah Minggu</th><th style="width:14%">Minggu Tidak Efektif</th><th style="width:14%">Minggu Efektif</th><th style="width:30%">Keterangan</th></tr></thead><tbody>';
    ord.forEach(function (b, i) { var x = by[b]; tn += x.n; te += x.e; h += '<tr><td class="c">' + (i + 1) + '</td><td>' + b + '</td><td class="c">' + x.n + '</td><td class="c">' + (x.n - x.e) + '</td><td class="c">' + x.e + '</td><td class="kecil">' + esc(x.ket.join('; ')) + '</td></tr>'; });
    h += '<tr class="total"><td colspan="2" class="c">Jumlah</td><td class="c">' + tn + '</td><td class="c">' + (tn - te) + '</td><td class="c">' + te + '</td><td></td></tr></tbody></table>';
    return h;
  }
  /* ---- 4. Prota ---- */
  function docProta() {
    var jpm = jpMinggu(), h = kop() + judul('Program Tahunan', (I.mapel_nama || '') + ' — Fase ' + I.fase + ' Kelas ' + I.kelas) + idTable({ tahunan: true, extra: [['Alokasi Waktu', jpm + ' JP per minggu (1 JP = ' + (P.jenjang === 'MA' ? 45 : P.jenjang === 'MTS' ? 40 : 35) + ' menit)']] });
    h += '<h3>A. Rincian Minggu Efektif</h3><p class="sub">Semester I (Ganjil)</p>' + tabelMinggu('1') + '<p class="sub">Semester II (Genap)</p>' + tabelMinggu('2');
    h += '<h3>B. Program Tahunan</h3><table class="grid"><thead><tr><th style="width:6%">No</th><th style="width:11%">Kode TP</th><th>Tujuan Pembelajaran</th><th style="width:24%">Materi Pokok</th><th style="width:8%">JP</th></tr></thead><tbody>';
    var tot = 0;
    ['1', '2'].forEach(function (s) {
      var L = tpSem(s), cap = efektif(s) * jpm, used = L.reduce(function (a, t) { return a + (+t.jp || 0); }, 0); tot += cap;
      var lab = 'Semester ' + ROMAWI[s] + (s === '1' ? ' (Ganjil)' : ' (Genap)');
      h += '<tr class="grup" data-label="' + lab + '"><td colspan="5"><b>' + lab + '</b></td></tr>';
      L.forEach(function (t, i) { h += '<tr><td class="c">' + (i + 1) + '</td><td class="c">' + esc(t.kode || '') + '</td><td>' + esc(t.tp) + '</td><td>' + esc(t.materi || '') + '</td><td class="c">' + esc(t.jp || 0) + '</td></tr>'; });
      if (!L.length) h += '<tr><td colspan="5" class="c kecil">Belum ada TP pada semester ini.</td></tr>';
      h += '<tr><td class="c">' + (L.length + 1) + '</td><td></td><td colspan="2">Asesmen sumatif, remedial, pengayaan, dan cadangan</td><td class="c">' + Math.max(0, cap - used) + '</td></tr>';
      h += '<tr class="total"><td colspan="4">Jumlah JP Semester ' + ROMAWI[s] + ' (' + efektif(s) + ' minggu efektif × ' + jpm + ' JP)</td><td class="c">' + cap + '</td></tr>';
      if (used > cap) h += '<tr><td colspan="5" class="peringatan">Peringatan: JP TP semester ' + ROMAWI[s] + ' (' + used + ' JP) melebihi JP tersedia (' + cap + ' JP).</td></tr>';
    });
    h += '<tr class="total"><td colspan="4">Jumlah JP Satu Tahun</td><td class="c">' + tot + '</td></tr></tbody></table>';
    return h + ttd();
  }
  /* ---- 5. Prosem ---- */
  function docProsem() {
    var jpm = jpMinggu(), h = '';
    ['1', '2'].forEach(function (s, si) {
      var W = weeksFor(s), L = tpSem(s), months = [], mb = {};
      W.forEach(function (w) { if (!mb[w.bulan]) { mb[w.bulan] = []; months.push(w.bulan); } mb[w.bulan].push(w); });
      // alokasi JP berurutan ke minggu efektif
      var cells = L.map(function () { return W.map(function () { return 0; }); }), wi = 0, room = jpm;
      L.forEach(function (t, ti) {
        var need = +t.jp || 0;
        while (need > 0 && wi < W.length) {
          if (!W[wi].ef) { wi++; room = jpm; continue; }
          var take = Math.min(room, need); cells[ti][wi] += take; need -= take; room -= take;
          if (room === 0) { wi++; room = jpm; }
        }
      });
      var cad = W.map(function (w, i) { if (!w.ef) return 0; var u = cells.reduce(function (a, r) { return a + r[i]; }, 0); return Math.max(0, jpm - u); });
      var nW = W.length, wTP = 34, cw = ((100 - 5 - wTP - 6) / nW).toFixed(2);
      h += (si ? '<div class="pb"></div>' : '') + kop() + judul('Program Semester', (I.mapel_nama || '') + ' — Fase ' + I.fase + ' Kelas ' + I.kelas) + idTable({ sem: s, extra: [['Alokasi Waktu', jpm + ' JP per minggu; ' + efektif(s) + ' minggu efektif']] });
      h += '<table class="grid prosem"><colgroup><col style="width:5%"><col style="width:' + wTP + '%"><col style="width:6%">' + W.map(function () { return '<col style="width:' + cw + '%">'; }).join('') + '</colgroup><thead><tr><th rowspan="2">No</th><th rowspan="2">Tujuan Pembelajaran</th><th rowspan="2">JP</th>' +
        months.map(function (m) { return '<th colspan="' + mb[m].length + '">' + m.slice(0, 3) + '</th>'; }).join('') + '</tr><tr>' +
        W.map(function (w) { return '<th class="mg">' + w.ke + '</th>'; }).join('') + '</tr></thead><tbody>';
      L.forEach(function (t, ti) {
        h += '<tr><td class="c">' + (ti + 1) + '</td><td><b>' + esc(t.kode || '') + '</b> ' + esc(t.tp) + '</td><td class="c">' + esc(t.jp || 0) + '</td>' +
          W.map(function (w, i) { return w.ef ? '<td class="c mg' + (cells[ti][i] ? ' isi-jp' : '') + '">' + (cells[ti][i] || '') + '</td>' : '<td class="mg libur"></td>'; }).join('') + '</tr>';
      });
      h += '<tr><td class="c">' + (L.length + 1) + '</td><td>Asesmen sumatif, remedial, pengayaan, cadangan</td><td class="c">' + cad.reduce(function (a, b) { return a + b; }, 0) + '</td>' + W.map(function (w, i) { return w.ef ? '<td class="c mg' + (cad[i] ? ' cad' : '') + '">' + (cad[i] || '') + '</td>' : '<td class="mg libur"></td>'; }).join('') + '</tr>';
      h += '<tr class="total"><td colspan="2">Jumlah</td><td class="c">' + efektif(s) * jpm + '</td>' + W.map(function (w) { return w.ef ? '<td class="c mg">' + jpm + '</td>' : '<td class="mg libur"></td>'; }).join('') + '</tr></tbody></table>';
      var ket = []; W.forEach(function (w) { if (!w.ef && w.ket) { var k = w.bulan.slice(0, 3) + '-' + w.ke + ': ' + w.ket; ket.push(k); } });
      h += '<p class="kecil"><b>Keterangan:</b> angka = JP pada minggu tersebut; kolom arsir = minggu tidak efektif' + (ket.length ? ' (' + esc(ket.join('; ')) + ')' : '') + '.</p>' + ttd();
    });
    return h;
  }
  /* ---- 6. KKTP ---- */
  function docKKTP() {
    var B = kktpBands(), h = '';
    ['1', '2'].forEach(function (s, si) {
      var L = tpSem(s);
      h += (si ? '<div class="pb"></div>' : '') + kop() + judul('Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)', (I.mapel_nama || '') + ' — Fase ' + I.fase + ' Kelas ' + I.kelas) + idTable({ sem: s, extra: [['Batas Ketuntasan', P.pengaturan.kktp + ' (pendekatan interval nilai)']] });
      h += '<table class="grid kktp"><thead><tr><th rowspan="2" style="width:5%">No</th><th rowspan="2" style="width:27%">Tujuan Pembelajaran</th><th colspan="' + B.length + '">Interval Nilai</th></tr><tr>' + B.map(function (b, i) { return '<th>' + b[0] + '–' + b[1] + '<div class="kecil n">' + KKTP_KET[B.length === 3 && i === 2 ? 2 : i].split(',')[0] + '</div></th>'; }).join('') + '</tr></thead><tbody>';
      var topik = null;
      L.forEach(function (t, i) {
        if (t.topik && t.topik !== topik) { topik = t.topik; h += '<tr class="grup"><td colspan="' + (2 + B.length) + '"><b>' + esc(topik) + '</b></td></tr>'; }
        var d = arr(t.kktp);
        h += '<tr><td class="c">' + (i + 1) + '</td><td><b>' + esc(t.kode || '') + '</b> ' + esc(t.tp) + '</td>' + B.map(function (b, k) { return '<td class="kecil">' + esc(d[k] || KKTP_KET[k]) + '</td>'; }).join('') + '</tr>';
      });
      if (!L.length) h += '<tr><td colspan="' + (2 + B.length) + '" class="c kecil">Belum ada TP pada semester ini.</td></tr>';
      h += '</tbody></table><p class="sub">Keterangan interval:</p><table class="grid"><tbody>' + B.map(function (b, i) { return '<tr><td style="width:18%" class="c">' + b[0] + '–' + b[1] + '</td><td>' + KKTP_KET[B.length === 3 && i === 2 ? 2 : i] + '</td></tr>'; }).join('') + '</tbody></table>';
      h += '<p class="kecil">Nilai murid per TP dihitung dari asesmen yang mengukur TP tersebut (skor perolehan ÷ skor maksimal × 100), lalu dibandingkan dengan interval di atas untuk menentukan tindak lanjut.</p>' + ttd();
    });
    return h;
  }
  /* ---- 7. Modul Ajar ---- */
  function tblCek(items, chosen, label, prefix) {
    return '<table class="grid cek"><thead><tr><th style="width:18%">Kode</th><th>' + label + '</th><th style="width:16%">Status</th></tr></thead><tbody>' +
      Object.keys(items).map(function (k) { return '<tr><td class="c">' + prefix + ' ' + k + '</td><td>' + esc(items[k]) + '</td><td class="c">' + (chosen.indexOf(+k) >= 0 ? '✔' : '–') + '</td></tr>'; }).join('') + '</tbody></table>';
  }
  function itemTeks(x) {
    if (x && typeof x === 'object') return (x.sintaks ? '<span class="sintaks">[' + esc(x.sintaks) + ']</span> ' : '') + inl(x.teks || x.kegiatan || '');
    return inl(x);
  }
  function liList(a) { a = arr(a); return a.length ? '<ol>' + a.map(function (x) { return '<li dir="auto">' + itemTeks(x) + '</li>'; }).join('') + '</ol>' : '<p>-</p>'; }
  function modelHtml(m) {
    var id = m.model, mo = MODEL[id], nama = m.model_nama || (mo && mo.nama) || '';
    if (!nama) return '';
    var sx = arr(m.sintaks_model).length ? arr(m.sintaks_model) : (mo ? mo.sintaks.map(function (s) { return s.replace(/\s*\[[^\]]*\]\s*$/, ''); }) : []);
    return '<p><b>Model pembelajaran: ' + esc(nama) + '</b></p>' + (sx.length ? '<p class="kecil"><i>Sintaks:</i> ' + sx.map(function (s, i) { return (i + 1) + ') ' + esc(s); }).join('; ') + '</p>' : '');
  }
  function menit(jp) { return (+jp || 2) * (P.jenjang === 'MA' ? 45 : P.jenjang === 'MTS' ? 40 : 35); }
  function docModul(m, idx) {
    var tps = arr(m.tp_kode).map(function (k) { return P.tp.filter(function (t) { return t.kode === k; })[0]; }).filter(Boolean);
    var cp = cpMapel(), els = [];
    tps.forEach(function (t) { var e = elemenIndex(t.elemen); if (e >= 0 && els.indexOf(e) < 0) els.push(e); });
    var dpl = arr(m.dpl).map(num).filter(Boolean), kbc = arr(m.kbc).map(num).filter(Boolean);
    if (!dpl.length) tps.forEach(function (t) { dplCodes(t).forEach(function (c) { if (dpl.indexOf(c) < 0) dpl.push(c); }); });
    if (!kbc.length) tps.forEach(function (t) { kbcCodes(t).forEach(function (c) { if (kbc.indexOf(c) < 0) kbc.push(c); }); });
    var pert = arr(m.pertemuan), jpTot = m.jp || pert.reduce(function (a, p) { return a + (+p.jp || 0); }, 0) || tps.reduce(function (a, t) { return a + (+t.jp || 0); }, 0);
    var d = m.desain || {}, idf = m.identifikasi || {};
    var h = (idx ? '<div class="pb"></div>' : '') + kop() + judul('Modul Ajar', 'Rencana Pembelajaran Mendalam Berbasis Cinta');
    h += '<table class="grid head"><tr><td class="lbl">Satuan Pendidikan</td><td>' + esc(I.madrasah) + '</td><td class="lbl">Mata Pelajaran</td><td>' + esc(I.mapel_nama) + '</td></tr>' +
      '<tr><td class="lbl">Fase / Kelas</td><td>' + esc(I.fase + ' / ' + I.kelas) + '</td><td class="lbl">Semester</td><td>' + semTxt(m.semester || (tps[0] && tps[0].semester) || I.semester) + '</td></tr>' +
      '<tr><td class="lbl">Topik</td><td>' + esc(m.judul_topik || m.topik || '') + '</td><td class="lbl">Alokasi Waktu</td><td>' + esc(jpTot + ' JP (' + (pert.length || 1) + ' pertemuan)') + '</td></tr>' +
      '<tr><td class="lbl">Tahun Pelajaran</td><td>' + esc(I.tahun_pelajaran) + '</td><td class="lbl">Guru</td><td>' + esc(I.guru.nama) + '</td></tr></table>';
    h += '<h3>I. IDENTIFIKASI</h3><p class="sub">1. Identifikasi Murid</p>' + md(idf.murid || '') + '<p class="sub">2. Identifikasi Materi Pelajaran</p>' + md(idf.materi || '');
    h += '<div class="dua"><div><p class="sub">3. Dimensi Profil Lulusan (DPL)</p>' + tblCek(DPL, dpl, 'Dimensi Profil Lulusan', 'DPL') + '</div><div><p class="sub">4. Topik Panca Cinta (KBC)</p>' + tblCek(KBC, kbc, 'Topik Panca Cinta', 'Topik') + '</div></div>';
    h += '<p class="sub">5. Materi Integrasi KBC</p>' + (arr(m.integrasi_kbc).length ? '<ul>' + arr(m.integrasi_kbc).map(function (x) { return '<li dir="auto"><b>' + esc(KBC[num(x.kode)] || x.topik || '') + ':</b> ' + inl(x.teks || x) + '</li>'; }).join('') + '</ul>' : '<p>-</p>');
    var cpHtml = els.map(function (e) { return '<p><b>Elemen ' + esc(cp.elemen[e].nama) + ':</b></p>' + md(cp.elemen[e].teks); }).join('') || md(m.cp || '');
    h += '<h3>II. DESAIN PEMBELAJARAN</h3><table class="grid desain">' +
      '<tr><td class="lbl">Capaian Pembelajaran (CP)</td><td>' + cpHtml + '</td></tr>' +
      '<tr><td class="lbl">Lintas Disiplin Ilmu</td><td>' + md(d.lintas_disiplin || '-') + '</td></tr>' +
      '<tr><td class="lbl">Tujuan Pembelajaran</td><td>' + (m.pengantar_tp ? '<p>' + inl(m.pengantar_tp) + '</p>' : '') + '<ol>' + tps.map(function (t) { return '<li><b>' + esc(t.kode) + '</b> ' + esc(t.tp) + '</li>'; }).join('') + '</ol></td></tr>' +
      '<tr><td class="lbl">Topik Pembelajaran</td><td>' + md(d.topik || m.judul_topik || '-') + '</td></tr>' +
      '<tr><td class="lbl">Praktik Pedagogis</td><td>' + modelHtml(m) + md(d.praktik_pedagogis || (modelHtml(m) ? '' : '-')) + '</td></tr>' +
      '<tr><td class="lbl">Kemitraan Pembelajaran</td><td>' + md(d.kemitraan || '-') + '</td></tr>' +
      '<tr><td class="lbl">Lingkungan Pembelajaran</td><td>' + md(d.lingkungan || '-') + '</td></tr>' +
      '<tr><td class="lbl">Pemanfaatan Digital / Media</td><td>' + md(d.digital || '-') + '</td></tr></table>';
    h += '<h3>III. PENGALAMAN BELAJAR (LANGKAH-LANGKAH PEMBELAJARAN)</h3>';
    pert.forEach(function (p, i) {
      var tm = menit(p.jp || (jpTot / (pert.length || 1))), du = p.durasi || {}, a = du.awal || Math.round(tm * 0.12 / 5) * 5 + ' menit', z = du.penutup || Math.round(tm * 0.12 / 5) * 5 + ' menit', n = du.inti || (tm - 2 * Math.round(tm * 0.12 / 5) * 5) + ' menit';
      h += '<div class="pertemuan"><p class="pt">Pertemuan ' + (p.ke || i + 1) + ' (' + esc((p.jp || '') + ' JP') + ')' + (p.fokus ? ' — ' + esc(p.fokus) : '') + '</p>' +
        '<p class="sub">AWAL — Pembukaan (' + esc(a) + ') <span class="prinsip">[Berkesadaran, Bermakna, Menggembirakan]</span></p>' + liList(p.awal) +
        '<p class="sub">INTI — Pengalaman Belajar Utama (' + esc(n) + ')</p>' +
        '<p class="pb2"><b>1. Memahami</b> <span class="prinsip">[Berkesadaran, Bermakna]</span></p>' + liList(p.memahami) +
        '<p class="pb2"><b>2. Mengaplikasi</b> <span class="prinsip">[Bermakna, Menggembirakan]</span></p>' + liList(p.mengaplikasi) +
        '<p class="pb2"><b>3. Merefleksi</b> <span class="prinsip">[Berkesadaran, Bermakna]</span></p>' + liList(p.merefleksi) +
        '<p class="sub">PENUTUP — Evaluasi dan Refleksi Akhir (' + esc(z) + ')</p>' + liList(p.penutup) + '</div>';
    });
    h += ttd();
    /* Lampiran I asesmen */
    var as = m.asesmen || {};
    h += '<div class="pb"></div><h2 class="lamp">LAMPIRAN I: INSTRUMEN ASESMEN</h2><p class="c kecil">' + esc(m.judul_topik || '') + ' — ' + esc(I.mapel_nama) + ' Kelas ' + esc(I.kelas) + '</p>';
    h += '<h3>A. Asesmen Diagnostik (Awal Pembelajaran)</h3><table class="grid"><thead><tr><th style="width:5%">No</th><th>Pertanyaan Pemantik</th><th style="width:35%">Indikator Jawaban yang Diharapkan</th><th style="width:22%">Tindak Lanjut</th></tr></thead><tbody>' +
      arr(as.diagnostik).map(function (x, i) { return '<tr><td class="c">' + (i + 1) + '</td><td dir="auto">' + inl(x.pertanyaan) + '</td><td dir="auto">' + inl(x.indikator || '') + '</td><td>' + inl(x.tindak_lanjut || '') + '</td></tr>'; }).join('') + '</tbody></table>';
    var sikap = arr(as.sikap);
    h += '<h3>B. Asesmen Formatif</h3><p class="sub">1. Lembar Observasi Sikap (DPL dan Panca Cinta)</p>';
    if (sikap.length) {
      h += '<table class="grid"><thead><tr><th style="width:5%">No</th><th>Nama Murid</th>' + sikap.map(function (x) { return '<th style="width:' + Math.floor(55 / sikap.length) + '%">' + esc(x.aspek) + '</th>'; }).join('') + '</tr></thead><tbody>';
      for (var r = 1; r <= 5; r++) h += '<tr><td class="c">' + r + '</td><td></td>' + sikap.map(function () { return '<td class="c kecil">1 – 2 – 3 – 4</td>'; }).join('') + '</tr>';
      h += '</tbody></table><p class="kecil"><b>Rubrik sikap (skor 4):</b></p><ul class="kecil">' + sikap.map(function (x) { return '<li><b>' + esc(x.aspek) + ':</b> ' + inl(x.rubrik || '') + '</li>'; }).join('') + '</ul>';
    }
    var kin = arr(as.kinerja);
    if (kin.length) {
      h += '<p class="sub">2. Rubrik Unjuk Kerja</p><table class="grid kecil"><thead><tr><th style="width:18%">Aspek</th><th>Skor 4 (Sangat Baik)</th><th>Skor 3 (Baik)</th><th>Skor 2 (Cukup)</th><th>Skor 1 (Perlu Bimbingan)</th></tr></thead><tbody>' +
        kin.map(function (x) { var s = arr(x.skor); return '<tr><td><b>' + esc(x.aspek) + '</b></td>' + [0, 1, 2, 3].map(function (k) { return '<td dir="auto">' + inl(s[k] || '') + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table><p class="kecil">Nilai unjuk kerja = (skor perolehan ÷ ' + (kin.length * 4) + ') × 100</p>';
    }
    var sum = arr(as.sumatif);
    h += '<h3>C. Asesmen Sumatif</h3>' + (sum.length ? '<ol>' + sum.map(function (x) { return '<li dir="auto">' + inl(x.soal || x) + (x.kunci ? '<div class="kunci kecil"><b>Kunci/pedoman:</b> ' + inl(x.kunci) + '</div>' : '') + '</li>'; }).join('') + '</ol>' : '<p>-</p>');
    /* Lampiran II LKPD (tanpa kop) */
    var lk = m.lkpd;
    if (lk) {
      h += '<div class="pb"></div><div class="lkpd"><h2 class="lamp">LAMPIRAN II: LEMBAR KERJA PESERTA DIDIK (LKPD)</h2><p class="c"><b>' + esc(lk.judul || m.judul_topik || '') + '</b><br><span class="kecil">' + esc(I.mapel_nama + ' — Fase ' + I.fase + ' (Kelas ' + I.kelas + ') | Alokasi: ' + (lk.alokasi || '')) + '</span></p>' +
        '<table class="lk-id"><tr><td>Nama Kelompok: ..............................</td><td>Hari/Tanggal: ..............................</td></tr><tr><td>Anggota: 1. .................... 2. ....................<br>3. .................... 4. ....................</td><td>Kelas: ' + esc(I.kelas) + ' ..........</td></tr></table>' +
        '<div class="kotak"><b>Petunjuk Belajar dan Nilai Panca Cinta</b>' + liList(lk.petunjuk) + '</div>' +
        '<div class="kotak"><b>Tujuan Pembelajaran</b>' + liList(lk.tujuan || tps.map(function (t) { return t.tp; })) + '</div>';
      arr(lk.aktivitas).forEach(function (a, i) {
        h += '<div class="akt"><p class="pt">AKTIVITAS ' + (i + 1) + ': ' + esc(a.judul || '') + '</p>' + (a.pengantar ? md(a.pengantar) : '') + (arr(a.langkah).length ? '<p class="sub">Langkah kerja:</p>' + liList(a.langkah) : '');
        if (a.tabel) { var tb = a.tabel; h += '<table class="grid"><thead><tr>' + arr(tb.kolom).map(function (c) { return '<th dir="auto">' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>' + arr(tb.baris).map(function (row) { return '<tr>' + arr(tb.kolom).map(function (c, k) { return '<td dir="auto">' + esc(arr(row)[k] || '') + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>'; }
        if (arr(a.pertanyaan).length) h += '<ol class="tanya">' + arr(a.pertanyaan).map(function (q) { return '<li dir="auto">' + inl(q) + '<div class="garis"></div><div class="garis"></div></li>'; }).join('') + '</ol>';
        h += '</div>';
      });
      if (arr(lk.refleksi).length) h += '<div class="akt"><p class="pt">REFLEKSI PANCA CINTA</p><ol class="tanya">' + arr(lk.refleksi).map(function (q) { return '<li dir="auto">' + inl(q) + '<div class="garis"></div></li>'; }).join('') + '</ol></div>';
      if (arr(lk.penilaian_diri).length) h += '<p class="sub">Lembar Penilaian Diri Kelompok</p><table class="grid"><thead><tr><th style="width:6%">No</th><th>Indikator Sikap dan Keaktifan Kelompok</th><th style="width:10%">Ya</th><th style="width:10%">Belum</th></tr></thead><tbody>' + arr(lk.penilaian_diri).map(function (x, i) { return '<tr><td class="c">' + (i + 1) + '</td><td>' + inl(x) + '</td><td></td><td></td></tr>'; }).join('') + '</tbody></table>';
      h += '<table class="lk-id"><tr><td>Nilai LKPD: ..........</td><td>Catatan Guru: ...................................................</td></tr></table></div>';
    }
    return h;
  }

  /* ---------------- tampilan / UI ---------------- */
  var DOCS = [['cp', 'CP', docCP], ['tp', 'TP', docTP], ['atp', 'ATP', docATP], ['prota', 'Prota', docProta], ['prosem', 'Prosem', docProsem], ['kktp', 'KKTP', docKKTP]];
  var aktif = lsGet('perangkat-tab') || 'cp';
  function docsList() {
    var d = DOCS.slice();
    if (P.modul_ajar.length) d.push(['modul', 'Modul Ajar', function () { return P.modul_ajar.map(docModul).join(''); }]);
    if (P.tampilkan && P.tampilkan.length) d = d.filter(function (x) { return P.tampilkan.indexOf(x[0]) >= 0; });
    if (!P.tp.length) d = d.filter(function (x) { return x[0] === 'cp' || x[0] === 'modul'; });
    return d;
  }
  /* ---------------- gaya ---------------- */
  // Lembar A4 tetap: 794 × 1123 px (96 dpi). Area isi: margin atas 45, bawah 57, kiri-kanan 57 px.
  var CSS = '\
:root{--hijau:#0B2B2A;--muda:#DCE7DF;--emas:#B89146;--teks:#182322}\
html,body{margin:0;background:#e4e9e5;color:var(--teks);font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}\
#pa-bar{position:sticky;top:0;z-index:9;background:var(--hijau);color:#fff;padding:8px 10px;display:flex;flex-wrap:wrap;gap:6px;align-items:center;box-shadow:0 2px 6px rgba(0,0,0,.2)}\
#pa-bar .brand{font-weight:700;margin-right:6px;color:var(--emas)}\
#pa-bar button,#pa-bar label.btn{background:#ffffff1a;color:#fff;border:1px solid #ffffff44;border-radius:6px;padding:6px 10px;font-size:13px;cursor:pointer;font-family:inherit}\
#pa-bar button:hover,#pa-bar label.btn:hover{background:#ffffff33}\
#pa-bar button.on{background:var(--emas);border-color:var(--emas);color:#1b1b1b;font-weight:600}\
#pa-bar .sep{width:1px;height:22px;background:#ffffff44;margin:0 4px}\
#pa-bar input[type=number]{width:46px;padding:4px;border-radius:5px;border:0;font-size:13px}\
#pa-bar .kecilui{font-size:12px;opacity:.9}\
#pa-panel{display:none;background:#fff;border-bottom:3px solid var(--emas);padding:10px 14px;font-size:13px;max-height:55vh;overflow:auto}\
#pa-panel table{border-collapse:collapse;width:100%}#pa-panel td,#pa-panel th{border:1px solid #ccd;padding:3px 6px}\
#pa-info{background:#fff8e6;border:1px solid var(--emas);margin:12px auto;width:794px;max-width:calc(100% - 12px);box-sizing:border-box;padding:8px 12px;font-size:13px;border-radius:6px}\
#pa-wrap{padding:6px 6px 40px;overflow-x:auto}\
.lembar{position:relative;width:794px;height:1123px;margin:0 auto 22px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.15),0 6px 18px rgba(0,0,0,.10);box-sizing:border-box;overflow:hidden}\
.lembar .isi{position:absolute;top:45px;left:57px;right:57px;bottom:57px;overflow:hidden;font-family:"Times New Roman",Times,serif;font-size:11pt;line-height:1.3;color:#000;outline:none}\
.lembar .isi:focus{box-shadow:0 0 0 1px #b8914655}\
.lembar .kaki{position:absolute;left:57px;right:57px;bottom:22px;display:flex;justify-content:space-between;font-family:"Times New Roman",Times,serif;font-size:8pt;color:#666;border-top:0.5px solid #bbb;padding-top:3px}\
.isi>:first-child{margin-top:0}\
.kop img{width:100%;display:block;margin-bottom:6px}.kop-kosong{border:1px dashed #b89146;color:#8a6d2e;text-align:center;padding:8px;font-family:sans-serif;font-size:11px;margin-bottom:6px}\
.judul{text-align:center;font-size:13pt;text-transform:uppercase;margin:4px 0 2px}.subjudul{text-align:center;font-size:12pt;margin:0 0 8px;font-weight:700}\
.isi h3{font-size:11.5pt;margin:10px 0 5px}.sub{font-weight:700;margin:8px 0 4px}.pt{font-weight:700;background:#eef2ef;padding:3px 6px;margin:10px 0 4px}\
.isi p{margin:0 0 5px}.isi ul,.isi ol{margin:2px 0 6px;padding-left:22px}\
table.identitas{margin:0 0 8px;border-collapse:collapse}.identitas td{padding:1px 4px;vertical-align:top}.identitas .lbl{width:150px}.identitas .sep{width:10px}\
table.grid{width:100%;border-collapse:collapse;margin:4px 0 8px;table-layout:auto}.grid th,.grid td{border:1px solid #000;padding:3px 5px;vertical-align:top;word-wrap:break-word;overflow-wrap:break-word}\
.grid th{background:#e8ece9;text-align:center;vertical-align:middle}\
.grid p{margin:0 0 3px}.grid ul,.grid ol{margin:0;padding-left:16px}\
.c{text-align:center}.kecil{font-size:9pt}.n{font-weight:400}.grup td{background:#f1f4f2}.total td{font-weight:700;background:#f1f4f2}.cp-el{margin-top:2px}\
.peringatan{color:#a30000;font-weight:700}.sumber{font-size:9pt;font-style:italic;margin:0 0 6px}\
.prosem{font-size:8pt;table-layout:fixed}.prosem th,.prosem td{padding:2px 2px}.prosem .mg{text-align:center;padding:2px 0}.prosem td.libur{background:#d6d6d6}.prosem td.isi-jp{background:#dce7df;font-weight:700}.prosem td.cad{background:#f6edd9}\
.kktp td,.kktp th{font-size:9pt}\
table.ttd{width:100%;margin-top:16px;border:0;border-collapse:collapse}.ttd td{width:50%;text-align:center;vertical-align:top;border:0}.ttd-ruang{height:56px}\
.head td{font-size:10pt}.head .lbl,.desain .lbl{width:28%;font-weight:700;background:#f1f4f2}\
.dua{display:flex;gap:10px}.dua>div{flex:1;min-width:0}.cek td,.cek th{font-size:9.5pt}\
.prinsip{font-weight:400;font-style:italic;font-size:9pt}.sintaks{font-weight:700;font-size:9pt;color:#0B2B2A}.pb2{margin:6px 0 2px}\
.lamp{text-align:center;font-size:12pt;margin:4px 0}.kotak{border:1px solid #000;padding:5px 8px;margin:6px 0}\
.lk-id{width:100%;margin:6px 0;border-collapse:collapse}.lk-id td{padding:3px 2px;font-size:10pt}\
.garis{border-bottom:1px dotted #555;height:18px}.tanya li{margin-bottom:6px}\
[dir=auto]{unicode-bidi:plaintext}\
.ekspor .kop-kosong,.ekspor .lembar .isi:focus{display:none;box-shadow:none}\
@media screen and (max-width:820px){#pa-wrap{padding-left:0;padding-right:0}}\
@media print{@page{size:A4 portrait;margin:0}html,body{background:#fff}#pa-bar,#pa-panel,#pa-info,.no-print,.kop-kosong{display:none!important}#pa-wrap{padding:0;overflow:visible!important}.dok.sembunyi{display:none!important}.lembar{margin:0;box-shadow:none;page-break-after:always;break-after:page}.lembar:last-child{page-break-after:auto}}\
';
  function el(id) { return document.getElementById(id); }

  /* ---------------- paginator A4 ---------------- */
  var FRAG = 0;
  var TEMBUS = { 'pertemuan': 1, 'lkpd': 1, 'akt': 1, 'cp-intro': 1 };      // pembungkus yang dibuka
  function isPB(n) { return n.classList && n.classList.contains('pb'); }
  function bukaBungkus(nodes) {
    var out = [];
    nodes.forEach(function (n) {
      if (n.nodeType === 3) { if (n.textContent.trim()) { var p = document.createElement('p'); p.textContent = n.textContent; out.push(p); } return; }
      if (n.nodeType !== 1) return;
      if (n.tagName === 'DIV' && [].some.call(n.classList, function (c) { return TEMBUS[c]; })) { out = out.concat(bukaBungkus([].slice.call(n.childNodes))); return; }
      out.push(n);
    });
    return out;
  }
  function judulBlok(n) {
    if (!n || n.nodeType !== 1) return false;
    if (/^H[1-4]$/.test(n.tagName)) return true;
    return n.tagName === 'P' && (n.classList.contains('sub') || n.classList.contains('pt') || n.classList.contains('pb2'));
  }
  function dapatDipecah(n) {
    if (n.tagName === 'TABLE') return n.classList.contains('grid') && n.tBodies[0] && n.tBodies[0].rows.length > 1;
    if (n.tagName === 'OL' || n.tagName === 'UL') return n.children.length > 1;
    return false;
  }
  function lebih(isi) { return isi.scrollHeight > isi.clientHeight + 1; }
  function lembarBaru(box, docId, judulDok, pbManual) {
    var s = document.createElement('div'); s.className = 'lembar'; s.dataset.doc = docId; if (pbManual) s.dataset.pb = '1';
    s.innerHTML = '<div class="isi" contenteditable="true" spellcheck="false"></div><div class="kaki" contenteditable="false"><span>' + esc(judulDok) + ' — ' + esc(I.mapel_nama || '') + ' Kelas ' + esc(I.kelas) + '</span><span class="nohal"></span></div>';
    box.appendChild(s); return s.firstChild;
  }
  function pecahTabel(t, isi) {
    var tb = t.tBodies[0];
    var part = t.cloneNode(false), fid = t.dataset.frag || ('f' + (++FRAG));
    t.dataset.frag = fid; part.dataset.frag = fid;
    [].forEach.call(t.children, function (c) { if (c.tagName !== 'TBODY') part.appendChild(c.cloneNode(true)); });
    var ptb = document.createElement('tbody'); part.appendChild(ptb); isi.appendChild(part);
    var n = 0;
    while (tb.rows.length) { var r = tb.rows[0]; ptb.appendChild(r); if (lebih(isi)) { tb.insertBefore(r, tb.firstChild); break; } n++; }
    while (n > 0 && ptb.rows[ptb.rows.length - 1].classList.contains('grup')) { tb.insertBefore(ptb.rows[ptb.rows.length - 1], tb.firstChild); n--; }
    if (n === 0 || !tb.rows.length) { if (n === 0) { isi.removeChild(part); } return n === 0 ? null : false; }
    // label lanjutan grup
    var lab = t.dataset.label || '';
    [].forEach.call(ptb.rows, function (r) { if (r.classList.contains('grup') && r.dataset.label) lab = r.dataset.label; });
    t.dataset.label = lab;
    if (lab && !tb.rows[0].classList.contains('grup')) {
      var cols = 0; [].forEach.call((ptb.rows[ptb.rows.length - 1] || tb.rows[0]).cells, function (c) { cols += c.colSpan || 1; });
      var lr = document.createElement('tr'); lr.className = 'grup'; lr.dataset.auto = '1'; lr.innerHTML = '<td colspan="' + cols + '"><b>' + esc(lab) + ' (lanjutan)</b></td>';
      tb.insertBefore(lr, tb.firstChild);
    }
    return t;
  }
  function pecahDaftar(l, isi) {
    var part = l.cloneNode(false), fid = l.dataset.frag || ('f' + (++FRAG));
    l.dataset.frag = fid; part.dataset.frag = fid; isi.appendChild(part);
    var n = 0, start = +(l.getAttribute('start') || 1);
    while (l.children.length) { var li = l.children[0]; part.appendChild(li); if (lebih(isi)) { l.insertBefore(li, l.firstChild); break; } n++; }
    if (n === 0) { isi.removeChild(part); return null; }
    if (!l.children.length) return false;
    if (l.tagName === 'OL') l.setAttribute('start', start + n);
    return l;
  }
  function alirkan(docId, judulDok, blocks, box) {
    var isi = lembarBaru(box, docId, judulDok), q = blocks.slice(), pbNext = false;
    while (q.length) {
      var b = q.shift();
      if (isPB(b)) { if (isi.childNodes.length) isi = lembarBaru(box, docId, judulDok, true); continue; }
      isi.appendChild(b);
      if (!lebih(isi)) continue;
      isi.removeChild(b);
      var sisa = dapatDipecah(b) ? (b.tagName === 'TABLE' ? pecahTabel(b, isi) : pecahDaftar(b, isi)) : null;
      if (sisa === false) { continue; }                 // ternyata muat seluruhnya
      if (sisa) { isi = lembarBaru(box, docId, judulDok); q.unshift(sisa); continue; }
      if (!isi.childNodes.length) { isi.appendChild(b); isi = lembarBaru(box, docId, judulDok); continue; }  // terlalu tinggi, letakkan saja
      var bawa = [];
      while (isi.childNodes.length > 1 && judulBlok(isi.lastChild)) bawa.unshift(isi.removeChild(isi.lastChild));
      isi = lembarBaru(box, docId, judulDok);
      bawa.forEach(function (x) { isi.appendChild(x); });
      q.unshift(b);
    }
    var ls = box.querySelectorAll('.lembar');
    [].forEach.call(ls, function (s, i) { var nh = s.querySelector('.nohal'); if (nh) nh.textContent = 'Halaman ' + (i + 1) + ' dari ' + ls.length; });
  }
  // kumpulkan kembali isi lembar (setelah diedit) menjadi alur utuh
  function kumpulkan(box) {
    var out = [], last = null;
    [].forEach.call(box.querySelectorAll('.lembar'), function (s, si) {
      if (s.dataset.pb && si) { var pb = document.createElement('div'); pb.className = 'pb'; out.push(pb); last = null; }
      [].slice.call(s.querySelector('.isi').childNodes).forEach(function (n) {
        if (n.nodeType !== 1) { if (n.nodeType === 3 && n.textContent.trim()) { var p = document.createElement('p'); p.textContent = n.textContent; out.push(p); last = p; } return; }
        [].forEach.call(n.querySelectorAll ? n.querySelectorAll('tr[data-auto]') : [], function (r) { r.remove(); });
        if (last && n.dataset.frag && last.dataset.frag === n.dataset.frag) {
          if (n.tagName === 'TABLE') { var lt = last.tBodies[0]; [].slice.call(n.tBodies[0] ? n.tBodies[0].rows : []).forEach(function (r) { lt.appendChild(r); }); }
          else [].slice.call(n.children).forEach(function (li) { last.appendChild(li); });
          return;
        }
        out.push(n); last = n;
      });
    });
    out.forEach(function (n) { if (n.removeAttribute) { n.removeAttribute('data-frag'); n.removeAttribute('data-label'); if (n.tagName === 'OL') n.removeAttribute('start'); } });
    return out;
  }
  function rapikan(box) {
    var docId = box.dataset.doc, j = box.dataset.judul, blocks = kumpulkan(box);
    var y = window.scrollY; box.innerHTML = ''; alirkan(docId, j, blocks, box); window.scrollTo(0, y);
  }

  /* ---------------- render ---------------- */
  function tampilkanAktif() {
    [].forEach.call(document.querySelectorAll('#pa-wrap .dok'), function (d) { var on = aktif === 'semua' || d.dataset.doc === aktif; d.classList.toggle('sembunyi', !on); d.style.display = on ? '' : 'none'; });
    [].forEach.call(document.querySelectorAll('#pa-tabs button'), function (b) { b.classList.toggle('on', b.dataset.tab === aktif); });
  }
  var KOP_R = 0, KOP_SRC = '';
  function render() {
    if (P.kop && KOP_SRC !== P.kop) {
      var im = new Image(); im.onload = function () { KOP_R = im.naturalHeight / im.naturalWidth; KOP_SRC = P.kop; render(); };
      im.onerror = function () { KOP_R = 0; KOP_SRC = P.kop; render(); }; im.src = P.kop; return;
    }
    var list = docsList();
    if (aktif !== 'semua' && !list.some(function (d) { return d[0] === aktif; })) aktif = list[0][0];
    el('pa-tabs').innerHTML = list.map(function (d) { return '<button data-tab="' + d[0] + '">' + d[1] + '</button>'; }).join('') + '<button data-tab="semua">Semua</button>';
    var wrap = el('pa-wrap'); wrap.innerHTML = '';
    list.forEach(function (d) {
      var body; try { body = d[2](); } catch (e) { body = '<p class="peringatan">Gagal menyusun dokumen ' + d[1] + ': ' + esc(e.message) + '</p>'; }
      var box = document.createElement('div'); box.className = 'dok'; box.dataset.doc = d[0]; box.dataset.judul = d[1]; wrap.appendChild(box);
      var tmp = document.createElement('div'); tmp.innerHTML = body;
      alirkan(d[0], d[1], bukaBungkus([].slice.call(tmp.childNodes)), box);
    });
    tampilkanAktif();
    el('kktp-in').value = P.pengaturan.kktp; el('jpm-in').value = jpMinggu();
    var info = [];
    if (GAGAL.length) info.push('Sebagian data rujukan gagal dimuat (' + GAGAL.join(', ') + '). Periksa koneksi internet lalu muat ulang.');
    if (!cpMapel()) info.push('CP mapel "' + esc(I.mapel_id) + '" Fase ' + I.fase + ' tidak ditemukan.');
    if (arr(P.riwayat_model).length) info.push('<b>Model yang sudah dipakai:</b> ' + arr(P.riwayat_model).map(function (r) { return esc((MODEL[r] && MODEL[r].nama) || r); }).join(', ') + '.');
    info.push('Tampilan ini sama persis dengan hasil cetak/PDF (A4 portrait). Teks dapat diedit langsung; tata letak halaman dirapikan otomatis setelah selesai mengedit. Ubah pengaturan (KKTP, JP, minggu efektif, Atur TP) sebelum mengedit teks, karena pengaturan menyusun ulang dokumen.');
    el('pa-info').innerHTML = info.join('<br>');
  }
  function lembarTampil() { return [].slice.call(document.querySelectorAll('#pa-wrap .dok')).filter(function (d) { return d.style.display !== 'none'; }).reduce(function (a, d) { return a.concat([].slice.call(d.querySelectorAll('.lembar'))); }, []); }
  function namaFile(ext) { var t = aktif === 'semua' ? 'Perangkat Ajar' : (docsList().filter(function (d) { return d[0] === aktif; })[0] || [0, 'Dokumen'])[1]; return (t + ' - ' + (I.mapel_nama || '') + ' - Kelas ' + I.kelas + ' - ' + (I.guru.nama || '')).replace(/[\\/:*?"<>|]+/g, '') + '.' + ext; }
  function unduh(blob, name) { var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 2000); }

  /* ---------------- ekspor ---------------- */
  function wordDoc() {
    var docs = [].slice.call(document.querySelectorAll('#pa-wrap .dok')).filter(function (d) { return d.style.display !== 'none'; });
    var body = docs.map(function (d) {
      var tmp = document.createElement('div'); d.cloneNode(true).querySelectorAll('.lembar').forEach(function (s) { tmp.appendChild(s); });
      return kumpulkan(tmp).map(function (n) { return isPB(n) ? '<br clear="all" style="page-break-before:always">' : n.outerHTML; }).join('');
    }).join('<br clear="all" style="page-break-before:always">');
    body = body.replace(/<div class="kop-kosong[^>]*>.*?<\/div>/g, '').replace(/ contenteditable="(true|false)"/g, '');
    var imgs = [], i = 0;
    body = body.replace(/src="(data:image\/(png|jpe?g|gif|webp);base64,([^"]+))"/g, function (m0, all, type, b64) { var n = 'kop' + (i++) + '.' + (type === 'jpeg' ? 'jpg' : type); imgs.push({ n: n, type: 'image/' + type, b64: b64 }); return 'src="' + n + '"'; });
    var css = '@page WordSection1{size:21cm 29.7cm;margin:1.2cm 1.5cm 1.5cm 1.5cm;mso-page-orientation:portrait}div.WordSection1{page:WordSection1}body{font-family:"Times New Roman";font-size:11pt}p{margin:0 0 4pt}table{border-collapse:collapse;width:100%}.grid td,.grid th{border:1px solid #000;padding:2pt 4pt;vertical-align:top}.grid th{background:#e8ece9}thead{display:table-header-group}.judul{text-align:center;font-size:13pt;text-transform:uppercase;margin:4pt 0 2pt}.subjudul{text-align:center;font-size:12pt;margin:0 0 8pt}.c{text-align:center}.kecil{font-size:9pt}.prosem td,.prosem th{font-size:7.5pt;padding:1pt}.libur{background:#d6d6d6}.isi-jp{background:#dce7df}.grup td,.total td{background:#f1f4f2}.ttd td{border:0;text-align:center;width:50%}.ttd-ruang{height:50pt}.kop img{width:100%}.identitas td{border:0;padding:1pt 3pt}.lk-id td{border:0}.kotak{border:1pt solid #000;padding:4pt}.garis{border-bottom:1pt dotted #555;height:14pt}.pt{font-weight:bold;background:#eef2ef}.sub{font-weight:bold}';
    var html = '<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><style>' + css + '</style></head><body><div class="WordSection1">' + body + '</div></body></html>';
    var B = '----=_NextPart_PERANGKAT', out = 'MIME-Version: 1.0\r\nContent-Type: multipart/related; boundary="' + B + '"\r\n\r\n--' + B + '\r\nContent-Type: text/html; charset="utf-8"\r\nContent-Location: file:///C:/dok.htm\r\nContent-Transfer-Encoding: base64\r\n\r\n' + b64utf8(html) + '\r\n';
    imgs.forEach(function (im) { out += '--' + B + '\r\nContent-Type: ' + im.type + '\r\nContent-Location: file:///C:/' + im.n + '\r\nContent-Transfer-Encoding: base64\r\n\r\n' + im.b64.replace(/(.{76})/g, '$1\r\n') + '\r\n'; });
    out += '--' + B + '--';
    unduh(new Blob([out], { type: 'application/msword' }), namaFile('doc'));
  }
  function b64utf8(s) { var b = new TextEncoder().encode(s), r = '', CH = 0x8000; for (var i = 0; i < b.length; i += CH) r += String.fromCharCode.apply(null, b.subarray(i, i + CH)); return btoa(r).replace(/(.{76})/g, '$1\r\n'); }
  var LIB = {
    h2c: ['https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js'],
    pdf: ['https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js']
  };
  function muat(urls, ada) {
    return new Promise(function (res, rej) {
      if (ada()) return res(); var i = 0;
      (function next() { if (i >= urls.length) return rej(); var s = document.createElement('script'); s.src = urls[i++]; s.onload = function () { ada() ? res() : next(); }; s.onerror = next; document.head.appendChild(s); })();
    });
  }
  function pdf() {
    var btn = el('btn-pdf'), lab = btn.textContent;
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    btn.disabled = true; btn.textContent = 'Menyiapkan PDF…';
    Promise.all([muat(LIB.h2c, function () { return !!window.html2canvas; }), muat(LIB.pdf, function () { return !!(window.jspdf && window.jspdf.jsPDF); })]).then(function () {
      var ls = lembarTampil(), doc = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true }), i = 0;
      document.body.classList.add('ekspor');
      return new Promise(function (res, rej) {
        (function satu() {
          if (i >= ls.length) return res();
          btn.textContent = 'PDF ' + (i + 1) + '/' + ls.length + '…';
          window.html2canvas(ls[i], { scale: 2, backgroundColor: '#ffffff', useCORS: true, logging: false, width: 794, height: 1123, windowWidth: 1200 }).then(function (cv) {
            if (i) doc.addPage('a4', 'portrait');
            doc.addImage(cv.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 210, 297);
            i++; setTimeout(satu, 0);
          }).catch(rej);
        })();
      }).then(function () { doc.save(namaFile('pdf')); });
    }).catch(function () { alertBar('Pustaka PDF tidak dapat dimuat di tampilan ini. Gunakan tombol "Cetak", lalu pilih tujuan "Simpan sebagai PDF" — hasilnya sama persis.'); })
      .then(function () { document.body.classList.remove('ekspor'); btn.disabled = false; btn.textContent = lab; });
  }
  function cetak() {
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    try { window.print(); } catch (x) { alertBar('Cetak diblokir oleh tampilan ini. Gunakan "Unduh PDF" atau "Unduh HTML" lalu cetak dari browser.'); }
  }
  function unduhHTML() {
    var isi = lembarTampil().map(function (s) { var c = s.cloneNode(true); [].forEach.call(c.querySelectorAll('.kop-kosong'), function (k) { k.remove(); }); return c.outerHTML; }).join('');
    var doc = '<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>' + esc(namaFile('html')) + '</title><style>' + CSS + '</style></head><body><div id="pa-wrap"><div class="dok">' + isi + '</div></div></body></html>';
    unduh(new Blob([doc], { type: 'text/html' }), namaFile('html'));
  }
  function unduhJSON() { var c = JSON.parse(JSON.stringify(P)); delete c.kop; unduh(new Blob(['window.PERANGKAT = ' + JSON.stringify(c, null, 1) + ';'], { type: 'text/javascript' }), 'data-perangkat.js'); }
  function alertBar(t) { var i = el('pa-info'); i.innerHTML = '<b>' + esc(t) + '</b><br>' + i.innerHTML; window.scrollTo(0, 0); }

  /* ---------------- panel ---------------- */
  function panelMinggu() {
    P.pengaturan.minggu = P.pengaturan.minggu || {};
    var h = '<b>Minggu efektif</b> — centang/hapus centang untuk mengubah. <button data-act="tutup">Tutup</button> <button data-act="reset-minggu">Kembalikan default</button><div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:6px">';
    ['1', '2'].forEach(function (s) {
      h += '<table style="width:auto"><tr><th colspan="4">Semester ' + ROMAWI[s] + ' (' + efektif(s) + ' minggu efektif)</th></tr><tr><th>Bulan</th><th>Mg</th><th>Senin</th><th>Efektif</th></tr>' + weeksFor(s).map(function (w) { return '<tr title="' + esc(w.ket) + '"><td>' + w.bulan + '</td><td>' + w.ke + '</td><td>' + w.senin + '</td><td style="text-align:center"><input type="checkbox" data-minggu="' + w.senin + '"' + (w.ef ? ' checked' : '') + '></td></tr>'; }).join('') + '</table>';
    });
    return h + '</div>';
  }
  function panelTP() {
    var F = I.fase === 'F', h = '<b>Atur TP</b> — ubah ' + (F ? 'kelas, ' : '') + 'semester, dan JP setiap TP. <button data-act="tutup">Tutup</button><table style="margin-top:6px"><tr><th>Kode</th><th>Tujuan Pembelajaran</th>' + (F ? '<th>Kelas</th>' : '') + '<th>Semester</th><th>JP</th></tr>';
    var cur = TPk();
    P.tp.forEach(function (t, i) {
      var inKelas = cur.indexOf(t) >= 0;
      h += '<tr><td>' + esc(t.kode) + '</td><td>' + esc(t.tp) + '</td>' + (F ? '<td><select data-tp="' + i + '" data-f="kelas"><option' + (t.kelas === 'XI' ? ' selected' : '') + '>XI</option><option' + (t.kelas === 'XII' ? ' selected' : '') + '>XII</option></select></td>' : '') +
        '<td>' + (inKelas ? '<select data-tp="' + i + '" data-f="semester"><option value="1"' + (String(t.semester) === '1' ? ' selected' : '') + '>I</option><option value="2"' + (String(t.semester) === '2' ? ' selected' : '') + '>II</option></select>' : '-') + '</td><td><input type="number" min="0" style="width:56px" data-tp="' + i + '" data-f="jp" value="' + esc(t.jp || 0) + '"></td></tr>';
    });
    return h + '</table>';
  }
  function bukaPanel(fn) { var p = el('pa-panel'); p.innerHTML = fn(); p.style.display = 'block'; }

  /* ---------------- inisialisasi ---------------- */
  function init() {
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    document.title = 'Perangkat Ajar ' + (I.mapel_nama || '') + ' Kelas ' + I.kelas;
    var root = el('app') || document.body;
    root.innerHTML = '<div id="pa-bar"><span class="brand">Perangkat Ajar ' + esc(P.jenjang) + '</span><span id="pa-tabs"></span><span class="sep"></span>' +
      '<label class="btn">Unggah Kop<input type="file" id="kop-in" accept="image/*" hidden></label><button data-act="hapus-kop">Hapus Kop</button><span class="sep"></span>' +
      '<span class="kecilui">KKTP</span><input type="number" id="kktp-in" min="1" max="100"><span class="kecilui">JP/mg</span><input type="number" id="jpm-in" min="1" max="12">' +
      '<button data-act="minggu">Minggu Efektif</button><button data-act="atur-tp">Atur TP</button><span class="sep"></span>' +
      '<button data-act="cetak">Cetak</button><button data-act="pdf" id="btn-pdf">Unduh PDF</button><button data-act="word">Unduh Word</button><button data-act="html">Unduh HTML</button><button data-act="json" title="Simpan data (TP, pengaturan) untuk dipakai lagi">Data</button></div>' +
      '<div id="pa-panel"></div><div id="pa-info"></div><div id="pa-wrap"><div class="dok"><div class="lembar"><div class="isi" style="font-family:sans-serif">Memuat data rujukan (CP, struktur kurikulum, kalender)…</div></div></div></div>';
    root.addEventListener('click', function (e) {
      var t = e.target.closest('[data-tab],[data-act]'); if (!t) return;
      if (t.dataset.tab) { aktif = t.dataset.tab; lsSet('perangkat-tab', aktif); tampilkanAktif(); return; }
      var a = t.dataset.act;
      if (a === 'cetak') cetak(); else if (a === 'pdf') pdf(); else if (a === 'word') wordDoc(); else if (a === 'html') unduhHTML(); else if (a === 'json') unduhJSON();
      else if (a === 'hapus-kop') { P.kop = ''; lsSet(kopKey, null); render(); }
      else if (a === 'minggu') bukaPanel(panelMinggu); else if (a === 'atur-tp') bukaPanel(panelTP);
      else if (a === 'tutup') el('pa-panel').style.display = 'none';
      else if (a === 'reset-minggu') { P.pengaturan.minggu = {}; render(); bukaPanel(panelMinggu); }
    });
    root.addEventListener('change', function (e) {
      var t = e.target;
      if (t.id === 'kop-in' && t.files[0]) { var fr = new FileReader(); fr.onload = function () { P.kop = fr.result; lsSet(kopKey, P.kop); render(); }; fr.readAsDataURL(t.files[0]); }
      else if (t.id === 'kktp-in') { P.pengaturan.kktp = Math.max(1, Math.min(100, +t.value || 75)); render(); }
      else if (t.id === 'jpm-in') { P.pengaturan.jp_minggu = Math.max(1, +t.value || 1); render(); }
      else if (t.dataset.minggu) { P.pengaturan.minggu[t.dataset.minggu] = t.checked; render(); bukaPanel(panelMinggu); }
      else if (t.dataset.tp) { var tp = P.tp[+t.dataset.tp], f = t.dataset.f; tp[f] = f === 'jp' ? (+t.value || 0) : t.value; if (f === 'kelas') delete tp.semester; render(); bukaPanel(panelTP); }
    });
    // rapikan halaman setelah selesai mengedit sebuah lembar
    var kotor = null;
    root.addEventListener('input', function (e) { var d = e.target.closest && e.target.closest('.dok'); if (d) kotor = d; });
    root.addEventListener('focusout', function (e) {
      if (!kotor) return; var d = kotor;
      setTimeout(function () { if (document.activeElement && d.contains(document.activeElement)) return; if (kotor === d) { kotor = null; rapikan(d); } }, 120);
    });
    window.addEventListener('beforeprint', function () { if (kotor) { var d = kotor; kotor = null; rapikan(d); } });
    loadAll().then(render, render);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.MesinPerangkat = { versi: VERSI, render: render, data: P };
})();
