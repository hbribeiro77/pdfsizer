'use client';

import { useState } from 'react';

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const generate1MBPDF = async () => {
    setIsGenerating(true);
    setResult(null);

    try {
      const response = await fetch('/api/generate-1mb-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sizeMB: 1.0,
          tolerance: 1024 * 100, // 100KB tolerância
          maxAttempts: 15
        })
      });

      if (!response.ok) {
        throw new Error('Erro na geração do PDF');
      }

      const blob = await response.blob();
      
      // Criar link para download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pdf-1mb-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setResult({
        success: true,
        size: blob.size,
        sizeMB: (blob.size / (1024 * 1024)).toFixed(2)
      });

    } catch (error) {
      console.error('Erro:', error);
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">
          Gerador de PDF 1MB
        </h1>
        
        <button
          onClick={generate1MBPDF}
          disabled={isGenerating}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded transition-colors"
        >
          {isGenerating ? 'Gerando PDF...' : 'Gerar PDF de 1MB'}
        </button>

        {result && (
          <div className="mt-4 p-4 rounded border">
            {result.success ? (
              <div className="text-green-600">
                <p>✅ PDF gerado com sucesso!</p>
                <p>Tamanho: {result.sizeMB}MB ({result.size} bytes)</p>
              </div>
            ) : (
              <div className="text-red-600">
                <p>❌ Erro: {result.error}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
