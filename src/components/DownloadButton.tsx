'use client';

import { useState } from 'react';
import { Download, CheckCircle, XCircle, Loader2, FileCheck } from 'lucide-react';
import { FileVerifier } from '@/lib/file-verifier';
import { FileVerificationResult } from '@/types';

interface DownloadButtonProps {
  sizeMB: number;
  onVerification?: (result: FileVerificationResult) => void;
}

export function DownloadButton({ sizeMB, onVerification }: DownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<FileVerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsGenerating(true);
    setError(null);
    setVerificationResult(null);

    try {
      console.log(`🚀 Starting download for ${sizeMB}MB PDF`);

      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sizeMB }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro na geração do PDF');
      }

      // Obter informações do header
      const actualSizeMB = parseFloat(response.headers.get('X-Actual-Size-MB') || '0');
      const targetSizeMB = parseFloat(response.headers.get('X-Target-Size-MB') || '0');
      const differenceBytes = parseInt(response.headers.get('X-Difference-Bytes') || '0');
      const attempts = parseInt(response.headers.get('X-Attempts') || '0');
      const success = response.headers.get('X-Success') === 'true';

      console.log(`📊 Generation completed:`);
      console.log(`   Target: ${targetSizeMB}MB`);
      console.log(`   Actual: ${actualSizeMB}MB`);
      console.log(`   Difference: ${differenceBytes} bytes`);
      console.log(`   Attempts: ${attempts}`);
      console.log(`   Success: ${success}`);

      // Fazer download do arquivo
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pdf-${sizeMB}mb-test.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Verificar o arquivo baixado
      setIsVerifying(true);
      const file = new File([blob], `pdf-${sizeMB}mb-test.pdf`, { type: 'application/pdf' });
      
      const tolerance = FileVerifier.calculateTolerance(sizeMB);
      const result = FileVerifier.verifyFileSize(file, sizeMB, tolerance);
      
      setVerificationResult(result);
      onVerification?.(result);

      console.log(`✅ Verification completed:`);
      console.log(`   Expected: ${result.expectedSizeMB}MB`);
      console.log(`   Actual: ${result.actualSizeMB.toFixed(2)}MB`);
      console.log(`   Difference: ${result.differenceBytes} bytes`);
      console.log(`   Tolerance: ${result.tolerance} bytes`);
      console.log(`   Is Correct: ${result.isCorrect}`);

    } catch (err) {
      console.error('❌ Error during download:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsGenerating(false);
      setIsVerifying(false);
    }
  };

  const getStatusIcon = () => {
    if (isGenerating || isVerifying) {
      return <Loader2 className="h-5 w-5 animate-spin" />;
    }
    
    if (verificationResult) {
      return verificationResult.isCorrect 
        ? <CheckCircle className="h-5 w-5 text-green-500" />
        : <XCircle className="h-5 w-5 text-red-500" />;
    }
    
    return <Download className="h-5 w-5" />;
  };

  const getButtonText = () => {
    if (isGenerating) return 'Gerando PDF...';
    if (isVerifying) return 'Verificando...';
    if (verificationResult) {
      return verificationResult.isCorrect ? 'Download Concluído!' : 'Download Concluído';
    }
    return 'Gerar e Baixar PDF';
  };

  const getButtonClass = () => {
    let baseClass = 'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
    
    if (isGenerating || isVerifying) {
      return `${baseClass} bg-blue-600 hover:bg-blue-700 focus:ring-blue-500`;
    }
    
    if (verificationResult) {
      return verificationResult.isCorrect
        ? `${baseClass} bg-green-600 hover:bg-green-700 focus:ring-green-500`
        : `${baseClass} bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500`;
    }
    
    return `${baseClass} bg-blue-600 hover:bg-blue-700 focus:ring-blue-500`;
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleDownload}
        disabled={isGenerating || isVerifying}
        className={getButtonClass()}
      >
        {getStatusIcon()}
        <span className="ml-2">{getButtonText()}</span>
      </button>

      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <XCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {verificationResult && (
        <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center space-x-2 mb-2">
            <FileCheck className="h-4 w-4" />
            <span className="font-medium">Verificação de Tamanho</span>
          </div>
          
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Tamanho Esperado:</span>
              <span className="font-mono">{verificationResult.expectedSizeMB} MB</span>
            </div>
            <div className="flex justify-between">
              <span>Tamanho Real:</span>
              <span className="font-mono">{verificationResult.actualSizeMB.toFixed(2)} MB</span>
            </div>
            <div className="flex justify-between">
              <span>Diferença:</span>
              <span className={`font-mono ${Math.abs(verificationResult.differenceBytes) <= verificationResult.tolerance ? 'text-green-600' : 'text-red-600'}`}>
                {verificationResult.differenceBytes > 0 ? '+' : ''}{FileVerifier.formatFileSize(verificationResult.differenceBytes)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tolerância:</span>
              <span className="font-mono">{FileVerifier.formatFileSize(verificationResult.tolerance)}</span>
            </div>
          </div>

          <div className={`mt-3 p-2 rounded text-sm font-medium ${
            verificationResult.isCorrect 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
          }`}>
            {verificationResult.isCorrect 
              ? '✅ Tamanho está correto!' 
              : '⚠️ Tamanho está fora da tolerância'
            }
          </div>
        </div>
      )}
    </div>
  );
} 