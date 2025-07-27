#!/bin/bash

echo "🚀 Iniciando PDFSizer..."

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instalando..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install --production
fi

# Definir variáveis de ambiente
export NODE_ENV=production
export PORT=${PORT:-3000}

echo "🔧 Configurações:"
echo "   - NODE_ENV: $NODE_ENV"
echo "   - PORT: $PORT"

# Iniciar o servidor
echo "🚀 Iniciando servidor na porta $PORT..."
node server.js 