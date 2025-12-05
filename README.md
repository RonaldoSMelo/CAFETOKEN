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

## 📸 Demonstração Visual

### Fluxo Completo da Aplicação

#### 1. Tela Inicial
![Tela Inicial - Interface principal do CAFÉTOKEN](images/1%20-%20Tela%20Inicial.png)

#### 2. Conectando Carteira
![Conectando Carteira - Integração com MetaMask](images/2%20-%20Conectando%20na%20carteira.png)

#### 3. Criando NFT
![Criando NFT - Formulário de cadastro de microlote](images/3%20-%20Criando%20um%20Novo%20NFT.png)

#### 4. Localização
![Localização - Dados de origem do café](images/4-criado%20localização.png)

#### 5. Certificado de Qualidade
![Certificado de Qualidade - Upload de documentação](images/5%20-%20inserindo%20a%20midia%20do%20certificado.png)

#### 6. Dados de Qualidade
![Dados de Qualidade - Score SCA e características](images/5-%20cadastrado%20a%20qualidade.png)

#### 7. Revisão
![Revisão - Confirmação dos dados do lote](images/7%20-revisão.png)

#### 8. Criar NFT
![Criar NFT - Mint na blockchain](images/8%20-%20criar%20o%20NFT.png)

#### 9. Confirmação
![Confirmação - Assinatura da transação](images/9%20-%20confirmando%20a%20transação.png)

#### 10. Dashboard
![Dashboard - Transação concluída com sucesso](images/10%20-%20dashboard%20da%20transação.png)

#### 11. Marketplace
![Marketplace - Lote disponível para venda](images/11-%20lote%20disponivel%20para%20venda.png)

#### 12. Compra
![Compra - Tela de aquisição do NFT](images/12%20-%20tela%20para%20compra.png)

### Principais Funcionalidades Demonstradas

1. **🔐 Conexão Web3** - Integração segura com carteiras digitais
2. **📝 Cadastro de Lotes** - Formulário completo com validações
3. **📍 Rastreabilidade** - Registro de origem e localização
4. **📄 Certificação** - Upload de documentos de qualidade
5. **⚡ Mint Instantâneo** - Criação de NFT na blockchain
6. **🏪 Marketplace** - Listagem e compra de lotes
7. **💰 Transações** - Sistema completo de pagamentos

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

# Ou execute os testes do smart contract
cd ../contracts
npm test
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

## 🧪 Testes

### Executando os Testes

O projeto possui uma suite completa de testes automatizados cobrindo todas as funcionalidades do smart contract.

```bash
# Entre na pasta de contratos
cd contracts

# Execute todos os testes
npm test

# Execute com relatório detalhado
npx hardhat test --verbose

# Execute testes específicos
npx hardhat test --grep "Minting"
```

### Cobertura de Testes

✅ **36 testes passando** cobrindo:

| Categoria | Testes | Descrição |
|-----------|--------|-----------|
| **Deployment** | 5 | Inicialização e configuração |
| **Minting** | 7 | Criação de NFTs e validações |
| **Marketplace - Listing** | 4 | Listagem de NFTs para venda |
| **Marketplace - Buying** | 4 | Compra de NFTs e taxas |
| **Marketplace - Management** | 2 | Cancelamento e atualização |
| **Redemption** | 4 | Resgate de café físico |
| **Admin Functions** | 7 | Funções administrativas |
| **View Functions** | 3 | Consultas e estatísticas |

### Script de Demonstração

Execute o script interativo para ver todas as funcionalidades em ação:

```bash
# Demonstração completa
npx hardhat run scripts/test-demo.js --network hardhat
```

**O que o script demonstra:**

1. ✅ Deploy do contrato
2. ✅ Mint de NFTs de café
3. ✅ Listagem no marketplace
4. ✅ Compra de NFTs
5. ✅ Resgate de café físico
6. ✅ Consultas de dados
7. ✅ Funções administrativas

### Exemplo de Saída dos Testes

```
☕ CafeToken Contract
  📋 Deployment
    ✔ Should set the correct name and symbol
    ✔ Should set the correct owner
    ✔ Should set the correct mint fee
  🌱 Minting
    ✔ Should mint a coffee NFT successfully
    ✔ Should store coffee lot data correctly
    ✔ Should fail if mint fee is insufficient
  🏪 Marketplace
    ✔ Should list NFT for sale
    ✔ Should buy NFT successfully
    ✔ Should transfer correct amounts with marketplace fee
  ♻️ Redemption
    ✔ Should redeem coffee successfully

36 passing (2s)
```

### Testes Manuais na Rede Local

Para testar manualmente com uma interface:

```bash
# Terminal 1 - Inicie um nó local
npx hardhat node

# Terminal 2 - Faça deploy
npx hardhat run scripts/deploy.js --network localhost

# Terminal 3 - Execute o frontend
cd ../frontend
npm run dev
```

---

## 💡 Como Usar - Exemplos Práticos

### Para Produtores

#### 1. Conectar Carteira
```javascript
// O frontend detecta automaticamente a MetaMask
// Clique em "Conectar Carteira" na interface
```

#### 2. Criar um NFT de Café
```javascript
// Preencha o formulário com:
- Código do Lote: BR-MG-2024-001
- Peso: 300 kg
- Score SCA: 85.00 pontos
- Data da Colheita: 15/03/2024
- Upload: Certificado de qualidade (PDF/Imagem)
- Localização: Fazenda, Cidade, Estado
```

#### 3. Listar no Marketplace
```javascript
// Após criar o NFT:
1. Acesse "Meus NFTs"
2. Selecione o lote
3. Clique em "Vender"
4. Defina o preço em ETH
5. Confirme a transação
```

### Para Compradores

#### 1. Explorar Marketplace
```javascript
// Navegue pelos lotes disponíveis
// Filtre por:
- Região (MG, ES, BA)
- Score SCA (83+, 85+, 90+)
- Preço
- Peso do lote
```

#### 2. Comprar um NFT
```javascript
// Ao encontrar um lote interessante:
1. Clique em "Ver Detalhes"
2. Revise certificados e origem
3. Clique em "Comprar"
4. Confirme o pagamento na MetaMask
5. NFT transferido para sua carteira
```

#### 3. Resgatar Café Físico
```javascript
// Quando quiser receber o café:
1. Acesse "Meus NFTs"
2. Selecione o lote
3. Clique em "Resgatar Café"
4. Confirme a transação
5. Aguarde contato para entrega
```

### Comandos Úteis

```bash
# Desenvolvimento Local
cd contracts && npx hardhat node          # Terminal 1: Blockchain local
npx hardhat run scripts/deploy.js --network localhost  # Terminal 2: Deploy
cd frontend && npm run dev                # Terminal 3: Frontend

# Testes
cd contracts && npm test                  # Executar todos os testes
npx hardhat run scripts/test-demo.js     # Demonstração interativa

# Deploy em Produção
npx hardhat run scripts/deploy.js --network polygon  # Deploy na Polygon
npx hardhat verify --network polygon <CONTRACT_ADDRESS>  # Verificar contrato
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

