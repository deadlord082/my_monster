function InputField ({
  type,
  name,
  label,
  value,
  onChange,
  onChangeText,
  error
}: {
  type?: string
  name?: string
  label?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangeText?: (text: string) => void
  error?: string
}): React.ReactNode {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (onChange !== undefined) onChange(e)
    if (onChangeText !== undefined) onChangeText(e.target.value)
  }

  return (
    <div className='flex flex-col space-y-2'>
      {(label != null && label.length > 0) && (
        <label className='text-sm font-medium text-cyan-300 ml-1'>
          {label}
        </label>
      )}
      <input
        className={`
            w-full px-4 py-3 rounded-xl border-2 bg-black/50 backdrop-blur-sm
            transition-all duration-300 text-cyan-300 placeholder-cyan-700
            focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400
            hover:border-cyan-300 hover:bg-black/70
            ${(error != null && error.length > 0) ? 'border-red-400 bg-red-900/50' : 'border-cyan-900'}
        `}
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={`Saisissez votre ${label?.toLowerCase().replace(':', '') ?? 'information'}`}
      />
      {(error != null && error.length > 0) && (
        <span className='text-sm text-red-400 ml-1 text-shadow-glow'>
          {error}
        </span>
      )}
    </div>
  )
}

export default InputField
