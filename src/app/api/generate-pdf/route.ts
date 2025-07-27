import { NextRequest, NextResponse } from 'next/server';
import { PDFGenerator } from '@/lib/pdf-generator';
import { PDFGenerationRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: PDFGenerationRequest = await request.json();
    
    // Validação básica
    if (!body.sizeMB || body.sizeMB <= 0) {
      return NextResponse.json(
        { error: 'Tamanho deve ser maior que 0' },
        { status: 400 }
      );
    }

    if (body.sizeMB > 100) {
      return NextResponse.json(
        { error: 'Tamanho máximo é 100MB' },
        { status: 400 }
      );
    }

    console.log(`🚀 Starting PDF generation for ${body.sizeMB}MB`);

    // Gerar PDF
    const result = await PDFGenerator.generatePDF({
      sizeMB: body.sizeMB,
      tolerance: body.tolerance || 1024,
      maxAttempts: body.maxAttempts || 10
    });

    if (!result.success || !result.buffer) {
      return NextResponse.json(
        { 
          error: result.error || 'Falha na geração do PDF',
          attempts: result.attempts,
          actualSizeMB: result.actualSizeBytes / (1024 * 1024)
        },
        { status: 500 }
      );
    }

    console.log(`✅ PDF generated successfully!`);
    console.log(`📊 Size: ${(result.actualSizeBytes / (1024 * 1024)).toFixed(2)}MB`);
    console.log(`📈 Difference: ${result.difference} bytes`);
    console.log(`🔄 Attempts: ${result.attempts}`);

    // Criar resposta com o PDF
    const response = new NextResponse(result.buffer);
    
    // Configurar headers
    response.headers.set('Content-Type', 'application/pdf');
    response.headers.set('Content-Disposition', `attachment; filename="pdf-${body.sizeMB}mb-test.pdf"`);
    response.headers.set('Content-Length', result.actualSizeBytes.toString());
    
    // Headers customizados com informações do resultado
    response.headers.set('X-Actual-Size-MB', (result.actualSizeBytes / (1024 * 1024)).toFixed(2));
    response.headers.set('X-Target-Size-MB', body.sizeMB.toString());
    response.headers.set('X-Difference-Bytes', result.difference.toString());
    response.headers.set('X-Attempts', result.attempts.toString());
    response.headers.set('X-Success', result.success.toString());

    return response;

  } catch (error) {
    console.error('❌ Error in PDF generation API:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'PDF Generator API',
    version: '1.0.0',
    endpoints: {
      POST: '/api/generate-pdf - Generate PDF with specified size'
    },
    usage: {
      sizeMB: 'Size in MB (required)',
      tolerance: 'Tolerance in bytes (optional, default: 1024)',
      maxAttempts: 'Maximum attempts (optional, default: 10)'
    }
  });
} 