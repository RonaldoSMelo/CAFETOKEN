import { BrowserProvider, Contract, parseEther, formatEther } from 'ethers'

// ABI simplificado do CafeToken
const CAFE_TOKEN_ABI = [
  // Read functions
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function balanceOf(address owner) view returns (uint256)',
  'function mintFee() view returns (uint256)',
  'function marketplaceFee() view returns (uint256)',
  'function getCoffeeLot(uint256 tokenId) view returns (tuple(string lotCode, address producer, uint256 weightKg, uint256 scaScore, uint256 harvestTimestamp, string qualityReportHash, bool redeemed, uint256 mintedAt))',
  'function getListing(uint256 tokenId) view returns (tuple(address seller, uint256 price, bool active))',
  'function getActiveListings() view returns (uint256[] tokenIds, tuple(address seller, uint256 price, bool active)[] listings)',
  'function getTokensByOwner(address owner) view returns (uint256[])',
  'function getTotalMinted() view returns (uint256)',
  
  // Write functions
  'function mintCoffeeLot(string tokenURI, string lotCode, uint256 weightKg, uint256 scaScore, uint256 harvestTimestamp, string qualityReportHash) payable returns (uint256)',
  'function listForSale(uint256 tokenId, uint256 price)',
  'function cancelListing(uint256 tokenId)',
  'function buyNFT(uint256 tokenId) payable',
  'function updateListingPrice(uint256 tokenId, uint256 newPrice)',
  'function redeemCoffee(uint256 tokenId)',
  
  // Events
  'event CoffeeMinted(uint256 indexed tokenId, string lotCode, address indexed producer, uint256 weightKg, uint256 scaScore, string tokenURI)',
  'event CoffeeListed(uint256 indexed tokenId, address indexed seller, uint256 price)',
  'event ListingCancelled(uint256 indexed tokenId, address indexed seller)',
  'event CoffeeSold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price)',
  'event CoffeeRedeemed(uint256 indexed tokenId, address indexed redeemer, string lotCode)',
]

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || ''

export class CafeTokenService {
  private provider: BrowserProvider | null = null
  private contract: Contract | null = null

  async connect(): Promise<void> {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask não encontrada')
    }

    this.provider = new BrowserProvider(window.ethereum)
    await this.provider.send('eth_requestAccounts', [])
    
