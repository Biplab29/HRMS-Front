function Panel({ title, eyebrow, action, children, className = '' }) {
  return (
    <section className={`console-card p-6 ${className}`}>
      {(title || eyebrow || action) && (
        <header className="mb-6 flex items-start justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            {eyebrow && <p className="muted-label mb-1.5">{eyebrow}</p>}
            {title && <h2 className="text-lg font-bold text-steel-200 dark:text-white tracking-tight">{title}</h2>}
          </div>
          {action && <div className="mt-1">{action}</div>}
        </header>
      )}
      {children}
    </section>
  )
}

export default Panel
