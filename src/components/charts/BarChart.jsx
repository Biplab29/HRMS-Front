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
    <div className="relative h-60 w-full px-5 pt-5">
      {/* Subtle Horizontal Gridlines */}
      <div className="absolute inset-x-5 top-5 bottom-12 flex flex-col justify-between pointer-events-none">
        <div className="border-b border-white/5 w-full h-0" />
        <div className="border-b border-white/5 w-full h-0" />
        <div className="border-b border-white/5 w-full h-0" />
        <div className="border-b border-white/5 w-full h-0" />
      </div>

      <div 
        className="relative z-10 grid h-full items-end gap-5" 
        style={{ 
          gridTemplateColumns: `repeat(${Math.max(values.length, 1)}, minmax(0, 1fr))`,
          height: 'calc(100% - 20px)'
        }}
      >
        {values.map((value, index) => {
          const heightPercent = maxValue > 0 ? (value / maxValue) * 100 : 0
          const label = labels[index] || `Category ${index + 1}`
          return (
            <div key={`${label}-${index}`} className="flex h-full flex-col justify-end gap-3">
              <div className="flex flex-1 items-end rounded-t-lg bg-ink-800/40 border border-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] relative group">
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-brand-300 opacity-0 group-hover:opacity-100 transition-opacity bg-ink-950 border border-ink-650 px-2 py-0.5 rounded shadow-console whitespace-nowrap pointer-events-none z-20">
                  {formatTooltip(value)}
                </span>
                <div 
                  className="w-full rounded-t-md bg-gradient-to-t from-brand-600 via-brand-500 to-indigo-500 transition-all duration-500 hover:from-brand-500 hover:via-brand-400 hover:to-indigo-400 cursor-pointer shadow-[0_0_8px_rgba(99,102,241,0.25)] hover:shadow-[0_0_16px_rgba(99,102,241,0.6)]" 
                  style={{ height: `${heightPercent}%` }} 
                />
              </div>
              <span className="truncate text-center text-[10px] font-semibold tracking-wider uppercase text-steel-400" title={`${label} (${formatLabelValue(value)})`}>
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default BarChart
