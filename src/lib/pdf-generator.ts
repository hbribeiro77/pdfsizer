// Polyfill para TextEncoder/TextDecoder no ambiente Next.js
if (typeof global !== 'undefined') {
  if (typeof global.TextEncoder === 'undefined') {
    const { TextEncoder, TextDecoder } = require('util');
    global.TextEncoder = TextEncoder;
    global.TextDecoder = TextDecoder;
  }
}

import PDFDocument from 'pdfkit';
import { PDFGenerationRequest, PDFGenerationResult } from '@/types';

export class PDFGenerator {
  private static createPDFDocument(pages: number): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        console.log(`🔧 Creating PDF with ${pages} pages`);
        
        // Configuração para evitar carregamento de fontes externas
        const doc = new PDFDocument({
          autoFirstPage: false
        });

        const chunks: Buffer[] = [];
        
        doc.on('data', (chunk) => {
          chunks.push(chunk);
        });

        doc.on('end', () => {
          const buffer = Buffer.concat(chunks);
          console.log(`🔧 PDF created successfully: ${buffer.length} bytes`);
          resolve(buffer);
        });

        doc.on('error', (error) => {
          console.error(`🔧 PDF creation error:`, error);
          reject(error);
        });

        // Adicionar páginas
        for (let i = 0; i < pages; i++) {
          if (i > 0) {
            doc.addPage();
          }
          
          // Usar fonte padrão sem especificar
          doc.fontSize(12);
          
          // Calcular quantas linhas cabem em uma página A4
          const pageHeight = 842; // A4 height in points
          const lineHeight = 14; // altura aproximada de uma linha
          const linesPerPage = Math.floor((pageHeight - 100) / lineHeight); // -100 para margens
          
          // Preencher a página com "T"s
          for (let line = 0; line < linesPerPage; line++) {
            const charsPerLine = 80; // caracteres por linha
            const lineText = 'T'.repeat(charsPerLine);
            doc.text(lineText);
          }
        }

        // Adicionar metadados básicos
        doc.info.Title = 'PDF Size Test Document';
        doc.info.Author = 'PDFSizer';
        doc.info.Subject = 'File size testing';
        doc.info.CreationDate = new Date();
        doc.info.ModDate = new Date();

        doc.end();
      } catch (error) {
        console.error(`🔧 Error in createPDFDocument:`, error);
        reject(error);
      }
    });
  }

  public static async generatePDF(request: PDFGenerationRequest): Promise<PDFGenerationResult> {
    const {
      sizeMB,
      tolerance = 1024, // 1KB padrão
      maxAttempts = 10
    } = request;

    const targetSizeBytes = Math.round(sizeMB * 1024 * 1024);
    let attempts = 0;
    let currentBuffer: Buffer | null = null;
    let currentSize = 0;
    let baseSize = 0;
    let bytesPerPage = 0;

    console.log(`🎯 Target size: ${sizeMB}MB (${targetSizeBytes} bytes)`);

    do {
      attempts++;
      console.log(`📝 Attempt ${attempts}/${maxAttempts}`);

      try {
        let pages = 1;
        
        if (attempts === 1) {
          // Primeira tentativa: estimativa inicial baseada em testes reais
          // 1 página = ~1.6KB, então para 1MB precisamos de ~655 páginas
          pages = Math.ceil(targetSizeBytes / 1600);
          console.log(`🔧 First attempt: estimating ${pages} pages (${targetSizeBytes / 1600} estimated)`);
        } else {
          // Tentativas subsequentes: ajustar baseado no aprendizado
          const sizeDifference = targetSizeBytes - currentSize;
          const pagesToAdd = Math.ceil(sizeDifference / bytesPerPage);
          pages = Math.max(1, pages + pagesToAdd);
          console.log(`🔧 Attempt ${attempts}: adjusting to ${pages} pages (difference: ${sizeDifference} bytes, ${pagesToAdd} pages to add)`);
        }

        // Gerar PDF
        console.log(`🔧 Generating PDF with ${pages} pages...`);
        currentBuffer = await this.createPDFDocument(pages);
        currentSize = currentBuffer.length;

        // Calcular métricas para próxima tentativa
        if (attempts === 1) {
          baseSize = currentSize;
          bytesPerPage = currentSize / pages;
          console.log(`🔧 First result: ${currentSize} bytes, ${pages} pages, ${bytesPerPage.toFixed(0)} bytes per page`);
        }

        console.log(`📊 Current size: ${(currentSize / (1024 * 1024)).toFixed(2)}MB (${currentSize} bytes)`);
        console.log(`📈 Difference: ${currentSize - targetSizeBytes} bytes`);
        console.log(`📏 Bytes per page: ${bytesPerPage.toFixed(0)}`);

        // Verificar se está dentro da tolerância
        if (Math.abs(currentSize - targetSizeBytes) <= tolerance) {
          console.log(`✅ Size within tolerance!`);
          break;
        }

      } catch (error) {
        console.error(`❌ Error in attempt ${attempts}:`, error);
        return {
          success: false,
          buffer: null,
          actualSizeBytes: 0,
          targetSizeBytes,
          difference: targetSizeBytes,
          attempts,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }

    } while (attempts < maxAttempts);

    const difference = currentSize - targetSizeBytes;
    const success = Math.abs(difference) <= tolerance;

    console.log(`🎉 Final result: ${success ? 'SUCCESS' : 'CLOSE ENOUGH'}`);
    console.log(`📊 Final size: ${(currentSize / (1024 * 1024)).toFixed(2)}MB`);
    console.log(`📈 Final difference: ${difference} bytes`);
    console.log(`📊 Accuracy: ${((1 - Math.abs(difference) / targetSizeBytes) * 100).toFixed(2)}%`);

    return {
      success,
      buffer: currentBuffer,
      actualSizeBytes: currentSize,
      targetSizeBytes,
      difference,
      attempts
    };
  }
} 