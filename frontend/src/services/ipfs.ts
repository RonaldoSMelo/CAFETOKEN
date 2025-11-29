const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY || ''
const PINATA_SECRET = import.meta.env.VITE_PINATA_SECRET || ''
const PINATA_GATEWAY = import.meta.env.VITE_PINATA_GATEWAY || 'https://gateway.pinata.cloud/ipfs/'

interface PinataResponse {
  IpfsHash: string
  PinSize: number
  Timestamp: string
}

interface NFTMetadata {
  name: string
  description: string
  image: string
  external_url?: string
  attributes: {
    trait_type: string
    value: string | number
    display_type?: string
  }[]
}

export class IPFSService {
  private apiKey: string
  private secret: string
  private gateway: string

  constructor() {
    this.apiKey = PINATA_API_KEY
    this.secret = PINATA_SECRET
    this.gateway = PINATA_GATEWAY
  }

  async uploadFile(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': this.apiKey,
        'pinata_secret_api_key': this.secret,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to upload file to IPFS')
    }

    const data: PinataResponse = await response.json()
    return data.IpfsHash
  }

  async uploadJSON(json: object): Promise<string> {
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': this.apiKey,
        'pinata_secret_api_key': this.secret,
      },
      body: JSON.stringify(json),
    })

    if (!response.ok) {
      throw new Error('Failed to upload JSON to IPFS')
    }

    const data: PinataResponse = await response.json()
    return data.IpfsHash
  }

  async uploadNFTMetadata(metadata: NFTMetadata): Promise<string> {
    return this.uploadJSON(metadata)
  }

  async uploadCoffeeLotData(data: {
    lotCode: string
    producerName: string
    farmName: string
    region: string
    state: string
    country: string
    altitude: number
    coordinates?: { lat: number; lng: number }
    variety: string
    process: string
    weightKg: number
    scaScore: number
    harvestDate: string
    certifications: string[]
    cuppingNotes?: string
    qualityReportHash?: string
    imageHash: string
    description: string
  }): Promise<string> {
    const metadata: NFTMetadata = {
      name: `Microlote ${data.lotCode}`,
      description: data.description,
      image: `ipfs://${data.imageHash}`,
      external_url: `https://cafetoken.io/nft/${data.lotCode}`,
      attributes: [
        { trait_type: 'Lot Code', value: data.lotCode },
        { trait_type: 'Producer', value: data.producerName },
        { trait_type: 'Farm', value: data.farmName },
        { trait_type: 'Region', value: data.region },
        { trait_type: 'State', value: data.state },
        { trait_type: 'Country', value: data.country },
        { trait_type: 'Altitude', value: `${data.altitude}m` },
        { trait_type: 'Variety', value: data.variety },
        { trait_type: 'Process', value: data.process },
        { trait_type: 'Weight (kg)', value: data.weightKg, display_type: 'number' },
        { trait_type: 'SCA Score', value: data.scaScore, display_type: 'number' },
        { trait_type: 'Harvest Date', value: data.harvestDate },
        { trait_type: 'Certifications', value: data.certifications.join(', ') },
      ],
    }

    if (data.coordinates) {
      metadata.attributes.push({
        trait_type: 'GPS Coordinates',
        value: `${data.coordinates.lat}, ${data.coordinates.lng}`,
      })
    }

    if (data.cuppingNotes) {
      metadata.attributes.push({
        trait_type: 'Cupping Notes',
        value: data.cuppingNotes,
      })
    }

    if (data.qualityReportHash) {
      metadata.attributes.push({
        trait_type: 'Quality Report Hash',
        value: data.qualityReportHash,
      })
    }

    metadata.attributes.push({
      trait_type: 'Redeemed',
      value: 'No',
    })

    return this.uploadJSON(metadata)
  }

  getIPFSUrl(hash: string): string {
    if (hash.startsWith('ipfs://')) {
      return `${this.gateway}${hash.replace('ipfs://', '')}`
    }
    return `${this.gateway}${hash}`
  }

  async fetchMetadata(hash: string): Promise<NFTMetadata> {
    const url = this.getIPFSUrl(hash)
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error('Failed to fetch metadata from IPFS')
    }

    return response.json()
  }
}

// Singleton instance
export const ipfsService = new IPFSService()

