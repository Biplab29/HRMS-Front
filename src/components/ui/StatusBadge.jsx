function StatusBadge({ children, tone = 'brand' }) {
  const toneMap = {
    success: 'bg-success/15 text-success border-success/20',
    warning: 'bg-warning/15 text-warning border-warning/20',
    danger: 'bg-danger/15 text-danger border-danger/20',
    brand: 'bg-brand-500/15 text-brand-300 border-brand-500/20',
    neutral: 'bg-ink-700/50 text-steel-300 border-white/5',
  }

  return <span className={`status-pill ${toneMap[tone]} backdrop-blur-md`}>{children}</span>
}

export default StatusBadge
