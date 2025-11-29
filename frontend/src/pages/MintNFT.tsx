import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Coffee,
  Upload,
  MapPin,
  Mountain,
  Scale,
  Star,
  Calendar,
  FileText,
  Image,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { BrowserProvider, Contract, parseEther } from 'ethers'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useWallet } from '../context/WalletContext'

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
const CONTRACT_ABI = [
  'function mintCoffeeLot(string tokenURI, string lotCode, uint256 weightKg, uint256 scaScore, uint256 harvestTimestamp, string qualityReportHash) payable returns (uint256)',
  'function mintFee() view returns (uint256)',
]

const steps = [
  { id: 1, name: 'Informações Básicas', icon: Coffee },
  { id: 2, name: 'Localização', icon: MapPin },
  { id: 3, name: 'Qualidade', icon: Star },
  { id: 4, name: 'Mídia', icon: Image },
  { id: 5, name: 'Revisão', icon: Check },
]

const varietyOptions = [
  'Bourbon Amarelo',
  'Bourbon Vermelho',
  'Catuaí Amarelo',
  'Catuaí Vermelho',
  'Mundo Novo',
  'Acaiá',
  'Geisha',
  'Pacamara',
  'Outro',
]

const processOptions = [
  'Natural',
  'Lavado',
  'Honey',
  'Cereja Descascado',
  'Fermentado Anaeróbico',
  'Outro',
]

const certificationOptions = [
  'Rainforest Alliance',
  'UTZ Certified',
  'Orgânico Brasil',
  'Fair Trade',
  'BSCA',
  'Cup of Excellence',
]

interface FormData {
  lotCode: string
  variety: string
  customVariety: string
  process: string
  customProcess: string
  weightKg: string
  harvestDate: string
  farmName: string
  region: string
  state: string
  country: string
  altitude: string
  coordinates: string
  scaScore: string
  cuppingNotes: string
  certifications: string[]
  qualityReport: File | null
  images: File[]
  description: string
  price: string
}

