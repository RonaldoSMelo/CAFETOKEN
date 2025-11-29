import { Routes, Route } from 'react-router-dom'
import { WalletProvider } from './context/WalletContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Marketplace from './pages/Marketplace'
import NFTDetails from './pages/NFTDetails'
import MintNFT from './pages/MintNFT'
import ProducerDashboard from './pages/ProducerDashboard'
import Profile from './pages/Profile'

function App() {
  return (
    <WalletProvider>
      <div className="min-h-screen flex flex-col bg-cafe-950 bg-mesh">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/nft/:id" element={<NFTDetails />} />
            <Route path="/mint" element={<MintNFT />} />
            <Route path="/dashboard" element={<ProducerDashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </WalletProvider>
  )
}

export default App

