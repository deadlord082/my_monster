function getSize (size: 'sm' | 'md' | 'lg' | 'xl'): string {
  switch (size) {
    case 'sm': return 'px-2 py-1 text-sm'
    case 'md': return 'px-4 py-2 text-md'
    case 'lg': return 'px-6 py-3 text-lg'
    case 'xl': return 'px-8 py-4 text-xl'
  }
}

function getVariant (variant: 'primary' | 'ghost' | 'underline' | 'outline', disabled: boolean): string {
  switch (variant) {
    case 'primary': return disabled ? 'bg-[#003b46] text-[#00768a]' : 'bg-[#00d8ff] hover:bg-[#00aee0] text-black shadow-[0_0_20px_rgba(0,216,255,0.3)] hover:shadow-[0_0_30px_rgba(0,216,255,0.5)]'
    case 'ghost': return disabled ? 'bg-transparent text-[#003b46]' : 'bg-transparent text-[#00d8ff] hover:bg-[#00d8ff]/10'
    case 'underline': return disabled ? 'underline text-[#003b46]' : 'underline hover:no-underline underline-offset-6 text-[#00d8ff] hover:text-[#4ee1ff]'
    case 'outline': return disabled ? 'border border-[#003b46] text-[#00768a]' : 'border border-[#00d8ff] text-[#00d8ff] hover:bg-[#00d8ff]/10 hover:border-[#4ee1ff] hover:text-[#4ee1ff]'
  }
}

function Button ({
  children = 'Click me',
  onClick,
  size = 'md',
  variant = 'primary',
  disabled = false,
  type
}: {
  children: React.ReactNode
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'ghost' | 'underline' | 'outline'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}): React.ReactNode {
  return (
    <button
      className={`rounded-md  ${disabled ? '' : 'transition-all duration-300 cursor-pointer active:scale-95'} ${getSize(size)} ${getVariant(variant, disabled)}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  )
}

export default Button
