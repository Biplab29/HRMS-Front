function BarChart({ 
  values = [74, 58, 86, 42, 55], 
  labels = ['Engineering', 'Marketing', 'Sales', 'Product', 'Support'], 
  tooltipSuffix = 'Employee' 
}) {
  const maxValue = Math.max(...values, 0)

  const formatTooltip = (val) => {
    if (tooltipSuffix === 'INR') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(val)
    }
    return `${val} ${tooltipSuffix}${val !== 1 && tooltipSuffix === 'Employee' ? 's' : ''}`
  }

  const formatLabelValue = (val) => {
    if (tooltipSuffix === 'INR') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(val)
    }
    return val
  }

  return (
    <div 
      className="grid h-60 items-end gap-5 px-5 pt-5" 
      style={{ gridTemplateColumns: `repeat(${Math.max(values.length, 1)}, minmax(0, 1fr))` }}
    >
      {values.map((value, index) => {
        const heightPercent = maxValue > 0 ? (value / maxValue) * 100 : 0
        const label = labels[index] || `Category ${index + 1}`
        return (
          <div key={`${label}-${index}`} className="flex h-full flex-col justify-end gap-3">
            <div className="flex flex-1 items-end rounded-t bg-ink-700 relative group">
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold text-brand-300 opacity-0 group-hover:opacity-100 transition-opacity bg-ink-900 border border-ink-650 px-1.5 py-0.5 rounded shadow-console whitespace-nowrap pointer-events-none z-10">
                {formatTooltip(value)}
              </span>
              <div 
                className="w-full rounded-t bg-brand-500 transition-all duration-500 hover:bg-brand-400 cursor-pointer" 
                style={{ height: `${heightPercent}%` }} 
              />
            </div>
            <span className="truncate text-center text-[10px] uppercase text-steel-300" title={`${label} (${formatLabelValue(value)})`}>
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default BarChart
