# Cell Store — Documentação do Sistema

## Visão Geral

Sistema de compra e revenda de celulares com catálogo público e painel administrativo protegido por senha. Desenvolvido em Next.js 14 e hospedado no Vercel.

---

## Stack

| Item | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router) |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS |
| Banco de dados | Upstash Redis via `@vercel/kv` (produção) / JSON local (desenvolvimento) |
| Hospedagem | Vercel (plano Hobby) |
| Repositório | GitHub — `Ricardorodrigueslima/iphone` |

---

## Variáveis de Ambiente

| Variável | Onde é usada | Descrição |
|---|---|---|
| `ADMIN_PASSWORD` | Servidor (API) | Senha do painel administrativo |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Cliente | Número do WhatsApp (formato: `5532991663801`) |
| `NEXT_PUBLIC_STORE_NAME` | Cliente | Nome da loja |
| `NEXT_PUBLIC_STORE_SLOGAN` | Cliente | Slogan exibido no hero |
| `KV_REST_API_URL` | Servidor (API) | URL do banco Redis (setada pelo Vercel ao conectar Upstash) |
| `KV_REST_API_TOKEN` | Servidor (API) | Token do banco Redis |

> **Arquivo local:** `.env.local` (nunca commitado no Git)
> **Produção:** configurar no Vercel → projeto → Settings → Environment Variables

---

## Páginas e Rotas

### Páginas Públicas

| Rota | Descrição |
|---|---|
| `/` | Catálogo público com hero, destaques, filtros e simulador de parcelas |

### Páginas Administrativas

| Rota | Descrição |
|---|---|
| `/admin` | Painel com login, estatísticas, tabela de dispositivos e configurações |
| `/admin/novo` | Formulário de cadastro de novo aparelho |
| `/admin/editar/[id]` | Formulário de edição de aparelho existente |

### API Routes

| Rota | Métodos | Descrição |
|---|---|---|
| `/api/auth` | `POST` | Verifica senha do admin (compara com `ADMIN_PASSWORD`) |
| `/api/devices` | `GET` `POST` `PUT` `DELETE` | CRUD completo de dispositivos |
| `/api/settings` | `GET` `PUT` | Lê e salva configurações da loja (taxa de juros) |

---

## Armazenamento de Dados

### Produção (Vercel)
Usa **Upstash Redis** via `@vercel/kv`. As chaves armazenadas são:

| Chave | Conteúdo |
|---|---|
| `devices` | Array JSON com todos os dispositivos |
| `settings` | Objeto com configurações (`{ taxaJuros: number }`) |

**Migração automática:** na primeira requisição em produção, se a chave `devices` não existir no Redis, o sistema lê o arquivo `data/devices.json` (bundled no deploy) e salva no Redis automaticamente.

### Desenvolvimento Local
Sem as variáveis `KV_REST_API_URL` e `KV_REST_API_TOKEN`, o sistema usa arquivos JSON locais:
- `data/devices.json` — dispositivos
- `data/settings.json` — configurações

---

## Funcionalidades

### Catálogo Público (`/`)
- Hero com nome, slogan e botão de WhatsApp
- Seção de **Destaques** (dispositivos marcados como destaque e disponíveis)
- **Catálogo completo** com filtros por marca, condição e faixa de preço
- Cards com badge de status (Disponível / Vendido / Reservado) e condição
- **Simulador de parcelas** em cada card:
  - Fórmula: **Tabela Price** — `PMT = PV × [i(1+i)ⁿ] / [(1+i)ⁿ − 1]`
  - Mostra à vista + 2x até 12x com juros compostos
  - Exibe acréscimo em relação ao preço à vista
  - Taxa configurável no painel admin
- Botão de WhatsApp com mensagem pré-preenchida por aparelho
- Seção de aparelhos indisponíveis em opacidade reduzida

### Painel Admin (`/admin`)
- Login por senha (verificado no servidor via `/api/auth`)
- **Cards de estatísticas:** total cadastrado, disponíveis, total investido, lucro potencial
- **Campo de taxa de juros:** % ao mês cobrado pela maquininha (salvo no Redis)
- Tabela ordenável de dispositivos com ações: editar, marcar como vendido, excluir
- Botão para cadastrar novo aparelho

### Formulário de Aparelho (`/admin/novo` e `/admin/editar/[id]`)
- Campos: foto (URL), nome, marca, modelo, cor, armazenamento, condição, preços, data de compra, status, descrição, mensagem WhatsApp personalizada, destaque
- Lucro e margem calculados automaticamente em tempo real
- Preview da imagem ao digitar a URL

---

## Modelo de Dados — Dispositivo

```typescript
interface Device {
  id: string;           // UUID gerado automaticamente
  nome: string;
  marca: string;
  modelo: string;
  cor: string;
  armazenamento: string;
  condicao: "Novo" | "Seminovo" | "Usado";
  descricao: string;
  foto: string;         // URL da imagem
  precoCusto: number;
  precoVenda: number;
  lucro: number;        // calculado: precoVenda - precoCusto
  margem: number;       // calculado: (lucro / precoCusto) * 100
  dataCompra: string;   // formato YYYY-MM-DD
  status: "Disponível" | "Vendido" | "Reservado";
  destaque: boolean;
  whatsappMsg: string;  // mensagem personalizada (vazio = mensagem padrão)
}
```

---

## Configurações da Loja

| Configuração | Onde alterar | Efeito |
|---|---|---|
| Taxa de juros da maquininha | Admin → campo "Taxa de juros" → Salvar taxa | Atualiza o simulador de parcelas no catálogo |
| Senha do admin | Vercel → Environment Variables → `ADMIN_PASSWORD` + redeploy | Altera a senha de acesso |
| Nome / Slogan / WhatsApp | Vercel → Environment Variables → `NEXT_PUBLIC_*` + redeploy | Atualiza textos do catálogo |

---

## Deploy

1. Push para `main` no GitHub → Vercel faz deploy automático
2. Variáveis de ambiente sensíveis são configuradas no Vercel (não no código)
3. O banco Redis (Upstash) é gerenciado via integração Vercel → Integrations → Upstash
