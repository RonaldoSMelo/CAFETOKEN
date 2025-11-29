import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Coffee,
  Plus,
  TrendingUp,
  DollarSign,
  Package,
  Clock,
  Eye,
  Edit,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import { useWallet } from '../context/WalletContext'

const stats = [
  {
    label: 'Lotes Tokenizados',
    value: '12',
    change: '+2',
    trend: 'up',
    icon: Coffee,
  },
  {
    label: 'Volume Vendido',
    value: '4.5 ETH',
    change: '+0.8',
    trend: 'up',
    icon: TrendingUp,
  },
  {
    label: 'Receita Total',
    value: 'R$ 45.000',
    change: '+12%',
    trend: 'up',
    icon: DollarSign,
  },
  {
    label: 'Lotes Disponíveis',
    value: '5',
    change: '-1',
    trend: 'down',
    icon: Package,
  },
]

const mockLots = [
  {
    id: 1,
    lotCode: 'CAF-2024-MG-001',
    name: 'Bourbon Amarelo #001',
    status: 'listed',
    price: '0.5',
    scaScore: 86.5,
    weight: 30,
    views: 245,
    createdAt: '2024-06-01',
  },
  {
    id: 2,
    lotCode: 'CAF-2024-MG-002',
    name: 'Geisha Natural #002',
    status: 'sold',
    price: '0.75',
    scaScore: 88.0,
    weight: 25,
    views: 189,
    createdAt: '2024-05-28',
  },
  {
    id: 3,
    lotCode: 'CAF-2024-MG-003',
    name: 'Catuaí Honey #003',
    status: 'pending',
    price: null,
    scaScore: 85.5,
    weight: 20,
    views: 0,
    createdAt: '2024-06-10',
  },
  {
    id: 4,
    lotCode: 'CAF-2024-MG-004',
    name: 'Bourbon Vermelho #004',
    status: 'redeemed',
    price: '0.6',
    scaScore: 87.0,
    weight: 35,
    views: 312,
    createdAt: '2024-05-15',
  },
]

const recentActivity = [
  {
    type: 'sale',
    message: 'Lote CAF-2024-MG-002 vendido por 0.75 ETH',
    time: '2 horas atrás',
  },
  {
    type: 'view',
    message: '15 novas visualizações em Bourbon Amarelo #001',
    time: '5 horas atrás',
  },
  {
    type: 'redeem',
    message: 'Resgate solicitado para CAF-2024-MG-004',
    time: '1 dia atrás',
  },
  {
    type: 'mint',
    message: 'NFT CAF-2024-MG-003 criado com sucesso',
    time: '2 dias atrás',
  },
]

const statusMap: Record<string, { label: string; variant: 'default' | 'gold' | 'success' | 'warning' | 'error' }> = {
  listed: { label: 'À Venda', variant: 'success' },
  sold: { label: 'Vendido', variant: 'gold' },
  pending: { label: 'Pendente', variant: 'warning' },
  redeemed: { label: 'Resgatado', variant: 'default' },
}

