import { Link } from 'react-router-dom'
import { Coffee, Twitter, Github, MessageCircle, Mail } from 'lucide-react'

const footerLinks = {
  platform: [
    { name: 'Marketplace', href: '/marketplace' },
    { name: 'Mint NFT', href: '/mint' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Como Funciona', href: '/#how-it-works' },
  ],
  resources: [
    { name: 'Documentação', href: '/docs' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Blog', href: '/blog' },
    { name: 'Suporte', href: '/support' },
  ],
  legal: [
    { name: 'Termos de Uso', href: '/terms' },
    { name: 'Privacidade', href: '/privacy' },
    { name: 'Cookies', href: '/cookies' },
  ],
}

const socialLinks = [
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/cafetoken' },
  { name: 'Discord', icon: MessageCircle, href: 'https://discord.gg/cafetoken' },
  { name: 'GitHub', icon: Github, href: 'https://github.com/cafetoken' },
  { name: 'Email', icon: Mail, href: 'mailto:contato@cafetoken.io' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-cafe-800 bg-cafe-900/30">
      <div className="container-custom py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold">
                <Coffee className="w-6 h-6 text-cafe-950" />
              </div>
              <div>
                <span className="font-display text-2xl font-bold text-cafe-100">CAFÉ</span>
                <span className="font-display text-2xl font-bold text-gradient">TOKEN</span>
              </div>
            </Link>
            <p className="text-cafe-400 text-sm leading-relaxed max-w-sm mb-6">
              A primeira plataforma de microlotes de café brasileiro tokenizados no mundo. 
              Seu café, sua história, agora em blockchain.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-cafe-800 hover:bg-cafe-700 flex items-center justify-center text-cafe-400 hover:text-gold-400 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-display text-sm font-semibold text-cafe-100 uppercase tracking-wider mb-4">
              Plataforma
            </h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-cafe-400 hover:text-gold-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-display text-sm font-semibold text-cafe-100 uppercase tracking-wider mb-4">
              Recursos
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-cafe-400 hover:text-gold-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-display text-sm font-semibold text-cafe-100 uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-cafe-400 hover:text-gold-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-cafe-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-cafe-500">
              © {currentYear} CAFÉTOKEN. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2 text-sm text-cafe-500">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                Polygon Network
              </span>
              <span className="text-sm text-cafe-500">
                Feito com ☕ no Brasil
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

