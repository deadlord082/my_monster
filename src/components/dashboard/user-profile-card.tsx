import type { UserDisplay } from '@/hooks/dashboard'

/**
 * Props pour le composant UserProfileCard
 */
interface UserProfileCardProps {
  /** Informations d'affichage de l'utilisateur */
  userDisplay: UserDisplay
}

/**
 * Carte de profil utilisateur affichée dans le dashboard
 *
 * Responsabilité unique : afficher l'avatar, le rôle et l'email
 * de l'utilisateur connecté.
 *
 * @param {UserProfileCardProps} props - Props du composant
 * @returns {React.ReactNode} Carte de profil utilisateur
 *
 * @example
 * <UserProfileCard userDisplay={userDisplay} />
 */
export function UserProfileCard ({ userDisplay }: UserProfileCardProps): React.ReactNode {
  return (
    <div className='flex items-center gap-4'>
      <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-black/60 text-2xl font-bold text-cyan-300 shadow-inner border border-cyan-900/30'>
        {userDisplay.initial}
      </div>
      <div>
        <p className='text-xs uppercase tracking-[0.25em] text-cyan-300/70'>Gardien.ne</p>
        <p className='text-lg font-semibold text-cyan-100'>{userDisplay.email}</p>
      </div>
    </div>
  )
}
