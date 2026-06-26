function Avatar({ person, size = 'md' }) {
  const sizes = {
    sm: 'h-7 w-7 text-[10px]',
    md: 'h-9 w-9 text-[11px]',
    lg: 'h-11 w-11 text-[12px]',
  }

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-brand-gradient ${sizes[size]} font-bold text-steel-200 dark:text-white shadow-lg ring-2 ring-ink-900 transition-transform duration-300 hover:scale-110 hover:shadow-brand-500/50`}
      aria-hidden="true"
    >
      {person.avatar}
    </span>
  )
}

export default Avatar
