import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Coffee } from 'lucide-react'
import NFTGrid from '../components/nft/NFTGrid'
import FilterBar from '../components/marketplace/FilterBar'
import type { MarketplaceFilters, NFTWithListing } from '../types'

// Mock data para demonstração
const mockNFTs: NFTWithListing[] = [
  {
    tokenId: 1,
    lotCode: 'CAF-2024-MG-001',
    producer: '0x1234567890123456789012345678901234567890',
    producerName: 'João Silva',
    farmName: 'Sítio Alto da Serra',
    weightKg: 30,
    scaScore: 8650,
    harvestTimestamp: 1717200000,
    qualityReportHash: 'QmXyz123',
    redeemed: false,
    mintedAt: 1717200000,
    listing: {
      tokenId: 1,
      seller: '0x1234567890123456789012345678901234567890',
      price: BigInt('500000000000000000'),
      priceFormatted: '0.5',
      active: true,
    },
    metadata: {
      name: 'Bourbon Amarelo #001',
      description: 'Microlote excepcional de Bourbon Amarelo',
      image: '/placeholder-coffee.jpg',
      attributes: [],
    },
  },
  {
    tokenId: 2,
    lotCode: 'CAF-2024-MG-002',
    producer: '0x2345678901234567890123456789012345678901',
    producerName: 'Maria Santos',
    farmName: 'Fazenda Santa Clara',
    weightKg: 25,
    scaScore: 8800,
    harvestTimestamp: 1717200000,
    qualityReportHash: 'QmAbc456',
    redeemed: false,
    mintedAt: 1717200000,
    listing: {
      tokenId: 2,
      seller: '0x2345678901234567890123456789012345678901',
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
  {
    tokenId: 3,
    lotCode: 'CAF-2024-ES-003',
    producer: '0x3456789012345678901234567890123456789012',
    producerName: 'Pedro Costa',
    farmName: 'Sítio Boa Vista',
    weightKg: 20,
    scaScore: 8550,
    harvestTimestamp: 1717200000,
    qualityReportHash: 'QmDef789',
    redeemed: false,
    mintedAt: 1717200000,
    listing: {
      tokenId: 3,
      seller: '0x3456789012345678901234567890123456789012',
      price: BigInt('400000000000000000'),
      priceFormatted: '0.4',
      active: true,
    },
    metadata: {
      name: 'Catuaí Vermelho #003',
      description: 'Catuaí de processo honey',
      image: '/placeholder-coffee.jpg',
      attributes: [],
    },
  },
  {
    tokenId: 4,
    lotCode: 'CAF-2024-MG-004',
    producer: '0x4567890123456789012345678901234567890123',
    producerName: 'Ana Oliveira',
    farmName: 'Fazenda Esperança',
    weightKg: 35,
    scaScore: 9100,
    harvestTimestamp: 1717200000,
    qualityReportHash: 'QmGhi012',
    redeemed: false,
    mintedAt: 1717200000,
    listing: {
      tokenId: 4,
      seller: '0x4567890123456789012345678901234567890123',
      price: BigInt('1200000000000000000'),
      priceFormatted: '1.2',
      active: true,
    },
    metadata: {
      name: 'Geisha Lavado #004',
      description: 'Geisha de competição, pontuação 91+',
      image: '/placeholder-coffee.jpg',
      attributes: [],
    },
  },
  {
    tokenId: 5,
    lotCode: 'CAF-2024-BA-005',
    producer: '0x5678901234567890123456789012345678901234',
    producerName: 'Carlos Mendes',
    farmName: 'Sítio Recanto',
    weightKg: 28,
    scaScore: 8400,
    harvestTimestamp: 1717200000,
    qualityReportHash: 'QmJkl345',
    redeemed: false,
    mintedAt: 1717200000,
    listing: {
      tokenId: 5,
      seller: '0x5678901234567890123456789012345678901234',
      price: BigInt('350000000000000000'),
      priceFormatted: '0.35',
      active: true,
    },
    metadata: {
      name: 'Mundo Novo #005',
      description: 'Mundo Novo de terroir único',
      image: '/placeholder-coffee.jpg',
      attributes: [],
    },
  },
  {
    tokenId: 6,
    lotCode: 'CAF-2024-MG-006',
    producer: '0x6789012345678901234567890123456789012345',
    producerName: 'Lucia Ferreira',
    farmName: 'Fazenda Primavera',
    weightKg: 22,
    scaScore: 8750,
    harvestTimestamp: 1717200000,
    qualityReportHash: 'QmMno678',
    redeemed: false,
    mintedAt: 1717200000,
    listing: {
      tokenId: 6,
      seller: '0x6789012345678901234567890123456789012345',
      price: BigInt('650000000000000000'),
      priceFormatted: '0.65',
      active: true,
    },
    metadata: {
      name: 'Bourbon Vermelho #006',
      description: 'Bourbon fermentado anaeróbico',
      image: '/placeholder-coffee.jpg',
      attributes: [],
    },
  },
]

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<MarketplaceFilters>({})
  const [isLoading] = useState(false)

  // Filter and sort NFTs
  const filteredNFTs = useMemo(() => {
    let result = [...mockNFTs]

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        nft =>
          nft.metadata?.name?.toLowerCase().includes(query) ||
          nft.lotCode.toLowerCase().includes(query) ||
          nft.farmName?.toLowerCase().includes(query)
      )
    }

    // Filter by score
    if (filters.minScore) {
      result = result.filter(nft => nft.scaScore >= filters.minScore! * 100)
    }

    // Sort
    switch (filters.sortBy) {
      case 'price_asc':
        result.sort((a, b) => 
          parseFloat(a.listing?.priceFormatted || '0') - parseFloat(b.listing?.priceFormatted || '0')
        )
        break
      case 'price_desc':
        result.sort((a, b) => 
          parseFloat(b.listing?.priceFormatted || '0') - parseFloat(a.listing?.priceFormatted || '0')
        )
        break
      case 'score_desc':
        result.sort((a, b) => b.scaScore - a.scaScore)
        break
      case 'newest':
      default:
        result.sort((a, b) => b.mintedAt - a.mintedAt)
    }

    return result
  }, [searchQuery, filters])

  return (
    <div className="pt-28 pb-16 min-h-screen">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-cafe-100 mb-3">
                Marketplace
              </h1>
              <p className="text-lg text-cafe-400">
                Explore e adquira microlotes de café especial brasileiro tokenizados
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cafe-500" />
              <input
                type="text"
                placeholder="Buscar lotes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-12"
              />
            </div>
          </div>

          {/* Filters */}
          <FilterBar
            filters={filters}
            onFiltersChange={setFilters}
            totalResults={filteredNFTs.length}
          />
        </motion.div>

        {/* Grid */}
        <NFTGrid
          nfts={filteredNFTs}
          isLoading={isLoading}
          emptyMessage={
            searchQuery
              ? `Nenhum resultado para "${searchQuery}"`
              : 'Nenhum microlote disponível no momento'
          }
        />

        {/* Empty state CTA */}
        {filteredNFTs.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-8"
          >
            <button
              onClick={() => {
                setSearchQuery('')
                setFilters({})
              }}
              className="text-gold-400 hover:text-gold-300 transition-colors"
            >
              Limpar filtros e busca
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

