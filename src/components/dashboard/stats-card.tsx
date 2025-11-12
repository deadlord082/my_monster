/**
 * Props pour le composant StatsCard
 */
interface StatsCardProps {
  /** Titre de la statistique */
  title: string
  /** Valeur numérique ou textuelle de la statistique */
  value: number | string
  /** Description complémentaire */
  description: string
  /** Couleur thématique pour la bordure (lochinvar, fuchsia-blue, moccaccino) */
  color: 'lochinvar' | 'fuchsia-blue' | 'moccaccino'
  /** Si true, la carte prend toute la largeur disponible */
  fullWidth?: boolean
}

/**
 * Carte d'affichage d'une statistique
 *
 * Responsabilité unique : afficher une statistique avec son titre,
 * sa valeur et sa description dans un style cohérent.
 *
 * @param {StatsCardProps} props - Props du composant
 * @returns {React.ReactNode} Carte de statistique stylisée
 *
 * @example
 * <StatsCard
 *   title="Compagnons"
 *   value={5}
 *   description="Monstres prêts pour l'aventure"
 *   color="lochinvar"
 * />
 */
export function StatsCard ({
  title,
  value,
  description,
  color,
  fullWidth = false
}: StatsCardProps): React.ReactNode {
  // Mapping des couleurs aux classes Tailwind
  const ringColorClass = {
    lochinvar: 'ring-cyan-900/30',
    'fuchsia-blue': 'ring-indigo-900/30',
    moccaccino: 'ring-cyan-800/30'
  }[color]

  const textColorClass = {
    lochinvar: 'text-cyan-300',
    'fuchsia-blue': 'text-indigo-300',
    moccaccino: 'text-cyan-300'
  }[color]

  const widthClass = fullWidth ? 'sm:col-span-2' : ''

  return (
    <div
      className={`rounded-2xl bg-black/60 p-4 shadow-[0_12px_30px_rgba(0,216,255,0.04)] ring-1 ${ringColorClass} ${widthClass}`}
    >
      <p className={`text-xs font-semibold uppercase tracking-wide ${textColorClass}`}>
        {title}
      </p>
      <p className='mt-2 text-3xl font-black text-cyan-100'>
        {value}
      </p>
      <p className='text-xs text-cyan-300'>
        {description}
      </p>
    </div>
  )
}
