function StatCard({ label, value, subtext, icon: Icon, tone = 'brand' }) {
  const isLongValue = String(value).length > 10
  const toneMap = {
    brand: 'text-brand-300 bg-brand-500/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    danger: 'text-danger bg-danger/10',
    neutral: 'text-steel-300 bg-ink-700',
  }

  return (
    <article className="console-card min-h-[92px] min-w-0 overflow-hidden p-4 transition hover:border-brand-500/60">
      <div className="mb-3 flex items-start justify-between gap-3">
        <p className="muted-label">{label}</p>
        {Icon && (
          <span className={`flex h-7 w-7 items-center justify-center rounded ${toneMap[tone]}`}>
            <Icon aria-hidden="true" />
          </span>
        )}
      </div>
      <div className="grid min-w-0 gap-2">
        <strong className={`${isLongValue ? 'text-[24px] leading-tight' : 'whitespace-nowrap text-[30px] leading-none'} min-w-0 font-semibold text-steel-200`}>
          {value}
        </strong>
        {subtext && <span className="pb-1 text-[11px] font-medium leading-4 text-steel-400">{subtext}</span>}
      </div>
    </article>
  )
}

export default StatCard
