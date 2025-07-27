import { FileVerificationResult } from '@/types';

export class FileVerifier {
  /**
   * Verifica se o tamanho do arquivo está correto
   */
  public static verifyFileSize(
    file: File,
    expectedSizeMB: number,
    toleranceBytes: number = 1024
  ): FileVerificationResult {
    const actualSizeBytes = file.size;
    const expectedSizeBytes = expectedSizeMB * 1024 * 1024;
    const differenceBytes = actualSizeBytes - expectedSizeBytes;
    const isCorrect = Math.abs(differenceBytes) <= toleranceBytes;

    return {
      isCorrect,
      actualSizeMB: actualSizeBytes / (1024 * 1024),
      expectedSizeMB,
      differenceBytes,
      tolerance: toleranceBytes
    };
  }

  /**
   * Formata o tamanho em bytes para uma string legível
   */
  public static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Calcula a tolerância baseada no tamanho do arquivo
   */
  public static calculateTolerance(sizeMB: number): number {
    // Para arquivos pequenos (< 1MB): 1KB de tolerância
    if (sizeMB < 1) return 1024;
    
    // Para arquivos médios (1-10MB): 0.1% de tolerância
    if (sizeMB <= 10) return Math.round(sizeMB * 1024 * 1024 * 0.001);
    
    // Para arquivos grandes (> 10MB): 0.05% de tolerância
    return Math.round(sizeMB * 1024 * 1024 * 0.0005);
  }

  /**
   * Verifica se o arquivo é um PDF válido
   */
  public static async verifyPDFFile(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      // Verificar extensão
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        resolve(false);
        return;
      }

      // Verificar MIME type
      if (file.type !== 'application/pdf') {
        resolve(false);
        return;
      }

      // Verificar se tem conteúdo
      if (file.size === 0) {
        resolve(false);
        return;
      }

      // Verificar header do PDF (primeiros 4 bytes devem ser "%PDF")
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          const header = new TextDecoder().decode(uint8Array.slice(0, 4));
          resolve(header === '%PDF');
        } catch {
          resolve(false);
        }
      };
      reader.onerror = () => resolve(false);
      reader.readAsArrayBuffer(file.slice(0, 4));
    });
  }
} 