const fs = require('fs');
const { PDFParse } = require('pdf-parse');

async function run() {
  const pdfPath = 'c:/Users/ASUS/Downloads/Modul-Rumah-Bunda.pdf';
  const dataBuffer = fs.readFileSync(pdfPath);
  const uint8 = new Uint8Array(dataBuffer);
  const parser = new PDFParse(uint8);
  await parser.load();
  const textResult = await parser.getText();
  const text = typeof textResult === 'string' ? textResult : (textResult.text || JSON.stringify(textResult));

  console.log('Text length:', text.length);
  fs.writeFileSync('scripts/extracted_modul.txt', text, 'utf-8');
  console.log('Saved to scripts/extracted_modul.txt');
  console.log('\n--- FIRST 2500 CHARACTERS ---');
  console.log(text.substring(0, 2500));
}

run().catch(console.error);
