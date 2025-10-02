import { ReactNode, PropsWithChildren } from 'react'

interface CardProps extends PropsWithChildren {
  className?: string
}

export default function Card ({ children, className = '' }: CardProps): ReactNode {
  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-tolopea-100 p-8 ${className}`}>
      {children}
    </div>
  )
}
