import Image from 'next/image'
import type { FooterLinkGroup } from '@/types/components'

// Single Responsibility: FooterLinkGroupComponent displays one group of links
function FooterLinkGroupComponent ({ title, links }: FooterLinkGroup): React.ReactNode {
  return (
    <div>
      <h3 className='text-lg font-semibold mb-4 text-[#00d8ff]'>{title}</h3>
      <ul className='space-y-2 text-[#e6f7ff]/70'>
        {links.map((link, index) => (
          <li key={index}>
            <a href={link.href} className='hover:text-[#00d8ff] transition-colors hover:text-shadow-glow'>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Single Responsibility: Footer handles site footer information and navigation
export default function Footer (): React.ReactNode {
  const linkGroups: FooterLinkGroup[] = [
    {
      title: 'Liens utiles',
      links: [
        { label: 'Comment jouer', href: '#' },
        { label: 'FAQ', href: '#' },
        { label: 'Support', href: '#' },
        { label: 'Communauté', href: '#' }
      ]
    },
    {
      title: 'Légal',
      links: [
        { label: 'Conditions d\'utilisation', href: '#' },
        { label: 'Politique de confidentialité', href: '#' },
        { label: 'Mentions légales', href: '#' },
        { label: 'CGV', href: '#' }
      ]
    }
  ]

  return (
    <footer className='bg-black/90 text-[#e6f7ff] py-16 border-t border-[#00d8ff]/10 shadow-[0_0_30px_rgba(0,216,255,0.1)]'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid md:grid-cols-4 gap-8'>
          {/* Logo & Description */}
          <div className='col-span-2'>
            <div className='flex items-center space-x-2 mb-4'>
              <Image
                src='/logo_comp.webp'
                alt='Tamagotcho Logo'
                width={32}
                height={32}
                className='w-8 h-8'
              />
              <span className='text-2xl font-bold text-[#00d8ff] text-shadow-glow'>
                Tamagotcho
              </span>
            </div>
            <p className='text-[#e6f7ff]/70 mb-6 max-w-md'>
              L'expérience Tamagotchi nouvelle génération. Adoptez, soignez et regardez grandir votre créature virtuelle adorée.
            </p>
          </div>

          {/* Link Groups */}
          {linkGroups.map((group, index) => (
            <FooterLinkGroupComponent key={index} {...group} />
          ))}
        </div>

        <div className='border-t border-[#00d8ff]/10 mt-12 pt-8 text-center text-[#e6f7ff]/50'>
          <p>&copy; 2025 Tamagotcho. Tous droits réservés. Créé avec <span className='text-[#00d8ff]'>❤️</span> pour My Digital School.</p>
        </div>
      </div>
    </footer>
  )
}
