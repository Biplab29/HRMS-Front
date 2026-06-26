import React from 'react'

function Footer() {
  return (
    <footer className="mt-auto border-t border-ink-800 dark:border-white/5 bg-ink-900/50 backdrop-blur-md px-6 py-4 transition-all duration-300">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-between gap-4 text-xs text-steel-500 sm:flex-row sm:gap-0">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <span className="font-semibold text-steel-400">NexHR System</span>
          <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-end sm:gap-6">
          <a 
            href="#" 
            className="transition-colors hover:text-brand-400 focus-visible:outline-brand-400"
          >
            Privacy Policy
          </a>
          <a 
            href="#" 
            className="transition-colors hover:text-brand-400 focus-visible:outline-brand-400"
          >
            Terms of Service
          </a>
          <a 
            href="#" 
            className="transition-colors hover:text-brand-400 focus-visible:outline-brand-400"
          >
            Help Center
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
