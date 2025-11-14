import type { BenefitCardProps } from '@/types/components'

// Open/Closed Principle: BenefitCard can be extended with new color themes
function getColorClasses (colorTheme: BenefitCardProps['colorTheme']): {
  background: string
  border: string
  iconBackground: string
  glow: string
} {
  const colorMaps = {
    moccaccino: {
      background: 'bg-black/40',
      border: 'border-[#00d8ff]/20',
      iconBackground: 'bg-gradient-to-r from-[#00d8ff] to-[#2d6fe0]',
      glow: 'shadow-[0_0_30px_rgba(0,216,255,0.1)]'
    },
    lochinvar: {
      background: 'bg-black/40',
      border: 'border-[#4ee1ff]/20',
      iconBackground: 'bg-gradient-to-r from-[#4ee1ff] to-[#2d6fe0]',
      glow: 'shadow-[0_0_30px_rgba(78,225,255,0.1)]'
    },
    'fuchsia-blue': {
      background: 'bg-black/40',
      border: 'border-[#2d6fe0]/20',
      iconBackground: 'bg-gradient-to-r from-[#2d6fe0] to-[#00d8ff]',
      glow: 'shadow-[0_0_30px_rgba(45,111,224,0.1)]'
    }
  }
  return colorMaps[colorTheme]
}

// Single Responsibility: BenefitCard displays one benefit with consistent styling
export function BenefitCard ({
  icon,
  title,
  description,
  colorTheme
}: BenefitCardProps): React.ReactNode {
  const colors = getColorClasses(colorTheme)

  return (
    <div className={`text-center p-8 rounded-2xl ${colors.background} border ${colors.border} backdrop-blur-sm ${colors.glow} group hover:scale-105 transition-transform duration-300`}>
      <div className={`w-16 h-16 ${colors.iconBackground} rounded-full flex items-center justify-center text-black text-2xl mx-auto mb-6 shadow-[0_0_20px_rgba(0,216,255,0.2)] group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className='text-xl font-bold text-[#00d8ff] mb-4 text-shadow-glow'>{title}</h3>
      <p className='text-[#e6f7ff]/70'>{description}</p>
    </div>
  )
}

// Single Responsibility: BenefitsSection orchestrates the benefits display
export default function BenefitsSection (): React.ReactNode {
  const benefits: BenefitCardProps[] = [
    {
      icon: '💖',
      title: 'Créatures Attachantes',
      description: 'Des monstres adorables avec des personnalités uniques qui évoluent selon vos soins',
      colorTheme: 'moccaccino'
    },
    {
      icon: '🎮',
      title: 'Gameplay Engageant',
      description: 'Nourrissez, jouez et prenez soin de votre créature pour débloquer de nouvelles capacités',
      colorTheme: 'lochinvar'
    },
    {
      icon: '🌟',
      title: 'Évolution Continue',
      description: 'Regardez votre monstre grandir et se transformer à travers différentes phases de vie',
      colorTheme: 'fuchsia-blue'
    }
  ]

  return (
    <section id='benefits' className='py-20 bg-gradient-to-br from-black via-[#000824] to-[#001242] relative overflow-hidden'>
      <div className='absolute inset-0'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_800px_at_20%_80%,rgba(0,216,255,0.1),transparent)]' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_600px_at_80%_20%,rgba(78,225,255,0.1),transparent)]' />
      </div>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold text-[#00d8ff] mb-4 text-shadow-glow'>
            Pourquoi choisir My Monster ?
          </h2>
          <p className='text-xl text-[#e6f7ff]/70 max-w-2xl mx-auto'>
            Une expérience de jeu unique qui combine nostalgie et innovation moderne
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} {...benefit} />
          ))}
        </div>
      </div>
    </section>
  )
}
