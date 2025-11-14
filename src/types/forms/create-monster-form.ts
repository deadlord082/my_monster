import type { MonsterState } from '@/types/monster'

export interface CreateMonsterFormValues {
  name: string
  traits: string
  level: number
  equipedAccessories: string[]
  equipedBackground: string
  isPublic: boolean
  xp: number
  maxXp: number
  state: MonsterState
}

export interface CreateMonsterFormProps {
  onSubmit: (values: CreateMonsterFormValues) => void
  onCancel: () => void
}
