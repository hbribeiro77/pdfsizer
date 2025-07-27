import { PDFGenerator } from '../pdf-generator';
import { PDFGenerationRequest } from '@/types';
import fs from 'fs';
import path from 'path';

// Polyfill para Node.js (força como any para evitar erro de tipagem)
import { TextEncoder, TextDecoder } from 'util';
if (typeof global.TextEncoder === 'undefined') {
  // @ts-ignore
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  // @ts-ignore
  global.TextDecoder = TextDecoder;
}

describe('PDFGenerator (integração real)', () => {
  it('deve gerar um PDF de 1MB com precisão aceitável', async () => {
    const request: PDFGenerationRequest = {
      sizeMB: 1.0,
      tolerance: 1024 * 100, // 100KB tolerância
      maxAttempts: 15
    };

    console.log('🎯 Iniciando geração de PDF de 1MB...');
    const result = await PDFGenerator.generatePDF(request);

    console.log('📊 Resultado da geração:');
    console.log(`   Sucesso: ${result.success}`);
    console.log(`   Tamanho esperado: ${request.sizeMB}MB (${request.sizeMB * 1024 * 1024} bytes)`);
    console.log(`   Tamanho real: ${(result.actualSizeBytes / (1024 * 1024)).toFixed(2)}MB (${result.actualSizeBytes} bytes)`);
    console.log(`   Diferença: ${result.difference} bytes`);
    console.log(`   Tentativas: ${result.attempts}`);
    console.log(`   Tolerância: ${request.tolerance} bytes`);
    if (result.error) {
      console.log(`   Erro: ${result.error}`);
    }

    // Verificações básicas - aceitar qualquer resultado para análise
    expect(result).toBeDefined();
    if (result.buffer) {
      expect(result.buffer).toBeDefined();
    }
    expect(result.attempts).toBeGreaterThan(0);

    // Verificar se está dentro da tolerância
    const difference = Math.abs(result.actualSizeBytes - request.sizeMB * 1024 * 1024);
    const accuracy = result.actualSizeBytes > 0 ? ((1 - difference / (request.sizeMB * 1024 * 1024)) * 100) : 0;
    
    console.log(`   Diferença absoluta: ${difference} bytes`);
    console.log(`   Precisão: ${accuracy.toFixed(2)}%`);
    console.log(`   Dentro da tolerância: ${difference <= request.tolerance!}`);

    // Salvar o PDF gerado para inspeção manual (se existir)
    if (result.buffer) {
      const outputPath = path.join(__dirname, 'pdf-teste-1mb.pdf');
      fs.writeFileSync(outputPath, result.buffer);
      console.log(`💾 PDF salvo em: ${outputPath}`);
    }

    // Verificar se atingiu pelo menos 90% de precisão
    console.log('🎯 Verificando precisão mínima de 90%...');
    expect(accuracy).toBeGreaterThanOrEqual(90.0);
    console.log(`✅ Precisão de ${accuracy.toFixed(2)}% atingida!`);
  }, 120000); // 2 minutos de timeout
}); 