export default function ProducerDashboard() {
  const { isConnected, connect } = useWallet()
  const [activeTab, setActiveTab] = useState<'all' | 'listed' | 'sold'>('all')

  const filteredLots = mockLots.filter(lot => {
    if (activeTab === 'all') return true
    if (activeTab === 'listed') return lot.status === 'listed'
    if (activeTab === 'sold') return lot.status === 'sold'
    return true
  })

  if (!isConnected) {
    return (
      <div className="pt-28 pb-16 min-h-screen">
        <div className="container-custom">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 rounded-full bg-cafe-800/50 flex items-center justify-center mb-6">
              <Coffee className="w-12 h-12 text-cafe-600" />
            </div>
            <h2 className="font-display text-2xl font-bold text-cafe-100 mb-3">
              Conecte sua Wallet
            </h2>
            <p className="text-cafe-400 max-w-md mb-8">
              Para acessar o dashboard de produtor, você precisa conectar sua carteira digital.
            </p>
            <Button onClick={connect} size="lg">
              Conectar Wallet
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-28 pb-16 min-h-screen">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="font-display text-3xl font-bold text-cafe-100 mb-1">
              Dashboard do Produtor
            </h1>
            <p className="text-cafe-400">
              Gerencie seus microlotes tokenizados
            </p>
          </div>
          <Link to="/mint">
            <Button leftIcon={<Plus className="w-4 h-4" />}>
              Novo Lote
            </Button>
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-gold-500" />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm ${
                      stat.trend === 'up' ? 'text-success' : 'text-error'
                    }`}
                  >
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <p className="text-2xl font-bold text-cafe-100 mb-1">{stat.value}</p>
                <p className="text-sm text-cafe-500">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lots Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card padding="none">
              <div className="p-6 border-b border-cafe-800">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-semibold text-cafe-100">
                    Meus Lotes
                  </h2>
                  <div className="flex items-center gap-1 p-1 bg-cafe-800/50 rounded-lg">
                    {(['all', 'listed', 'sold'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                          activeTab === tab
                            ? 'bg-cafe-700 text-cafe-100'
                            : 'text-cafe-400 hover:text-cafe-200'
                        }`}
                      >
                        {tab === 'all' ? 'Todos' : tab === 'listed' ? 'À Venda' : 'Vendidos'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="divide-y divide-cafe-800">
                {filteredLots.map((lot) => (
                  <div
                    key={lot.id}
                    className="p-4 hover:bg-cafe-800/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-cafe-800 flex items-center justify-center flex-shrink-0">
                        <Coffee className="w-8 h-8 text-cafe-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-cafe-100 truncate">
                            {lot.name}
                          </h3>
                          <Badge variant={statusMap[lot.status].variant}>
                            {statusMap[lot.status].label}
                          </Badge>
                        </div>
                        <p className="text-sm text-cafe-500 font-mono">{lot.lotCode}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-cafe-400">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {lot.views}
                          </span>
                          <span>{lot.weight} kg</span>
                          <span className="text-gold-400 font-mono">
                            SCA {lot.scaScore}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        {lot.price && (
                          <p className="font-mono font-bold text-gold-400">
                            {lot.price} MATIC
                          </p>
                        )}
                        <p className="text-xs text-cafe-500 mt-1">
                          {new Date(lot.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <button className="p-2 text-cafe-500 hover:text-cafe-300 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredLots.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-cafe-500">Nenhum lote encontrado</p>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Activity Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <h2 className="font-display text-lg font-semibold text-cafe-100 mb-6">
                Atividade Recente
              </h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 pb-4 border-b border-cafe-800 last:border-0 last:pb-0"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        activity.type === 'sale'
                          ? 'bg-success/20 text-success'
                          : activity.type === 'view'
                          ? 'bg-gold-500/20 text-gold-400'
                          : activity.type === 'redeem'
                          ? 'bg-warning/20 text-warning'
                          : 'bg-cafe-700 text-cafe-300'
                      }`}
                    >
                      {activity.type === 'sale' && <DollarSign className="w-4 h-4" />}
                      {activity.type === 'view' && <Eye className="w-4 h-4" />}
                      {activity.type === 'redeem' && <Package className="w-4 h-4" />}
                      {activity.type === 'mint' && <Coffee className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-cafe-200 leading-relaxed">
                        {activity.message}
                      </p>
                      <p className="text-xs text-cafe-500 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <h3 className="font-display text-lg font-semibold text-cafe-100 mb-4">
                Ações Rápidas
              </h3>
              <div className="space-y-2">
                <Link to="/mint" className="block">
                  <button className="w-full flex items-center gap-3 p-3 bg-cafe-800/50 hover:bg-cafe-800 rounded-xl transition-colors text-left">
                    <Plus className="w-5 h-5 text-gold-500" />
                    <span className="text-cafe-200">Criar novo lote</span>
                  </button>
                </Link>
                <button className="w-full flex items-center gap-3 p-3 bg-cafe-800/50 hover:bg-cafe-800 rounded-xl transition-colors text-left">
                  <Edit className="w-5 h-5 text-gold-500" />
                  <span className="text-cafe-200">Editar perfil</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-cafe-800/50 hover:bg-cafe-800 rounded-xl transition-colors text-left">
                  <Calendar className="w-5 h-5 text-gold-500" />
                  <span className="text-cafe-200">Agendar colheita</span>
                </button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

