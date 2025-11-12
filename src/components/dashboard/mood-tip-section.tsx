/**
 * Props pour le composant MoodTipSection
 */
interface MoodTipSectionProps {
  /** Message personnalisé basé sur l'humeur favorite */
  message: string
}

/**
 * Section affichant l'astuce d'humeur personnalisée
 *
 * Responsabilité unique : afficher un conseil basé sur
 * l'humeur dominante des monstres de l'utilisateur.
 *
 * @param {MoodTipSectionProps} props - Props du composant
 * @returns {React.ReactNode} Section d'astuce mood
 *
 * @example
 * <MoodTipSection message={favoriteMoodMessage} />
 */
export function MoodTipSection ({ message }: MoodTipSectionProps): React.ReactNode {
  return (
    <div className='rounded-3xl bg-black/60 p-6 shadow-[0_18px_40px_rgba(0,216,255,0.06)] ring-1 ring-cyan-900/20 backdrop-blur'>
      <p className='text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300'>
        Astuce mood
      </p>
      <p className='mt-3 text-base font-medium text-cyan-100'>{message}</p>
      <p className='mt-2 text-xs text-cyan-300'>
        Observe tes créatures pour débloquer toutes les humeurs et récolter des surprises.
      </p>
    </div>
  )
}
