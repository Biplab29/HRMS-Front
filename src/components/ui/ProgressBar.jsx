function ProgressBar({ value, tone = 'brand' }) {
  const colorMap = {
    brand: 'bg-brand-500',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
    steel: 'bg-steel-300',
  }

  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-ink-650" aria-hidden="true">
      <div className={`h-full rounded-full ${colorMap[tone]}`} style={{ width: `${value}%` }} />
    </div>
  )
}

export default ProgressBar
