# PDFSizer 📄

Uma ferramenta simples e eficiente para gerar PDFs com tamanho exato, ideal para testar limites de upload em aplicações web.

## 🚀 Características

- **Tamanho Preciso**: Gera PDFs com tamanho exato, com tolerância de até 100KB
- **Geração Rápida**: PDFs gerados em segundos, mesmo para arquivos grandes
- **Interface Intuitiva**: Slider interativo para seleção de tamanho (0-20MB)
- **Botões Rápidos**: Acesso rápido aos tamanhos mais comuns
- **Barra de Progresso**: Feedback visual durante a geração
- **Verificação Automática**: Verificação automática do tamanho após o download

## 🛠️ Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PDFKit** - Geração de PDFs
- **HTML/CSS/JavaScript** - Frontend simples e eficiente
- **Jest** - Testes automatizados

## 📦 Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd pdfsizer

# Instale as dependências
npm install

# Execute o servidor
node server.js
```

O servidor estará disponível em `http://localhost:3000`

## 🎯 Como Usar

1. **Selecione o Tamanho**: Use o slider para escolher o tamanho desejado (0-20MB)
2. **Ou use os Botões Rápidos**: Clique em 0.5MB, 1MB, 5MB ou 10MB
3. **Gere o PDF**: Clique em "Gerar PDF"
4. **Aguarde**: A barra de progresso mostra o status da geração
5. **Download Automático**: O PDF será baixado automaticamente
6. **Verificação**: O sistema mostra a precisão do tamanho gerado

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes de integração
npm run test:integration
```

## 📊 API

### POST /api/generate-pdf

Gera um PDF com o tamanho especificado.

**Request Body:**
```json
{
  "sizeMB": 5.0,
  "tolerance": 102400,
  "maxAttempts": 15
}
```

**Response:**
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="pdf-{sizeMB}mb-{timestamp}.pdf"`

## 🏗️ Estrutura do Projeto

```
pdfsizer/
├── server.js                    # Servidor Express principal
├── public/
│   └── index.html              # Interface do usuário
├── src/                        # Código legacy do Next.js (não usado)
├── lib/                        # Bibliotecas e testes
│   └── __tests__/
│       ├── pdf-generator.test.ts
│       └── pdf-generator.integration.test.ts
├── test-pdf.js                 # Script de teste standalone
├── test-pages.js               # Script para calcular bytes por página
├── package.json
└── README.md
```

## 🔧 Como Funciona

O sistema usa uma abordagem baseada em páginas para gerar PDFs com tamanho preciso:

1. **Estimativa Inicial**: Calcula quantas páginas são necessárias baseado em ~1.6KB por página
2. **Geração**: Cria um PDF com o número estimado de páginas, cada uma preenchida com caracteres 'T'
3. **Ajuste**: Se necessário, ajusta o número de páginas nas tentativas subsequentes
4. **Verificação**: Confirma se o tamanho final está dentro da tolerância especificada

### Algoritmo de Tolerância

- **Tolerância Padrão**: 100KB para todos os tamanhos
- **Máximo de Tentativas**: 15 tentativas para refinar o tamanho
- **Precisão**: Geralmente acima de 95% de precisão

## 🚀 Deploy

### Heroku

```bash
# Instale a CLI do Heroku
npm install -g heroku

# Login
heroku login

# Crie o app
heroku create seu-app-name

# Deploy
git push heroku main
```

### Railway

```bash
# Instale a CLI do Railway
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Vercel

```bash
# Instale a CLI da Vercel
npm i -g vercel

# Deploy
vercel
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🐛 Problemas Conhecidos

- Para arquivos muito grandes (> 15MB), a geração pode levar alguns segundos
- A precisão pode variar ligeiramente dependendo do sistema operacional

## 🔮 Roadmap

- [ ] Suporte a outros formatos (DOCX, XLSX)
- [ ] Templates personalizáveis
- [ ] API REST completa
- [ ] Integração com serviços de nuvem
- [ ] Dashboard de estatísticas
- [ ] Suporte a múltiplos idiomas

## 📞 Suporte

Se você encontrar algum problema ou tiver sugestões, abra uma issue no GitHub.

---

Desenvolvido com ❤️ para facilitar testes de upload de arquivos.
