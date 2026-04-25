# Cell Store - Sistema de Compra e Revenda de Celulares

Sistema completo para gestão de compra e revenda de celulares com Next.js 14, Tailwind CSS e API integrada.

## ?? Funcionalidades

### Landing Page Pública (/)
- Design moderno, mobile-first
- Seção Hero com nome da loja e slogan
- Cards de dispositivos em destaque
- Catálogo completo com filtros (marca, condição, faixa de preço)
- Botão WhatsApp com mensagem pré-pronta
- Badge de status (Disponível/Vendido/Reservado)
- Rodapé com informações de contato

### Painel Administrativo (/admin)
- Proteção por senha (variável de ambiente)
- Cards de resumo:
  - Total de aparelhos cadastrados
  - Aparelhos disponíveis
  - Total investido (soma dos custos)
  - Lucro potencial (soma dos lucros)
- Tabela com todos os dispositivos:
  - Ordenável por coluna
  - Filtro por status e marca
  - Ações: editar, excluir, marcar como vendido
- Formulário de cadastro/edição com cálculo automático de lucro e margem

## ??? Tecnologias

- **Framework**: Next.js 14 (App Router)
- **Estilização**: Tailwind CSS
- **Linguagem**: TypeScript
- **Persistência**: Arquivo JSON local (data/devices.json)
- **Imagens**: URLs externas (pode usar Cloudinary ou base64)

## ?? Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Senha de acesso ao painel administrativo
ADMIN_PASSWORD=suasenha123

# Número do WhatsApp (formato internacional sem +)
WHATSAPP_NUMBER=5531999999999

# Nome da loja
NEXT_PUBLIC_STORE_NAME=Cell Store

# Slogan da loja
NEXT_PUBLIC_STORE_SLOGAN=Os melhores celulares, no seu bolso
```

## ?? Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse: http://localhost:3000

## ?? Estrutura do Projeto

```
??? src/
?   ??? app/
?   ?   ??? api/devices/    # API de dispositivos
?   ?   ??? admin/          # Painel administrativo
?   ?   ?   ??? novo/      # Cadastro de dispositivo
?   ?   ?   ??? editar/    # Edição de dispositivo
?   ?   ??? layout.tsx     # Layout principal
?   ?   ??? page.tsx       # Landing page
?   ?   ??? globals.css    # Estilos globais
?   ??? components/        # Componentes React
?   ?   ??? DeviceCard.tsx
?   ?   ??? DeviceTable.tsx
?   ?   ??? DeviceForm.tsx
?   ?   ??? Filters.tsx
?   ?   ??? StatsCards.tsx
?   ?   ??? LoginForm.tsx
?   ??? lib/              # Utilitários
?   ?   ??? devices.ts
?   ??? types/            # Tipos TypeScript
?       ??? index.ts
??? data/
?   ??? devices.json      # Dados dos dispositivos
??? public/               # Arquivos estáticos
??? .env.local            # Variáveis de ambiente
??? package.json
??? tsconfig.json
??? tailwind.config.js
??? next.config.js
```

## ?? API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/devices | Listar todos os dispositivos |
| POST | /api/devices | Criar novo dispositivo |
| PUT | /api/devices | Atualizar dispositivo |
| DELETE | /api/devices?id={id} | Excluir dispositivo |

## ?? Deploy na Vercel

1. Crie uma conta na [Vercel](https://vercel.com)
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente na Vercel:
   - `ADMIN_PASSWORD`
   - `WHATSAPP_NUMBER`
   - `NEXT_PUBLIC_STORE_NAME`
   - `NEXT_PUBLIC_STORE_SLOGAN`
4. Faça o deploy

**Nota**: O deploy na Vercel usa sistema de arquivos efêmero. Para persistência, considere:
- Usar Vercel KV (Redis) para armazenar os dados
- Ou conectar a um banco de dados externo (PostgreSQL, MongoDB, etc.)

## ?? Modelo de Dados

```json
{
  "id": "uuid",
  "nome": "iPhone 13 128GB",
  "marca": "Apple",
  "modelo": "iPhone 13",
  "cor": "Preto",
  "armazenamento": "128GB",
  "condicao": "Seminovo",
  "descricao": "Descrição do appareilho",
  "foto": "https://...",
  "precoCusto": 2500,
  "precoVenda": 2999,
  "lucro": 499,
  "margem": 20,
  "dataCompra": "2024-01-15",
  "status": "Disponível",
  "destaque": true,
  "whatsappMsg": ""
}
```

## ?? Licença

MIT License