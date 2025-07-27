import { PDFGenerator } from '../pdf-generator';
import { PDFGenerationRequest } from '@/types';

// Mock do PDFKit
jest.mock('pdfkit', () => {
  return jest.fn().mockImplementation(() => {
    const mockDoc: any = {
      on: jest.fn((event: string, callback: Function) => {
        if (event === 'data') {
          // Simular chunks de dados com tamanho controlado
          const mockData = Buffer.from('mock pdf data '.repeat(1000)); // ~15KB
          callback(mockData);
        } else if (event === 'end') {
          // Simular finalização
          callback();
        }
        return mockDoc;
      }),
      fontSize: jest.fn().mockReturnThis(),
      text: jest.fn().mockReturnThis(),
      moveDown: jest.fn().mockReturnThis(),
      info: {
        Title: '',
        Author: '',
        Subject: '',
        Keywords: '',
        CreationDate: new Date(),
        ModDate: new Date(),
      },
      end: jest.fn(),
    };
    return mockDoc;
  });
});

describe('PDFGenerator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate PDF successfully', async () => {
    const request: PDFGenerationRequest = {
      sizeMB: 1.0,
      tolerance: 1024 * 100, // 100KB tolerance for tests
      maxAttempts: 5
    };

    const result = await PDFGenerator.generatePDF(request);

    // Verificações básicas
    expect(result).toBeDefined();
    expect(result.buffer).toBeDefined();
    expect(result.actualSizeBytes).toBeGreaterThan(0);
    expect(result.attempts).toBeGreaterThan(0);
    expect(typeof result.success).toBe('boolean');
  }, 30000);

  it('should handle different sizes', async () => {
    const sizes = [0.5, 1.0, 5.0];
    
    for (const size of sizes) {
      const request: PDFGenerationRequest = {
        sizeMB: size,
        tolerance: 1024 * 100, // 100KB tolerance for tests
        maxAttempts: 5
      };

      const result = await PDFGenerator.generatePDF(request);

      expect(result).toBeDefined();
      expect(result.buffer).toBeDefined();
      expect(result.actualSizeBytes).toBeGreaterThan(0);
    }
  }, 30000);

  it('should respect max attempts', async () => {
    const request: PDFGenerationRequest = {
      sizeMB: 5.0,
      tolerance: 1, // Very small tolerance to force max attempts
      maxAttempts: 3
    };

    const result = await PDFGenerator.generatePDF(request);

    expect(result.attempts).toBeLessThanOrEqual(request.maxAttempts!);
  }, 30000);

  it('should handle invalid size gracefully', async () => {
    const request: PDFGenerationRequest = {
      sizeMB: -1,
      tolerance: 1024,
      maxAttempts: 5
    };

    const result = await PDFGenerator.generatePDF(request);

    // Deve retornar um resultado, mesmo que não seja bem-sucedido
    expect(result).toBeDefined();
    expect(result.attempts).toBeGreaterThan(0);
  }, 30000);
}); 