    const signer = await this.provider.getSigner()
    this.contract = new Contract(CONTRACT_ADDRESS, CAFE_TOKEN_ABI, signer)
  }

  async getReadOnlyContract(): Promise<Contract> {
    if (!this.provider) {
      this.provider = new BrowserProvider(window.ethereum!)
    }
    return new Contract(CONTRACT_ADDRESS, CAFE_TOKEN_ABI, this.provider)
  }

  // Read functions
  async getMintFee(): Promise<string> {
    const contract = await this.getReadOnlyContract()
    const fee = await contract.mintFee()
    return formatEther(fee)
  }

  async getMarketplaceFee(): Promise<number> {
    const contract = await this.getReadOnlyContract()
    const fee = await contract.marketplaceFee()
    return Number(fee) / 100 // Convert basis points to percentage
  }

  async getTotalMinted(): Promise<number> {
    const contract = await this.getReadOnlyContract()
    return Number(await contract.getTotalMinted())
  }

  async getTokensByOwner(owner: string): Promise<number[]> {
    const contract = await this.getReadOnlyContract()
    const tokens = await contract.getTokensByOwner(owner)
    return tokens.map((t: bigint) => Number(t))
  }

  async getCoffeeLot(tokenId: number): Promise<{
    lotCode: string
    producer: string
    weightKg: number
    scaScore: number
    harvestTimestamp: number
    qualityReportHash: string
    redeemed: boolean
    mintedAt: number
  }> {
    const contract = await this.getReadOnlyContract()
    const lot = await contract.getCoffeeLot(tokenId)
    return {
      lotCode: lot.lotCode,
      producer: lot.producer,
      weightKg: Number(lot.weightKg),
      scaScore: Number(lot.scaScore),
      harvestTimestamp: Number(lot.harvestTimestamp),
      qualityReportHash: lot.qualityReportHash,
      redeemed: lot.redeemed,
      mintedAt: Number(lot.mintedAt),
    }
  }

  async getListing(tokenId: number): Promise<{
    seller: string
    price: bigint
    priceFormatted: string
    active: boolean
  }> {
    const contract = await this.getReadOnlyContract()
    const listing = await contract.getListing(tokenId)
    return {
      seller: listing.seller,
      price: listing.price,
      priceFormatted: formatEther(listing.price),
      active: listing.active,
    }
  }

  async getActiveListings(): Promise<{
    tokenIds: number[]
    listings: { seller: string; price: bigint; priceFormatted: string; active: boolean }[]
  }> {
    const contract = await this.getReadOnlyContract()
    const [tokenIds, listings] = await contract.getActiveListings()
    return {
      tokenIds: tokenIds.map((t: bigint) => Number(t)),
      listings: listings.map((l: { seller: string; price: bigint; active: boolean }) => ({
        seller: l.seller,
        price: l.price,
        priceFormatted: formatEther(l.price),
        active: l.active,
      })),
    }
  }

  async getTokenURI(tokenId: number): Promise<string> {
    const contract = await this.getReadOnlyContract()
    return await contract.tokenURI(tokenId)
  }

  // Write functions
  async mintCoffeeLot(
    tokenURI: string,
    lotCode: string,
    weightKg: number,
    scaScore: number,
    harvestTimestamp: number,
    qualityReportHash: string
  ): Promise<number> {
    if (!this.contract) await this.connect()
    
    const mintFee = await this.contract!.mintFee()
    const tx = await this.contract!.mintCoffeeLot(
      tokenURI,
      lotCode,
      weightKg,
      scaScore,
      harvestTimestamp,
      qualityReportHash,
      { value: mintFee }
    )
    
    const receipt = await tx.wait()
    
    // Parse the CoffeeMinted event to get tokenId
    const mintEvent = receipt.logs.find(
      (log: { topics: string[] }) => log.topics[0] === this.contract!.interface.getEvent('CoffeeMinted')?.topicHash
    )
    
    if (mintEvent) {
      const decoded = this.contract!.interface.parseLog({
        topics: mintEvent.topics as string[],
        data: mintEvent.data,
      })
      return Number(decoded?.args[0])
    }
    
    throw new Error('Failed to get token ID from mint event')
  }

  async listForSale(tokenId: number, priceInMatic: string): Promise<void> {
    if (!this.contract) await this.connect()
    
    const priceWei = parseEther(priceInMatic)
    const tx = await this.contract!.listForSale(tokenId, priceWei)
    await tx.wait()
  }

  async cancelListing(tokenId: number): Promise<void> {
    if (!this.contract) await this.connect()
    
    const tx = await this.contract!.cancelListing(tokenId)
    await tx.wait()
  }

  async buyNFT(tokenId: number, priceWei: bigint): Promise<void> {
    if (!this.contract) await this.connect()
    
    const tx = await this.contract!.buyNFT(tokenId, { value: priceWei })
    await tx.wait()
  }

  async updateListingPrice(tokenId: number, newPriceInMatic: string): Promise<void> {
    if (!this.contract) await this.connect()
    
    const priceWei = parseEther(newPriceInMatic)
    const tx = await this.contract!.updateListingPrice(tokenId, priceWei)
    await tx.wait()
  }

  async redeemCoffee(tokenId: number): Promise<void> {
    if (!this.contract) await this.connect()
    
    const tx = await this.contract!.redeemCoffee(tokenId)
    await tx.wait()
  }
}

// Singleton instance
export const cafeTokenService = new CafeTokenService()

