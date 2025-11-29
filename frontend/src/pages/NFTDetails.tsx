import { useState } from 'react'
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
} from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import { useWallet } from '../context/WalletContext'

// Mock NFT data
const mockNFT = {
  tokenId: 1,
  lotCode: 'CAF-2024-MG-001',
  producer: '0x1234567890123456789012345678901234567890',
  producerName: 'João Silva',
  farmName: 'Sítio Alto da Serra',
  weightKg: 30,
  scaScore: 8650,
  harvestTimestamp: 1717200000,
  qualityReportHash: 'QmXyz123456789abcdef',
  redeemed: false,
  mintedAt: 1717200000,
  variety: 'Bourbon Amarelo',
  process: 'Natural',
  altitude: 1280,
  region: 'Minas Gerais',
  country: 'Brasil',
  coordinates: { lat: -21.7654, lng: -45.1234 },
  certifications: ['Rainforest Alliance', 'Orgânico Brasil'],
  cuppingNotes: 'Chocolate, caramelo, notas cítricas de laranja, corpo aveludado',
  listing: {
    tokenId: 1,
    seller: '0x1234567890123456789012345678901234567890',
    price: BigInt('500000000000000000'),
    priceFormatted: '0.5',
    active: true,
  },
  metadata: {
    name: 'Bourbon Amarelo #001',
    description: 'Microlote excepcional de Bourbon Amarelo cultivado a 1.280m de altitude nas montanhas de Minas Gerais. Processo natural com secagem em terreiro suspenso. Notas sensoriais de chocolate, caramelo e cítricos.',
    image: '/placeholder-coffee.jpg',
    attributes: [],
  },
  transactionHistory: [
    { type: 'mint', from: '0x0000...0000', to: '0x1234...7890', date: '2024-06-01', price: null },
  ],
}

export default function NFTDetails() {
  const { id } = useParams()
  const { isConnected, address, connect } = useWallet()
  const [copied, setCopied] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isBuying, setIsBuying] = useState(false)

  const nft = mockNFT // Em produção, buscar pelo ID

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copiado!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleBuy = async () => {
    if (!isConnected) {
      connect()
      return
    }
    setIsBuying(true)
    // Simular compra
    await new Promise(resolve => setTimeout(resolve, 2000))
    toast.success('Compra simulada com sucesso!')
    setIsBuying(false)
  }

  const isOwner = address?.toLowerCase() === nft.listing?.seller.toLowerCase()

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
                
                {/* Overlay buttons */}
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

                {/* Status */}
                <div className="absolute top-4 left-4">
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
              </div>
            </Card>

            {/* Certifications */}
            <Card>
              <h3 className="font-display text-lg font-semibold text-cafe-100 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-gold-500" />
                Certificações
              </h3>
              <div className="flex flex-wrap gap-2">
                {nft.certifications.map((cert) => (
                  <Badge key={cert} variant="gold" icon={<Check className="w-3 h-3" />}>
                    {cert}
                  </Badge>
                ))}
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
              <a
                href={`https://ipfs.io/ipfs/${nft.qualityReportHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 text-sm text-gold-400 hover:text-gold-300 transition-colors"
              >
                Ver no IPFS
                <ExternalLink className="w-4 h-4" />
              </a>
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
                {nft.metadata?.description}
              </p>
            </div>

            {/* Producer Info */}
            <Card className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center">
                <User className="w-7 h-7 text-cafe-950" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-cafe-500">Produtor</p>
                <p className="font-semibold text-cafe-100">{nft.producerName}</p>
                <p className="text-sm text-cafe-400">{nft.farmName}</p>
              </div>
              <Badge variant="success" icon={<Check className="w-3 h-3" />}>
                Verificado
              </Badge>
            </Card>

            {/* Price & Actions */}
            {nft.listing?.active && (
              <Card className="bg-cafe-900/80 border-gold-500/20">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-cafe-500 mb-1">Preço atual</p>
                    <p className="font-mono text-3xl font-bold text-gold-400">
                      {nft.listing.priceFormatted} MATIC
                    </p>
                    <p className="text-sm text-cafe-500">≈ R$ 1.750,00</p>
                  </div>
                </div>

                {isOwner ? (
                  <div className="space-y-3">
                    <Button variant="secondary" className="w-full">
                      Editar Listagem
                    </Button>
                    <Button variant="ghost" className="w-full text-error">
                      Cancelar Listagem
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleBuy}
                    isLoading={isBuying}
                    className="w-full"
                    size="lg"
                  >
                    {isConnected ? 'Comprar Agora' : 'Conectar Wallet'}
                  </Button>
                )}
              </Card>
            )}

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
                    <p className="text-sm font-medium text-cafe-100">{nft.variety}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-cafe-800/30 rounded-lg">
                  <Droplets className="w-5 h-5 text-gold-500" />
                  <div>
                    <p className="text-xs text-cafe-500">Processo</p>
                    <p className="text-sm font-medium text-cafe-100">{nft.process}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-cafe-800/30 rounded-lg">
                  <Mountain className="w-5 h-5 text-gold-500" />
                  <div>
                    <p className="text-xs text-cafe-500">Altitude</p>
                    <p className="text-sm font-medium text-cafe-100">{nft.altitude}m</p>
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
                    <p className="text-xs text-cafe-500">Região</p>
                    <p className="text-sm font-medium text-cafe-100">{nft.region}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-cafe-800/30 rounded-lg">
                  <Calendar className="w-5 h-5 text-gold-500" />
                  <div>
                    <p className="text-xs text-cafe-500">Colheita</p>
                    <p className="text-sm font-medium text-cafe-100">
                      {new Date(nft.harvestTimestamp * 1000).toLocaleDateString('pt-BR', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Cupping Notes */}
            <Card>
              <h3 className="font-display text-lg font-semibold text-cafe-100 mb-4 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-gold-500" />
                Notas de Degustação
              </h3>
              <p className="text-cafe-300 leading-relaxed">
                {nft.cuppingNotes}
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

