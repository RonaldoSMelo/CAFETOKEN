# 🏗️ CAFÉTOKEN - Arquitetura Técnica

---

## 📐 Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CAFÉTOKEN ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         FRONTEND LAYER                               │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │    React     │  │   Tailwind   │  │   ethers.js  │              │   │
│  │  │  TypeScript  │  │     CSS      │  │  Web3 SDK    │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         BACKEND LAYER                                │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │   Supabase   │  │   Supabase   │  │   Supabase   │              │   │
│  │  │  PostgreSQL  │  │     Auth     │  │   Storage    │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                       BLOCKCHAIN LAYER                               │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │   Polygon    │  │   ERC-721    │  │    IPFS      │              │   │
│  │  │   Network    │  │   Contract   │  │   Pinata     │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                       AUTOMATION LAYER                               │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │     n8n      │  │   Webhooks   │  │  Schedulers  │              │   │
│  │  │  Workflows   │  │   Events     │  │    Crons     │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔷 1. Frontend Layer

### Stack Tecnológica

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| React | 18.x | Framework UI |
| TypeScript | 5.x | Tipagem estática |
| Tailwind CSS | 3.x | Estilização |
| Vite | 5.x | Build tool |
| ethers.js | 6.x | Interação Web3 |
| wagmi | 2.x | React hooks Web3 |
| TanStack Query | 5.x | Data fetching |

### Estrutura de Diretórios

```
frontend/
├── public/
│   └── assets/
├── src/
│   ├── components/
│   │   ├── ui/              # Componentes base (Button, Card, etc)
│   │   ├── layout/          # Header, Footer, Sidebar
│   │   ├── nft/             # NFTCard, NFTDetails, etc
│   │   ├── marketplace/     # Listagens, filtros
│   │   ├── producer/        # Dashboard produtor
│   │   └── wallet/          # Conexão wallet
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Marketplace.tsx
│   │   ├── NFTDetails.tsx
│   │   ├── MintNFT.tsx
│   │   ├── ProducerDashboard.tsx
│   │   └── Profile.tsx
│   ├── hooks/
│   │   ├── useContract.ts
│   │   ├── useIPFS.ts
│   │   └── useWallet.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   └── ipfs.ts
│   ├── types/
│   │   ├── nft.ts
│   │   ├── producer.ts
│   │   └── marketplace.ts
│   ├── services/
│   │   ├── supabase.ts
│   │   └── contract.ts
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🔷 2. Backend Layer (Supabase)

### Schema do Banco de Dados

```sql
-- Produtores
CREATE TABLE producers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    farm_name VARCHAR(255) NOT NULL,
    farm_location GEOGRAPHY(POINT),
    farm_altitude INTEGER,
    certifications TEXT[],
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Microlotes
CREATE TABLE microlots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    producer_id UUID REFERENCES producers(id),
    lot_code VARCHAR(50) UNIQUE NOT NULL,
    variety VARCHAR(100) NOT NULL,
    process VARCHAR(100),
    harvest_date DATE,
    weight_kg DECIMAL(10,2) NOT NULL,
    sca_score DECIMAL(4,2),
    cupping_notes TEXT,
    certifications TEXT[],
    storage_location VARCHAR(255),
    storage_qr_code VARCHAR(255),
    quality_report_hash VARCHAR(66),
    images TEXT[],
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- NFTs
CREATE TABLE nfts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    microlot_id UUID REFERENCES microlots(id),
    token_id INTEGER UNIQUE,
    contract_address VARCHAR(42),
    metadata_uri VARCHAR(255),
    ipfs_hash VARCHAR(66),
    owner_address VARCHAR(42),
    price_wei VARCHAR(78),
    price_usd DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'minted',
    minted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transações
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nft_id UUID REFERENCES nfts(id),
    from_address VARCHAR(42),
    to_address VARCHAR(42),
    price_wei VARCHAR(78),
    price_usd DECIMAL(10,2),
    tx_hash VARCHAR(66) UNIQUE,
    tx_type VARCHAR(20),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resgates (Redeem)
CREATE TABLE redeems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nft_id UUID REFERENCES nfts(id),
    requester_address VARCHAR(42),
    shipping_address TEXT,
    shipping_country VARCHAR(100),
    tracking_code VARCHAR(100),
    status VARCHAR(20) DEFAULT 'requested',
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ
);

-- Auditorias
CREATE TABLE audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    microlot_id UUID REFERENCES microlots(id),
    auditor_name VARCHAR(255),
    audit_type VARCHAR(50),
    result VARCHAR(20),
    notes TEXT,
    document_hash VARCHAR(66),
    audited_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Políticas de Segurança (RLS)