export default function MintNFT() {
  const { isConnected, connect } = useWallet()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    lotCode: '',
    variety: '',
    customVariety: '',
    process: '',
    customProcess: '',
    weightKg: '',
    harvestDate: '',
    farmName: '',
    region: '',
    state: 'MG',
    country: 'Brasil',
    altitude: '',
    coordinates: '',
    scaScore: '',
    cuppingNotes: '',
    certifications: [],
    qualityReport: null,
    images: [],
    description: '',
    price: '',
  })

  const updateField = (field: keyof FormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleCertification = (cert: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter(c => c !== cert)
        : [...prev.certifications, cert],
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!isConnected) {
      connect()
      return
    }

    if (!window.ethereum) {
      toast.error('MetaMask não encontrada!')
      return
    }

    setIsSubmitting(true)
    
    try {
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
      
      // Criar metadata URI simples
      const tokenURI = `data:application/json,${encodeURIComponent(JSON.stringify({
        name: `Microlote ${formData.lotCode}`,
        description: formData.description || `Café ${formData.variety} - ${formData.process}`,
        attributes: [
          { trait_type: 'Variety', value: formData.variety },
          { trait_type: 'Process', value: formData.process },
          { trait_type: 'Weight', value: formData.weightKg },
          { trait_type: 'Farm', value: formData.farmName },
          { trait_type: 'Region', value: formData.region },
          { trait_type: 'Altitude', value: formData.altitude },
          { trait_type: 'SCA Score', value: formData.scaScore },
        ]
      }))}`
      
      // Converter SCA score (86.5 -> 8650)
      const scaScoreInt = Math.round(parseFloat(formData.scaScore || '85') * 100)
      
      // Converter data para timestamp
      const harvestTimestamp = formData.harvestDate 
        ? Math.floor(new Date(formData.harvestDate).getTime() / 1000)
        : Math.floor(Date.now() / 1000)
      
      toast.loading('Aguardando confirmação no MetaMask...', { id: 'mint' })
      
      // Chamar função de mint com 0.01 ETH hardcoded
      const tx = await contract.mintCoffeeLot(
        tokenURI,
        formData.lotCode || 'CAF-TEST-001',
        parseInt(formData.weightKg) || 30,
        scaScoreInt,
        harvestTimestamp,
        'QmHash123',
        { value: parseEther('0.01') }
      )
      
      toast.loading('Processando transação...', { id: 'mint' })
      
      const receipt = await tx.wait()
      
      toast.success(`NFT criado com sucesso! TX: ${receipt.hash.slice(0, 10)}...`, { id: 'mint' })
      
    } catch (error: any) {
      console.error('Erro ao criar NFT:', error)
      toast.error(error.reason || error.message || 'Erro ao criar NFT', { id: 'mint' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="input-label">Código do Lote *</label>
              <input
                type="text"
                placeholder="Ex: CAF-2024-MG-001"
                value={formData.lotCode}
                onChange={e => updateField('lotCode', e.target.value)}
                className="input"
              />
              <p className="text-xs text-cafe-500 mt-1">
                Identificador único do seu microlote
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="input-label">Variedade *</label>
                <select
                  value={formData.variety}
                  onChange={e => updateField('variety', e.target.value)}
                  className="input"
                >
                  <option value="">Selecione...</option>
                  {varietyOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="input-label">Processo *</label>
                <select
                  value={formData.process}
                  onChange={e => updateField('process', e.target.value)}
                  className="input"
                >
                  <option value="">Selecione...</option>
                  {processOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="input-label">
                  <Scale className="w-4 h-4 inline mr-2" />
                  Peso (kg) *
                </label>
                <input
                  type="number"
                  placeholder="30"
                  min="1"
                  value={formData.weightKg}
                  onChange={e => updateField('weightKg', e.target.value)}
                  className="input"
                />
              </div>

              <div>
                <label className="input-label">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Data da Colheita *
                </label>
                <input
                  type="date"
                  value={formData.harvestDate}
                  onChange={e => updateField('harvestDate', e.target.value)}
                  className="input"
                />
              </div>
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="input-label">Nome da Fazenda/Sítio *</label>
              <input
                type="text"
                placeholder="Ex: Sítio Alto da Serra"
                value={formData.farmName}
                onChange={e => updateField('farmName', e.target.value)}
                className="input"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="input-label">Região/Cidade *</label>
                <input
                  type="text"
                  placeholder="Ex: Carmo de Minas"
                  value={formData.region}
                  onChange={e => updateField('region', e.target.value)}
                  className="input"
                />
              </div>

              <div>
                <label className="input-label">Estado *</label>
                <select
                  value={formData.state}
                  onChange={e => updateField('state', e.target.value)}
                  className="input"
                >
                  <option value="MG">Minas Gerais</option>
                  <option value="ES">Espírito Santo</option>
                  <option value="SP">São Paulo</option>
                  <option value="BA">Bahia</option>
                  <option value="PR">Paraná</option>
                  <option value="RO">Rondônia</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="input-label">
                  <Mountain className="w-4 h-4 inline mr-2" />
                  Altitude (metros) *
                </label>
                <input
                  type="number"
                  placeholder="1200"
                  min="0"
                  value={formData.altitude}
                  onChange={e => updateField('altitude', e.target.value)}
                  className="input"
                />
              </div>

              <div>
                <label className="input-label">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Coordenadas GPS
                </label>
                <input
                  type="text"
                  placeholder="-21.7654, -45.1234"
                  value={formData.coordinates}
                  onChange={e => updateField('coordinates', e.target.value)}
                  className="input"
                />
              </div>
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="input-label">
                <Star className="w-4 h-4 inline mr-2" />
                Pontuação SCA *
              </label>
              <input
                type="number"
                placeholder="86.5"
                min="80"
                max="100"
                step="0.1"
                value={formData.scaScore}
                onChange={e => updateField('scaScore', e.target.value)}
                className="input"
              />
              <p className="text-xs text-cafe-500 mt-1">
                Pontuação do protocolo SCA (80-100)
              </p>
            </div>

            <div>
              <label className="input-label">Notas de Degustação</label>
              <textarea
                placeholder="Descreva as notas sensoriais do café..."
                rows={3}
                value={formData.cuppingNotes}
                onChange={e => updateField('cuppingNotes', e.target.value)}
                className="input resize-none"
              />
            </div>

            <div>
              <label className="input-label">Certificações</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {certificationOptions.map(cert => (
                  <button
                    key={cert}
                    type="button"
                    onClick={() => toggleCertification(cert)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                      formData.certifications.includes(cert)
                        ? 'bg-gold-500/20 text-gold-400 border-gold-500/30'
                        : 'bg-cafe-800/50 text-cafe-400 border-cafe-700 hover:border-cafe-600'
                    }`}
                  >
                    {formData.certifications.includes(cert) && (
                      <Check className="w-3 h-3 inline mr-1" />
                    )}
                    {cert}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="input-label">
                <FileText className="w-4 h-4 inline mr-2" />
                Laudo de Qualidade
              </label>
              <div className="mt-2">
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-cafe-700 rounded-xl cursor-pointer hover:border-gold-500/50 transition-colors">
                  <Upload className="w-8 h-8 text-cafe-500 mb-2" />
                  <span className="text-sm text-cafe-400">
                    {formData.qualityReport
                      ? formData.qualityReport.name
                      : 'Clique para fazer upload do laudo (PDF)'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={e => updateField('qualityReport', e.target.files?.[0] || null)}
                  />
                </label>
              </div>
            </div>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="input-label">
                <Image className="w-4 h-4 inline mr-2" />
                Imagens do Lote
              </label>
              <div className="mt-2">
                <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-cafe-700 rounded-xl cursor-pointer hover:border-gold-500/50 transition-colors">
                  <Upload className="w-10 h-10 text-cafe-500 mb-3" />
                  <span className="text-cafe-300 font-medium mb-1">
                    Arraste ou clique para adicionar
                  </span>
                  <span className="text-sm text-cafe-500">
                    JPG, PNG ou WEBP (máx. 5MB cada)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={e => {
                      if (e.target.files) {
                        updateField('images', [...formData.images, ...Array.from(e.target.files)])
                      }
                    }}
                  />
                </label>
              </div>
              {formData.images.length > 0 && (
                <div className="grid grid-cols-4 gap-3 mt-4">
                  {formData.images.map((file, index) => (
                    <div key={index} className="relative aspect-square rounded-lg bg-cafe-800 overflow-hidden">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = [...formData.images]
                          newImages.splice(index, 1)
                          updateField('images', newImages)
                        }}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-cafe-950/80 text-cafe-400 hover:text-error flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="input-label">Descrição do NFT</label>
              <textarea
                placeholder="Conte a história do seu café, o terroir, o cuidado na produção..."
                rows={4}
                value={formData.description}
                onChange={e => updateField('description', e.target.value)}
                className="input resize-none"
              />
            </div>

            <div>
              <label className="input-label">Preço de Listagem (MATIC)</label>
              <input
                type="number"
                placeholder="0.5"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={e => updateField('price', e.target.value)}
                className="input"
              />
              <p className="text-xs text-cafe-500 mt-1">
                Deixe em branco para criar sem listar no marketplace
              </p>
            </div>
          </motion.div>
        )

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="space-y-3">
                <h4 className="font-semibold text-cafe-100 flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-gold-500" />
                  Informações do Lote
                </h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-cafe-500">Código</dt>
                    <dd className="text-cafe-200 font-mono">{formData.lotCode || '-'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-cafe-500">Variedade</dt>
                    <dd className="text-cafe-200">{formData.variety || '-'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-cafe-500">Processo</dt>
                    <dd className="text-cafe-200">{formData.process || '-'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-cafe-500">Peso</dt>
                    <dd className="text-cafe-200">{formData.weightKg ? `${formData.weightKg} kg` : '-'}</dd>
                  </div>
                </dl>
              </Card>

              <Card className="space-y-3">
                <h4 className="font-semibold text-cafe-100 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gold-500" />
                  Localização
                </h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-cafe-500">Fazenda</dt>
                    <dd className="text-cafe-200">{formData.farmName || '-'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-cafe-500">Região</dt>
                    <dd className="text-cafe-200">{formData.region || '-'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-cafe-500">Estado</dt>
                    <dd className="text-cafe-200">{formData.state}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-cafe-500">Altitude</dt>
                    <dd className="text-cafe-200">{formData.altitude ? `${formData.altitude}m` : '-'}</dd>
                  </div>
                </dl>
              </Card>

              <Card className="space-y-3">
                <h4 className="font-semibold text-cafe-100 flex items-center gap-2">
                  <Star className="w-4 h-4 text-gold-500" />
                  Qualidade
                </h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-cafe-500">SCA Score</dt>
                    <dd className="text-gold-400 font-bold">{formData.scaScore || '-'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-cafe-500">Certificações</dt>
                    <dd className="text-cafe-200">{formData.certifications.length || 0}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-cafe-500">Laudo</dt>
                    <dd className="text-cafe-200">
                      {formData.qualityReport ? '✓ Anexado' : '-'}
                    </dd>
                  </div>
                </dl>
              </Card>

              <Card className="space-y-3">
                <h4 className="font-semibold text-cafe-100 flex items-center gap-2">
                  <Image className="w-4 h-4 text-gold-500" />
                  Mídia & Preço
                </h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-cafe-500">Imagens</dt>
                    <dd className="text-cafe-200">{formData.images.length} anexadas</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-cafe-500">Preço</dt>
                    <dd className="text-gold-400 font-mono">
                      {formData.price ? `${formData.price} MATIC` : 'Não listado'}
                    </dd>
                  </div>
                </dl>
              </Card>
            </div>

            <div className="p-4 bg-warning/10 border border-warning/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-warning font-medium mb-1">Atenção</p>
                <p className="text-cafe-400">
                  Ao criar o NFT, você confirma que todas as informações são verdadeiras 
                  e que o lote está disponível e armazenado corretamente.
                </p>
              </div>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="pt-28 pb-16 min-h-screen">
      <div className="container-custom max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-display text-4xl font-bold text-cafe-100 mb-3">
            Tokenizar Microlote
          </h1>
          <p className="text-lg text-cafe-400">
            Transforme seu café especial em um NFT com lastro físico
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex flex-col items-center ${
                    step.id <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed'
                  }`}
                  disabled={step.id > currentStep}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      step.id === currentStep
                        ? 'bg-gradient-gold text-cafe-950'
                        : step.id < currentStep
                        ? 'bg-gold-500/20 text-gold-400'
                        : 'bg-cafe-800 text-cafe-500'
                    }`}
                  >
                    {step.id < currentStep ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={`text-xs mt-2 hidden sm:block ${
                      step.id === currentStep
                        ? 'text-gold-400'
                        : step.id < currentStep
                        ? 'text-cafe-300'
                        : 'text-cafe-600'
                    }`}
                  >
                    {step.name}
                  </span>
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={`hidden sm:block w-full h-0.5 mx-2 ${
                      step.id < currentStep ? 'bg-gold-500/50' : 'bg-cafe-800'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <Card className="p-8">
          <div className="mb-6">
            <h2 className="font-display text-xl font-semibold text-cafe-100">
              {steps[currentStep - 1].name}
            </h2>
          </div>

          {renderStepContent()}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-cafe-800">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 1}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Anterior
            </Button>

            {currentStep < steps.length ? (
              <Button
                onClick={nextStep}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Próximo
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                isLoading={isSubmitting}
                leftIcon={isSubmitting ? undefined : <Coffee className="w-4 h-4" />}
              >
                {isConnected ? 'Criar NFT' : 'Conectar Wallet'}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

