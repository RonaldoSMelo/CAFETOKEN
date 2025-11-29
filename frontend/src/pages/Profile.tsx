import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Copy,
  Check,
  ExternalLink,
  Coffee,
  Settings,
  Bell,
  Shield,
  LogOut,
} from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import NFTGrid from '../components/nft/NFTGrid'
import { useWallet } from '../context/WalletContext'
import type { NFTWithListing } from '../types'

// Mock user NFTs
const mockUserNFTs: NFTWithListing[] = [
  {
    tokenId: 1,
    lotCode: 'CAF-2024-MG-001',
    producer: '0x1234567890123456789012345678901234567890',
    farmName: 'Sítio Alto da Serra',
    weightKg: 30,
    scaScore: 8650,
    harvestTimestamp: 1717200000,
    qualityReportHash: 'QmXyz123',
    redeemed: false,
    mintedAt: 1717200000,
    metadata: {
      name: 'Bourbon Amarelo #001',
      description: 'Microlote excepcional',
      image: '/placeholder-coffee.jpg',
      attributes: [],
    },
  },
  {
    tokenId: 2,
    lotCode: 'CAF-2024-MG-002',
    producer: '0x1234567890123456789012345678901234567890',
    farmName: 'Fazenda Santa Clara',
    weightKg: 25,
    scaScore: 8800,
    harvestTimestamp: 1717200000,
    qualityReportHash: 'QmAbc456',
    redeemed: false,
    mintedAt: 1717200000,
    listing: {
      tokenId: 2,
      seller: '0x1234567890123456789012345678901234567890',
      price: BigInt('750000000000000000'),
      priceFormatted: '0.75',
      active: true,
    },
    metadata: {
      name: 'Geisha Natural #002',
      description: 'Geisha de altitude excepcional',
      image: '/placeholder-coffee.jpg',
      attributes: [],
    },
  },
]

const tabs = [
  { id: 'owned', label: 'Meus NFTs', count: 2 },
  { id: 'listed', label: 'À Venda', count: 1 },
  { id: 'activity', label: 'Atividade', count: null },
]

