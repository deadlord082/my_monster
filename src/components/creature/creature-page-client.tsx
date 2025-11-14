'use client'

import { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import type { MonsterTraits, DBMonster } from '@/types/monster'
import type { DBBackground } from '@/types/background'
import type { MonsterAction } from '@/hooks/monsters'
import { parseMonsterTraits } from '@/lib/utils'
import { CreatureMonsterDisplay } from './creature-monster-display'
import { CreatureStatsPanel } from './creature-stats-panel'
import { MonsterAccessories } from './creature-accessory'
import { MonsterBackgrounds } from './creature-background'
import { LevelUpAnimation } from './level-up-animation'
import { ShopModal } from './shop-modal'
import { useRouter } from 'next/navigation'
import { getEquippedBackground } from '@/actions/background.actions'
import TogglePublicButton from './toggle-public-button'

/**
 * Props pour le composant CreaturePageClient
 */
interface CreaturePageClientProps {
  /** Données du monstre à afficher */
  monster: DBMonster
}

/**
 * Composant client de la page de détail d'une créature - Version Jeu Vidéo Fun
 *
 * Responsabilité unique : orchestrer l'affichage de toutes les sections
 * de la page de détail (header, monstre animé, stats, traits, couleurs).
 *
 * Nouveau design :
 * - Fond ultra coloré avec animations
 * - Mise en avant du monstre
 * - Panels fun et engageants
 *
 * @param {CreaturePageClientProps} props - Props du composant
 * @returns {React.ReactNode} Page complète de détail de la créature
 */
export function CreaturePageClient ({ monster }: CreaturePageClientProps): React.ReactNode {
  const [currentAction, setCurrentAction] = useState<MonsterAction>(null)
  const [currentMonster, setCurrentMonster] = useState<DBMonster>(monster)
  const [showXpGain, setShowXpGain] = useState(false)
  const [xpGained, setXpGained] = useState(0)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [showShop, setShowShop] = useState(false)
  const [equippedBackground, setEquippedBackground] = useState<DBBackground | null>(null)
  const actionTimerRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  // Parse des traits depuis le JSON stocké en base - Optimisé avec useMemo
  const traits: MonsterTraits = useMemo(() => parseMonsterTraits(currentMonster.traits) ?? {
    bodyColor: '#FFB5E8',
    accentColor: '#FF9CEE',
    eyeColor: '#2C2C2C',
    antennaColor: '#FFE66D',
    bobbleColor: '#FFE66D',
    cheekColor: '#FFB5D5',
    bodyStyle: 'round',
    eyeStyle: 'big',
    antennaStyle: 'single',
    accessory: 'none'
  }, [currentMonster.traits])

  // Charger le background équipé au montage et quand le monstre change
  useEffect(() => {
    const loadEquippedBackground = async (): Promise<void> => {
      try {
        const bg = await getEquippedBackground(monster._id)
        setEquippedBackground(bg)
      } catch (error) {
        console.error('Erreur lors du chargement du background équipé:', error)
      }
    }

    void loadEquippedBackground()
  }, [monster._id, currentMonster.equipedBackground])

  /**
   * Callback appelé quand un background est équipé/déséquipé
   * Recharge immédiatement le background pour mise à jour instantanée
   * Optimisé avec useCallback pour éviter les re-renders des composants enfants
   */
  const handleBackgroundChange = useCallback(async (): Promise<void> => {
    try {
      const bg = await getEquippedBackground(monster._id)
      setEquippedBackground(bg)
    } catch (error) {
      console.error('Erreur lors du rechargement du background:', error)
    }
  }, [monster._id])

  useEffect(() => {
    const fetchMonster = async (): Promise<void> => {
      try {
        const response = await fetch(`/api/monster?id=${monster._id}`)
        if (response.ok) {
          const updatedMonster: DBMonster = await response.json()

          // Détection du gain d'XP
          if (updatedMonster.xp !== currentMonster.xp ||
              updatedMonster.level !== currentMonster.level) {
            // Calcul du gain d'XP
            const xpDiff = updatedMonster.level > currentMonster.level
              ? updatedMonster.xp + (updatedMonster.level - currentMonster.level - 1) * currentMonster.maxXp + (currentMonster.maxXp - currentMonster.xp)
              : updatedMonster.xp - currentMonster.xp

            if (xpDiff > 0) {
              setXpGained(xpDiff)
              setShowXpGain(true)

              // Masquer l'animation après 2 secondes
              setTimeout(() => {
                setShowXpGain(false)
              }, 2000)
            }

            // Détection du level-up
            if (updatedMonster.level > currentMonster.level) {
              setShowLevelUp(true)
            }
          }

          setCurrentMonster(updatedMonster)
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du monstre :', error)
      }
    }

    const interval = setInterval(() => {
      void fetchMonster()
    }, 2000)

    return () => clearInterval(interval)
  }, [monster, currentMonster])

  // Nettoyage du timer d'action au démontage du composant
  useEffect(() => {
    return () => {
      if (actionTimerRef.current !== null) {
        clearTimeout(actionTimerRef.current)
      }
    }
  }, [])

  /**
   * Gère le déclenchement d'une action sur le monstre
   * Optimisé avec useCallback pour éviter les re-renders des boutons d'action
   * @param {MonsterAction} action - Action déclenchée
   */
  const handleAction = useCallback((action: MonsterAction): void => {
    // Nettoyer le timer précédent si existant
    if (actionTimerRef.current !== null) {
      clearTimeout(actionTimerRef.current)
    }

    setCurrentAction(action)

    // Réinitialiser l'action après l'animation (doit correspondre au délai de useMonsterAction)
    const timer = setTimeout(() => {
      setCurrentAction(null)
      actionTimerRef.current = null
    }, 2500)

    actionTimerRef.current = timer
  }, [])

  return (
    <div className='min-h-screen bg-gray-50 py-6'>
      <div className='pointer-events-none absolute top-40 left-20 text-5xl animate-twinkle-delayed'>✨</div>
      <div className='pointer-events-none absolute bottom-40 right-60 text-4xl animate-twinkle'>💫</div>

      <div className='container relative z-10 mx-auto px-4 max-w-7xl'>
        {/* Barre de navigation - Plus compacte */}
        <div className='flex justify-between items-center mb-6 gap-4'>
          {/* Bouton retour + nom */}
          <div className='flex items-center gap-4'>
            <button
              onClick={() => { void router.push('/app') }}
              className='group relative overflow-hidden inline-flex items-center gap-2 bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white font-black px-4 py-2 rounded-xl shadow-lg ring-2 ring-purple-200/50 transition-all duration-300 hover:scale-105 active:scale-95'
            >
              <span className='text-xl'>←</span>
              <span className='hidden sm:inline'>Retour</span>
            </button>

            {/* Nom du monstre inline */}
            <div className='flex items-center gap-2'>
              <span className='text-3xl'>👋</span>
              <h1 className='text-3xl sm:text-4xl font-bold text-gray-900'>
                {currentMonster.name}
              </h1>
            </div>
          </div>

          {/* Bouton boutique */}
          <div className='flex items-center gap-3'>
            <TogglePublicButton
              monsterId={currentMonster._id}
              initialIsPublic={currentMonster.isPublic ?? false}
            />
            <button
              onClick={() => { setShowShop(true) }}
              className='group relative overflow-hidden inline-flex items-center gap-2 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-black px-4 py-2 rounded-xl shadow-lg ring-2 ring-green-200/50 transition-all duration-300 hover:scale-105 active:scale-95'
            >
              <span className='text-xl'>🛍️</span>
              <span className='hidden sm:inline'>Boutique</span>
            </button>
          </div>
        </div>

        {/* Grille principale - Alignée */}
        <div className='grid lg:grid-cols-2 gap-6 items-start'>
          {/* Colonne gauche : Monstre animé + Actions */}
          <div className='space-y-6'>
            <CreatureMonsterDisplay
              traits={traits}
              state={currentMonster.state}
              level={currentMonster.level}
              currentAction={currentAction}
              onAction={handleAction}
              monsterId={currentMonster._id}
              equipedAccessoriesIds={currentMonster.equipedAccessories ?? []}
              equipedBackgroundUrl={equippedBackground?.url ?? null}
            />
          </div>

          {/* Colonne droite : Statistiques + Accessoires */}
          <div className='space-y-6'>
            <CreatureStatsPanel
              level={currentMonster.level}
              xp={currentMonster.xp ?? 0}
              maxXp={currentMonster.maxXp ?? currentMonster.level * 100}
              state={currentMonster.state}
              createdAt={currentMonster.createdAt}
              updatedAt={currentMonster.updatedAt}
              showXpGain={showXpGain}
              xpGained={xpGained}
            />

            {/* Accessoires du monstre */}
            <MonsterAccessories
              monsterId={currentMonster._id}
              equipedAccessories={currentMonster.equipedAccessories ?? []}
            />

            {/* Backgrounds du monstre */}
            <MonsterBackgrounds
              monsterId={currentMonster._id}
              equipedBackgroundId={currentMonster.equipedBackground ?? null}
              onBackgroundChange={() => { void handleBackgroundChange() }}
            />
          </div>
        </div>
      </div>

      {/* Animation de level-up */}
      <LevelUpAnimation
        newLevel={currentMonster.level}
        show={showLevelUp}
        onComplete={() => setShowLevelUp(false)}
      />

      {/* Modal de la boutique */}
      {showShop && (
        <ShopModal
          onClose={() => { setShowShop(false) }}
          creatureName={currentMonster.name}
          creatureId={currentMonster._id}
        />
      )}

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-25px); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.3) rotate(180deg); }
        }

        @keyframes twinkle-delayed {
          0%, 100% { opacity: 0.4; transform: scale(0.9) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(-180deg); }
        }

        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }

        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
        .animate-twinkle-delayed { animation: twinkle-delayed 4s ease-in-out infinite; }
        .animate-shine { animation: shine 1.5s ease-in-out; }
      `}
      </style>
    </div>
  )
}
