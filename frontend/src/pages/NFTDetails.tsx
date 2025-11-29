import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ExternalLink,
  Share2,
  Heart,
  MapPin,
  Mountain,
  Calendar,
  Scale,
  Star,
  Coffee,
  Leaf,
  Droplets,
  Award,
  FileText,
  Package,
  User,
  Copy,
  Check,
  Tag,
  ShoppingCart,
  Loader2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { BrowserProvider, Contract, formatEther, parseEther } from 'ethers'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import { useWallet } from '../context/WalletContext'

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
const CONTRACT_ABI = [
  'function getCoffeeLot(uint256 tokenId) view returns (tuple(string lotCode, address producer, uint256 weightKg, uint256 scaScore, uint256 harvestTimestamp, string qualityReportHash, bool redeemed, uint256 mintedAt))',
  'function getListing(uint256 tokenId) view returns (tuple(address seller, uint256 price, bool active))',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function listForSale(uint256 tokenId, uint256 price)',
  'function cancelListing(uint256 tokenId)',
  'function buyNFT(uint256 tokenId) payable',
  'function redeemCoffee(uint256 tokenId)',
  'function updateListingPrice(uint256 tokenId, uint256 newPrice)',
]

interface NFTData {
  tokenId: number
  lotCode: string
  producer: string
  weightKg: number
  scaScore: number
  harvestTimestamp: number
  qualityReportHash: string
  redeemed: boolean
  mintedAt: number
  owner: string
  listing: {
    seller: string
    price: bigint
    priceFormatted: string
    active: boolean
  }
  metadata: {
    name: string
    description: string
    image: string
    attributes: any[]
  }
}

