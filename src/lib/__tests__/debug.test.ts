import { PDFGenerator } from '../pdf-generator';
import { PDFGenerationRequest } from '@/types';
import fs from 'fs';
import path from 'path';

// Polyfill para Node.js
import { TextEncoder, TextDecoder } from 'util';
if (typeof global.TextEncoder === 'undefined') {
  // @ts-ignore
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  // @ts-ignore
  global.TextDecoder = TextDecoder;
}

describe('Debug PDF Generator', () => {
  it('teste simples de geração', async () => {
    const request: PDFGenerationRequest = {
      sizeMB: 1.0,
      tolerance: 1024 * 100, // 100KB tolerância
      maxAttempts: 5
    };

    console.log('🔍 Debug: Iniciando teste simples...');
    console.log('🔍 Debug: Request:', JSON.stringify(request, null, 2));
    
    const result = await PDFGenerator.generatePDF(request);

    console.log('🔍 Debug: Resultado completo:');
    console.log(JSON.stringify(result, null, 2));

    if (result.buffer) {
      const outputPath = path.join(__dirname, 'debug-test.pdf');
      fs.writeFileSync(outputPath, result.buffer);
      console.log(`🔍 Debug: PDF salvo em ${outputPath} (${result.buffer.length} bytes)`);
      
      // Verificar se o arquivo foi realmente criado
      if (fs.existsSync(outputPath)) {
        const stats = fs.statSync(outputPath);
        console.log(`🔍 Debug: Arquivo criado com sucesso: ${stats.size} bytes`);
      } else {
        console.log(`🔍 Debug: ERRO - Arquivo não foi criado!`);
      }
    } else {
      console.log('🔍 Debug: Nenhum buffer retornado!');
    }

    expect(result).toBeDefined();
  }, 60000);
}); 