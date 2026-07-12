import React from 'react'

function GlobalLoader({ message = 'Processing request...' }) {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-ink-950/60 backdrop-blur-md transition-all duration-300">
      <div className="flex flex-col items-center gap-4 rounded-xl border border-ink-800 dark:border-white/5 bg-ink-850/80 p-6 shadow-glow max-w-xs text-center">
        {/* Modern rotating loading ring */}
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-4 border-ink-800 dark:border-white/10" />
          <div className="absolute inset-0 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
        </div>
        <p className="text-sm font-semibold text-steel-200 dark:text-white animate-pulse">
          {message}
        </p>
      </div>
    </div>
  )
}

export default GlobalLoader
