function BarChart({ values = [74, 58, 86, 42, 55] }) {
  const labels = ['Engineering', 'Marketing', 'Sales', 'Product', 'Support']

  return (
    <div className="grid h-60 grid-cols-5 items-end gap-5 px-5 pt-5">
      {values.map((value, index) => (
        <div key={labels[index]} className="flex h-full flex-col justify-end gap-3">
          <div className="flex flex-1 items-end rounded-t bg-ink-700">
            <div className="w-full rounded-t bg-brand-500" style={{ height: `${value}%` }} />
          </div>
          <span className="truncate text-center text-[10px] uppercase text-steel-300">{labels[index]}</span>
        </div>
      ))}
    </div>
  )
}

export default BarChart
