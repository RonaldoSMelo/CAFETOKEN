import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, ChevronDown, X, SlidersHorizontal } from 'lucide-react'
import type { MarketplaceFilters } from '../../types'

interface FilterBarProps {
  filters: MarketplaceFilters
  onFiltersChange: (filters: MarketplaceFilters) => void
  totalResults: number
}

const sortOptions = [
  { value: 'newest', label: 'Mais Recentes' },
  { value: 'price_asc', label: 'Menor Preço' },
  { value: 'price_desc', label: 'Maior Preço' },
  { value: 'score_desc', label: 'Maior Pontuação' },
]

const varietyOptions = [
  'Bourbon Amarelo',
  'Bourbon Vermelho',
  'Catuaí',
  'Geisha',
  'Mundo Novo',
  'Acaiá',
]

const processOptions = [
  'Natural',
  'Lavado',
  'Honey',
  'Fermentado',
]

const certificationOptions = [
  'Rainforest Alliance',
  'UTZ',
  'Orgânico',
  'Fair Trade',
]

export default function FilterBar({ filters, onFiltersChange, totalResults }: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const updateFilter = (key: keyof MarketplaceFilters, value: unknown) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFiltersChange({})
  }

  const hasActiveFilters = Object.keys(filters).some(
    key => filters[key as keyof MarketplaceFilters] !== undefined
  )

  return (
    <div className="space-y-4">
      {/* Main bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden btn-secondary"
          >
            <Filter className="w-4 h-4" />
            Filtros
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-gold-500" />
            )}
          </button>

          {/* Desktop filters */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Variety dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'variety' ? null : 'variety')}
                className="flex items-center gap-2 px-4 py-2 bg-cafe-800/50 hover:bg-cafe-800 rounded-lg border border-cafe-700 text-sm transition-colors"
              >
                <span className="text-cafe-300">Variedade</span>
                {filters.variety && (
                  <span className="text-gold-400">{filters.variety}</span>
                )}
                <ChevronDown className={`w-4 h-4 text-cafe-400 transition-transform ${openDropdown === 'variety' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openDropdown === 'variety' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full mt-2 w-48 bg-cafe-900 border border-cafe-700 rounded-lg shadow-xl z-20 overflow-hidden"
                  >
                    <div className="p-2">
                      <button
                        onClick={() => {
                          updateFilter('variety', undefined)
                          setOpenDropdown(null)
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-cafe-400 hover:text-cafe-100 hover:bg-cafe-800 rounded-lg transition-colors"
                      >
                        Todas
                      </button>
                      {varietyOptions.map(option => (
                        <button
                          key={option}
                          onClick={() => {
                            updateFilter('variety', option)
                            setOpenDropdown(null)
                          }}
                          className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-colors ${
                            filters.variety === option
                              ? 'bg-gold-500/20 text-gold-400'
                              : 'text-cafe-300 hover:text-cafe-100 hover:bg-cafe-800'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Process dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'process' ? null : 'process')}
                className="flex items-center gap-2 px-4 py-2 bg-cafe-800/50 hover:bg-cafe-800 rounded-lg border border-cafe-700 text-sm transition-colors"
              >
                <span className="text-cafe-300">Processo</span>
                {filters.process && (
                  <span className="text-gold-400">{filters.process}</span>
                )}
                <ChevronDown className={`w-4 h-4 text-cafe-400 transition-transform ${openDropdown === 'process' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openDropdown === 'process' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full mt-2 w-48 bg-cafe-900 border border-cafe-700 rounded-lg shadow-xl z-20 overflow-hidden"
                  >
                    <div className="p-2">
                      <button
                        onClick={() => {
                          updateFilter('process', undefined)
                          setOpenDropdown(null)
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-cafe-400 hover:text-cafe-100 hover:bg-cafe-800 rounded-lg transition-colors"
                      >
                        Todos
                      </button>
                      {processOptions.map(option => (
                        <button
                          key={option}
                          onClick={() => {
                            updateFilter('process', option)
                            setOpenDropdown(null)
                          }}
                          className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-colors ${
                            filters.process === option
                              ? 'bg-gold-500/20 text-gold-400'
                              : 'text-cafe-300 hover:text-cafe-100 hover:bg-cafe-800'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Score range */}
            <button
              onClick={() => setOpenDropdown(openDropdown === 'score' ? null : 'score')}
              className="flex items-center gap-2 px-4 py-2 bg-cafe-800/50 hover:bg-cafe-800 rounded-lg border border-cafe-700 text-sm transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4 text-cafe-400" />
              <span className="text-cafe-300">Pontuação</span>
              {filters.minScore && (
                <span className="text-gold-400">{filters.minScore}+</span>
              )}
            </button>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-2 text-sm text-cafe-400 hover:text-error transition-colors"
              >
                <X className="w-4 h-4" />
                Limpar
              </button>
            )}
          </div>

          {/* Results count */}
          <span className="text-sm text-cafe-500">
            {totalResults} {totalResults === 1 ? 'resultado' : 'resultados'}
          </span>
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
            className="flex items-center gap-2 px-4 py-2 bg-cafe-800/50 hover:bg-cafe-800 rounded-lg border border-cafe-700 text-sm transition-colors"
          >
            <span className="text-cafe-300">Ordenar por:</span>
            <span className="text-cafe-100">
              {sortOptions.find(o => o.value === filters.sortBy)?.label || 'Mais Recentes'}
            </span>
            <ChevronDown className={`w-4 h-4 text-cafe-400 transition-transform ${openDropdown === 'sort' ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {openDropdown === 'sort' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full right-0 mt-2 w-48 bg-cafe-900 border border-cafe-700 rounded-lg shadow-xl z-20 overflow-hidden"
              >
                <div className="p-2">
                  {sortOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        updateFilter('sortBy', option.value as MarketplaceFilters['sortBy'])
                        setOpenDropdown(null)
                      }}
                      className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-colors ${
                        filters.sortBy === option.value
                          ? 'bg-gold-500/20 text-gold-400'
                          : 'text-cafe-300 hover:text-cafe-100 hover:bg-cafe-800'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile filters panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden"
          >
            <div className="p-4 bg-cafe-900/50 rounded-xl border border-cafe-800 space-y-4">
              <div>
                <label className="block text-sm font-medium text-cafe-300 mb-2">Variedade</label>
                <select
                  value={filters.variety || ''}
                  onChange={e => updateFilter('variety', e.target.value || undefined)}
                  className="input"
                >
                  <option value="">Todas</option>
                  {varietyOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-cafe-300 mb-2">Processo</label>
                <select
                  value={filters.process || ''}
                  onChange={e => updateFilter('process', e.target.value || undefined)}
                  className="input"
                >
                  <option value="">Todos</option>
                  {processOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-cafe-300 mb-2">Pontuação mínima</label>
                <input
                  type="number"
                  min="80"
                  max="100"
                  placeholder="Ex: 85"
                  value={filters.minScore || ''}
                  onChange={e => updateFilter('minScore', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cafe-300 mb-2">Certificações</label>
                <div className="flex flex-wrap gap-2">
                  {certificationOptions.map(cert => (
                    <button
                      key={cert}
                      onClick={() => {
                        const current = filters.certifications || []
                        const updated = current.includes(cert)
                          ? current.filter(c => c !== cert)
                          : [...current, cert]
                        updateFilter('certifications', updated.length ? updated : undefined)
                      }}
                      className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                        filters.certifications?.includes(cert)
                          ? 'bg-gold-500/20 text-gold-400 border-gold-500/30'
                          : 'bg-cafe-800 text-cafe-400 border-cafe-700 hover:border-cafe-600'
                      }`}
                    >
                      {cert}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

