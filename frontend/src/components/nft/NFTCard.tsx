import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Mountain, Calendar, Scale, Star, Tag } from 'lucide-react'
import Badge from '../ui/Badge'
import type { NFTWithListing } from '../../types'

interface NFTCardProps {
  nft: NFTWithListing
  index?: number
}

export default function NFTCard({ nft, index = 0 }: NFTCardProps) {
  const formatPrice = (price: string) => {
    return parseFloat(price).toFixed(3)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('pt-BR', {
      month: 'short',
      year: 'numeric',
    })
  }

  const getScoreColor = (score: number) => {
    const normalizedScore = score / 100 // Convert from 8600 to 86
    if (normalizedScore >= 90) return 'text-success'
    if (normalizedScore >= 85) return 'text-gold-400'
    return 'text-cafe-300'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link to={`/nft/${nft.tokenId}`}>
        <div className="group card-hover overflow-hidden">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-cafe-800">
            <img
              src={nft.metadata?.image || '/placeholder-coffee.jpg'}
              alt={nft.metadata?.name || `Lote ${nft.lotCode}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-cafe-950/80 via-transparent to-transparent" />
            
            {/* Status badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {nft.redeemed && (
                <Badge variant="warning" icon={<Scale className="w-3 h-3" />}>
                  Resgatado
                </Badge>
              )}
              {nft.listing?.active && (
                <Badge variant="success">À Venda</Badge>
              )}
            </div>

            {/* SCA Score */}
            <div className="absolute top-4 right-4">
              <div className="flex items-center gap-1 px-3 py-1.5 bg-cafe-950/80 backdrop-blur-sm rounded-full border border-cafe-700">
                <Star className={`w-4 h-4 ${getScoreColor(nft.scaScore)}`} />
                <span className={`font-mono font-bold ${getScoreColor(nft.scaScore)}`}>
                  {(nft.scaScore / 100).toFixed(1)}
                </span>
              </div>
            </div>

            {/* Price tag */}
            {nft.listing?.active && (
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center justify-between px-4 py-3 bg-cafe-950/90 backdrop-blur-sm rounded-xl border border-gold-500/30">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gold-400" />
                    <span className="text-sm text-cafe-400">Preço</span>
                  </div>
                  <span className="font-mono font-bold text-gold-400">
                    {formatPrice(nft.listing.priceFormatted)} MATIC
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 space-y-4">
            {/* Title */}
            <div>
              <h3 className="font-display text-lg font-semibold text-cafe-100 group-hover:text-gold-400 transition-colors line-clamp-1">
                {nft.metadata?.name || `Microlote ${nft.lotCode}`}
              </h3>
              <p className="text-sm text-cafe-400 mt-1">
                {nft.farmName || 'Produtor verificado'}
              </p>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gold-500/70" />
                <span className="text-cafe-400 truncate">Minas Gerais</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mountain className="w-4 h-4 text-gold-500/70" />
                <span className="text-cafe-400">1.200m</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gold-500/70" />
                <span className="text-cafe-400">{formatDate(nft.harvestTimestamp)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Scale className="w-4 h-4 text-gold-500/70" />
                <span className="text-cafe-400">{nft.weightKg} kg</span>
              </div>
            </div>

            {/* Lot code */}
            <div className="pt-3 border-t border-cafe-800">
              <span className="font-mono text-xs text-cafe-500">
                {nft.lotCode}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