```sql
-- Produtores podem ver apenas seus próprios dados
CREATE POLICY "Producers can view own data"
ON producers FOR SELECT
USING (wallet_address = auth.jwt() ->> 'wallet_address');

-- Qualquer um pode ver NFTs listados
CREATE POLICY "Anyone can view listed NFTs"
ON nfts FOR SELECT
USING (status = 'listed');

-- Apenas owner pode atualizar NFT
CREATE POLICY "Owner can update NFT"
ON nfts FOR UPDATE
USING (owner_address = auth.jwt() ->> 'wallet_address');
```

---

## 🔷 3. Blockchain Layer

### Smart Contract: CafeToken.sol

```
┌─────────────────────────────────────────────────────────────────┐
│                     CafeToken Contract                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📦 HERANÇA                                                    │
│  ├── ERC721URIStorage                                          │
│  ├── ERC721Enumerable                                          │
│  ├── Ownable                                                   │
│  └── ReentrancyGuard                                           │
│                                                                 │
│  📊 ESTRUTURAS                                                 │
│  ├── CoffeeLot                                                 │
│  │   ├── lotCode (string)                                      │
│  │   ├── producer (address)                                    │
│  │   ├── weightKg (uint256)                                    │
│  │   ├── scaScore (uint256)                                    │
│  │   ├── harvestDate (uint256)                                 │
│  │   ├── qualityReportHash (string)                            │
│  │   └── redeemed (bool)                                       │
│  │                                                              │
│  └── Listing                                                   │
│      ├── seller (address)                                      │
│      ├── price (uint256)                                       │
│      └── active (bool)                                         │
│                                                                 │
│  🔧 FUNÇÕES                                                    │
│  ├── mintCoffeeLot()      → Cria novo NFT                     │
│  ├── listForSale()        → Lista no marketplace              │
│  ├── cancelListing()      → Remove listagem                   │
│  ├── buyNFT()             → Compra NFT                        │
│  ├── redeemCoffee()       → Resgata café físico               │
│  ├── updateTokenURI()     → Atualiza metadata                 │
│  └── withdraw()           → Saca fundos (owner)               │
│                                                                 │
│  📡 EVENTOS                                                    │
│  ├── CoffeeMinted                                              │
│  ├── CoffeeListed                                              │
│  ├── CoffeeSold                                                │
│  ├── CoffeeRedeemed                                            │
│  └── ListingCancelled                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Fluxo de Interações

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Produtor │     │ Frontend │     │ Contract │     │   IPFS   │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │
     │ 1. Cadastra    │                │                │
     │    lote        │                │                │
     │───────────────►│                │                │
     │                │                │                │
     │                │ 2. Upload      │                │
     │                │    metadata    │                │
     │                │───────────────────────────────►│
     │                │                │                │
     │                │ 3. Retorna     │                │
     │                │    IPFS URI    │                │
     │                │◄───────────────────────────────│
     │                │                │                │
     │                │ 4. mintCoffee  │                │
     │                │    Lot(uri)    │                │
     │                │───────────────►│                │
     │                │                │                │
     │                │ 5. NFT criado  │                │
     │                │    (tokenId)   │                │
     │                │◄───────────────│                │
     │                │                │                │
     │ 6. Confirmação │                │                │
     │◄───────────────│                │                │
     │                │                │                │
```

---

## 🔷 4. IPFS / Metadata

### Estrutura do Metadata (ERC-721)

```json
{
  "name": "Microlote CAF-2024-MG-0042",
  "description": "Microlote de café especial da Fazenda Sítio Alto da Serra, Minas Gerais, Brasil. Bourbon Amarelo, 86 pontos SCA.",
  "image": "ipfs://QmXyz.../image.jpg",
  "external_url": "https://cafetoken.io/nft/42",
  "attributes": [
    {
      "trait_type": "Lot Code",
      "value": "CAF-2024-MG-0042"
    },
    {
      "trait_type": "Producer",
      "value": "João Silva"
    },
    {
      "trait_type": "Farm",
      "value": "Sítio Alto da Serra"
    },
    {
      "trait_type": "Location",
      "value": "Minas Gerais, Brazil"
    },
    {
      "trait_type": "GPS Coordinates",
      "value": "-21.7654, -45.1234"
    },
    {
      "trait_type": "Altitude",
      "value": "1280m"
    },
    {
      "trait_type": "Variety",
      "value": "Yellow Bourbon"
    },
    {
      "trait_type": "Process",
      "value": "Natural"
    },
    {
      "trait_type": "SCA Score",
      "value": 86,
      "display_type": "number"
    },
    {
      "trait_type": "Harvest Date",
      "value": "2024-06-15"
    },
    {
      "trait_type": "Weight (kg)",
      "value": 30,
      "display_type": "number"
    },
    {
      "trait_type": "Certifications",
      "value": "Rainforest Alliance, Organic"
    },
    {
      "trait_type": "Cupping Notes",
      "value": "Chocolate, caramel, citrus"
    },
    {
      "trait_type": "Quality Report Hash",
      "value": "QmAbc123..."
    },
    {
      "trait_type": "Redeemed",
      "value": "No"
    }
  ]
}
```

