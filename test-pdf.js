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

async function testPDFGeneration() {
  console.log('🚀 Testando geração de PDF diretamente...');
  
  const request = {
    sizeMB: 1.0,
    tolerance: 1024 * 100, // 100KB tolerância
    maxAttempts: 5
  };

  console.log('📋 Request:', JSON.stringify(request, null, 2));
  
  try {
    const result = await PDFGenerator.generatePDF(request);
    
    console.log('📊 Resultado:');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.buffer) {
      const outputPath = path.join(__dirname, 'test-direct.pdf');
      fs.writeFileSync(outputPath, result.buffer);
      console.log(`💾 PDF salvo em: ${outputPath} (${result.buffer.length} bytes)`);
      
      const stats = fs.statSync(outputPath);
      console.log(`📁 Arquivo criado: ${stats.size} bytes`);
      
      const accuracy = ((1 - Math.abs(result.difference) / (request.sizeMB * 1024 * 1024)) * 100);
      console.log(`🎯 Precisão: ${accuracy.toFixed(2)}%`);
    } else {
      console.log('❌ Nenhum buffer retornado!');
    }
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

testPDFGeneration(); 