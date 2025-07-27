const { TextEncoder, TextDecoder } = require('util');
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

const fs = require('fs');
const path = require('path');

// Importar o gerador de PDF
const { PDFGenerator } = require('./src/lib/pdf-generator');

async function testPages() {
  console.log('🔍 Testando diferentes números de páginas...');
  
  const targetSize = 1024 * 1024; // 1MB
  const testPages = [10, 50, 100, 200, 300, 400, 500];
  
  for (const pages of testPages) {
    console.log(`\n📄 Testando ${pages} páginas...`);
    
    try {
      const result = await PDFGenerator.createPDFDocument(pages);
      const sizeKB = (result.length / 1024).toFixed(0);
      const sizeMB = (result.length / (1024 * 1024)).toFixed(2);
      
      console.log(`   Tamanho: ${sizeKB}KB (${sizeMB}MB)`);
      console.log(`   Bytes por página: ${(result.length / pages).toFixed(0)}`);
      
      if (result.length >= targetSize) {
        console.log(`   ✅ ${pages} páginas são suficientes para 1MB!`);
        break;
      }
      
      // Salvar o PDF para inspeção
      const outputPath = path.join(__dirname, `test-${pages}pages.pdf`);
      fs.writeFileSync(outputPath, result);
      console.log(`   💾 Salvo em: ${outputPath}`);
      
    } catch (error) {
      console.error(`   ❌ Erro:`, error.message);
    }
  }
}

testPages(); 