export default function Profile() {
  const { address, isConnected, balance, connect, disconnect } = useWallet()
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('owned')

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      toast.success('Endereço copiado!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!isConnected) {
    return (
      <div className="pt-28 pb-16 min-h-screen">
        <div className="container-custom">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 rounded-full bg-cafe-800/50 flex items-center justify-center mb-6">
              <User className="w-12 h-12 text-cafe-600" />
            </div>
            <h2 className="font-display text-2xl font-bold text-cafe-100 mb-3">
              Conecte sua Wallet
            </h2>
            <p className="text-cafe-400 max-w-md mb-8">
              Para acessar seu perfil e ver seus NFTs, você precisa conectar sua carteira digital.
            </p>
            <Button onClick={connect} size="lg">
              Conectar Wallet
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  return (
    <div className="pt-28 pb-16 min-h-screen">
      <div className="container-custom">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <Card className="p-8">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-2xl bg-gradient-gold flex items-center justify-center flex-shrink-0">
                <User className="w-12 h-12 text-cafe-950" />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="font-display text-2xl font-bold text-cafe-100">
                    {formatAddress(address!)}
                  </h1>
                  <Badge variant="success" icon={<Check className="w-3 h-3" />}>
                    Verificado
                  </Badge>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={copyAddress}
                    className="flex items-center gap-2 text-sm text-cafe-400 hover:text-cafe-200 transition-colors"
                  >
                    <span className="font-mono">{address}</span>
                    {copied ? (
                      <Check className="w-4 h-4 text-success" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div>
                    <span className="text-cafe-500">Saldo</span>
                    <p className="font-mono text-lg text-gold-400 font-bold">
                      {parseFloat(balance || '0').toFixed(4)} MATIC
                    </p>
                  </div>
                  <div>
                    <span className="text-cafe-500">NFTs</span>
                    <p className="font-mono text-lg text-cafe-100 font-bold">
                      {mockUserNFTs.length}
                    </p>
                  </div>
                  <div>
                    <span className="text-cafe-500">Membro desde</span>
                    <p className="text-cafe-100">Jun 2024</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://polygonscan.com/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="secondary" leftIcon={<ExternalLink className="w-4 h-4" />}>
                    Ver no Polygonscan
                  </Button>
                </a>
                <Button variant="ghost" leftIcon={<Settings className="w-4 h-4" />}>
                  Configurações
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Quick Stats */}
            <Card>
              <h3 className="font-display text-lg font-semibold text-cafe-100 mb-4">
                Resumo
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-cafe-800">
                  <span className="text-cafe-400">NFTs Possuídos</span>
                  <span className="font-mono text-cafe-100">2</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-cafe-800">
                  <span className="text-cafe-400">Listados</span>
                  <span className="font-mono text-cafe-100">1</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-cafe-800">
                  <span className="text-cafe-400">Vendidos</span>
                  <span className="font-mono text-cafe-100">3</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-cafe-400">Valor Total</span>
                  <span className="font-mono text-gold-400">1.25 ETH</span>
                </div>
              </div>
            </Card>

            {/* Settings Menu */}
            <Card>
              <h3 className="font-display text-lg font-semibold text-cafe-100 mb-4">
                Configurações
              </h3>
              <div className="space-y-1">
                <button className="w-full flex items-center gap-3 p-3 text-cafe-300 hover:text-cafe-100 hover:bg-cafe-800/50 rounded-lg transition-colors text-left">
                  <Settings className="w-5 h-5" />
                  <span>Preferências</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-cafe-300 hover:text-cafe-100 hover:bg-cafe-800/50 rounded-lg transition-colors text-left">
                  <Bell className="w-5 h-5" />
                  <span>Notificações</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-cafe-300 hover:text-cafe-100 hover:bg-cafe-800/50 rounded-lg transition-colors text-left">
                  <Shield className="w-5 h-5" />
                  <span>Segurança</span>
                </button>
                <button
                  onClick={disconnect}
                  className="w-full flex items-center gap-3 p-3 text-error hover:bg-error/10 rounded-lg transition-colors text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Desconectar</span>
                </button>
              </div>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            {/* Tabs */}
            <div className="flex items-center gap-1 p-1 bg-cafe-900/50 rounded-xl mb-6 w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-cafe-800 text-cafe-100'
                      : 'text-cafe-400 hover:text-cafe-200'
                  }`}
                >
                  {tab.label}
                  {tab.count !== null && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-cafe-700 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            {activeTab === 'owned' && (
              <NFTGrid
                nfts={mockUserNFTs}
                emptyMessage="Você ainda não possui nenhum NFT"
              />
            )}

            {activeTab === 'listed' && (
              <NFTGrid
                nfts={mockUserNFTs.filter(nft => nft.listing?.active)}
                emptyMessage="Você não tem nenhum NFT listado para venda"
              />
            )}

            {activeTab === 'activity' && (
              <Card>
                <div className="space-y-4">
                  {[
                    { action: 'Comprou', item: 'Bourbon Amarelo #001', price: '0.5 ETH', time: '2 dias atrás' },
                    { action: 'Listou', item: 'Geisha Natural #002', price: '0.75 ETH', time: '3 dias atrás' },
                    { action: 'Transferiu', item: 'Catuaí #003', price: null, time: '1 semana atrás' },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-4 border-b border-cafe-800 last:border-0"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-cafe-800 flex items-center justify-center">
                          <Coffee className="w-6 h-6 text-cafe-500" />
                        </div>
                        <div>
                          <p className="text-cafe-100">
                            <span className="text-cafe-400">{activity.action}</span>{' '}
                            {activity.item}
                          </p>
                          {activity.price && (
                            <p className="text-sm text-gold-400 font-mono">{activity.price}</p>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-cafe-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

