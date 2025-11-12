import type { MonsterCardProps } from '@/types/components'

// Single Responsibility: MonsterCard displays one monster's info
export function MonsterCard ({
  emoji,
  name,
  personality
}: MonsterCardProps): React.ReactNode {
  return (
    <div className='bg-black/60 rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,216,255,0.08)] hover:shadow-[0_20px_50px_rgba(0,216,255,0.12)] transition-shadow border border-cyan-900/40'>
      <div className='text-6xl text-center mb-4 text-cyan-300 text-shadow-glow'>{emoji}</div>
      <h3 className='text-lg font-semibold text-center text-cyan-100 mb-2'>{name}</h3>
      <p className='text-sm text-cyan-300/90 text-center'>{personality}</p>
    </div>
  )
}

// Single Responsibility: MonstersSection orchestrates the monster gallery
export default function MonstersSection (): React.ReactNode {
  const monsters: MonsterCardProps[] = [
    {
      emoji: '🐱',
      name: 'Miaou',
      personality: 'Joueur et affectueux'
    },
    {
      emoji: '🐶',
      name: 'Woufy',
      personality: 'Loyal et énergique'
    },
    {
      emoji: '🐰',
      name: 'Lapinou',
      personality: 'Doux et curieux'
    },
    {
      emoji: '🐼',
      name: 'Pandou',
      personality: 'Calme et sage'
    }
  ]

  return (
    <section id='monsters' className='py-20 bg-gradient-to-br from-black via-[#001022] to-[#001242]'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold text-cyan-200 mb-4 text-shadow-glow'>
            Rencontrez vos futurs compagnons
          </h2>
          <p className='text-xl text-cyan-300/90 max-w-2xl mx-auto'>
            Chaque créature a sa propre personnalité et ses besoins spécifiques
          </p>
        </div>

        <div className='grid md:grid-cols-4 gap-6'>
          {monsters.map((monster, index) => (
            <MonsterCard key={index} {...monster} />
          ))}
        </div>
      </div>
    </section>
  )
}
