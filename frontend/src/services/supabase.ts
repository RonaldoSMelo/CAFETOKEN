import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for database tables
export interface Producer {
  id: string
  wallet_address: string
  name: string
  email?: string
  phone?: string
  farm_name: string
  farm_location?: { lat: number; lng: number }
  farm_altitude?: number
  certifications: string[]
  verified: boolean
  created_at: string
  updated_at: string
}

export interface Microlot {
  id: string
  producer_id: string
  lot_code: string
  variety: string
  process?: string
  harvest_date: string
  weight_kg: number
  sca_score?: number
  cupping_notes?: string
  certifications: string[]
  storage_location?: string
  storage_qr_code?: string
  quality_report_hash?: string
  images: string[]
  status: 'pending' | 'approved' | 'minted' | 'sold' | 'redeemed'
  created_at: string
  updated_at: string
}

export interface NFT {
  id: string
  microlot_id: string
  token_id: number
  contract_address: string
  metadata_uri: string
  ipfs_hash: string
  owner_address: string
  price_wei?: string
  price_usd?: number
  status: 'minted' | 'listed' | 'sold' | 'redeemed'
  minted_at: string
  created_at: string
  updated_at: string
}

// Producer functions
export async function getProducerByWallet(walletAddress: string) {
  const { data, error } = await supabase
    .from('producers')
    .select('*')
    .eq('wallet_address', walletAddress.toLowerCase())
    .single()

  if (error) throw error
  return data as Producer
}

export async function createProducer(producer: Partial<Producer>) {
  const { data, error } = await supabase
    .from('producers')
    .insert([producer])
    .select()
    .single()

  if (error) throw error
  return data as Producer
}

export async function updateProducer(id: string, updates: Partial<Producer>) {
  const { data, error } = await supabase
    .from('producers')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Producer
}

// Microlot functions
export async function getMicrolotsByProducer(producerId: string) {
  const { data, error } = await supabase
    .from('microlots')
    .select('*')
    .eq('producer_id', producerId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Microlot[]
}

export async function getMicrolotByLotCode(lotCode: string) {
  const { data, error } = await supabase
    .from('microlots')
    .select('*')
    .eq('lot_code', lotCode)
    .single()

  if (error) throw error
  return data as Microlot
}

export async function createMicrolot(microlot: Partial<Microlot>) {
  const { data, error } = await supabase
    .from('microlots')
    .insert([microlot])
    .select()
    .single()

  if (error) throw error
  return data as Microlot
}

export async function updateMicrolot(id: string, updates: Partial<Microlot>) {
  const { data, error } = await supabase
    .from('microlots')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Microlot
}

// NFT functions
export async function getNFTsByOwner(ownerAddress: string) {
  const { data, error } = await supabase
    .from('nfts')
    .select(`
      *,
      microlots (*)
    `)
    .eq('owner_address', ownerAddress.toLowerCase())

  if (error) throw error
  return data
}

export async function getListedNFTs() {
  const { data, error } = await supabase
    .from('nfts')
    .select(`
      *,
      microlots (
        *,
        producers (name, farm_name, verified)
      )
    `)
    .eq('status', 'listed')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getNFTByTokenId(tokenId: number) {
  const { data, error } = await supabase
    .from('nfts')
    .select(`
      *,
      microlots (
        *,
        producers (*)
      )
    `)
    .eq('token_id', tokenId)
    .single()

  if (error) throw error
  return data
}

// Storage functions
export async function uploadImage(file: File, path: string) {
  const { data, error } = await supabase.storage
    .from('images')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw error
  return data
}

export async function getImageUrl(path: string) {
  const { data } = supabase.storage.from('images').getPublicUrl(path)
  return data.publicUrl
}

export async function uploadDocument(file: File, path: string) {
  const { data, error } = await supabase.storage
    .from('documents')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw error
  return data
}

