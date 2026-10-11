const fs = require('fs');
const { PDFParse } = require('pdf-parse');

async function run() {
  const pdfPath = 'c:/Users/ASUS/Downloads/Buku Siswa Matematika Kelas 7 Kurikulum Merdeka.pdf';
  console.log('Reading:', pdfPath);
  const dataBuffer = fs.readFileSync(pdfPath);
  const uint8 = new Uint8Array(dataBuffer);
  const parser = new PDFParse(uint8);
  await parser.load();
  const textResult = await parser.getText();
  const text = typeof textResult === 'string' ? textResult : (textResult.text || JSON.stringify(textResult));

  console.log('Buku Siswa Text length:', text.length);
  fs.writeFileSync('scripts/extracted_buku_siswa.txt', text.substring(0, 50000), 'utf-8');
  console.log('Saved preview to scripts/extracted_buku_siswa.txt');
  console.log('\n--- FIRST 3000 CHARACTERS ---');
  console.log(text.substring(0, 3000));
}

run().catch(console.error);