export default function NFTDetails() {
  const { id } = useParams()
  const { isConnected, address, connect } = useWallet()
  const [copied, setCopied] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isBuying, setIsBuying] = useState(false)
  const [isListing, setIsListing] = useState(false)
  const [isRedeeming, setIsRedeeming] = useState(false)
  const [isCanceling, setIsCanceling] = useState(false)
  const [nft, setNft] = useState<NFTData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [listPrice, setListPrice] = useState('')
  const [showListModal, setShowListModal] = useState(false)

  // Buscar dados do NFT
  const fetchNFT = async () => {
    if (!id) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      let provider
      if (window.ethereum) {
        provider = new BrowserProvider(window.ethereum)
      } else {
        const { JsonRpcProvider } = await import('ethers')
        provider = new JsonRpcProvider('http://127.0.0.1:8545')
      }
      
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
      const tokenId = parseInt(id)
      
      const [lot, listing, owner, tokenURI] = await Promise.all([
        contract.getCoffeeLot(tokenId),
        contract.getListing(tokenId),
        contract.ownerOf(tokenId),
        contract.tokenURI(tokenId),
      ])

      // Parsear metadata
      let metadata = {
        name: `Microlote #${tokenId}`,
        description: '',
        image: '/placeholder-coffee.jpg',
        attributes: [],
      }

      if (tokenURI.startsWith('data:application/json,')) {
        try {
          const jsonStr = decodeURIComponent(tokenURI.replace('data:application/json,', ''))
          metadata = JSON.parse(jsonStr)
          if (!metadata.image) metadata.image = '/placeholder-coffee.jpg'
        } catch (e) {
          console.warn('Erro ao parsear metadata:', e)
        }
      }

      setNft({
        tokenId,
        lotCode: lot.lotCode,
        producer: lot.producer,
        weightKg: Number(lot.weightKg),
        scaScore: Number(lot.scaScore),
        harvestTimestamp: Number(lot.harvestTimestamp),
        qualityReportHash: lot.qualityReportHash,
        redeemed: lot.redeemed,
        mintedAt: Number(lot.mintedAt),
        owner,
        listing: {
          seller: listing.seller,
          price: listing.price,
          priceFormatted: formatEther(listing.price),
          active: listing.active,
        },
        metadata,
      })
    } catch (err: any) {
      console.error('Erro ao buscar NFT:', err)
      setError('NFT não encontrado ou erro de conexão')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNFT()
  }, [id])

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copiado!')
    setTimeout(() => setCopied(false), 2000)
  }

  const getAttributeValue = (traitType: string): string => {
    const attr = nft?.metadata.attributes?.find(
      (a: any) => a.trait_type === traitType
    )
    return attr?.value || '-'
  }

  // Comprar NFT
  const handleBuy = async () => {
    if (!isConnected) {
      connect()
      return
    }
    if (!nft || !window.ethereum) return

    setIsBuying(true)
    try {
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

      toast.loading('Aguardando confirmação...', { id: 'buy' })
      
      const tx = await contract.buyNFT(nft.tokenId, { 
        value: nft.listing.price 
      })
      
      toast.loading('Processando compra...', { id: 'buy' })
      await tx.wait()
      
      toast.success('NFT comprado com sucesso!', { id: 'buy' })
      fetchNFT() // Recarregar dados
    } catch (err: any) {
      console.error('Erro na compra:', err)
      toast.error(err.reason || 'Erro ao comprar NFT', { id: 'buy' })
    } finally {
      setIsBuying(false)
    }
  }

  // Listar para venda
  const handleList = async () => {
    if (!isConnected || !nft || !window.ethereum || !listPrice) return

    setIsListing(true)
    try {
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

      toast.loading('Aguardando confirmação...', { id: 'list' })
      
      const priceWei = parseEther(listPrice)
      const tx = await contract.listForSale(nft.tokenId, priceWei)
      
      toast.loading('Listando NFT...', { id: 'list' })
      await tx.wait()
      
      toast.success('NFT listado para venda!', { id: 'list' })
      setShowListModal(false)
      setListPrice('')
      fetchNFT()
    } catch (err: any) {
      console.error('Erro ao listar:', err)
      toast.error(err.reason || 'Erro ao listar NFT', { id: 'list' })
    } finally {
      setIsListing(false)
    }
  }

  // Cancelar listagem
  const handleCancelListing = async () => {
    if (!isConnected || !nft || !window.ethereum) return

    setIsCanceling(true)
    try {
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

      toast.loading('Cancelando listagem...', { id: 'cancel' })
      
      const tx = await contract.cancelListing(nft.tokenId)
      await tx.wait()
      
      toast.success('Listagem cancelada!', { id: 'cancel' })
      fetchNFT()
    } catch (err: any) {
      console.error('Erro ao cancelar:', err)
      toast.error(err.reason || 'Erro ao cancelar', { id: 'cancel' })
    } finally {
      setIsCanceling(false)
    }
  }

  // Resgatar café
  const handleRedeem = async () => {
    if (!isConnected || !nft || !window.ethereum) return

    if (!confirm('Tem certeza que deseja resgatar o café físico? Esta ação é irreversível.')) {
      return
    }

    setIsRedeeming(true)
    try {
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

      toast.loading('Processando resgate...', { id: 'redeem' })
      
      const tx = await contract.redeemCoffee(nft.tokenId)
      await tx.wait()
      
      toast.success('Café resgatado! Entraremos em contato para envio.', { id: 'redeem' })
      fetchNFT()
    } catch (err: any) {
      console.error('Erro no resgate:', err)
      toast.error(err.reason || 'Erro ao resgatar', { id: 'redeem' })
    } finally {
      setIsRedeeming(false)
    }
  }

  const isOwner = address?.toLowerCase() === nft?.owner?.toLowerCase()

  if (isLoading) {
    return (
      <div className="pt-28 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-gold-500 animate-spin mx-auto mb-4" />
          <p className="text-cafe-400">Carregando NFT...</p>
        </div>
      </div>
    )
  }

  if (error || !nft) {
    return (
      <div className="pt-28 pb-16 min-h-screen">
        <div className="container-custom">
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 text-cafe-400 hover:text-cafe-100 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Marketplace
          </Link>
          <div className="text-center py-20">
            <Coffee className="w-16 h-16 text-cafe-600 mx-auto mb-4" />
            <h2 className="text-2xl font-display font-bold text-cafe-300 mb-2">
              {error || 'NFT não encontrado'}
            </h2>
            <p className="text-cafe-500">
              Verifique se o ID está correto ou se a blockchain está rodando.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-28 pb-16 min-h-screen">
      <div className="container-custom">
        {/* Back button */}
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 text-cafe-400 hover:text-cafe-100 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Marketplace
        </Link>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left column - Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <Card padding="none" className="overflow-hidden">
              <div className="aspect-square bg-cafe-800 flex items-center justify-center relative group">
                <Coffee className="w-32 h-32 text-cafe-600" />
                
                {/* Status badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {nft.redeemed ? (
                    <Badge variant="warning" icon={<Package className="w-3 h-3" />}>
                      Resgatado
                    </Badge>
                  ) : nft.listing?.active ? (
                    <Badge variant="success">À Venda</Badge>
                  ) : (
                    <Badge>Não listado</Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-3 rounded-xl backdrop-blur-sm transition-colors ${
                      isLiked
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-cafe-950/50 text-cafe-400 hover:text-cafe-100'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-3 rounded-xl bg-cafe-950/50 backdrop-blur-sm text-cafe-400 hover:text-cafe-100 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </Card>

            {/* Quality Report */}
            <Card>
              <h3 className="font-display text-lg font-semibold text-cafe-100 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gold-500" />
                Laudo de Qualidade
              </h3>
              <div className="flex items-center justify-between p-3 bg-cafe-800/50 rounded-lg">
                <span className="font-mono text-sm text-cafe-400 truncate">
                  {nft.qualityReportHash}
                </span>
                <button
                  onClick={() => copyToClipboard(nft.qualityReportHash)}
                  className="p-2 text-cafe-400 hover:text-cafe-100 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </Card>
          </motion.div>

          {/* Right column - Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Title & Score */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm text-cafe-500 font-mono mb-2">{nft.lotCode}</p>
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-cafe-100">
                    {nft.metadata?.name}
                  </h1>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gold-500/10 rounded-xl border border-gold-500/20">
                  <Star className="w-5 h-5 text-gold-400" />
                  <span className="font-mono text-2xl font-bold text-gold-400">
                    {(nft.scaScore / 100).toFixed(1)}
                  </span>
                </div>
              </div>
              <p className="text-cafe-400 leading-relaxed">
                {nft.metadata?.description || `Microlote de café especial - ${nft.lotCode}`}
              </p>
            </div>

            {/* Owner Info */}
            <Card className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center">
                <User className="w-7 h-7 text-cafe-950" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-cafe-500">{isOwner ? 'Você é o dono' : 'Dono atual'}</p>
                <p className="font-semibold text-cafe-100 font-mono">{formatAddress(nft.owner)}</p>
              </div>
              {isOwner && (
                <Badge variant="gold" icon={<Check className="w-3 h-3" />}>
                  Seu NFT
                </Badge>
              )}
            </Card>

            {/* Price & Actions */}
            <Card className="bg-cafe-900/80 border-gold-500/20">
              {nft.redeemed ? (
                <div className="text-center py-4">
                  <Package className="w-12 h-12 text-warning mx-auto mb-3" />
                  <p className="text-warning font-semibold">Café Resgatado</p>
                  <p className="text-cafe-500 text-sm">Este lote já foi enviado ao comprador</p>
                </div>
              ) : nft.listing?.active ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm text-cafe-500 mb-1">Preço atual</p>
                      <p className="font-mono text-3xl font-bold text-gold-400">
                        {nft.listing.priceFormatted} ETH
                      </p>
                    </div>
                    <Tag className="w-8 h-8 text-gold-500" />
                  </div>

                  {isOwner ? (
                    <div className="space-y-3">
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={handleCancelListing}
                        isLoading={isCanceling}
                      >
                        Cancelar Listagem
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={handleBuy}
                      isLoading={isBuying}
                      className="w-full"
                      size="lg"
                      leftIcon={<ShoppingCart className="w-5 h-5" />}
                    >
                      {isConnected ? 'Comprar Agora' : 'Conectar para Comprar'}
                    </Button>
                  )}
                </>
              ) : isOwner ? (
                <div className="space-y-4">
                  <p className="text-cafe-400 text-center">Este NFT não está listado para venda</p>
                  
                  {showListModal ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-cafe-400 mb-2">Preço (ETH)</label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.5"
                          value={listPrice}
                          onChange={(e) => setListPrice(e.target.value)}
                          className="input"
                        />
                      </div>
                      <div className="flex gap-3">
                        <Button
                          variant="secondary"
                          className="flex-1"
                          onClick={() => setShowListModal(false)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          className="flex-1"
                          onClick={handleList}
                          isLoading={isListing}
                          disabled={!listPrice}
                        >
                          Confirmar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button
                        className="w-full"
                        onClick={() => setShowListModal(true)}
                        leftIcon={<Tag className="w-4 h-4" />}
                      >
                        Listar para Venda
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleRedeem}
                        isLoading={isRedeeming}
                        leftIcon={<Package className="w-4 h-4" />}
                      >
                        Resgatar Café Físico
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-cafe-400">Este NFT não está à venda no momento</p>
                </div>
              )}
            </Card>

            {/* Attributes Grid */}
            <Card>
              <h3 className="font-display text-lg font-semibold text-cafe-100 mb-4">
                Detalhes do Lote
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-cafe-800/30 rounded-lg">
                  <Coffee className="w-5 h-5 text-gold-500" />
                  <div>
                    <p className="text-xs text-cafe-500">Variedade</p>
                    <p className="text-sm font-medium text-cafe-100">{getAttributeValue('Variety')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-cafe-800/30 rounded-lg">
                  <Droplets className="w-5 h-5 text-gold-500" />
                  <div>
                    <p className="text-xs text-cafe-500">Processo</p>
                    <p className="text-sm font-medium text-cafe-100">{getAttributeValue('Process')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-cafe-800/30 rounded-lg">
                  <Mountain className="w-5 h-5 text-gold-500" />
                  <div>
                    <p className="text-xs text-cafe-500">Altitude</p>
                    <p className="text-sm font-medium text-cafe-100">{getAttributeValue('Altitude')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-cafe-800/30 rounded-lg">
                  <Scale className="w-5 h-5 text-gold-500" />
                  <div>
                    <p className="text-xs text-cafe-500">Peso</p>
                    <p className="text-sm font-medium text-cafe-100">{nft.weightKg} kg</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-cafe-800/30 rounded-lg">
                  <MapPin className="w-5 h-5 text-gold-500" />
                  <div>
                    <p className="text-xs text-cafe-500">Fazenda</p>
                    <p className="text-sm font-medium text-cafe-100">{getAttributeValue('Farm')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-cafe-800/30 rounded-lg">
                  <Calendar className="w-5 h-5 text-gold-500" />
                  <div>
                    <p className="text-xs text-cafe-500">Colheita</p>
                    <p className="text-sm font-medium text-cafe-100">
                      {new Date(nft.harvestTimestamp * 1000).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Token Info */}
            <Card>
              <h3 className="font-display text-lg font-semibold text-cafe-100 mb-4">
                Informações do Token
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-cafe-500">Token ID</span>
                  <span className="text-cafe-200 font-mono">#{nft.tokenId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cafe-500">Contrato</span>
                  <span className="text-cafe-200 font-mono">{formatAddress(CONTRACT_ADDRESS)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cafe-500">Blockchain</span>
                  <span className="text-cafe-200">Polygon</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cafe-500">Padrão</span>
                  <span className="text-cafe-200">ERC-721</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
