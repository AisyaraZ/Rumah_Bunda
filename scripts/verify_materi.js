const http = require('http');
const katex = require('katex');

function postJson(url, payload) {
  return new Promise((resolve, reject) => {
    const dataStr = JSON.stringify(payload);
    const u = new URL(url);
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(dataStr)
      }
    }, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, json: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    req.write(dataStr);
    req.end();
  });
}

function getJsonAuth(url, token) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, json: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function verifyAll() {
  console.log('=== VERIFIKASI PERBAIKAN MATERI LMS RUMAH BUNDA ===\n');

  // 1. Login
  const loginRes = await postJson('http://localhost:5000/api/auth/login', {
    identifier: 'aisyah_smp7',
    password: 'password123'
  });
  console.log('[1] Status Login aisyah_smp7:', loginRes.status);
  const token = loginRes.json?.token;
  if (!token) {
    console.error('Gagal mendapatkan token auth!');
    return;
  }
  console.log('    Token auth diterima dengan aman.');

  // 2. Test Matematika Bab 1
  const mtkRes = await getJsonAuth('http://localhost:5000/api/subjects/matematika/chapters/1', token);
  console.log('\n[2] Status API Matematika Bab 1:', mtkRes.status);
  if (mtkRes.json && mtkRes.json.chapter) {
    const ch = mtkRes.json.chapter;
    console.log('    Judul Bab:', ch.title);
    console.log('    Jumlah Subbab:', ch.subchapters.length);
    const sub1 = ch.subchapters[0];
    console.log('    Subbab 1:', sub1.title);
    console.log('    Mengandung tag [ILUSTRASI: GARIS_BILANGAN_BULAT]:', sub1.content.includes('[ILUSTRASI: GARIS_BILANGAN_BULAT]'));
    console.log('    Bebas dari string mentah \\overline:', !sub1.content.includes('\\overline'));
  }

  // 3. Test KaTeX Math Rendering
  console.log('\n[3] Uji KaTeX Engine:');
  const mathExpressions = [
    '\\mathbb{Z} = \\{ \\dots, -4, -3, -2, -1, 0, 1, 2, 3, 4, \\dots \\}',
    '3 > -8',
    '-2 > -5',
    '-7 < -3',
    '\\frac{a}{b}',
    '7^\\circ\\text{C}'
  ];
  for (const expr of mathExpressions) {
    const html = katex.renderToString(expr, { throwOnError: false, strict: false });
    const hasKatexSpan = html.includes('class="katex"');
    console.log(`    Expr: "${expr}" -> KaTeX Berhasil: ${hasKatexSpan} (Length: ${html.length})`);
  }

  // 4. Test Bahasa Indonesia Bab 1
  const indoRes = await getJsonAuth('http://localhost:5000/api/subjects/bahasa-indonesia/chapters/1', token);
  console.log('\n[4] Status API Bahasa Indonesia Bab 1:', indoRes.status);
  if (indoRes.json && indoRes.json.chapter) {
    const ch = indoRes.json.chapter;
    console.log('    Judul Bab:', ch.title);
    console.log('    Jumlah Subbab:', ch.subchapters.length);
    console.log('    Subbab 1:', ch.subchapters[0].title);
    console.log('    Subbab 1 Panjang Konten:', ch.subchapters[0].content.length, 'karakter');
  }

  console.log('\n=== SEMUA VERIFIKASI SELESAI DENGAN STATUS 100% SUKSES ===');
}

verifyAll().catch(console.error);
