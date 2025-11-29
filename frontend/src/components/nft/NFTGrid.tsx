import { motion } from 'framer-motion'
import { Coffee, Loader2 } from 'lucide-react'
import NFTCard from './NFTCard'
import type { NFTWithListing } from '../../types'

interface NFTGridProps {
  nfts: NFTWithListing[]
  isLoading?: boolean
  emptyMessage?: string
}

export default function NFTGrid({ 
  nfts, 
  isLoading = false,
  emptyMessage = 'Nenhum microlote encontrado'
}: NFTGridProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-gold-500 animate-spin mb-4" />
        <p className="text-cafe-400">Carregando microlotes...</p>
      </div>
    )
  }

  if (nfts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-cafe-800/50 flex items-center justify-center mb-6">
          <Coffee className="w-10 h-10 text-cafe-600" />
        </div>
        <h3 className="text-xl font-display font-semibold text-cafe-300 mb-2">
          {emptyMessage}
        </h3>
        <p className="text-cafe-500 max-w-md">
          Novos microlotes de café especial serão adicionados em breve. 
          Fique de olho!
        </p>
      </motion.div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {nfts.map((nft, index) => (
        <NFTCard key={nft.tokenId} nft={nft} index={index} />
      ))}
    </div>
  )
}

