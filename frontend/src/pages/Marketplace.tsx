import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, RefreshCw } from 'lucide-react'
import { BrowserProvider, Contract, formatEther } from 'ethers'
import NFTGrid from '../components/nft/NFTGrid'
import FilterBar from '../components/marketplace/FilterBar'
import Button from '../components/ui/Button'
import type { MarketplaceFilters, NFTWithListing } from '../types'

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
const CONTRACT_ABI = [
  'function getTotalMinted() view returns (uint256)',
  'function getCoffeeLot(uint256 tokenId) view returns (tuple(string lotCode, address producer, uint256 weightKg, uint256 scaScore, uint256 harvestTimestamp, string qualityReportHash, bool redeemed, uint256 mintedAt))',
  'function getListing(uint256 tokenId) view returns (tuple(address seller, uint256 price, bool active))',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function tokenURI(uint256 tokenId) view returns (string)',
]

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<MarketplaceFilters>({})
  const [isLoading, setIsLoading] = useState(true)
  const [nfts, setNfts] = useState<NFTWithListing[]>([])
  const [error, setError] = useState<string | null>(null)

  // Função para buscar NFTs da blockchain
  const fetchNFTs = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      let provider
      
      // Tentar usar MetaMask, senão usar RPC direto
      if (window.ethereum) {
        provider = new BrowserProvider(window.ethereum)
      } else {
        // Fallback para RPC direto (read-only)
        const { JsonRpcProvider } = await import('ethers')
        provider = new JsonRpcProvider('http://127.0.0.1:8545')
      }
      
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
      
      // Buscar total de NFTs mintados
      const totalMinted = await contract.getTotalMinted()
      const total = Number(totalMinted)
      
      if (total === 0) {
        setNfts([])
        setIsLoading(false)
        return
      }
      
      // Buscar dados de cada NFT
      const nftPromises = []
      for (let i = 1; i <= total; i++) {
        nftPromises.push(fetchSingleNFT(contract, i))
      }
      
      const fetchedNFTs = await Promise.all(nftPromises)
      const validNFTs = fetchedNFTs.filter(nft => nft !== null) as NFTWithListing[]
      
      setNfts(validNFTs)
    } catch (err: any) {
      console.error('Erro ao buscar NFTs:', err)
      setError('Erro ao conectar com a blockchain. Verifique se o Hardhat está rodando.')
    } finally {
      setIsLoading(false)
    }
  }

  // Buscar dados de um único NFT
  const fetchSingleNFT = async (contract: Contract, tokenId: number): Promise<NFTWithListing | null> => {
    try {
      const [lot, listing, owner, tokenURI] = await Promise.all([
        contract.getCoffeeLot(tokenId),
        contract.getListing(tokenId),
        contract.ownerOf(tokenId),
        contract.tokenURI(tokenId),
      ])

      // Tentar parsear metadata do tokenURI
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

      return {
        tokenId,
        lotCode: lot.lotCode,
        producer: lot.producer,
        farmName: extractFarmFromMetadata(metadata),
        weightKg: Number(lot.weightKg),
        scaScore: Number(lot.scaScore),
        harvestTimestamp: Number(lot.harvestTimestamp),
        qualityReportHash: lot.qualityReportHash,
        redeemed: lot.redeemed,
        mintedAt: Number(lot.mintedAt),
        listing: {
          tokenId,
          seller: listing.seller,
          price: listing.price,
          priceFormatted: formatEther(listing.price),
          active: listing.active,
        },
        metadata: {
          name: metadata.name || `Microlote ${lot.lotCode}`,
          description: metadata.description || '',
          image: metadata.image || '/placeholder-coffee.jpg',
          attributes: metadata.attributes || [],
        },
        owner,
      }
    } catch (err) {
      console.error(`Erro ao buscar NFT #${tokenId}:`, err)
      return null
    }
  }

  // Extrair nome da fazenda dos metadados
  const extractFarmFromMetadata = (metadata: any): string => {
    if (metadata.attributes) {
      const farmAttr = metadata.attributes.find(
        (attr: any) => attr.trait_type === 'Farm' || attr.trait_type === 'Fazenda'
      )
      if (farmAttr) return farmAttr.value
    }
    return 'Produtor Verificado'
  }

  // Carregar NFTs ao montar o componente
  useEffect(() => {
    fetchNFTs()
  }, [])

  // Filtrar e ordenar NFTs
  const filteredNFTs = useMemo(() => {
    let result = [...nfts]

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
  }, [nfts, searchQuery, filters])

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
              {nfts.length > 0 && (
                <p className="text-sm text-gold-400 mt-2">
                  🔗 {nfts.length} NFT{nfts.length > 1 ? 's' : ''} na blockchain
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Refresh button */}
              <Button
                variant="secondary"
                onClick={fetchNFTs}
                disabled={isLoading}
                leftIcon={<RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />}
              >
                Atualizar
              </Button>
              
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
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm">
              ⚠️ {error}
            </div>
          )}

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
            error
              ? 'Não foi possível carregar os NFTs'
              : searchQuery
              ? `Nenhum resultado para "${searchQuery}"`
              : 'Nenhum microlote tokenizado ainda. Seja o primeiro a criar!'
          }
        />

        {/* Empty state CTA */}
        {filteredNFTs.length === 0 && !isLoading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-8"
          >
            {searchQuery || Object.keys(filters).length > 0 ? (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setFilters({})
                }}
                className="text-gold-400 hover:text-gold-300 transition-colors"
              >
                Limpar filtros e busca
              </button>
            ) : (
              <a href="/mint" className="text-gold-400 hover:text-gold-300 transition-colors">
                Criar primeiro NFT →
              </a>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
