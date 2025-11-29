# ☕ CAFÉTOKEN

> **A primeira plataforma de microlotes de café brasileiro tokenizados no mundo**

*"Seu café, sua história, agora em blockchain."*

![License](https://img.shields.io/badge/license-MIT-gold)
![Blockchain](https://img.shields.io/badge/blockchain-Polygon-8247E5)
![Status](https://img.shields.io/badge/status-MVP-green)

---

## 🎯 Sobre o Projeto

O **CAFÉTOKEN** transforma microlotes reais de café especial brasileiro em **NFTs lastreados fisicamente**, permitindo:

- ✅ **Comprovação de origem** - Rastreabilidade total do grão
- ✅ **Negociação global** - Marketplace internacional
- ✅ **Pré-venda da safra** - Financiamento antecipado para produtores
- ✅ **Valorização do produto** - Storytelling + certificação
- ✅ **Liquidez digital** - Mercado secundário ativo

---

## 🧱 Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                         CAFÉTOKEN                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│   │   Frontend   │    │   Backend    │    │  Blockchain  │     │
│   │   (React)    │◄──►│  (Supabase)  │◄──►│  (Polygon)   │     │
│   └──────────────┘    └──────────────┘    └──────────────┘     │
│                              │                    │              │
│                              ▼                    ▼              │
│                       ┌──────────────┐    ┌──────────────┐     │
│                       │     IPFS     │    │Smart Contract│     │
│                       │  (Metadata)  │    │  (ERC-721)   │     │
│                       └──────────────┘    └──────────────┘     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| **Frontend** | React 18 + TypeScript + Tailwind CSS |
| **Backend** | Supabase (PostgreSQL + Auth + Storage) |
| **Blockchain** | Polygon (ERC-721) |
| **Storage** | IPFS (Pinata) |
| **Wallet** | WalletConnect / MetaMask |
| **Automações** | n8n |

---

## 📁 Estrutura do Projeto

```
CAFETOKEN/
├── contracts/              # Smart Contracts Solidity
│   ├── CafeToken.sol      # Contrato principal ERC-721
│   └── Marketplace.sol    # Contrato do marketplace
├── frontend/               # Aplicação React
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── hooks/         # Custom hooks (Web3, etc)
│   │   ├── utils/         # Funções utilitárias
│   │   ├── types/         # TypeScript types
│   │   └── styles/        # Estilos globais
│   └── public/
├── docs/                   # Documentação
│   ├── pitch-deck.md      # Pitch para investidores
│   ├── comercial.md       # Material comercial
│   ├── arquitetura.md     # Arquitetura técnica
│   └── fluxogramas.md     # Fluxos de processo
└── README.md
```

---

## 🏃‍♂️ Quick Start

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- MetaMask instalada
- Conta Supabase

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/cafetoken.git

# Entre na pasta
cd cafetoken

# Instale dependências do frontend
cd frontend
npm install

# Configure variáveis de ambiente
cp .env.example .env.local

# Inicie o servidor de desenvolvimento
npm run dev
```

### Variáveis de Ambiente

```env
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
VITE_CONTRACT_ADDRESS=endereco_do_contrato
VITE_POLYGON_RPC=https://polygon-rpc.com
VITE_PINATA_API_KEY=sua_chave_pinata
VITE_PINATA_SECRET=seu_secret_pinata
```

---

## 📊 Modelo de Negócio

| Receita | Valor |
|---------|-------|
| Taxa de Mint | R$ 10 - R$ 25/lote |
| Taxa Marketplace | 2% - 4% por venda |
| Armazenamento | Embutido no custo |
| Features Premium | Leilões, analytics |
| API B2B | Integração torrefações |

---

## 🎯 Roadmap

### Fase 1 - MVP (30 dias) ✅
- [x] Smart contract ERC-721
- [x] API + Supabase
- [x] Interface React
- [x] Mint manual
- [x] Marketplace básico

### Fase 2 - Validação (60 dias)
- [ ] Parceria armazém
- [ ] 5 microlotes tokenizados
- [ ] Torrefações estrangeiras
- [ ] Leilão piloto

### Fase 3 - Escala (90 dias)
- [ ] Auditoria profissional
- [ ] Armazéns em 3 estados
- [ ] App mobile
- [ ] Tokenização cacau/amêndoas

---

## 👥 Público-Alvo

### Produtores
- Microlotes de 10-30 sacas
- Café especial 83+ pontos SCA
- Regiões premium (MG, ES, BA)

### Compradores
- Torrefações USA/Europa/Japão
- Compradores premium
- Traders de commodities
- Investidores Web3

---

## 📜 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE) para mais detalhes.

---

## 📞 Contato

**CAFÉTOKEN** - Transformando o café brasileiro em ativos digitais

- Website: [cafetoken.io](https://cafetoken.io)
- Email: contato@cafetoken.io
- Twitter: [@cafetoken](https://twitter.com/cafetoken)

---

<p align="center">
  <strong>☕ Feito com amor pelo café brasileiro ☕</strong>
</p>

