import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Wallet, ChevronDown, Coffee, Store, Plus, LayoutDashboard, User } from 'lucide-react'
import { useWallet } from '../../context/WalletContext'

const navigation = [
  { name: 'Marketplace', href: '/marketplace', icon: Store },
  { name: 'Mint NFT', href: '/mint', icon: Plus },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [walletMenuOpen, setWalletMenuOpen] = useState(false)
  const { address, isConnected, isConnecting, balance, connect, disconnect } = useWallet()
  const location = useLocation()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass border-b border-cafe-800/50">
        <nav className="container-custom" aria-label="Global">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold group-hover:shadow-gold-lg transition-shadow">
                <Coffee className="w-5 h-5 text-cafe-950" />
              </div>
              <div className="hidden sm:block">
                <span className="font-display text-xl font-bold text-cafe-100">CAFÉ</span>
                <span className="font-display text-xl font-bold text-gradient">TOKEN</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:gap-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-gold-400'
                        : 'text-cafe-300 hover:text-cafe-100 hover:bg-cafe-800/50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-gold-500/10 rounded-lg border border-gold-500/20"
                        transition={{ type: 'spring', duration: 0.5 }}
                      />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Wallet Button */}
            <div className="flex items-center gap-4">
              {isConnected ? (
                <div className="relative">
                  <button
                    onClick={() => setWalletMenuOpen(!walletMenuOpen)}
                    className="flex items-center gap-3 px-4 py-2 bg-cafe-800/80 hover:bg-cafe-700/80 rounded-xl border border-cafe-700 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center">
                      <User className="w-4 h-4 text-cafe-950" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-xs text-cafe-400">Conectado</p>
                      <p className="text-sm font-medium text-cafe-100">{formatAddress(address!)}</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-cafe-400 transition-transform ${walletMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {walletMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-64 origin-top-right"
                      >
                        <div className="card p-4 space-y-4">
                          <div className="flex items-center gap-3 pb-4 border-b border-cafe-800">
                            <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center">
                              <User className="w-6 h-6 text-cafe-950" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-cafe-100">{formatAddress(address!)}</p>
                              <p className="text-sm text-gold-400">{parseFloat(balance || '0').toFixed(4)} MATIC</p>
                            </div>
                          </div>
                          <Link
                            to="/profile"
                            onClick={() => setWalletMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-cafe-300 hover:text-cafe-100 hover:bg-cafe-800/50 rounded-lg transition-colors"
                          >
                            <User className="w-4 h-4" />
                            <span>Meu Perfil</span>
                          </Link>
                          <Link
                            to="/dashboard"
                            onClick={() => setWalletMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-cafe-300 hover:text-cafe-100 hover:bg-cafe-800/50 rounded-lg transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Dashboard</span>
                          </Link>
                          <button
                            onClick={() => {
                              disconnect()
                              setWalletMenuOpen(false)
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                          >
                            <Wallet className="w-4 h-4" />
                            <span>Desconectar</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={connect}
                  disabled={isConnecting}
                  className="btn-primary"
                >
                  <Wallet className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {isConnecting ? 'Conectando...' : 'Conectar Wallet'}
                  </span>
                </button>
              )}

              {/* Mobile menu button */}
              <button
                type="button"
                className="lg:hidden p-2 text-cafe-400 hover:text-cafe-100"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-cafe-950/80 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-cafe-900 border-l border-cafe-800 lg:hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-cafe-800">
                <Link to="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                  <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
                    <Coffee className="w-5 h-5 text-cafe-950" />
                  </div>
                  <span className="font-display text-xl font-bold">
                    <span className="text-cafe-100">CAFÉ</span>
                    <span className="text-gradient">TOKEN</span>
                  </span>
                </Link>
                <button
                  type="button"
                  className="p-2 text-cafe-400 hover:text-cafe-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="p-6 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      location.pathname === item.href
                        ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
                        : 'text-cafe-300 hover:text-cafe-100 hover:bg-cafe-800/50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}

