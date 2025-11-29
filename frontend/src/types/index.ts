// NFT Types
export interface CoffeeLot {
  tokenId: number
  lotCode: string
  producer: string
  producerName?: string
  farmName?: string
  weightKg: number
  scaScore: number
  harvestTimestamp: number
  qualityReportHash: string
  redeemed: boolean
  mintedAt: number
}

export interface NFTMetadata {
  name: string
  description: string
  image: string
  external_url?: string
  attributes: NFTAttribute[]
}

export interface NFTAttribute {
  trait_type: string
  value: string | number
  display_type?: string
}

export interface Listing {
  tokenId: number
  seller: string
  price: bigint
  priceFormatted: string
  active: boolean
}

export interface NFTWithListing extends CoffeeLot {
  listing?: Listing
  metadata?: NFTMetadata
}

// Producer Types
export interface Producer {
  id: string
  walletAddress: string
  name: string
  email?: string
  phone?: string
  farmName: string
  farmLocation?: {
    lat: number
    lng: number
  }
  farmAltitude?: number
  certifications: string[]
  verified: boolean
  createdAt: string
  updatedAt: string
}

// Microlot Types
export interface Microlot {
  id: string
  producerId: string
  lotCode: string
  variety: string
  process?: string
  harvestDate: string
  weightKg: number
  scaScore?: number
  cuppingNotes?: string
  certifications: string[]
  storageLocation?: string
  storageQrCode?: string
  qualityReportHash?: string
  images: string[]
  status: 'pending' | 'approved' | 'minted' | 'sold' | 'redeemed'
  createdAt: string
  updatedAt: string
}

// Transaction Types
export interface Transaction {
  id: string
  nftId: string
  fromAddress: string
  toAddress: string
  priceWei: string
  priceUsd?: number
  txHash: string
  txType: 'mint' | 'list' | 'sale' | 'transfer' | 'redeem'
  status: 'pending' | 'confirmed' | 'failed'
  createdAt: string
}

// Redeem Types
export interface RedeemRequest {
  id: string
  nftId: string
  requesterAddress: string
  shippingAddress: string
  shippingCountry: string
  trackingCode?: string
  status: 'requested' | 'processing' | 'shipped' | 'delivered'
  requestedAt: string
  shippedAt?: string
  deliveredAt?: string
}

// Filter Types
export interface MarketplaceFilters {
  minPrice?: number
  maxPrice?: number
  minScore?: number
  maxScore?: number
  variety?: string
  process?: string
  certifications?: string[]
  sortBy?: 'price_asc' | 'price_desc' | 'score_desc' | 'newest'
}

// Wallet Types
export interface WalletState {
  address: string | null
  isConnected: boolean
  isConnecting: boolean
  chainId: number | null
  balance: string | null
}

