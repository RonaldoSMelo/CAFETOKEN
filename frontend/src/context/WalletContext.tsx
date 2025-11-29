import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { BrowserProvider, formatEther } from 'ethers'
import toast from 'react-hot-toast'
import type { WalletState } from '../types'

interface WalletContextType extends WalletState {
  connect: () => Promise<void>
  disconnect: () => void
  switchNetwork: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

const POLYGON_CHAIN_ID = 137
const POLYGON_MUMBAI_CHAIN_ID = 80001

const POLYGON_NETWORK = {
  chainId: `0x${POLYGON_CHAIN_ID.toString(16)}`,
  chainName: 'Polygon Mainnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: ['https://polygon-rpc.com'],
  blockExplorerUrls: ['https://polygonscan.com'],
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    chainId: null,
    balance: null,
  })

  const updateBalance = useCallback(async (address: string) => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new BrowserProvider(window.ethereum)
      const balance = await provider.getBalance(address)
      setState(prev => ({ ...prev, balance: formatEther(balance) }))
    }
  }, [])

  const connect = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') {
      toast.error('Por favor, instale o MetaMask!')
      window.open('https://metamask.io/download/', '_blank')
      return
    }

    setState(prev => ({ ...prev, isConnecting: true }))

    try {
      const provider = new BrowserProvider(window.ethereum)
      const accounts = await provider.send('eth_requestAccounts', [])
      const network = await provider.getNetwork()
      const chainId = Number(network.chainId)

      if (accounts.length > 0) {
        const address = accounts[0]
        const balance = await provider.getBalance(address)

        setState({
          address,
          isConnected: true,
          isConnecting: false,
          chainId,
          balance: formatEther(balance),
        })

        toast.success('Wallet conectada!')

        // Check if on correct network
        if (chainId !== POLYGON_CHAIN_ID && chainId !== POLYGON_MUMBAI_CHAIN_ID) {
          toast('Você está em uma rede diferente. Considere mudar para Polygon.', {
            icon: '⚠️',
          })
        }
      }
    } catch (error) {
      console.error('Failed to connect:', error)
      toast.error('Falha ao conectar wallet')
      setState(prev => ({ ...prev, isConnecting: false }))
    }
  }, [])

  const disconnect = useCallback(() => {
    setState({
      address: null,
      isConnected: false,
      isConnecting: false,
      chainId: null,
      balance: null,
    })
    toast.success('Wallet desconectada')
  }, [])

  const switchNetwork = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') return

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: POLYGON_NETWORK.chainId }],
      })
    } catch (switchError: unknown) {
      // Chain not added, try to add it
      if ((switchError as { code: number }).code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [POLYGON_NETWORK],
          })
        } catch (addError) {
          console.error('Failed to add network:', addError)
          toast.error('Falha ao adicionar rede Polygon')
        }
      } else {
        console.error('Failed to switch network:', switchError)
        toast.error('Falha ao trocar de rede')
      }
    }
  }, [])

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum === 'undefined') return

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect()
      } else if (accounts[0] !== state.address) {
        setState(prev => ({ ...prev, address: accounts[0] }))
        updateBalance(accounts[0])
      }
    }

    const handleChainChanged = (chainId: string) => {
      setState(prev => ({ ...prev, chainId: parseInt(chainId, 16) }))
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum?.removeListener('chainChanged', handleChainChanged)
    }
  }, [state.address, disconnect, updateBalance])

  // Auto-connect if previously connected
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new BrowserProvider(window.ethereum)
        const accounts = await provider.send('eth_accounts', [])
        if (accounts.length > 0) {
          connect()
        }
      }
    }
    checkConnection()
  }, [connect])

  return (
    <WalletContext.Provider value={{ ...state, connect, disconnect, switchNetwork }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

// Type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
      on: (event: string, callback: (...args: unknown[]) => void) => void
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void
    }
  }
}

