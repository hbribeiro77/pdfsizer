export interface PDFGenerationRequest {
  sizeMB: number;
  tolerance?: number; // em bytes, padrão 1024 (1KB)
  maxAttempts?: number; // padrão 10
}

export interface PDFGenerationResult {
  success: boolean;
  buffer: Buffer | null;
  actualSizeBytes: number;
  targetSizeBytes: number;
  difference: number;
  attempts: number;
  error?: string;
}

export interface FileVerificationResult {
  isCorrect: boolean;
  actualSizeMB: number;
  expectedSizeMB: number;
  differenceBytes: number;
  tolerance: number;
}

export interface GenerationHistory {
  id: string;
  timestamp: Date;
  requestedSizeMB: number;
  actualSizeMB: number;
  success: boolean;
  attempts: number;
} 