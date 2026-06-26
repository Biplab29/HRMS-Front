function Breakdown({ title, rows, total, amount, danger = false }) {
  return (
    <div className="rounded border border-ink-650 bg-ink-950 p-4">
      <h3 className="mb-3 text-[12px] font-semibold uppercase text-steel-300">{title}</h3>
      <div className="space-y-2">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between text-[12px] text-steel-300">
            <span>{label}</span>
            <span>{value}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between border-t border-ink-650 pt-3 text-[12px] font-semibold">
        <span>{total}</span>
        <span className={danger ? 'text-danger' : 'text-steel-200'}>{amount}</span>
      </div>
    </div>
  )
}

export default Breakdown
