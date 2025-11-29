import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  Coffee, 
  Shield, 
  Globe, 
  Coins, 
  MapPin,
  Star,
  CheckCircle,
  Users,
  TrendingUp,
  Wallet
} from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const features = [
  {
    icon: Shield,
    title: 'Lastro Físico Real',
    description: 'Cada NFT representa um microlote certificado, auditado e armazenado em warehouse parceiro.',
  },
  {
    icon: Globe,
    title: 'Mercado Global',
    description: 'Conecte-se com torrefações e compradores de todo o mundo, 24 horas por dia.',
  },
  {
    icon: Coins,
    title: 'Financiamento Antecipado',
    description: 'Produtores podem vender a safra antes da colheita e receber pagamento adiantado.',
  },
  {
    icon: MapPin,
    title: 'Rastreabilidade Total',
    description: 'Do grão à xícara, todas as informações registradas em blockchain imutável.',
  },
]

const stats = [
  { value: '50+', label: 'Produtores', icon: Users },
  { value: '200+', label: 'Lotes Tokenizados', icon: Coffee },
  { value: 'R$ 2M+', label: 'Volume Negociado', icon: TrendingUp },
  { value: '15', label: 'Países', icon: Globe },
]

const steps = [
  {
    step: '01',
    title: 'Cadastre seu Lote',
    description: 'Produtor registra informações do microlote: origem, variedade, processo, pontuação SCA.',
  },
  {
    step: '02',
    title: 'Auditoria & Certificação',
    description: 'Lote é validado por auditor parceiro, armazenado e certificado.',
  },
  {
    step: '03',
    title: 'Tokenização',
    description: 'NFT é criado com todos os metadados e disponibilizado no marketplace.',
  },
  {
    step: '04',
    title: 'Venda Global',
    description: 'Compradores de todo o mundo podem adquirir ou fazer lances.',
  },
]

export default function Home() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-cafe-950 via-cafe-900 to-cafe-950" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/10 rounded-full border border-gold-500/20">
                <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
                <span className="text-sm text-gold-400">Primeira plataforma do Brasil</span>
              </div>

              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-cafe-100">Microlotes de</span>
                <br />
                <span className="text-gradient">Café Tokenizados</span>
              </h1>

              <p className="text-xl text-cafe-400 max-w-xl leading-relaxed">
                Transforme seu café especial brasileiro em NFTs lastreados fisicamente. 
                Rastreabilidade total, mercado global, liquidez digital.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/marketplace">
                  <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                    Explorar Marketplace
                  </Button>
                </Link>
                <Link to="/mint">
                  <Button variant="outline" size="lg">
                    Sou Produtor
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-cafe-700 border-2 border-cafe-900 flex items-center justify-center"
                    >
                      <Coffee className="w-4 h-4 text-gold-400" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-cafe-100 font-semibold">+50 Produtores</p>
                  <p className="text-sm text-cafe-500">já estão tokenizando</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              {/* Featured NFT Card */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-gold opacity-20 blur-3xl rounded-full" />
                <Card className="relative overflow-hidden" glow>
                  <div className="aspect-square bg-gradient-to-br from-cafe-800 to-cafe-900 flex items-center justify-center">
                    <div className="text-center p-8">
                      <Coffee className="w-24 h-24 text-gold-500/50 mx-auto mb-6" />
                      <p className="text-cafe-500">Imagem do NFT</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-display text-xl font-bold text-cafe-100">
                          Bourbon Amarelo #042
                        </h3>
                        <p className="text-cafe-400">Sítio Alto da Serra</p>
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1 bg-gold-500/20 rounded-full">
                        <Star className="w-4 h-4 text-gold-400" />
                        <span className="font-mono text-gold-400 font-bold">86</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-cafe-800">
                      <div>
                        <p className="text-sm text-cafe-500">Preço atual</p>
                        <p className="font-mono text-xl text-gold-400 font-bold">0.5 ETH</p>
                      </div>
                      <Button>Comprar</Button>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-cafe-800 bg-cafe-900/30">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gold-500/10 mb-4">
                  <stat.icon className="w-6 h-6 text-gold-500" />
                </div>
                <p className="font-display text-3xl md:text-4xl font-bold text-cafe-100 mb-1">
                  {stat.value}
                </p>
                <p className="text-cafe-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-cafe-100 mb-6">
              Por que <span className="text-gradient">tokenizar</span> seu café?
            </h2>
            <p className="text-xl text-cafe-400">
              A tecnologia blockchain traz transparência, segurança e novas oportunidades 
              para produtores e compradores de café especial.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="h-full p-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-gold flex items-center justify-center mb-6">
                    <feature.icon className="w-7 h-7 text-cafe-950" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-cafe-100 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-cafe-400 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="section bg-cafe-900/30">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-cafe-100 mb-6">
              Como <span className="text-gradient">funciona</span>
            </h2>
            <p className="text-xl text-cafe-400">
              Do grão ao token em 4 passos simples
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-gold-500/50 to-transparent -translate-x-4" />
                )}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/20 mb-6">
                    <span className="font-display text-2xl font-bold text-gold-400">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-cafe-100 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-cafe-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gold-600/20 via-gold-500/10 to-transparent" />
            <div className="absolute inset-0 bg-cafe-900/80 backdrop-blur-sm" />
            
            <div className="relative p-8 md:p-16 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 rounded-full border border-gold-500/30 mb-8">
                <CheckCircle className="w-4 h-4 text-gold-400" />
                <span className="text-sm text-gold-400">Comece agora gratuitamente</span>
              </div>

              <h2 className="font-display text-4xl md:text-5xl font-bold text-cafe-100 mb-6 max-w-3xl mx-auto">
                Pronto para tokenizar seu café especial?
              </h2>

              <p className="text-xl text-cafe-400 mb-10 max-w-2xl mx-auto">
                Junte-se aos produtores que já estão transformando o mercado de café 
                com tecnologia blockchain.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/mint">
                  <Button size="lg" leftIcon={<Coffee className="w-5 h-5" />}>
                    Cadastrar como Produtor
                  </Button>
                </Link>
                <Link to="/marketplace">
                  <Button variant="outline" size="lg" leftIcon={<Wallet className="w-5 h-5" />}>
                    Explorar Marketplace
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

