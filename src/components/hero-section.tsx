import Button from '@/components/button'

// Single Responsibility: Hero section handles only the main landing content
export default function HeroSection (): React.ReactNode {
  return (
    <section id='hero' className='bg-gradient-to-br from-black via-[#000824] to-[#001242] py-20 lg:py-32 relative overflow-hidden'>
      <div className='absolute inset-0'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_50%,rgba(0,216,255,0.1),transparent)]' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_700px_at_80%_20%,rgba(78,225,255,0.1),transparent)]' />
      </div>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        <div className='text-center'>
          <h1 className='text-4xl md:text-6xl font-bold text-[#e6f7ff] mb-6'>
            Adoptez votre <span className='text-[#00d8ff] text-shadow-glow'>petit monstre</span>
            <br />
            et vivez une aventure <span className='text-[#4ee1ff] text-shadow-glow'>magique</span>
          </h1>
          <p className='text-xl text-[#e6f7ff]/70 mb-8 max-w-3xl mx-auto'>
            Découvrez l'univers enchanteur de My Monster où des créatures monstrueuses n'attendent que vos soins et votre amour.
            Nourrissez, jouez et regardez grandir votre compagnon virtuel dans cette expérience unique !
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button size='xl' variant='primary'>
              Commencer l'aventure
            </Button>
            <Button size='xl' variant='outline'>
              Découvrir le jeu
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
