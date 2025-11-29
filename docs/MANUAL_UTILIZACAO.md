# 📖 Manual de Utilização - CAFÉTOKEN

> **Versão:** 1.0.0 MVP  
> **Última atualização:** Novembro 2024

---

## 📋 Índice

1. [Visão Geral](#1-visão-geral)
2. [Requisitos do Sistema](#2-requisitos-do-sistema)
3. [Instalação e Configuração](#3-instalação-e-configuração)
4. [Iniciando os Serviços](#4-iniciando-os-serviços)
5. [Configurando o MetaMask](#5-configurando-o-metamask)
6. [Usando a Aplicação](#6-usando-a-aplicação)
7. [Scripts Úteis](#7-scripts-úteis)
8. [Solução de Problemas](#8-solução-de-problemas)
9. [Arquitetura do Projeto](#9-arquitetura-do-projeto)

---

## 1. Visão Geral

O **CAFÉTOKEN** é uma plataforma de tokenização de microlotes de café especial brasileiro. Cada NFT representa um lote real de café, com informações completas de rastreabilidade.

### Funcionalidades do MVP:
- ✅ Criar NFTs de microlotes de café
- ✅ Conectar carteira MetaMask
- ✅ Visualizar marketplace
- ✅ Dashboard do produtor
- ✅ Perfil do usuário

---

## 2. Requisitos do Sistema

### Software Necessário:
| Software | Versão Mínima | Download |
|----------|---------------|----------|
| Node.js | 18.x ou superior | [nodejs.org](https://nodejs.org) |
| npm | 9.x ou superior | (incluso no Node.js) |
| MetaMask | Última versão | [metamask.io](https://metamask.io) |
| Git | Qualquer | [git-scm.com](https://git-scm.com) |

### Verificar instalação:
```powershell
node --version   # Deve mostrar v18.x.x ou superior
npm --version    # Deve mostrar 9.x.x ou superior
```

---

## 3. Instalação e Configuração

### 3.1 Clonar/Acessar o Projeto
```powershell
cd C:\repo-local\Blockchain\CAFETOKEN
```

### 3.2 Instalar Dependências do Smart Contract
```powershell
cd contracts
npm install
```

### 3.3 Instalar Dependências do Frontend
```powershell
cd ../frontend
npm install
```

### 3.4 Configurar Variáveis de Ambiente

Crie o arquivo `frontend/.env.local`:
```env
VITE_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
VITE_CHAIN_ID=31337
VITE_POLYGON_RPC=http://127.0.0.1:8545
```

> ⚠️ **Nota:** O endereço do contrato pode mudar após cada reinicialização da blockchain local.

---

## 4. Iniciando os Serviços

### 4.1 Iniciar a Blockchain Local (Terminal 1)
```powershell
cd C:\repo-local\Blockchain\CAFETOKEN\contracts
npx hardhat node
```

✅ **Sucesso:** Verá "Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/"

### 4.2 Fazer Deploy do Contrato (Terminal 2)
```powershell
cd C:\repo-local\Blockchain\CAFETOKEN\contracts
npx hardhat run scripts/deploy.js --network localhost
```

✅ **Sucesso:** Verá "CafeToken deployed to: 0x..." 

> ⚠️ **Importante:** Anote o endereço do contrato e atualize o `.env.local` se for diferente!

### 4.3 Iniciar o Frontend (Terminal 3)
```powershell
cd C:\repo-local\Blockchain\CAFETOKEN\frontend
npm run dev
```

✅ **Sucesso:** Verá "Local: http://localhost:5173/"

### 4.4 Resumo dos Serviços

| Serviço | URL | Terminal |
|---------|-----|----------|
| Blockchain Hardhat | http://127.0.0.1:8545 | Terminal 1 |
| Frontend React | http://localhost:5173 | Terminal 3 |

---

## 5. Configurando o MetaMask

### 5.1 Adicionar Rede Hardhat Local

1. Abra o MetaMask
2. Clique em **"Redes"** → **"Adicionar rede"** → **"Adicionar rede manualmente"**
3. Preencha:

| Campo | Valor |
|-------|-------|
| Nome da rede | `Hardhat Local` |
| URL do RPC | `http://127.0.0.1:8545` |
| ID da cadeia | `31337` |
| Símbolo da moeda | `ETH` |
| URL do Block Explorer | *(deixe vazio)* |

4. Clique em **"Salvar"**

### 5.2 Importar Conta de Teste

1. No MetaMask, clique no ícone da conta
2. Selecione **"Adicionar conta ou carteira de hardware"**
3. Clique em **"Importar conta"**
4. Cole a chave privada:
```
0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```
5. Clique em **"Importar"**

✅ **Sucesso:** A conta terá ~10.000 ETH

### 5.3 Contas de Teste Disponíveis

| Conta | Endereço | Chave Privada |
|-------|----------|---------------|
| #0 | 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 | 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 |
| #1 | 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 | 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d |
| #2 | 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC | 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a |

---

## 6. Usando a Aplicação

### 6.1 Página Inicial (Home)
**URL:** http://localhost:5173/

- Apresentação da plataforma
- Estatísticas
- Como funciona
- Call to action para produtores

### 6.2 Marketplace
**URL:** http://localhost:5173/marketplace

- Visualizar NFTs de café disponíveis
- Filtrar por variedade, processo, pontuação
- Ordenar por preço ou data

### 6.3 Criar NFT (Mint)
**URL:** http://localhost:5173/mint

#### Passo a passo:

**Etapa 1 - Informações Básicas:**
| Campo | Exemplo |
|-------|---------|
| Código do Lote | `CAF-2024-MG-001` |
| Variedade | `Bourbon Amarelo` |
| Processo | `Natural` |
| Peso (kg) | `30` |
| Data da Colheita | `15/06/2024` |

**Etapa 2 - Localização:**
| Campo | Exemplo |
|-------|---------|
| Nome da Fazenda | `Sítio Alto da Serra` |
| Região/Cidade | `Carmo de Minas` |
| Estado | `MG` |
| Altitude (m) | `1280` |
| Coordenadas GPS | `-21.7654, -45.1234` |

**Etapa 3 - Qualidade:**
| Campo | Exemplo |
|-------|---------|
| Pontuação SCA | `86.5` |
| Notas de Degustação | `Chocolate, caramelo, cítrico` |
| Certificações | Selecione as aplicáveis |
| Laudo de Qualidade | Upload PDF (opcional) |

**Etapa 4 - Mídia:**
| Campo | Exemplo |
|-------|---------|
| Imagens | Upload de fotos do lote |
| Descrição | Texto descritivo |
| Preço (MATIC) | `0.5` (opcional) |

**Etapa 5 - Revisão:**
- Confira todos os dados
- Clique em **"Criar NFT"**
- Confirme no MetaMask
- Aguarde a confirmação

### 6.4 Dashboard do Produtor
**URL:** http://localhost:5173/dashboard

- Visão geral dos lotes
- Estatísticas de vendas
- Ações rápidas
- Atividade recente

### 6.5 Perfil
**URL:** http://localhost:5173/profile

- Ver seus NFTs
- Histórico de atividade
- Configurações

---

## 7. Scripts Úteis

### 7.1 Verificar NFTs Criados
```powershell
cd C:\repo-local\Blockchain\CAFETOKEN\contracts
npx hardhat run scripts/check-nfts.js --network localhost
```

**Saída esperada:**
```
📋 Informações do Contrato:
   Nome: CafeToken
   Símbolo: CAFE
   Total Mintado: 1

☕ NFTs Criados:
🏷️  Token #1
   Código: CAF-2024-MG-001
   Peso: 30 kg
   SCA Score: 86.5
   ...
```

### 7.2 Compilar Contrato
```powershell
cd contracts
npx hardhat compile
```

### 7.3 Rodar Testes (futuro)
```powershell
cd contracts
npx hardhat test
```

### 7.4 Deploy em Testnet (futuro)
```powershell
npx hardhat run scripts/deploy.js --network polygonMumbai
```

---

## 8. Solução de Problemas

### ❌ Erro: "could not decode result data"
**Causa:** Contrato não existe no endereço especificado.

**Solução:**
1. Verifique se a blockchain está rodando (`npx hardhat node`)
2. Faça novo deploy do contrato
3. Atualize o endereço no `.env.local`
4. Reinicie o frontend

### ❌ Erro: "insufficient funds"
**Causa:** MetaMask desatualizado com a blockchain.

**Solução:**
1. MetaMask → Configurações → Avançado
2. Clique em "Clear activity tab data"
3. Ou reimporte a conta

### ❌ MetaMask não abre
**Causa:** Frontend não está chamando o contrato.

**Solução:**
1. Verifique se está na porta correta (5173)
2. Faça refresh com Ctrl+Shift+R
3. Reconecte a wallet

### ❌ "Nonce too high"
**Causa:** Blockchain foi reiniciada mas MetaMask manteve estado antigo.

**Solução:**
1. MetaMask → Configurações → Avançado
2. "Clear activity tab data"

### ❌ Porta em uso
**Causa:** Servidor anterior ainda rodando.

**Solução:**
```powershell
# Parar todos os processos Node
Get-Process -Name "node" | Stop-Process -Force
```

---

## 9. Arquitetura do Projeto

### 9.1 Estrutura de Pastas
```
CAFETOKEN/
├── contracts/                 # Smart Contracts
│   ├── contracts/
│   │   └── CafeToken.sol     # Contrato ERC-721
│   ├── scripts/
│   │   ├── deploy.js         # Script de deploy
│   │   └── check-nfts.js     # Script de consulta
│   ├── hardhat.config.js
│   └── package.json
│
├── frontend/                  # Aplicação React
│   ├── src/
│   │   ├── components/       # Componentes UI
│   │   ├── pages/            # Páginas
│   │   ├── context/          # Context API
│   │   ├── services/         # Serviços
│   │   └── types/            # TypeScript types
│   ├── .env.local            # Variáveis de ambiente
│   └── package.json
│
├── docs/                      # Documentação
│   ├── pitch-deck.md
│   ├── comercial.md
│   ├── arquitetura.md
│   ├── fluxogramas.md
│   └── MANUAL_UTILIZACAO.md  # Este arquivo
│
└── README.md
```

### 9.2 Fluxo de Dados

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │────▶│   MetaMask   │────▶│  Blockchain  │
│    React     │◀────│   Wallet     │◀────│   Hardhat    │
└──────────────┘     └──────────────┘     └──────────────┘
                                                 │
                                                 ▼
                                          ┌──────────────┐
                                          │  CafeToken   │
                                          │   Contract   │
                                          └──────────────┘
```

### 9.3 Contrato CafeToken

**Funções principais:**
| Função | Descrição |
|--------|-----------|
| `mintCoffeeLot()` | Criar novo NFT |
| `listForSale()` | Listar para venda |
| `buyNFT()` | Comprar NFT |
| `redeemCoffee()` | Resgatar café físico |
| `getCoffeeLot()` | Consultar dados do lote |

---

## 📞 Suporte

- **Documentação técnica:** `/docs/arquitetura.md`
- **Pitch deck:** `/docs/pitch-deck.md`
- **Material comercial:** `/docs/comercial.md`

---

## 🔄 Histórico de Versões

| Versão | Data | Descrição |
|--------|------|-----------|
| 1.0.0 | Nov/2024 | MVP inicial |

---

<p align="center">
  <strong>☕ CAFÉTOKEN - Seu café, sua história, agora em blockchain ☕</strong>
</p>