---

## 🔷 5. Automações (n8n)

### Workflows Principais

```
┌─────────────────────────────────────────────────────────────────┐
│                      N8N WORKFLOWS                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1️⃣ NOVO LOTE CADASTRADO                                        │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐     │
│  │Supabase │───►│ Validar │───►│  Criar  │───►│  Email  │     │
│  │ Trigger │    │  Dados  │    │  Tarefa │    │Auditor  │     │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘     │
│                                                                 │
│  2️⃣ AUDITORIA APROVADA                                          │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐     │
│  │Webhook  │───►│ Upload  │───►│  Mint   │───►│Notifica │     │
│  │Auditor  │    │  IPFS   │    │   NFT   │    │Produtor │     │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘     │
│                                                                 │
│  3️⃣ NFT VENDIDO                                                 │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐     │
│  │Contract │───►│Atualiza │───►│ Calcula │───►│  Email  │     │
│  │ Event   │    │  DB     │    │Comissão │    │ Partes  │     │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘     │
│                                                                 │
│  4️⃣ REDEEM SOLICITADO                                           │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐     │
│  │Contract │───►│ Valida  │───►│ Notifica│───►│ Atualiza│     │
│  │ Event   │    │ Endereço│    │ Armazém │    │ Status  │     │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔷 6. Integrações Externas

### APIs e Serviços

```
┌─────────────────────────────────────────────────────────────────┐
│                     INTEGRAÇÕES                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🔗 BLOCKCHAIN                                                  │
│  ├── Polygon RPC (Alchemy/Infura)                              │
│  ├── Polygonscan API (verificação)                             │
│  └── The Graph (indexação - futuro)                            │
│                                                                 │
│  🔗 STORAGE                                                     │
│  ├── IPFS via Pinata                                           │
│  └── Supabase Storage (imagens preview)                        │
│                                                                 │
│  🔗 WALLET                                                      │
│  ├── WalletConnect                                             │
│  ├── MetaMask                                                  │
│  └── Coinbase Wallet                                           │
│                                                                 │
│  🔗 PAGAMENTOS (futuro)                                         │
│  ├── Stripe (fiat)                                             │
│  └── Transak (on-ramp crypto)                                  │
│                                                                 │
│  🔗 COMUNICAÇÃO                                                 │
│  ├── SendGrid (emails)                                         │
│  └── Twilio (SMS - futuro)                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔷 7. Segurança

### Medidas Implementadas

| Camada | Medida | Descrição |
|--------|--------|-----------|
| **Smart Contract** | ReentrancyGuard | Previne reentrância |
| **Smart Contract** | Ownable | Controle de acesso |
| **Smart Contract** | SafeMath | Overflow protection (built-in Solidity 0.8+) |
| **Backend** | RLS | Row Level Security no Supabase |
| **Backend** | JWT | Autenticação via token |
| **Frontend** | Input validation | Sanitização de inputs |
| **Frontend** | HTTPS | Conexão segura |
| **Infra** | Rate limiting | Proteção DDoS |

### Auditoria Recomendada

- [ ] Auditoria de smart contract (Certik, OpenZeppelin)
- [ ] Pentest da aplicação
- [ ] Revisão de segurança Supabase

---

## 🔷 8. Deploy & DevOps

### Ambientes

| Ambiente | Blockchain | URL |
|----------|------------|-----|
| Development | Polygon Mumbai | localhost:5173 |
| Staging | Polygon Mumbai | staging.cafetoken.io |
| Production | Polygon Mainnet | cafetoken.io |

### CI/CD Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                      CI/CD PIPELINE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐     │
│  │  Push   │───►│  Lint   │───►│  Test   │───►│  Build  │     │
│  │ GitHub  │    │ ESLint  │    │ Vitest  │    │  Vite   │     │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘     │
│                                                      │          │
│                                                      ▼          │
│                                               ┌─────────┐      │
│                                               │ Deploy  │      │
│                                               │ Vercel  │      │
│                                               └─────────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔷 9. Escalabilidade

### Estratégias Futuras

| Desafio | Solução |
|---------|---------|
| Alto volume transações | The Graph para indexação |
| Múltiplas chains | Bridge para outras L2s |
| Dados históricos | Data warehouse |
| Performance | CDN + Edge functions |
| Mobile | React Native / PWA |

---

*Documento técnico - CAFÉTOKEN © 2024*

