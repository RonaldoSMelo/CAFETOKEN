import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Coffee,
  Plus,
  TrendingUp,
  DollarSign,
  Package,
  Clock,
  Eye,
  Edit,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  RefreshCw,
  Loader2,
  ShoppingCart,
  Tag,
  XCircle,
} from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import { useWallet } from '../context/WalletContext'
import { cafeTokenService } from '../services/contract'
import { formatEther } from 'ethers'
import toast from 'react-hot-toast'

interface ProducerLot {
  tokenId: number
  lotCode: string
  name: string
  status: 'owned' | 'listed' | 'sold' | 'redeemed'
  price: string | null
  scaScore: number
  weightKg: number
  mintedAt: Date
  redeemed: boolean
}

interface ProducerStats {
  totalLots: number
  listedLots: number
  totalWeightKg: number
  totalListedValue: string
}

const statusMap: Record<string, { label: string; variant: 'default' | 'gold' | 'success' | 'warning' | 'error' }> = {
  owned: { label: 'Em Carteira', variant: 'default' },
  listed: { label: 'À Venda', variant: 'success' },
  sold: { label: 'Vendido', variant: 'gold' },
  redeemed: { label: 'Resgatado', variant: 'warning' },
}

export default function ProducerDashboard() {
  const { isConnected, connect, address } = useWallet()
  const [activeTab, setActiveTab] = useState<'all' | 'listed' | 'owned'>('all')
  const [lots, setLots] = useState<ProducerLot[]>([])
  const [stats, setStats] = useState<ProducerStats>({
    totalLots: 0,
    listedLots: 0,
    totalWeightKg: 0,
    totalListedValue: '0',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedLot, setSelectedLot] = useState<number | null>(null)
  const [listingPrice, setListingPrice] = useState('')
  const [showListingModal, setShowListingModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const fetchProducerData = useCallback(async () => {
    if (!address) return

    try {
      // Buscar todos os tokens mintados
      const totalMinted = await cafeTokenService.getTotalMinted()
      const producerLots: ProducerLot[] = []
      let totalListedValue = BigInt(0)

      // Iterar por todos os tokens para encontrar os do produtor
      for (let i = 1; i <= totalMinted; i++) {
        try {
          const lot = await cafeTokenService.getCoffeeLot(i)
          
          // Verificar se o produtor original é o usuário conectado
          if (lot.producer.toLowerCase() === address.toLowerCase()) {
            const listing = await cafeTokenService.getListing(i)
            
            // Determinar status
            let status: 'owned' | 'listed' | 'sold' | 'redeemed' = 'owned'
            if (lot.redeemed) {
              status = 'redeemed'
            } else if (listing.active) {
              status = 'listed'
              totalListedValue += listing.price
            }

            // Buscar metadata para o nome
            let name = `Lote ${lot.lotCode}`
            try {
              const tokenURI = await cafeTokenService.getTokenURI(i)
              if (tokenURI.startsWith('data:application/json')) {
                const base64 = tokenURI.split(',')[1]
                const json = atob(base64)
                const metadata = JSON.parse(json)
                if (metadata.name) name = metadata.name
              }
            } catch {
              // Usar nome padrão
            }

            producerLots.push({
              tokenId: i,
              lotCode: lot.lotCode,
              name,
              status,
              price: listing.active ? listing.priceFormatted : null,
              scaScore: lot.scaScore / 100,
              weightKg: lot.weightKg,
              mintedAt: new Date(lot.mintedAt * 1000),
              redeemed: lot.redeemed,
            })
          }
        } catch (err) {
          console.error(`Error fetching token ${i}:`, err)
        }
      }

      // Ordenar por data de criação (mais recente primeiro)
      producerLots.sort((a, b) => b.mintedAt.getTime() - a.mintedAt.getTime())

      setLots(producerLots)
      setStats({
        totalLots: producerLots.length,
        listedLots: producerLots.filter(l => l.status === 'listed').length,
        totalWeightKg: producerLots.reduce((acc, l) => acc + l.weightKg, 0),
        totalListedValue: formatEther(totalListedValue),
      })
    } catch (error) {
      console.error('Error fetching producer data:', error)
      toast.error('Erro ao carregar dados do produtor')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [address])

  useEffect(() => {
    if (isConnected && address) {
      setIsLoading(true)
      fetchProducerData()
    }
  }, [isConnected, address, fetchProducerData])

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchProducerData()
  }

  const handleListForSale = async () => {
    if (!selectedLot || !listingPrice) {
      toast.error('Informe o preço de venda')
      return
    }

    setIsProcessing(true)
    try {
      await cafeTokenService.listForSale(selectedLot, listingPrice)
      toast.success('NFT listado para venda!')
      setShowListingModal(false)
      setListingPrice('')
      setSelectedLot(null)
      fetchProducerData()
    } catch (error: any) {
      console.error('Error listing NFT:', error)
      toast.error(`Erro ao listar: ${error.reason || error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancelListing = async (tokenId: number) => {
    setIsProcessing(true)
    try {
      await cafeTokenService.cancelListing(tokenId)
      toast.success('Listagem cancelada!')
      fetchProducerData()
    } catch (error: any) {
      console.error('Error canceling listing:', error)
      toast.error(`Erro ao cancelar: ${error.reason || error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const filteredLots = lots.filter(lot => {
    if (activeTab === 'all') return true
    if (activeTab === 'listed') return lot.status === 'listed'
    if (activeTab === 'owned') return lot.status === 'owned'
    return true
  })

  if (!isConnected) {
    return (
      <div className="pt-28 pb-16 min-h-screen">
        <div className="container-custom">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 rounded-full bg-cafe-800/50 flex items-center justify-center mb-6">
              <Coffee className="w-12 h-12 text-cafe-600" />
            </div>
            <h2 className="font-display text-2xl font-bold text-cafe-100 mb-3">
              Conecte sua Wallet
            </h2>
            <p className="text-cafe-400 max-w-md mb-8">
              Para acessar o dashboard de produtor, você precisa conectar sua carteira digital.
            </p>
            <Button onClick={connect} size="lg">
              Conectar Wallet
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-28 pb-16 min-h-screen">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="font-display text-3xl font-bold text-cafe-100 mb-1">
              Dashboard do Produtor
            </h1>
            <p className="text-cafe-400">
              Gerencie seus microlotes tokenizados
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={handleRefresh}
              disabled={isRefreshing}
              leftIcon={<RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
            >
              Atualizar
            </Button>
            <Link to="/mint">
              <Button leftIcon={<Plus className="w-4 h-4" />}>
                Novo Lote
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center">
                  <Coffee className="w-6 h-6 text-gold-500" />
                </div>
                {stats.totalLots > 0 && (
                  <div className="flex items-center gap-1 text-sm text-success">
                    <ArrowUpRight className="w-4 h-4" />
                    {stats.totalLots}
                  </div>
                )}
              </div>
              <p className="text-2xl font-bold text-cafe-100 mb-1">
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.totalLots}
              </p>
              <p className="text-sm text-cafe-500">Lotes Tokenizados</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center">
                  <Tag className="w-6 h-6 text-gold-500" />
                </div>
              </div>
              <p className="text-2xl font-bold text-cafe-100 mb-1">
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.listedLots}
              </p>
              <p className="text-sm text-cafe-500">À Venda</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-gold-500" />
                </div>
              </div>
              <p className="text-2xl font-bold text-cafe-100 mb-1">
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  `${parseFloat(stats.totalListedValue).toFixed(2)} ETH`
                )}
              </p>
              <p className="text-sm text-cafe-500">Valor em Venda</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center">
                  <Package className="w-6 h-6 text-gold-500" />
                </div>
              </div>
              <p className="text-2xl font-bold text-cafe-100 mb-1">
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : `${stats.totalWeightKg} kg`}
              </p>
              <p className="text-sm text-cafe-500">Peso Total</p>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lots Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card padding="none">
              <div className="p-6 border-b border-cafe-800">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-semibold text-cafe-100">
                    Meus Lotes
                  </h2>
                  <div className="flex items-center gap-1 p-1 bg-cafe-800/50 rounded-lg">
                    {(['all', 'listed', 'owned'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                          activeTab === tab
                            ? 'bg-cafe-700 text-cafe-100'
                            : 'text-cafe-400 hover:text-cafe-200'
                        }`}
                      >
                        {tab === 'all' ? 'Todos' : tab === 'listed' ? 'À Venda' : 'Em Carteira'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="p-12 flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-gold-500 mb-4" />
                  <p className="text-cafe-400">Carregando seus lotes...</p>
                </div>
              ) : (
                <div className="divide-y divide-cafe-800">
                  {filteredLots.map((lot) => (
                    <div
                      key={lot.tokenId}
                      className="p-4 hover:bg-cafe-800/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Link
                          to={`/nft/${lot.tokenId}`}
                          className="w-16 h-16 rounded-xl bg-cafe-800 flex items-center justify-center flex-shrink-0 hover:bg-cafe-700 transition-colors"
                        >
                          <Coffee className="w-8 h-8 text-cafe-600" />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Link to={`/nft/${lot.tokenId}`} className="hover:text-gold-400 transition-colors">
                              <h3 className="font-semibold text-cafe-100 truncate">
                                {lot.name}
                              </h3>
                            </Link>
                            <Badge variant={statusMap[lot.status].variant}>
                              {statusMap[lot.status].label}
                            </Badge>
                          </div>
                          <p className="text-sm text-cafe-500 font-mono">{lot.lotCode}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-cafe-400">
                            <span>#{lot.tokenId}</span>
                            <span>{lot.weightKg} kg</span>
                            <span className="text-gold-400 font-mono">
                              SCA {lot.scaScore}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          {lot.price && (
                            <p className="font-mono font-bold text-gold-400">
                              {lot.price} ETH
                            </p>
                          )}
                          <p className="text-xs text-cafe-500 mt-1">
                            {lot.mintedAt.toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {lot.status === 'owned' && !lot.redeemed && (
                            <button
                              onClick={() => {
                                setSelectedLot(lot.tokenId)
                                setShowListingModal(true)
                              }}
                              className="p-2 text-success hover:bg-success/20 rounded-lg transition-colors"
                              title="Listar para venda"
                            >
                              <ShoppingCart className="w-5 h-5" />
                            </button>
                          )}
                          {lot.status === 'listed' && (
                            <button
                              onClick={() => handleCancelListing(lot.tokenId)}
                              disabled={isProcessing}
                              className="p-2 text-error hover:bg-error/20 rounded-lg transition-colors"
                              title="Cancelar listagem"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          )}
                          <Link
                            to={`/nft/${lot.tokenId}`}
                            className="p-2 text-cafe-500 hover:text-cafe-300 transition-colors"
                          >
                            <Eye className="w-5 h-5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isLoading && filteredLots.length === 0 && (
                <div className="p-12 text-center">
                  <Coffee className="w-12 h-12 text-cafe-700 mx-auto mb-4" />
                  <p className="text-cafe-500 mb-4">
                    {activeTab === 'all'
                      ? 'Você ainda não tokenizou nenhum lote'
                      : activeTab === 'listed'
                      ? 'Nenhum lote à venda'
                      : 'Nenhum lote em carteira'}
                  </p>
                  {activeTab === 'all' && (
                    <Link to="/mint">
                      <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                        Criar Primeiro Lote
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Quick Actions */}
            <Card>
              <h3 className="font-display text-lg font-semibold text-cafe-100 mb-4">
                Ações Rápidas
              </h3>
              <div className="space-y-2">
                <Link to="/mint" className="block">
                  <button className="w-full flex items-center gap-3 p-3 bg-cafe-800/50 hover:bg-cafe-800 rounded-xl transition-colors text-left">
                    <Plus className="w-5 h-5 text-gold-500" />
                    <span className="text-cafe-200">Criar novo lote</span>
                  </button>
                </Link>
                <Link to="/marketplace" className="block">
                  <button className="w-full flex items-center gap-3 p-3 bg-cafe-800/50 hover:bg-cafe-800 rounded-xl transition-colors text-left">
                    <ShoppingCart className="w-5 h-5 text-gold-500" />
                    <span className="text-cafe-200">Ver marketplace</span>
                  </button>
                </Link>
                <Link to="/profile" className="block">
                  <button className="w-full flex items-center gap-3 p-3 bg-cafe-800/50 hover:bg-cafe-800 rounded-xl transition-colors text-left">
                    <Edit className="w-5 h-5 text-gold-500" />
                    <span className="text-cafe-200">Editar perfil</span>
                  </button>
                </Link>
              </div>
            </Card>

            {/* Info Card */}
            <Card className="mt-6">
              <h3 className="font-display text-lg font-semibold text-cafe-100 mb-4">
                💡 Dicas
              </h3>
              <div className="space-y-3 text-sm text-cafe-400">
                <p>• Clique no <ShoppingCart className="w-4 h-4 inline text-success" /> para listar um lote para venda</p>
                <p>• Clique no <XCircle className="w-4 h-4 inline text-error" /> para cancelar uma listagem</p>
                <p>• Clique no <Eye className="w-4 h-4 inline" /> para ver detalhes do NFT</p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Listing Modal */}
      {showListingModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-cafe-900 rounded-2xl p-6 max-w-md w-full border border-cafe-700"
          >
            <h3 className="font-display text-xl font-bold text-cafe-100 mb-4">
              Listar NFT para Venda
            </h3>
            <p className="text-cafe-400 mb-6">
              Defina o preço de venda para o Token #{selectedLot}
            </p>
            <div className="mb-6">
              <label className="block text-sm text-cafe-300 mb-2">
                Preço (ETH)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={listingPrice}
                onChange={(e) => setListingPrice(e.target.value)}
                placeholder="0.5"
                className="w-full px-4 py-3 bg-cafe-800 border border-cafe-700 rounded-lg text-cafe-100 focus:outline-none focus:border-gold-500"
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowListingModal(false)
                  setListingPrice('')
                  setSelectedLot(null)
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleListForSale}
                disabled={isProcessing || !listingPrice}
                isLoading={isProcessing}
                className="flex-1"
              >
                Listar
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
